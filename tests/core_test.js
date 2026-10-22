// Crash Dump Analyzer — CORE test (Node 16+).
// Usage: node tests/core_test.js CrashDumpAnalyzer.html [folder with real .dmp files]
// Without a folder only the built-in synthetic demo dumps (Windows + macOS) are tested (no real data needed).
// 1.5.0: adds macOS checks (synthetic .ips/.hang demos, a legacy .crash fixture, anonymisation, hideMem option) and an x86 minidump.
// 1.6.0: confidence score + evidence, cross-thread rule, MIDI kind, heap corruption / GS, known patterns, AI prompt.
const fs=require('fs'),vm=require('vm'),path=require('path');
const html=fs.readFileSync(process.argv[2],'utf8');
const m={exports:{}}; vm.runInNewContext(html.split('/*CORE-BEGIN*/')[1].split('/*CORE-END*/')[0],{module:m,TextDecoder,BigInt,console});
const C=m.exports, dir=process.argv[3], items=[]; const t0=Date.now(); let fails=0;
const check=(name,cond)=>{ console.log((cond?'OK   ':'FAIL ')+name); if(!cond) fails++; };
for(const f of (dir ? fs.readdirSync(dir).filter(f=>/\.(dmp|ips|crash|hang)$/i.test(f)).sort() : [])){
  const b=fs.readFileSync(path.join(dir,f)); const d=C.parseDump(b.buffer.slice(b.byteOffset,b.byteOffset+b.length),f), a=C.analyze(d); items.push({d,a});
  console.log(`  ${f.slice(0,44)} | ${a.culprit.module?a.culprit.module.name:'-'} (${a.culprit.confidence}) | ${a.signature.id} | instr: ${a.instr?a.instr.asm:'-'}`);
}
// demo dumps: 4 Windows minidumps + 2 macOS .ips + 1 macOS .hang (1.5.0)
const demoAll=C.demoDumps().map(x=>{const d=C.parseDump(x.buffer,x.name);return {d,a:C.analyze(d)};});
const demo=demoAll.slice(0,4), demoMac=demoAll.slice(4);
const dc=C.compare(demo);
check('demo: 7 items (4 Windows + 3 macOS) parsed without warnings', demoAll.length===7 && demoAll.every(x=>!x.d.warnings.length) && demoMac.every(x=>x.d.platform==='mac'));
check('demo: repeated signature detected', dc.notes.some(n=>n.key==='c.sameSig'));
check('demo: C++ type std::bad_alloc', demo[3].a.cxxType && demo[3].a.cxxType.type==='std::bad_alloc');
check('demo: no instruction analysis for C++ exception', !demo[3].a.instr);
check('demo: freeze with possible deadlock', !!demo[2].a.deadlock);
check('demo: solved module (Example Synth) ranked last', dc.fixFirst[dc.fixFirst.length-1].module==='Example Synth.vst3' && dc.fixFirst[dc.fixFirst.length-1].solved);
// macOS demos
const m5=demoMac[0], m6=demoMac[1], m7=demoMac[2];
check('mac demo 5: EXC_BAD_ACCESS in Example Sampler.vst3 (fault, high, audio thread)', m5.a.kind==='crash' && m5.a.exc.codeHex==='EXC_BAD_ACCESS' && m5.a.exc.name==='SIGSEGV' && m5.a.culprit.module.name==='Example Sampler.vst3' && m5.a.culprit.reason==='fault' && m5.a.culprit.confidence==='high' && m5.a.faultRole==='audio');
check('mac demo 5: NULL+offset finding, arm64 registers, no memory section', m5.a.av && m5.a.av.category==='null' && m5.a.faultCtx.arch==='arm64' && m5.a.faultCtx.regs.some(r=>r[0]==='pc') && !m5.a.mem);
check('mac demo 5: frames symbolicated (method symbol), 3 threads, main waiting', m5.a.frames.every(f=>f.method==='symbol') && m5.a.threadsOv.total===3 && m5.a.threadsOv.wait===2);
check('mac demo 6: SIGABRT uncaught std::bad_alloc from Example Reverb.component (AU, cxx, high)', m6.a.exc.codeHex==='EXC_CRASH' && m6.a.cxxType && m6.a.cxxType.type==='std::bad_alloc' && m6.a.culprit.module.name==='Example Reverb.component' && m6.a.culprit.module.kind==='plugin-au' && m6.a.culprit.reason==='cxx-mac');
check('mac demo 6: Rosetta finding + AU/Rosetta/console actions, no Windows-only actions', m6.a.findings.some(f=>f.key==='f.mac.rosetta') && ['a.mac.au','a.mac.rosetta','a.mac.console'].every(k=>m6.a.actions.some(x=>x.key===k)) && !m6.a.actions.some(x=>/^a\.(windbg|system|report|reportDev)$/.test(x.key)));
check('mac: module kinds (host, host-component, plugin-vst3, plugin-au, system, runtime)', ['host','host-component','plugin-vst3','plugin-au','system','runtime'].every(k=>m5.d.modules.some(x=>x.kind===k)));
check('mac: signature CDA-xxxxxxxx distinct per report', /^CDA-[0-9A-F]{8}$/.test(m5.a.signature.id) && m5.a.signature.id!==m6.a.signature.id);
check('mac demo 7 (.hang, bug_type 288): spindump parsed, 3 threads, 14 images, hot path leaf-first', m7.d.mac.format==='hang' && m7.d.threads.length===3 && m7.d.modules.length===14 && m7.a.frames[0].sym.includes('__psynch_cvwait') && m7.a.frames[m7.a.frames.length-1].sym.includes('start'));
check('mac demo 7: freeze, culprit Example Sampler.vst3 (hang-stack, medium), possible deadlock, duration finding', m7.a.kind==='hang' && m7.a.culprit.module.name==='Example Sampler.vst3' && m7.a.culprit.reason==='hang-stack' && !!m7.a.deadlock && m7.a.findings.some(f=>f.key==='f.mac.hang' && /3\.00s/.test(f.vars.dur)) && m7.d.threads.every(t=>t.samples===15));
check('mac demo 7: main thread found by dispatch queue; thread names/queues kept', m7.a.mainThread.queue==='com.apple.main-thread' && m7.d.threads[1].name==='Example Sampler Loader' && m7.d.threads[1].queue==='');
const call=C.compare(demoAll);
check('mixed comparison: c.mixed note, Example Synth still solved with 7 items', call.notes.some(n=>n.key==='c.mixed') && call.fixFirst.find(f=>f.module==='Example Synth.vst3').solved);
// legacy .crash fixture
const crashTxt=`Process:               DemoDAW [500]
Path:                  /Applications/DemoDAW.app/Contents/MacOS/DemoDAW
Identifier:            com.example.demodaw
Version:               1.0.5 (1005)
Code Type:             X86-64 (Native)
Date/Time:             2021-10-12 20:10:33.123 -0300
OS Version:            Mac OS X 10.15.7 (19H1419)
Report Version:        12
Anonymous UUID:        1B2C3D4E-5F60-7182-93A4-B5C6D7E8F901

Crashed Thread:        0  Dispatch queue: com.apple.main-thread

Exception Type:        EXC_CRASH (SIGABRT)
Exception Codes:       0x0000000000000000, 0x0000000000000000

Application Specific Information:
abort() called
terminating with uncaught exception of type std::out_of_range: vector

Thread 0 Crashed:: Dispatch queue: com.apple.main-thread
0   libsystem_kernel.dylib        \t0x00007fff6a00b33a __pthread_kill + 10
1   libsystem_c.dylib             \t0x00007fff69f12808 abort + 120
2   com.example.sampler           \t0x000000011a2b3c4d 0x11a000000 + 2833485
3   com.example.demodaw           \t0x0000000100010044 main + 72

Thread 1:: com.apple.audio.IOThread.client
0   libsystem_kernel.dylib        \t0x00007fff6a00a0ba mach_msg_trap + 10

Thread 0 crashed with X86 Thread State (64-bit):
  rax: 0x0000000000000000  rbx: 0x00007ffeefbfe000  rcx: 0x0000000000000001  rdx: 0x0000000000000002
  rip: 0x00007fff6a00b33a  rfl: 0x0000000000010246  cr2: 0x0000000000000000

Binary Images:
       0x100000000 -        0x1041d3fff +com.example.demodaw (1.0.5 - 1005) <AAAA> /Applications/DemoDAW.app/Contents/MacOS/DemoDAW
       0x11a000000 -        0x11a3fffff +com.example.sampler (1.0.1 - 1.0.1) <BBBB> /Users/juanperez/Library/Audio/Plug-Ins/VST3/Example Sampler.vst3/Contents/MacOS/Example Sampler
    0x7fff69f00000 -     0x7fff69f8ffff  libsystem_c.dylib (1353.60.8) <DDDD> /usr/lib/system/libsystem_c.dylib
    0x7fff6a000000 -     0x7fff6a3fffff  libsystem_kernel.dylib (6153.141.1) <EEEE> /usr/lib/system/libsystem_kernel.dylib
`;
const cd=C.parseDump(crashTxt,'DemoDAW_2021-10-12-201033.crash'), ca=C.analyze(cd);
check('.crash: parsed (host DemoDAW 1.0.5, Mac OS X 10.15.7, 2 threads, 4 images)', cd.platform==='mac' && ca.hostLabel==='DemoDAW 1.0.5' && /10\.15\.7/.test(cd.system.osName) && cd.threads.length===2 && cd.modules.length===4);
check('.crash: SIGABRT + std::out_of_range -> Example Sampler.vst3 (cxx, high), registers read', ca.exc.codeHex==='EXC_CRASH' && ca.cxxType.type==='std::out_of_range' && ca.culprit.module.name==='Example Sampler.vst3' && ca.culprit.reason==='cxx-mac' && ca.faultCtx.regs.some(r=>r[0]==='rip'));
check('.crash: time parsed with zone (-0300 -> UTC 23:10:33)', cd.header.timestamp===Date.UTC(2021,9,12,23,10,33)/1000);
// parseDump sniffing + errors
const bad=(()=>{try{C.parseDump('hello world','x.ips');return null;}catch(e){return e.code;}})();
check('parseDump: unknown content -> NOT_DUMP', bad==='NOT_DUMP');
const bt=(()=>{try{C.parseDump('{"bug_type":"777"}\n{"foo":1}','x.ips');return null;}catch(e){return e;}})();
check('parseDump: unknown .ips type -> MAC_UNSUPPORTED with bug_type', bt && bt.code==='MAC_UNSUPPORTED' && bt.bugType==='777');
const bt2=(()=>{try{C.parseDump('{"bug_type":"288"}\nDate/Time: 2026-01-01 10:00:00.000 +0000\nSteps: 3\n','x.hang');return null;}catch(e){return e;}})();
check('parseDump: truncated .hang (no Process section) -> MAC_UNSUPPORTED', bt2 && bt2.code==='MAC_UNSUPPORTED');
// x86 minidump (1.5.0: makeDump arch 'x86') — parser path for 32-bit dumps: SystemInfo archId 0, x86 CONTEXT, 4-byte stack slots.
{ const Tm=(y,mo,d,h,mi)=>Date.UTC(y,mo-1,d,h,mi,0)/1000, B={host:0x400000n,plug:0x10000000n,ntdll:0x77000000n,kbase:0x75000000n}, A=(k,o)=>B[k]+BigInt(o), ip=A('plug',0x1A2B4);
  const mod=(base,path,size,ver,ts)=>({base,path,size,ver,ts});
  const buf=C.makeDump({arch:'x86',time:Tm(2026,1,5,10,0),uptime:600,modules:[mod(B.host,'C:\\Program Files (x86)\\Example Audio\\DemoDAW32\\DemoDAW32.exe',0x2000000,[1,0,0,1],Tm(2025,1,1,0,0)),mod(B.plug,'C:\\Program Files (x86)\\VstPlugins\\Example Synth.dll',0x800000,[2,3,0,0],Tm(2024,6,1,0,0)),mod(B.ntdll,'C:\\Windows\\SysWOW64\\ntdll.dll',0x180000,[10,0,26100,1],Tm(2025,1,1,0,0)),mod(B.kbase,'C:\\Windows\\SysWOW64\\KERNELBASE.dll',0x200000,[10,0,26100,1],Tm(2025,1,1,0,0))],
    threads:[{id:501,regs:{eip:A('ntdll',0x1A54)},stackStart:0x1000000n,stack:[A('kbase',0x2D3E8),A('host',0x81230),A('host',0x10044)]},{id:502,name:'Audio',regs:{eip:ip,ecx:0n,eax:0x1000n},stackStart:0x1200000n,stack:[A('plug',0x1A3F0),A('plug',0x22010),A('host',0x2F188),A('ntdll',0x5A8E4)]}],
    exception:{tid:502,code:0xC0000005,address:ip,params:[0n,0x18n]},vm:{priv:1.1*2**30,ws:0.9*2**30,peakWs:2**30},sys:{total:16*2**30,avail:8*2**30,commit:9*2**30,limit:20*2**30}});
  const d=C.parseDump(buf,'DemoDAW32 1.0.0 32bit 2026.1.5 10.00.00.dmp'), a=C.analyze(d);
  check('x86 minidump: arch x86, 8-digit pointers, x86 registers, culprit Example Synth.dll (fault, high), 5 frames, no x64 decoder', d.system.arch==='x86' && a.ptrWidth===8 && a.faultCtx.arch==='x86' && a.faultCtx.regs.some(r=>r[0]==='eip') && a.culprit.module.name==='Example Synth.dll' && a.culprit.reason==='fault' && a.frames.length===5 && !a.instr && !d.warnings.length); }
