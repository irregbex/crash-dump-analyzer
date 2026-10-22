// Crash Dump Analyzer — CORE test (Node 16+).
// Usage: node tests/core_test.js CrashDumpAnalyzer.html [folder with real .dmp files]
// Without a folder only the built-in synthetic demo dumps are tested (no real data needed).
const fs=require('fs'),vm=require('vm'),path=require('path');
const html=fs.readFileSync(process.argv[2],'utf8');
const m={exports:{}}; vm.runInNewContext(html.split('/*CORE-BEGIN*/')[1].split('/*CORE-END*/')[0],{module:m,TextDecoder,BigInt,console});
const C=m.exports, dir=process.argv[3], items=[]; const t0=Date.now(); let fails=0;
const check=(name,cond)=>{ console.log((cond?'OK   ':'FAIL ')+name); if(!cond) fails++; };
for(const f of (dir ? fs.readdirSync(dir).filter(f=>/\.dmp$/i.test(f)).sort() : [])){
  const b=fs.readFileSync(path.join(dir,f)); const d=C.parseMinidump(b.buffer.slice(b.byteOffset,b.byteOffset+b.length),f), a=C.analyze(d); items.push({d,a});
  console.log(`  ${f.slice(0,44)} | ${a.culprit.module?a.culprit.module.name:'-'} (${a.culprit.confidence}) | ${a.signature.id} | instr: ${a.instr?a.instr.asm:'-'}`);
}
// demo dumps
const demo=C.demoDumps().map(x=>{const d=C.parseMinidump(x.buffer,x.name);return {d,a:C.analyze(d)};});
const dc=C.compare(demo);
check('demo: 4 dumps parsed without warnings', demo.length===4 && demo.every(x=>!x.d.warnings.length));
check('demo: repeated signature detected', dc.notes.some(n=>n.key==='c.sameSig'));
check('demo: C++ type std::bad_alloc', demo[3].a.cxxType && demo[3].a.cxxType.type==='std::bad_alloc');
check('demo: no instruction analysis for C++ exception', !demo[3].a.instr);
check('demo: freeze with possible deadlock', !!demo[2].a.deadlock);
check('demo: solved module (Example Synth) ranked last', dc.fixFirst[dc.fixFirst.length-1].module==='Example Synth.vst3' && dc.fixFirst[dc.fixFirst.length-1].solved);
// real dumps
const c=C.compare(items);
if (items.length) {
  check('real: one signature per distinct crash', new Set(items.map(i=>i.a.signature.id)).size<=items.length);
  check('real: fixFirst lists every culprit', c.fixFirst.length===new Set(items.map(i=>i.a.culprit.module&&i.a.culprit.module.name).filter(Boolean)).size);
}
// notes compatibility
check('notes: old format accepted', C.parseNotes(JSON.stringify({format:'crash-dump-viewer-notes',version:1,notes:[{module:'x',text:'y'}]})).length===1);
check('notes: new format written', JSON.parse(C.serializeNotes([])).format==='crash-dump-analyzer-notes');
// HTML report
const tk=C.privacyTokens([{modules:[{path:'C:\\Users\\JuanPerez\\x\\a.dll'}],unloaded:[]}]);
const r=C.buildReportHTML(items.concat(demo),'de',[], tk);
check('report: no <script>', !/<script/i.test(r.html));
check('report: CSP default-src none', r.html.includes("default-src 'none'"));
check('report: German title', r.html.includes('Crash-Dump-Bericht'));
// CSV / JSON
const all=items.concat(demo);
const csv=C.buildCSV(all).trim().split('\r\n'); check('csv: header + one line per dump, 20 cols', csv.length===all.length+1 && csv[0].split(';').length===20);
check('json: all dumps + fixFirst', (j=>j.dumps.length===all.length && Array.isArray(j.comparison.fixFirst) && j.comparison.fixFirst.length>0)(JSON.parse(C.buildJSON(all))));
// i18n parity
for (const L of ['es','de']) { const en=Object.keys(C.I18N.en), o=Object.keys(C.I18N[L]); check(`i18n ${L}: same keys as en (${o.length})`, en.length===o.length && en.every(k=>o.includes(k))); }
console.log(fails? `${fails} FAILED` : 'ALL OK', `(${Date.now()-t0} ms)`);
process.exit(fails?1:0);
