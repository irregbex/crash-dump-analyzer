const fs=require('fs'),vm=require('vm');
const h=fs.readFileSync(process.argv[2],'utf8');const mm={exports:{}};vm.runInNewContext(h.split('/*CORE-BEGIN*/')[1].split('/*CORE-END*/')[0],{module:mm,TextDecoder,BigInt,console});const C=mm.exports;
const ref=JSON.parse(fs.readFileSync(process.argv[4]||'pe_ref.json','utf8'));
const buf=fs.readFileSync(process.argv[3]); const P=C.parsePE(buf.buffer.slice(buf.byteOffset,buf.byteOffset+buf.length),'jansi.dll');
console.log('PE ts',P.timestamp===ref.ts,'soi',P.sizeOfImage===ref.soi,'exports',P.exports.length,'/',ref.nexp,'pdata',P.pdata.length/3,'/',ref.npdata);
const expOK = ref.exp.every(([rva,n])=>P.exports.some(e=>e.rva===rva&&e.name===n)); console.log('exports match',expOK);
console.log('name sample', C.peFunctionName(P, ref.exp[0][0]+5), '|', C.peFunctionName(P, ref.funcs[0].begin+3));
const BASE=0x180000000n, CALLER=0x7FF000000000n, R=CALLER+0x1234n, RSP0=0x10000000n, STK=0x4000;
let pass=0,fail=0;
for(const f of ref.funcs){
  const mem=new Uint8Array(STK); const dv=new DataView(mem.buffer);
  for(let i=0;i<STK;i+=8) dv.setBigUint64(i,0x1111111111111111n,true);
  dv.setBigUint64(f.size,R,true);
  const stackStart=RSP0, mod={name:'jansi.dll',path:'C:\\x\\jansi.dll',base:BASE,size:P.sizeOfImage,end:BASE+BigInt(P.sizeOfImage),timestamp:P.timestamp,kind:'thirdparty',pe:P};
  const caller={name:'caller.dll',path:'C:\\x\\caller.dll',base:CALLER,size:0x100000,end:CALLER+0x100000n,timestamp:1,kind:'thirdparty',pe:null};
  const d={modules:[mod,caller],unloaded:[],warnings:[],hasPE:true,memory:[{start:RSP0,size:STK,rva:0}],memMaxEnd:[RSP0+BigInt(STK)],
    reader:{has:(o,n)=>o>=0&&o+n<=STK,bytes:(o,n)=>mem.subarray(o,o+n)}};
  const ip=BASE+BigInt(f.begin+f.prolog);
  const regs=['rax','rbx','rcx','rdx','rsi','rdi','rbp','rsp','r8','r9','r10','r11','r12','r13','r14','r15','rip'].map(n=>[n,n==='rsp'?RSP0:n==='rip'?ip:0n]);
  const ctx={arch:'x64',ptrSize:8,ip,sp:RSP0,regs};
  const u=C.unwindX64(d,{stackStart,stackSize:STK},ctx,8);
  const ok=u.frames.length>=2&&u.frames[1].addr===R&&u.rsp===RSP0+BigInt(f.size)+8n;
  ok?pass++:(fail++,fail<4&&console.log('FAIL',f,u.frames.map(x=>x.addr.toString(16)),u.rsp.toString(16)));
}
console.log('unwind pass',pass,'fail',fail);