// anonymisation (macOS)
const tk=C.privacyTokens([cd, m5.d]);
const sup=C.anonymizeAll(C.buildSupportText(cd,ca),tk);
check('anonymise mac: /Users/<name>/ hidden, report ids hidden, standard /Library kept', tk.names.includes('juanperez') && !/juanperez/.test(sup) && tk.ids.includes('DEMO5000-BBBB-4000-8000-000000000002') && !/DEMO5000-BBBB/.test(C.anonymizeAll(C.buildTextReport(m5.d,m5.a,'en',[]),tk)) && /\/Library\/Audio\/Plug-Ins\/VST3\//.test(C.anonymizeAll(C.buildTextReport(m5.d,m5.a,'en',[]),tk)));
// ---- 1.6.0 ----
check('score: every demo has a 5..95 score with evidence; high rule >= 55', demoAll.every(x=>x.a.score && x.a.score.value>=5 && x.a.score.value<=95 && x.a.score.evidence.length>=1) && demo[0].a.score.value>=70 && demo[0].a.score.evidence.some(e=>e.key==='ev.badReg'));
check('score: freeze demo lists deadlock + memory evidence', demo[2].a.score.evidence.some(e=>e.key==='ev.deadlock') && demo[2].a.score.evidence.some(e=>e.key==='ev.mem' && e.pts<0));
check('score: no f.lead when > 50; present when <= 50', !demo[0].a.findings.some(f=>f.key==='f.lead'));
{ // synthetic Windows dumps for the new rules
  const Tm=(y,mo,d,h,mi)=>Date.UTC(y,mo-1,d,h,mi,0)/1000, B={host:0x140000000n,plug:0x7FFB20000000n,pace:0x7FFB28000000n,midi:0x7FFB30000000n,ntdll:0x7FFC40000000n,kbase:0x7FFC41000000n,vcrt:0x7FFC44000000n}, A=(k,o)=>B[k]+BigInt(o);
  const mods=[{base:B.host,path:'C:\\Program Files\\Example Audio\\DemoDAW\\DemoDAW.exe',size:0x6000000,ver:[1,0,0,1],ts:Tm(2025,1,1,0,0)},{base:B.plug,path:'C:\\Program Files\\Common Files\\VST3\\Example Synth.vst3\\Contents\\x86_64-win\\Example Synth.vst3',size:0x1800000,ver:[2,3,0,0],ts:Tm(2024,6,1,0,0)},{base:B.pace,path:'C:\\Program Files\\Common Files\\PACE\\wrappersist.dll',size:0x300000,ver:[1,0,0,0],ts:Tm(2025,1,1,0,0)},{base:B.midi,path:'C:\\Windows\\System32\\Windows.Devices.Midi2.dll',size:0x300000,ver:[1,0,0,0],ts:Tm(2025,1,1,0,0)},{base:B.ntdll,path:'C:\\Windows\\System32\\ntdll.dll',size:0x200000,ver:[10,0,26100,1],ts:Tm(2025,1,1,0,0)},{base:B.kbase,path:'C:\\Windows\\System32\\KERNELBASE.dll',size:0x400000,ver:[10,0,26100,1],ts:Tm(2025,1,1,0,0)},{base:B.vcrt,path:'C:\\Windows\\System32\\vcruntime140.dll',size:0x20000,ver:[14,40,1,0],ts:Tm(2025,1,1,0,0)}];
  const mk=(exc,thr)=>C.makeDump({time:Tm(2026,1,5,10,0),uptime:600,modules:mods,threads:thr,exception:exc,vm:{priv:2**30,ws:2**30,peakWs:2**30},sys:{total:16*2**30,avail:8*2**30,commit:9*2**30,limit:20*2**30}});
  const an=(buf,n)=>{const d=C.parseDump(buf,n);return {d,a:C.analyze(d)};};
  let ip=A('ntdll',0x1A54);
  let x=an(mk({tid:1,code:0xC0000005,address:ip,params:[0n,0x18n]},[{id:1,regs:{rip:ip,rcx:0n},stackStart:0x10000000n,stack:[A('ntdll',0x2D3E8),A('kbase',0x1230),A('host',0x10044)]},{id:2,name:'Audio 1',regs:{rip:A('ntdll',0x9F2A4)},stackStart:0x10200000n,stack:[A('kbase',0x30B4E),A('plug',0x1A3F0),A('host',0x2F1880)]},{id:3,name:'Audio 2',regs:{rip:A('ntdll',0x9F2A4)},stackStart:0x10400000n,stack:[A('kbase',0x30B4E),A('plug',0x22010),A('host',0x2F1880)]}]),'cross.dmp');
  check('cross-thread: fault in ntdll, plugin on 2 other threads -> culprit by cross-thread rule (medium)', x.a.culprit.module.name==='Example Synth.vst3' && x.a.culprit.reason==='cross-thread' && x.a.culprit.confidence==='medium' && x.a.verdict.key==='v.crash.cross' && x.a.findings.some(f=>f.key==='f.crossThread'));
  const mip=A('midi',0x1234);
  x=an(mk({tid:4,code:0xC0000005,address:mip,params:[0n,0x18n]},[{id:1,regs:{rip:A('ntdll',0x9F2A4)},stackStart:0x10000000n,stack:[A('kbase',0x2D3E8),A('host',0x10044)]},{id:4,name:'MIDI in',regs:{rip:mip,rcx:0n},stackStart:0x10600000n,stack:[A('midi',0x2000),A('host',0x2F1880)]}]),'midi.dmp');
  check('MIDI: Windows.Devices.Midi2.dll is kind midi (tier 2), vendor Windows MIDI Services, activity midi, a.midiWin action', x.a.culprit.module.kind==='midi' && /MIDI Services/.test(x.a.culprit.module.vendor) && x.a.activity.includes('midi') && x.a.actions.some(k=>k.key==='a.midiWin') && x.a.actions.some(k=>k.key==='a.midiDevice'));
  x=an(mk({tid:1,code:0xC0000374,address:ip,params:[0n,0n,0n]},[{id:1,regs:{rip:ip},stackStart:0x10000000n,stack:[A('ntdll',0x2D3E8),A('plug',0x1A3F0),A('pace',0x5000),A('host',0x10044)]}]),'heap.dmp');
  check('heap corruption: f.heap finding, a.heap action, score penalty, f.lead, PACE known pattern', x.a.heapCorruption && x.a.findings.some(f=>f.key==='f.heap') && x.a.actions.some(k=>k.key==='a.heap') && x.a.score.evidence.some(e=>e.key==='ev.heap') && x.a.findings.some(f=>f.key==='f.lead') && x.a.patterns.includes('pace') && x.a.findings.some(f=>f.key==='kp.pace'));
  ip=A('vcrt',0x1000);
  x=an(mk({tid:1,code:0xC0000409,address:ip,params:[2n]},[{id:1,regs:{rip:ip},stackStart:0x10000000n,stack:[A('plug',0x1A3F0),A('host',0x10044)]}]),'gs.dmp');
  check('fast-fail /GS: f.gs finding and +ev.gs on the first non-system caller', x.a.gsFailure && x.a.findings.some(f=>f.key==='f.gs') && x.a.culprit.module.name==='Example Synth.vst3' && x.a.score.evidence.some(e=>e.key==='ev.gs'));
  const prompt=C.buildAIPrompt(demo[2].d, demo[2].a, {hideMem:true});
  check('AI prompt: instructions, summary, score, all threads, modules; hideMem respected', /Verdict \/ Confidence/.test(prompt) && /=== TOOL CONFIDENCE SCORE ===/.test(prompt) && /=== THREADS \(3\)/.test(prompt) && /\[MAIN\]/.test(prompt) && /=== THIRD-PARTY MODULES/.test(prompt) && !/^Memory/m.test(prompt));
  check('AI prompt (mac): exception block with type/signal and ASI', /type: EXC_CRASH SIGABRT/.test(C.buildAIPrompt(m6.d,m6.a)) && /ASI: abort\(\) called/.test(C.buildAIPrompt(m6.d,m6.a)));
}
// notes compatibility
check('notes: old format accepted', C.parseNotes(JSON.stringify({format:'crash-dump-viewer-notes',version:1,notes:[{module:'x',text:'y'}]})).length===1);
check('notes: new format written', JSON.parse(C.serializeNotes([])).format==='crash-dump-analyzer-notes');
// HTML report
const tkw=C.privacyTokens([{modules:[{path:'C:\\Users\\JuanPerez\\x\\a.dll'}],unloaded:[]}]);
const r=C.buildReportHTML(items.concat(demoAll),'de',[], tkw);
check('report: no <script>', !/<script/i.test(r.html));
check('report: CSP default-src none', r.html.includes("default-src 'none'"));
check('report: German title + macOS limits note', r.html.includes('Crash-Dump-Bericht') && r.html.includes(C.t('de','r.limitsMac')));
// hide memory option (1.5.0)
const win=demo[3];
const full=C.buildTextReport(win.d,win.a,'en',[]), hid=C.buildTextReport(win.d,win.a,'en',[],{hideMem:true});
check('hideMem: memory section and f.mem findings removed from the text report', /Memory at the moment/.test(full) && !/Memory at the moment/.test(hid) && /Available RAM was very low/.test(full) && !/Available RAM was very low/.test(hid));
check('hideMem: support summary, CSV, JSON and HTML report without memory', !/^Memory/m.test(C.buildSupportText(win.d,win.a,{hideMem:true})) && C.buildCSV([win],{hideMem:true}).split('\r\n')[1].split(';').slice(15,18).join('')==='' && JSON.parse(C.buildJSON([win],{hideMem:true})).dumps[0].memory===null && !C.buildReportHTML([win],'en',[],null,{hideMem:true}).html.includes(C.t('en','h.memory')));
// CSV / JSON
const all=items.concat(demoAll);
const csv=C.buildCSV(all).trim().split('\r\n'); check('csv: header + one line per dump, 20 cols', csv.length===all.length+1 && csv[0].split(';').length===20);
check('json: all dumps + fixFirst', (j=>j.dumps.length===all.length && Array.isArray(j.comparison.fixFirst) && j.comparison.fixFirst.length>0)(JSON.parse(C.buildJSON(all))));
if (items.length) { const c=C.compare(items); check('real: one signature per distinct crash', new Set(items.map(i=>i.a.signature.id)).size<=items.length); check('real: fixFirst lists every culprit', c.fixFirst.length===new Set(items.map(i=>i.a.culprit.module&&i.a.culprit.module.name).filter(Boolean)).size); }
// i18n parity
for (const L of ['es','de']) { const en=Object.keys(C.I18N.en), o=Object.keys(C.I18N[L]); check(`i18n ${L}: same keys as en (${o.length})`, en.length===o.length && en.every(k=>o.includes(k))); }
console.log(fails? `${fails} FAILED` : 'ALL OK', `(${Date.now()-t0} ms)`);
process.exit(fails?1:0);
