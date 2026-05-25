ash

cat > /home/claude/xrd-vercel/src/App.jsx << 'ENDOFFILE'
import { useState, useEffect, useRef, useCallback } from "react";
import { api } from "./api";

/* ═══════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════ */
const ELEMENTS = [
  {symbol:"H",name:"Hydrogen",Z:1,row:1,col:1,cat:"nonmetal"},
  {symbol:"He",name:"Helium",Z:2,row:1,col:18,cat:"noble"},
  {symbol:"Li",name:"Lithium",Z:3,row:2,col:1,cat:"alkali"},
  {symbol:"Be",name:"Beryllium",Z:4,row:2,col:2,cat:"alkaline"},
  {symbol:"B",name:"Boron",Z:5,row:2,col:13,cat:"metalloid"},
  {symbol:"C",name:"Carbon",Z:6,row:2,col:14,cat:"nonmetal"},
  {symbol:"N",name:"Nitrogen",Z:7,row:2,col:15,cat:"nonmetal"},
  {symbol:"O",name:"Oxygen",Z:8,row:2,col:16,cat:"nonmetal"},
  {symbol:"F",name:"Fluorine",Z:9,row:2,col:17,cat:"nonmetal"},
  {symbol:"Ne",name:"Neon",Z:10,row:2,col:18,cat:"noble"},
  {symbol:"Na",name:"Sodium",Z:11,row:3,col:1,cat:"alkali"},
  {symbol:"Mg",name:"Magnesium",Z:12,row:3,col:2,cat:"alkaline"},
  {symbol:"Al",name:"Aluminium",Z:13,row:3,col:13,cat:"metal"},
  {symbol:"Si",name:"Silicon",Z:14,row:3,col:14,cat:"metalloid"},
  {symbol:"P",name:"Phosphorus",Z:15,row:3,col:15,cat:"nonmetal"},
  {symbol:"S",name:"Sulfur",Z:16,row:3,col:16,cat:"nonmetal"},
  {symbol:"Cl",name:"Chlorine",Z:17,row:3,col:17,cat:"nonmetal"},
  {symbol:"Ar",name:"Argon",Z:18,row:3,col:18,cat:"noble"},
  {symbol:"K",name:"Potassium",Z:19,row:4,col:1,cat:"alkali"},
  {symbol:"Ca",name:"Calcium",Z:20,row:4,col:2,cat:"alkaline"},
  {symbol:"Sc",name:"Scandium",Z:21,row:4,col:3,cat:"transition"},
  {symbol:"Ti",name:"Titanium",Z:22,row:4,col:4,cat:"transition"},
  {symbol:"V",name:"Vanadium",Z:23,row:4,col:5,cat:"transition"},
  {symbol:"Cr",name:"Chromium",Z:24,row:4,col:6,cat:"transition"},
  {symbol:"Mn",name:"Manganese",Z:25,row:4,col:7,cat:"transition"},
  {symbol:"Fe",name:"Iron",Z:26,row:4,col:8,cat:"transition"},
  {symbol:"Co",name:"Cobalt",Z:27,row:4,col:9,cat:"transition"},
  {symbol:"Ni",name:"Nickel",Z:28,row:4,col:10,cat:"transition"},
  {symbol:"Cu",name:"Copper",Z:29,row:4,col:11,cat:"transition"},
  {symbol:"Zn",name:"Zinc",Z:30,row:4,col:12,cat:"transition"},
  {symbol:"Ga",name:"Gallium",Z:31,row:4,col:13,cat:"metal"},
  {symbol:"Ge",name:"Germanium",Z:32,row:4,col:14,cat:"metalloid"},
  {symbol:"As",name:"Arsenic",Z:33,row:4,col:15,cat:"metalloid"},
  {symbol:"Se",name:"Selenium",Z:34,row:4,col:16,cat:"nonmetal"},
  {symbol:"Br",name:"Bromine",Z:35,row:4,col:17,cat:"nonmetal"},
  {symbol:"Kr",name:"Krypton",Z:36,row:4,col:18,cat:"noble"},
  {symbol:"Rb",name:"Rubidium",Z:37,row:5,col:1,cat:"alkali"},
  {symbol:"Sr",name:"Strontium",Z:38,row:5,col:2,cat:"alkaline"},
  {symbol:"Y",name:"Yttrium",Z:39,row:5,col:3,cat:"transition"},
  {symbol:"Zr",name:"Zirconium",Z:40,row:5,col:4,cat:"transition"},
  {symbol:"Nb",name:"Niobium",Z:41,row:5,col:5,cat:"transition"},
  {symbol:"Mo",name:"Molybdenum",Z:42,row:5,col:6,cat:"transition"},
  {symbol:"Tc",name:"Technetium",Z:43,row:5,col:7,cat:"transition"},
  {symbol:"Ru",name:"Ruthenium",Z:44,row:5,col:8,cat:"transition"},
  {symbol:"Rh",name:"Rhodium",Z:45,row:5,col:9,cat:"transition"},
  {symbol:"Pd",name:"Palladium",Z:46,row:5,col:10,cat:"transition"},
  {symbol:"Ag",name:"Silver",Z:47,row:5,col:11,cat:"transition"},
  {symbol:"Cd",name:"Cadmium",Z:48,row:5,col:12,cat:"transition"},
  {symbol:"In",name:"Indium",Z:49,row:5,col:13,cat:"metal"},
  {symbol:"Sn",name:"Tin",Z:50,row:5,col:14,cat:"metal"},
  {symbol:"Sb",name:"Antimony",Z:51,row:5,col:15,cat:"metalloid"},
  {symbol:"Te",name:"Tellurium",Z:52,row:5,col:16,cat:"metalloid"},
  {symbol:"I",name:"Iodine",Z:53,row:5,col:17,cat:"nonmetal"},
  {symbol:"Xe",name:"Xenon",Z:54,row:5,col:18,cat:"noble"},
  {symbol:"Cs",name:"Caesium",Z:55,row:6,col:1,cat:"alkali"},
  {symbol:"Ba",name:"Barium",Z:56,row:6,col:2,cat:"alkaline"},
  {symbol:"La",name:"Lanthanum",Z:57,row:6,col:3,cat:"lanthanide"},
  {symbol:"Ce",name:"Cerium",Z:58,row:8,col:4,cat:"lanthanide"},
  {symbol:"Pr",name:"Praseodymium",Z:59,row:8,col:5,cat:"lanthanide"},
  {symbol:"Nd",name:"Neodymium",Z:60,row:8,col:6,cat:"lanthanide"},
  {symbol:"Pm",name:"Promethium",Z:61,row:8,col:7,cat:"lanthanide"},
  {symbol:"Sm",name:"Samarium",Z:62,row:8,col:8,cat:"lanthanide"},
  {symbol:"Eu",name:"Europium",Z:63,row:8,col:9,cat:"lanthanide"},
  {symbol:"Gd",name:"Gadolinium",Z:64,row:8,col:10,cat:"lanthanide"},
  {symbol:"Tb",name:"Terbium",Z:65,row:8,col:11,cat:"lanthanide"},
  {symbol:"Dy",name:"Dysprosium",Z:66,row:8,col:12,cat:"lanthanide"},
  {symbol:"Ho",name:"Holmium",Z:67,row:8,col:13,cat:"lanthanide"},
  {symbol:"Er",name:"Erbium",Z:68,row:8,col:14,cat:"lanthanide"},
  {symbol:"Tm",name:"Thulium",Z:69,row:8,col:15,cat:"lanthanide"},
  {symbol:"Yb",name:"Ytterbium",Z:70,row:8,col:16,cat:"lanthanide"},
  {symbol:"Lu",name:"Lutetium",Z:71,row:8,col:17,cat:"lanthanide"},
  {symbol:"Hf",name:"Hafnium",Z:72,row:6,col:4,cat:"transition"},
  {symbol:"Ta",name:"Tantalum",Z:73,row:6,col:5,cat:"transition"},
  {symbol:"W",name:"Tungsten",Z:74,row:6,col:6,cat:"transition"},
  {symbol:"Re",name:"Rhenium",Z:75,row:6,col:7,cat:"transition"},
  {symbol:"Os",name:"Osmium",Z:76,row:6,col:8,cat:"transition"},
  {symbol:"Ir",name:"Iridium",Z:77,row:6,col:9,cat:"transition"},
  {symbol:"Pt",name:"Platinum",Z:78,row:6,col:10,cat:"transition"},
  {symbol:"Au",name:"Gold",Z:79,row:6,col:11,cat:"transition"},
  {symbol:"Hg",name:"Mercury",Z:80,row:6,col:12,cat:"transition"},
  {symbol:"Tl",name:"Thallium",Z:81,row:6,col:13,cat:"metal"},
  {symbol:"Pb",name:"Lead",Z:82,row:6,col:14,cat:"metal"},
  {symbol:"Bi",name:"Bismuth",Z:83,row:6,col:15,cat:"metal"},
  {symbol:"Po",name:"Polonium",Z:84,row:6,col:16,cat:"metalloid"},
  {symbol:"At",name:"Astatine",Z:85,row:6,col:17,cat:"metalloid"},
  {symbol:"Rn",name:"Radon",Z:86,row:6,col:18,cat:"noble"},
  {symbol:"Fr",name:"Francium",Z:87,row:7,col:1,cat:"alkali"},
  {symbol:"Ra",name:"Radium",Z:88,row:7,col:2,cat:"alkaline"},
  {symbol:"Ac",name:"Actinium",Z:89,row:7,col:3,cat:"actinide"},
  {symbol:"Th",name:"Thorium",Z:90,row:9,col:4,cat:"actinide"},
  {symbol:"Pa",name:"Protactinium",Z:91,row:9,col:5,cat:"actinide"},
  {symbol:"U",name:"Uranium",Z:92,row:9,col:6,cat:"actinide"},
  {symbol:"Np",name:"Neptunium",Z:93,row:9,col:7,cat:"actinide"},
  {symbol:"Pu",name:"Plutonium",Z:94,row:9,col:8,cat:"actinide"},
];

const ALL_SYMS = new Set(ELEMENTS.map(e=>e.symbol));
const CAT_COLORS = {
  alkali:"#ef4444",alkaline:"#f97316",transition:"#3b82f6",
  metal:"#94a3b8",metalloid:"#22c55e",nonmetal:"#eab308",
  noble:"#a855f7",lanthanide:"#14b8a6",actinide:"#ec4899",
};

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */
function parseXY(text) {
  const pts = [];
  for (const l of text.split(/\r?\n/)) {
    const t = l.trim();
    if (!t || t.startsWith("#") || t.startsWith("'") || /^[a-zA-Z_]/.test(t)) continue;
    const p = t.split(/[\s,;]+/);
    if (p.length >= 2) { const x=parseFloat(p[0]),y=parseFloat(p[1]); if(!isNaN(x)&&!isNaN(y)) pts.push([x,y]); }
  }
  return pts;
}
function detectPeaks(pts,topN=14){
  if(!pts.length) return {peaks:[],intensities:[]};
  const maxI=Math.max(...pts.map(p=>p[1]));
  const thr=maxI*0.04; const peaks=[];
  for(let i=3;i<pts.length-3;i++){
    const v=pts[i][1];
    if(v>thr&&v>=pts[i-1][1]&&v>=pts[i+1][1]&&v>pts[i-2][1]&&v>pts[i+2][1]&&v>pts[i-3][1]&&v>pts[i+3][1])
      peaks.push({two_theta:pts[i][0],intensity:v});
  }
  peaks.sort((a,b)=>b.intensity-a.intensity);
  const top=peaks.slice(0,topN);
  return{peaks:top.map(p=>+p.two_theta.toFixed(2)),intensities:top.map(p=>Math.round((p.intensity/maxI)*100))};
}
function parseComposition(formula){
  const els=[]; const re=/([A-Z][a-z]?)(\d*\.?\d*)/g; let m;
  while((m=re.exec(formula))!==null) if(ALL_SYMS.has(m[1])) els.push(m[1]);
  return [...new Set(els)];
}
function readText(file){ return new Promise((res,rej)=>{const r=new FileReader();r.onload=e=>res(e.target.result);r.onerror=rej;r.readAsText(file);}); }
function readAB(file){ return new Promise((res,rej)=>{const r=new FileReader();r.onload=e=>res(e.target.result);r.onerror=rej;r.readAsArrayBuffer(file);}); }

/* ═══════════════════════════════════════════════════════
   XRD CHART — renders from raw pts or synthetic peaks
═══════════════════════════════════════════════════════ */
function XRDChart({entry, small=false}){
  const w=small?280:680, h=small?80:180;
  const BLUE="#60a5fa";

  if(entry.xyData&&entry.xyData.length>10){
    const pts=entry.xyData;
    const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);
    const xMin=Math.min(...xs),xMax=Math.max(...xs),yMax=Math.max(...ys);
    const toX=x=>((x-xMin)/(xMax-xMin||1))*w;
    const toY=y=>(h-8)-(y/yMax)*(h-20);
    const d=pts.map((p,i)=>`${i===0?"M":"L"}${toX(p[0]).toFixed(1)},${toY(p[1]).toFixed(1)}`).join(" ");
    const ticks=small?[]:[20,30,40,50,60,70].filter(t=>t>=xMin&&t<=xMax);
    return(
      <svg width="100%" viewBox={`0 0 ${w} ${h+(small?10:24)}`} style={{display:"block"}}>
        <line x1={0} y1={h-8} x2={w} y2={h-8} stroke="#334155" strokeWidth={0.8}/>
        {ticks.map(t=>{const x=toX(t);return(<g key={t}><line x1={x} y1={h-8} x2={x} y2={h-3} stroke="#334155" strokeWidth={0.8}/><text x={x} y={h+10} textAnchor="middle" fontSize={10} fill="#64748b">{t}°</text></g>);})}
        {!small&&<text x={w/2} y={h+22} textAnchor="middle" fontSize={11} fill="#94a3b8">2θ (degrees)</text>}
        <path d={d+` L${toX(xs[xs.length-1])},${h-8} L${toX(xs[0])},${h-8} Z`} fill={BLUE} fillOpacity={0.12}/>
        <path d={d} fill="none" stroke={BLUE} strokeWidth={small?1.2:1.8}/>
      </svg>
    );
  }
  const tMin=10,tMax=80; const pts2=[];
  for(let t=tMin;t<=tMax;t+=0.08){
    let I=0;
    (entry.peaks||[]).forEach((pk,i)=>{I+=(((entry.intensities||[])[i]||50)/100)*Math.exp(-0.5*Math.pow((t-pk)/0.18,2));});
    pts2.push(`${((t-tMin)/(tMax-tMin)*w).toFixed(1)},${((h-12)-(I*(h-24))).toFixed(1)}`);
  }
  const path="M "+pts2.join(" L ");
  const ticks2=small?[]:[20,30,40,50,60,70];
  return(
    <svg width="100%" viewBox={`0 0 ${w} ${h+(small?10:24)}`} style={{display:"block"}}>
      <line x1={0} y1={h-8} x2={w} y2={h-8} stroke="#334155" strokeWidth={0.8}/>
      {ticks2.map(t=>{const x=((t-tMin)/(tMax-tMin))*w;return(<g key={t}><line x1={x} y1={h-8} x2={x} y2={h-3} stroke="#334155" strokeWidth={0.8}/><text x={x} y={h+10} textAnchor="middle" fontSize={10} fill="#64748b">{t}°</text></g>);})}
      {!small&&<text x={w/2} y={h+22} textAnchor="middle" fontSize={11} fill="#94a3b8">2θ (degrees)</text>}
      <path d={path+` L ${w},${h-8} L 0,${h-8} Z`} fill={BLUE} fillOpacity={0.1}/>
      <path d={path} fill="none" stroke={BLUE} strokeWidth={small?1.2:1.8}/>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   PERIODIC TABLE — full width, larger cells
═══════════════════════════════════════════════════════ */
function PeriodicTable({selected,onToggle,highlighted}){
  const Cell=({el})=>{
    const isSel=selected.includes(el.symbol),isHigh=highlighted?.includes(el.symbol);
    const c=CAT_COLORS[el.cat]||"#aaa";
    return(
      <div onClick={()=>onToggle(el.symbol)} title={`${el.name} (${el.Z})`}
        style={{gridColumn:el.col,gridRow:el.row,borderRadius:4,cursor:"pointer",
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          userSelect:"none",transition:"all 0.12s",padding:"2px 0",
          border:isSel?`2px solid ${c}`:isHigh?`2px dashed ${c}`:"1px solid #1e293b",
          background:isSel?c:isHigh?c+"25":"#1e293b",
          color:isSel?"#fff":"#e2e8f0",
          boxShadow:isSel?`0 0 8px ${c}66`:"none",
        }}>
        <span style={{fontSize:"0.55rem",opacity:0.6,lineHeight:1}}>{el.Z}</span>
        <span style={{fontSize:"0.8rem",fontWeight:700,lineHeight:1.2}}>{el.symbol}</span>
      </div>
    );
  };
  const gridBase={display:"grid",gridTemplateColumns:"repeat(18,1fr)",gap:3,width:"100%"};
  return(
    <div style={{width:"100%"}}>
      <div style={{...gridBase,gridTemplateRows:"repeat(7,38px)"}}>
        {ELEMENTS.filter(e=>e.row<=7).map(el=><Cell key={el.symbol} el={el}/>)}
      </div>
      <div style={{...gridBase,gridTemplateRows:"34px",marginTop:6}}>
        <div style={{gridColumn:"1/4",display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:6}}>
          <span style={{fontSize:"0.65rem",color:"#64748b",fontWeight:600}}>Ln</span>
        </div>
        {ELEMENTS.filter(e=>e.row===8).map(el=><Cell key={el.symbol} el={el}/>)}
      </div>
      <div style={{...gridBase,gridTemplateRows:"34px",marginTop:3}}>
        <div style={{gridColumn:"1/4",display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:6}}>
          <span style={{fontSize:"0.65rem",color:"#64748b",fontWeight:600}}>An</span>
        </div>
        {ELEMENTS.filter(e=>e.row===9).map(el=><Cell key={el.symbol} el={el}/>)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DROP ZONE
═══════════════════════════════════════════════════════ */
function DropZone({accept,multiple,onFiles,children}){
  const [over,setOver]=useState(false); const ref=useRef();
  return(
    <div onDragOver={e=>{e.preventDefault();setOver(true);}} onDragLeave={()=>setOver(false)}
      onDrop={e=>{e.preventDefault();setOver(false);onFiles([...e.dataTransfer.files]);}}
      onClick={()=>ref.current.click()}
      style={{border:`2px dashed ${over?"#3b82f6":"#334155"}`,borderRadius:10,padding:"20px 16px",
        cursor:"pointer",textAlign:"center",background:over?"#1e3a5f22":"#0f172a",transition:"all 0.15s"}}>
      <input ref={ref} type="file" accept={accept} multiple={multiple} style={{display:"none"}} onChange={e=>onFiles([...e.target.files])}/>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ADD ENTRY MODAL
═══════════════════════════════════════════════════════ */
function AddEntryModal({onClose,onSaved}){
  const [form,setForm]=useState({composition:"",name:"",phase:"",synthesis:"",temperature:"",atmosphere:"",date:new Date().toISOString().split("T")[0],notes:"",added_by:""});
  const [xyFile,setXyFile]=useState(null);
  const [xyStatus,setXyStatus]=useState(null);
  const [xyParsed,setXyParsed]=useState(null);
  const [xyRaw,setXyRaw]=useState("");
  const [saving,setSaving]=useState(false);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));

  const handleXY=async files=>{
    const f=files[0]; if(!f) return;
    setXyFile(f); setXyStatus("parsing");
    try{
      const text=await readText(f); const pts=parseXY(text);
      if(pts.length<5) throw new Error("Too few data points — check file format");
      const{peaks,intensities}=detectPeaks(pts);
      setXyParsed({pts,peaks,intensities}); setXyRaw(text);
      setXyStatus(`ok:${pts.length} points · ${peaks.length} peaks detected`);
    }catch(e){setXyStatus("err:"+e.message);}
  };

  const handleSave=async()=>{
    if(!form.composition.trim()) return alert("Composition is required.");
    setSaving(true);
    try{
      const{peaks,intensities}=xyParsed||{peaks:[],intensities:[]};
      await api.create({...form,name:form.name||form.composition,elements:parseComposition(form.composition),peaks,intensities,xy_data:xyRaw,filename:xyFile?.name||form.composition.replace(/\s+/g,"_")+".xy"});
      onSaved(); onClose();
    }catch(e){alert("Save failed: "+e.message);}
    finally{setSaving(false);}
  };

  const INP={width:"100%",padding:"8px 12px",fontSize:14,border:"1px solid #334155",borderRadius:8,background:"#0f172a",color:"#e2e8f0",boxSizing:"border-box"};
  const LBL={fontSize:12,color:"#94a3b8",marginBottom:4,display:"block",fontWeight:500};

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#111827",border:"1px solid #334155",borderRadius:14,padding:28,width:"min(560px,100%)",maxHeight:"92vh",overflowY:"auto"}}>
        <h3 style={{margin:"0 0 4px",fontSize:18,fontWeight:600}}>Add XRD Pattern</h3>
        <p style={{margin:"0 0 20px",fontSize:13,color:"#64748b"}}>Only composition is required — everything else is optional.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>

          <div style={{gridColumn:"span 2"}}>
            <label style={LBL}>Composition formula <span style={{color:"#ef4444"}}>*</span></label>
            <input value={form.composition} onChange={e=>set("composition",e.target.value)} placeholder="e.g. BaTiO3 or La0.8Sr0.2FeO3" style={{...INP,borderColor:form.composition?"#334155":"#ef4444"}}/>
            {form.composition&&<div style={{fontSize:12,color:"#22c55e",marginTop:4}}>Elements detected: {parseComposition(form.composition).join(", ")||"none"}</div>}
          </div>

          <div style={{gridColumn:"span 2"}}>
            <label style={LBL}>Sample name <span style={{fontSize:11,color:"#64748b",fontWeight:400}}>(defaults to composition if blank)</span></label>
            <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. BaTiO3 Tetragonal — 1200°C run 2" style={INP}/>
          </div>

          <div style={{gridColumn:"span 2"}}>
            <label style={LBL}>Upload .xy / .dat / .xye file</label>
            <DropZone accept=".xy,.xye,.dat,.txt,.csv,.asc" multiple={false} onFiles={handleXY}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                <span style={{fontSize:28}}>📂</span>
                <span style={{fontSize:14,color:"#94a3b8"}}>{xyFile?xyFile.name:"Drop .xy file here or click to browse"}</span>
                {xyStatus&&<span style={{fontSize:12,color:xyStatus.startsWith("ok")?"#22c55e":xyStatus==="parsing"?"#3b82f6":"#ef4444"}}>{xyStatus.startsWith("ok")?"✓ "+xyStatus.slice(3):xyStatus==="parsing"?"Parsing…":"✗ "+xyStatus.slice(4)}</span>}
              </div>
            </DropZone>
          </div>

          {[{label:"Phase / space group",key:"phase",placeholder:"e.g. Tetragonal P4mm",span:2},
            {label:"Synthesis method",key:"synthesis",placeholder:"e.g. Sol-gel, calcined 800°C, 6h in air",span:2},
            {label:"Temperature (°C)",key:"temperature",placeholder:"800",span:1},
            {label:"Atmosphere",key:"atmosphere",placeholder:"Air",span:1},
            {label:"Date",key:"date",type:"date",span:1},
            {label:"Your name / initials",key:"added_by",placeholder:"e.g. Priya",span:1},
          ].map(({label,key,placeholder,span,type})=>(
            <div key={key} style={{gridColumn:`span ${span}`}}>
              <label style={LBL}>{label}</label>
              <input type={type||"text"} value={form[key]} onChange={e=>set(key,e.target.value)} placeholder={placeholder} style={INP}/>
            </div>
          ))}

          <div style={{gridColumn:"span 2"}}>
            <label style={LBL}>Notes</label>
            <textarea value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Phase purity, crystallite size (Scherrer), observations…" rows={3} style={{...INP,resize:"vertical"}}/>
          </div>
        </div>
        <div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{padding:"8px 20px",borderRadius:8,border:"1px solid #334155",background:"transparent",cursor:"pointer",color:"#94a3b8",fontSize:14}}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{padding:"8px 24px",borderRadius:8,border:"none",background:saving?"#1e3a5f":"#3b82f6",color:"#fff",cursor:saving?"not-allowed":"pointer",fontSize:14,fontWeight:600}}>
            {saving?"Saving…":"Save Pattern"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   BULK UPLOAD MODAL
═══════════════════════════════════════════════════════ */
function BulkUploadModal({onClose,onImported}){
  const [xyFiles,setXyFiles]=useState({});
  const [xlsRows,setXlsRows]=useState(null);
  const [xyStatus,setXyStatus]=useState("");
  const [xlsStatus,setXlsStatus]=useState("");
  const [preview,setPreview]=useState([]);
  const [importing,setImporting]=useState(false);
  const [progress,setProgress]=useState("");

  const processXYFiles=async files=>{
    const list=files.filter(f=>/\.(xy|xye|dat|txt|asc|csv)$/i.test(f.name));
    setXyStatus(`Parsing ${list.length} file(s)…`);
    const map={};
    await Promise.all(list.map(async f=>{
      try{const text=await readText(f);const pts=parseXY(text);const{peaks,intensities}=detectPeaks(pts);map[f.name]={pts,peaks,intensities,raw:text};}
      catch{map[f.name]=null;}
    }));
    setXyFiles(map); setXyStatus(`✓ ${Object.keys(map).length} pattern files loaded`);
    rebuildPreview(map,xlsRows);
  };

  const processZip=async files=>{
    const zipFile=files.find(f=>/\.zip$/i.test(f.name));
    if(!zipFile){setXyStatus("No .zip file found");return;}
    setXyStatus("Unpacking ZIP…");
    try{
      const ab=await readAB(zipFile);
      const zip=await window.JSZip.loadAsync(ab);
      const map={};const tasks=[];
      zip.forEach((path,entry)=>{
        if(!entry.dir&&/\.(xy|xye|dat|txt|asc|csv)$/i.test(path)){
          const fname=path.split("/").pop();
          tasks.push(entry.async("text").then(text=>{const pts=parseXY(text);const{peaks,intensities}=detectPeaks(pts);map[fname]={pts,peaks,intensities,raw:text};}).catch(()=>{map[path.split("/").pop()]=null;}));
        }
      });
      await Promise.all(tasks);
      setXyFiles(map); setXyStatus(`✓ ${Object.keys(map).length} patterns extracted from ZIP`);
      rebuildPreview(map,xlsRows);
    }catch(e){setXyStatus("✗ "+e.message);}
  };

  const processExcel=async files=>{
    const f=files.find(f=>/\.(xlsx|xls|csv)$/i.test(f.name));
    if(!f){setXlsStatus("No Excel/CSV found");return;}
    setXlsStatus("Reading spreadsheet…");
    try{
      let rows;
      if(/\.csv$/i.test(f.name)){
        const text=await readText(f);const lines=text.split(/\r?\n/).filter(Boolean);
        const headers=lines[0].split(",").map(h=>h.trim().toLowerCase().replace(/\s+/g,"_"));
        rows=lines.slice(1).map(l=>{const vals=l.split(",");const row={};headers.forEach((h,i)=>{row[h]=(vals[i]||"").trim();});return row;});
      }else{
        const ab=await readAB(f);const wb=window.XLSX.read(ab,{type:"array"});
        const ws=wb.Sheets[wb.SheetNames[0]];
        const raw=window.XLSX.utils.sheet_to_json(ws,{defval:""});
        rows=raw.map(r=>{const n={};Object.keys(r).forEach(k=>{n[k.toLowerCase().trim().replace(/\s+/g,"_")]=String(r[k]).trim();});return n;});
      }
      setXlsRows(rows); setXlsStatus(`✓ ${rows.length} rows loaded`);
      rebuildPreview(xyFiles,rows);
    }catch(e){setXlsStatus("✗ "+e.message);}
  };

  const rebuildPreview=(xyMap,rows)=>{
    const items=[];
    if(rows){
      for(const row of rows){
        const fnKey=Object.keys(row).find(k=>k.includes("file")||k==="filename")||Object.keys(row)[0];
        const fname=row[fnKey]||"";
        const matchKey=Object.keys(xyMap).find(k=>k===fname||k.replace(/\.[^.]+$/,"")===(fname.replace(/\.[^.]+$/,"")));
        const xy=matchKey?xyMap[matchKey]:null;
        items.push({filename:fname,composition:row.composition||row.formula||row.comp||"",name:row.name||row.sample||row.sample_name||"",phase:row.phase||"",synthesis:row.synthesis||row.method||"",temperature:row.temperature||row.temp||"",atmosphere:row.atmosphere||"",date:row.date||"",notes:row.notes||row.note||"",added_by:row.added_by||row.contributor||"",matched:!!xy,xyData:xy?.pts||null,peaks:xy?.peaks||[],intensities:xy?.intensities||[],raw:xy?.raw||""});
      }
    }
    for(const[fname,xy]of Object.entries(xyMap)){
      if(!items.some(i=>i.filename===fname||i.filename===fname.replace(/\.[^.]+$/,""))){
        items.push({filename:fname,composition:fname.replace(/\.[^.]+$/,""),name:"",phase:"",synthesis:"",temperature:"",atmosphere:"",date:"",notes:"",added_by:"",matched:false,xyData:xy?.pts||null,peaks:xy?.peaks||[],intensities:xy?.intensities||[],raw:xy?.raw||""});
      }
    }
    setPreview(items);
  };

  const doImport=async()=>{
    const valid=preview.filter(p=>p.composition);
    if(!valid.length) return;
    setImporting(true); setProgress("Uploading to database…");
    try{
      const entries=valid.map(p=>({composition:p.composition,name:p.name||p.composition,elements:parseComposition(p.composition),phase:p.phase||"",synthesis:p.synthesis||"",temperature:p.temperature||"",atmosphere:p.atmosphere||"",date:p.date||new Date().toISOString().split("T")[0],notes:p.notes||"",added_by:p.added_by||"lab",filename:p.filename||p.composition+".xy",xy_data:p.raw||"",peaks:p.peaks,intensities:p.intensities}));
      const res=await api.bulk(entries);
      setProgress(`✓ Imported ${res.imported} patterns`);
      setTimeout(()=>{onImported();onClose();},800);
    }catch(e){setProgress("✗ "+e.message);setImporting(false);}
  };

  const readyCount=preview.filter(p=>p.composition).length;

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#111827",border:"1px solid #334155",borderRadius:14,padding:28,width:"min(680px,100%)",maxHeight:"92vh",overflowY:"auto"}}>
        <h3 style={{margin:"0 0 4px",fontSize:18,fontWeight:600}}>Bulk Import XRD Patterns</h3>
        <p style={{margin:"0 0 20px",fontSize:13,color:"#64748b"}}>Upload .xy files (or ZIP) + an Excel/CSV with metadata. Files matched by filename.</p>

        <div style={{marginBottom:18}}>
          <div style={{fontSize:14,fontWeight:600,marginBottom:10,color:"#e2e8f0"}}>① XRD Pattern Files</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <DropZone accept=".xy,.xye,.dat,.txt,.asc" multiple={true} onFiles={processXYFiles}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                <span style={{fontSize:28}}>📄</span>
                <span style={{fontSize:13,color:"#94a3b8",fontWeight:500}}>Multiple .xy files</span>
                <span style={{fontSize:12,color:"#64748b"}}>drag & drop or click to browse</span>
              </div>
            </DropZone>
            <DropZone accept=".zip" multiple={false} onFiles={processZip}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                <span style={{fontSize:28}}>🗜</span>
                <span style={{fontSize:13,color:"#94a3b8",fontWeight:500}}>ZIP archive</span>
                <span style={{fontSize:12,color:"#64748b"}}>containing .xy files inside</span>
              </div>
            </DropZone>
          </div>
          {xyStatus&&<div style={{fontSize:13,marginTop:8,color:xyStatus.startsWith("✓")?"#22c55e":xyStatus.startsWith("✗")?"#ef4444":"#3b82f6",fontWeight:500}}>{xyStatus}</div>}
        </div>

        <div style={{marginBottom:18}}>
          <div style={{fontSize:14,fontWeight:600,marginBottom:10,color:"#e2e8f0"}}>② Metadata Spreadsheet <span style={{fontSize:12,fontWeight:400,color:"#64748b"}}>(optional — but recommended)</span></div>
          <DropZone accept=".xlsx,.xls,.csv" multiple={false} onFiles={processExcel}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
              <span style={{fontSize:28}}>📊</span>
              <span style={{fontSize:13,color:"#94a3b8",fontWeight:500}}>Excel (.xlsx) or CSV file</span>
              <span style={{fontSize:12,color:"#64748b"}}>Columns: filename, composition, name, phase, synthesis, temperature, atmosphere, date, notes</span>
            </div>
          </DropZone>
          {xlsStatus&&<div style={{fontSize:13,marginTop:8,color:xlsStatus.startsWith("✓")?"#22c55e":xlsStatus.startsWith("✗")?"#ef4444":"#3b82f6",fontWeight:500}}>{xlsStatus}</div>}
        </div>

        {preview.length>0&&(
          <div style={{marginBottom:18}}>
            <div style={{fontSize:14,fontWeight:600,marginBottom:8}}>{preview.length} entries · {readyCount} ready to import</div>
            <div style={{maxHeight:220,overflowY:"auto",border:"1px solid #1e293b",borderRadius:10}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                <thead><tr style={{background:"#1e293b",position:"sticky",top:0}}>
                  {["File","Composition","Phase","XY Linked"].map(h=><th key={h} style={{padding:"8px 12px",textAlign:"left",fontWeight:600,color:"#94a3b8"}}>{h}</th>)}
                </tr></thead>
                <tbody>{preview.map((p,i)=>(
                  <tr key={i} style={{borderTop:"1px solid #1e293b"}}>
                    <td style={{padding:"6px 12px",color:"#64748b",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.filename||"—"}</td>
                    <td style={{padding:"6px 12px",fontWeight:600,color:p.composition?"#e2e8f0":"#ef4444"}}>{p.composition||"⚠ missing"}</td>
                    <td style={{padding:"6px 12px",color:"#94a3b8"}}>{p.phase||"—"}</td>
                    <td style={{padding:"6px 12px"}}><span style={{fontSize:11,padding:"2px 10px",borderRadius:12,background:p.matched?"#16a34a22":"#92400e22",color:p.matched?"#22c55e":"#f59e0b",fontWeight:600}}>{p.matched?"✓ Yes":"XY only"}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}

        <div style={{background:"#1e293b",borderRadius:8,padding:"10px 14px",marginBottom:18,fontSize:12,color:"#64748b",lineHeight:1.7}}>
          <strong style={{color:"#94a3b8"}}>Excel column headers (case-insensitive):</strong>{" "}
          {["filename","composition","name","phase","synthesis","temperature","atmosphere","date","notes"].map(c=>(
            <code key={c} style={{background:"#0f172a",color:"#60a5fa",padding:"1px 6px",borderRadius:4,marginRight:4}}>{c}</code>
          ))}
        </div>

        {progress&&<div style={{fontSize:14,color:progress.startsWith("✓")?"#22c55e":progress.startsWith("✗")?"#ef4444":"#3b82f6",marginBottom:14,fontWeight:500}}>{progress}</div>}

        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:13,color:"#64748b"}}>{readyCount} pattern{readyCount!==1?"s":""} will be saved</span>
          <div style={{display:"flex",gap:10}}>
            <button onClick={onClose} style={{padding:"8px 20px",borderRadius:8,border:"1px solid #334155",background:"transparent",cursor:"pointer",color:"#94a3b8",fontSize:14}}>Cancel</button>
            <button onClick={doImport} disabled={readyCount===0||importing} style={{padding:"8px 24px",borderRadius:8,border:"none",background:readyCount>0&&!importing?"#3b82f6":"#1e3a5f",color:"#fff",cursor:readyCount>0&&!importing?"pointer":"not-allowed",fontSize:14,fontWeight:600}}>
              {importing?"Importing…":`Import ${readyCount} Patterns`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ENTRY DETAIL PANEL — right side panel
═══════════════════════════════════════════════════════ */
function EntryDetail({entryLight,onClose,onDelete}){
  const [entry,setEntry]=useState(entryLight);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    setLoading(true);
    api.get(entryLight.id).then(res=>{
      const full=res.data;
      if(full.xy_data) full.xyData=parseXY(full.xy_data);
      setEntry(full);
    }).catch(()=>{}).finally(()=>setLoading(false));
  },[entryLight.id]);

  return(
    <div style={{height:"100%",overflowY:"auto",padding:"4px 0"}}>
      {/* header */}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:16,gap:8}}>
        <div>
          <h2 style={{margin:0,fontSize:17,fontWeight:600,color:"#f1f5f9"}}>{entry.name}</h2>
          <p style={{margin:"3px 0 0",fontSize:13,color:"#94a3b8"}}>{entry.composition}{entry.date?" · "+entry.date:""}</p>
          {entry.added_by&&<p style={{margin:"1px 0 0",fontSize:12,color:"#64748b"}}>Added by {entry.added_by}</p>}
        </div>
        <div style={{display:"flex",gap:6,flexShrink:0}}>
          <button onClick={onDelete} style={{padding:"5px 12px",borderRadius:7,border:"1px solid #ef444444",background:"transparent",color:"#ef4444",cursor:"pointer",fontSize:12,fontWeight:500}}>Delete</button>
          <button onClick={onClose} style={{padding:"5px 12px",borderRadius:7,border:"1px solid #334155",background:"transparent",color:"#94a3b8",cursor:"pointer",fontSize:12}}>✕ Close</button>
        </div>
      </div>

      {/* chart */}
      <div style={{background:"#0f172a",borderRadius:10,padding:"14px 10px",marginBottom:14}}>
        {loading
          ?<div style={{height:160,display:"flex",alignItems:"center",justifyContent:"center",color:"#64748b",fontSize:13}}>Loading pattern…</div>
          :<XRDChart entry={entry}/>}
      </div>

      {/* metadata grid */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        {[{label:"Phase / Space Group",value:entry.phase||"—"},
          {label:"Synthesis",value:entry.synthesis||"—"},
          {label:"Temperature",value:entry.temperature?entry.temperature+"°C":"—"},
          {label:"Atmosphere",value:entry.atmosphere||"—"},
          {label:"Filename",value:entry.filename||"—"},
          {label:"Elements",value:(entry.elements||[]).join(", ")||"—"},
        ].map(({label,value})=>(
          <div key={label} style={{background:"#1e293b",borderRadius:8,padding:"10px 14px"}}>
            <div style={{fontSize:11,color:"#64748b",marginBottom:3,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.04em"}}>{label}</div>
            <div style={{fontSize:13,fontWeight:500,color:"#e2e8f0",wordBreak:"break-all"}}>{value}</div>
          </div>
        ))}
      </div>

      {/* peaks */}
      {entry.peaks?.length>0&&(
        <div style={{background:"#1e293b",borderRadius:8,padding:"10px 14px",marginBottom:10}}>
          <div style={{fontSize:11,color:"#64748b",marginBottom:6,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.04em"}}>Detected Peak Positions (2θ)</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {entry.peaks.map((p,i)=>(
              <span key={i} style={{fontSize:12,background:"#1e3a5f",color:"#60a5fa",borderRadius:6,padding:"3px 10px",fontWeight:500,border:"1px solid #3b82f622"}}>{Number(p).toFixed(1)}°</span>
            ))}
          </div>
        </div>
      )}

      {/* notes */}
      {entry.notes&&(
        <div style={{background:"#1e293b",borderRadius:8,padding:"10px 14px"}}>
          <div style={{fontSize:11,color:"#64748b",marginBottom:4,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.04em"}}>Notes</div>
          <div style={{fontSize:13,lineHeight:1.7,color:"#e2e8f0"}}>{entry.notes}</div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════ */
export default function App(){
  const [db,setDb]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);
  const [selected,setSelected]=useState([]);
  const [activeEntry,setActiveEntry]=useState(null);
  const [showAdd,setShowAdd]=useState(false);
  const [showBulk,setShowBulk]=useState(false);
  const [search,setSearch]=useState("");
  const [tab,setTab]=useState("periodic");
  const searchTimer=useRef(null);

  const loadEntries=useCallback(async(params={})=>{
    setLoading(true);setError(null);
    try{const res=await api.list(params);setDb(res.data);}
    catch(e){setError(e.message);}
    finally{setLoading(false);}
  },[]);

  useEffect(()=>{loadEntries();},[loadEntries]);

  useEffect(()=>{
    clearTimeout(searchTimer.current);
    searchTimer.current=setTimeout(()=>{
      if(search.length>1){loadEntries({q:search});setSelected([]);}
      else if(search.length===0) loadEntries();
    },300);
  },[search,loadEntries]);

  useEffect(()=>{
    if(selected.length>0) loadEntries({elements:selected});
    else if(!search) loadEntries();
  },[selected]);

  const toggleEl=sym=>{setSelected(s=>s.includes(sym)?s.filter(x=>x!==sym):[...s,sym]);setActiveEntry(null);setSearch("");};
  const clearSel=()=>{setSelected([]);setActiveEntry(null);loadEntries();};

  const handleDelete=async id=>{
    if(!window.confirm("Delete this entry from the database?")) return;
    try{await api.delete(id);setActiveEntry(null);loadEntries();}
    catch(e){alert("Delete failed: "+e.message);}
  };

  const exactMatches=selected.length===0?[]:db.filter(e=>selected.every(s=>e.elements?.includes(s))&&e.elements?.every(s=>selected.includes(s)));
  const partialMatches=selected.length===0?[]:db.filter(e=>!exactMatches.includes(e)&&selected.some(s=>e.elements?.includes(s)));
  const highlighted=[...new Set([...exactMatches,...partialMatches].flatMap(e=>e.elements||[]))];
  const allEls=[...new Set(db.flatMap(e=>e.elements||[]))];

  const matchBadge=entry=>{
    if(exactMatches.includes(entry)) return{label:"Exact match",color:"#22c55e"};
    if(partialMatches.includes(entry)) return{label:`${entry.elements?.filter(e=>selected.includes(e)).length}/${selected.length} elements`,color:"#f59e0b"};
    return null;
  };

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:"#0a0f1e",color:"#e2e8f0",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",overflow:"hidden"}}>

      {/* ── TOP NAV ── */}
      <div style={{flexShrink:0,background:"#0f172a",borderBottom:"1px solid #1e293b",padding:"0 24px",display:"flex",alignItems:"center",gap:16,height:56}}>
        <span style={{fontSize:20}}>🔬</span>
        <div style={{flex:1}}>
          <span style={{fontSize:16,fontWeight:700,color:"#f1f5f9"}}>XRD Lab Database</span>
          <span style={{fontSize:12,color:"#64748b",marginLeft:12}}>{loading?"loading…":`${db.length} patterns · ${allEls.length} elements`}</span>
        </div>
        {/* search */}
        <input value={search} onChange={e=>{setSearch(e.target.value);setSelected([]);setActiveEntry(null);}}
          placeholder="Search composition, phase, element, synthesis…"
          style={{width:340,padding:"7px 14px",fontSize:13,border:"1px solid #334155",borderRadius:8,background:"#1e293b",color:"#e2e8f0",outline:"none"}}/>
        <button onClick={()=>setShowBulk(true)} style={{padding:"7px 16px",borderRadius:8,border:"1px solid #334155",background:"transparent",cursor:"pointer",color:"#e2e8f0",fontSize:13,fontWeight:500,whiteSpace:"nowrap"}}>⬆ Bulk Import</button>
        <button onClick={()=>setShowAdd(true)} style={{padding:"7px 18px",borderRadius:8,border:"none",background:"#3b82f6",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600,whiteSpace:"nowrap"}}>+ Add Pattern</button>
      </div>

      {/* ── MAIN AREA ── */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>

        {/* LEFT PANEL — periodic table + list */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>

          {/* tabs */}
          <div style={{flexShrink:0,display:"flex",gap:0,borderBottom:"1px solid #1e293b",background:"#0f172a",padding:"0 24px"}}>
            {[{id:"periodic",label:"Periodic Table Selector"},{id:"list",label:"All Patterns"}].map(t=>(
              <button key={t.id} onClick={()=>{setTab(t.id);clearSel();setSearch("");}}
                style={{padding:"12px 20px",fontSize:13,border:"none",cursor:"pointer",background:"transparent",fontWeight:tab===t.id?600:400,color:tab===t.id?"#f1f5f9":"#64748b",borderBottom:tab===t.id?"2px solid #3b82f6":"2px solid transparent",marginBottom:-1}}>
                {t.label}
              </button>
            ))}
          </div>

          <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>

            {/* periodic table section */}
            {tab==="periodic"&&!search&&(
              <div style={{marginBottom:20}}>
                <PeriodicTable selected={selected} onToggle={toggleEl} highlighted={highlighted}/>

                {/* legend */}
                <div style={{display:"flex",flexWrap:"wrap",gap:8,margin:"12px 0 10px"}}>
                  {Object.entries(CAT_COLORS).map(([cat,color])=>(
                    <span key={cat} style={{fontSize:11,padding:"3px 10px",borderRadius:12,background:color+"20",color,fontWeight:600,border:`1px solid ${color}44`}}>{cat}</span>
                  ))}
                </div>

                {selected.length>0&&(
                  <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",background:"#1e293b",borderRadius:10,border:"1px solid #334155"}}>
                    <span style={{fontSize:13,color:"#94a3b8",fontWeight:500}}>Selected:</span>
                    {selected.map(s=>(
                      <span key={s} onClick={()=>toggleEl(s)} style={{fontSize:13,background:"#1e3a5f",color:"#60a5fa",borderRadius:6,padding:"3px 12px",fontWeight:600,cursor:"pointer",border:"1px solid #3b82f644"}}>{s} ×</span>
                    ))}
                    <div style={{marginLeft:"auto",display:"flex",gap:16,fontSize:13}}>
                      <span style={{color:"#22c55e",fontWeight:600}}>✅ {exactMatches.length} exact</span>
                      <span style={{color:"#f59e0b",fontWeight:600}}>🟡 {partialMatches.length} partial</span>
                      <button onClick={clearSel} style={{background:"transparent",border:"none",color:"#64748b",cursor:"pointer",fontSize:13,textDecoration:"underline"}}>Clear</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* error */}
            {error&&<div style={{background:"#450a0a",border:"1px solid #ef4444",borderRadius:10,padding:"12px 16px",marginBottom:16,fontSize:14,color:"#ef4444",display:"flex",gap:12,alignItems:"center"}}>
              <span>⚠ {error}</span>
              <button onClick={()=>loadEntries()} style={{marginLeft:"auto",background:"transparent",border:"1px solid #ef4444",color:"#ef4444",padding:"4px 12px",borderRadius:6,cursor:"pointer",fontSize:12}}>Retry</button>
            </div>}

            {/* pattern list */}
            {loading&&db.length===0
              ?<div style={{textAlign:"center",padding:"60px 0",color:"#64748b",fontSize:15}}>Loading patterns…</div>
              :db.length===0
                ?<div style={{textAlign:"center",padding:"60px 0",color:"#64748b",fontSize:15}}>{search?"No patterns match your search.":"No patterns yet — click + Add Pattern to begin!"}</div>
                :<div style={{display:"grid",gridTemplateColumns:activeEntry?"1fr":"repeat(auto-fill,minmax(420px,1fr))",gap:12}}>
                  {db.map(entry=>{
                    const badge=matchBadge(entry);
                    const isActive=activeEntry?.id===entry.id;
                    return(
                      <div key={entry.id} onClick={()=>setActiveEntry(entry)}
                        style={{display:"grid",gridTemplateColumns:"1fr 220px",gap:0,background:isActive?"#1e3a5f":"#111827",borderRadius:12,cursor:"pointer",border:isActive?"1px solid #3b82f6":"1px solid #1e293b",transition:"all 0.12s",overflow:"hidden"}}>
                        <div style={{padding:"14px 16px"}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                            <span style={{fontSize:15,fontWeight:700,color:"#f1f5f9"}}>{entry.name}</span>
                            {badge&&<span style={{fontSize:11,padding:"2px 10px",borderRadius:10,background:badge.color+"22",color:badge.color,fontWeight:600,border:`1px solid ${badge.color}44`}}>{badge.label}</span>}
                          </div>
                          <div style={{fontSize:13,color:"#94a3b8",marginBottom:8}}>{entry.composition}{entry.phase?" · "+entry.phase:""}</div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:4,alignItems:"center"}}>
                            {(entry.elements||[]).map(el=>(
                              <span key={el} style={{fontSize:11,padding:"2px 8px",borderRadius:5,background:selected.includes(el)?"#1e3a5f":"#1e293b",color:selected.includes(el)?"#60a5fa":"#94a3b8",border:`1px solid ${selected.includes(el)?"#3b82f644":"#334155"}`}}>{el}</span>
                            ))}
                          </div>
                          <div style={{display:"flex",gap:12,marginTop:8,fontSize:11,color:"#475569"}}>
                            {entry.temperature&&<span>🌡 {entry.temperature}°C</span>}
                            {entry.atmosphere&&<span>💨 {entry.atmosphere}</span>}
                            {entry.added_by&&<span>👤 {entry.added_by}</span>}
                            {entry.date&&<span style={{marginLeft:"auto"}}>{entry.date}</span>}
                          </div>
                        </div>
                        <div style={{background:"#0a0f1e",borderLeft:"1px solid #1e293b",padding:"10px 8px",display:"flex",alignItems:"center"}}>
                          <XRDChart entry={entry} small/>
                        </div>
                      </div>
                    );
                  })}
                </div>
            }
          </div>
        </div>

        {/* RIGHT PANEL — entry detail */}
        {activeEntry&&(
          <div style={{width:480,flexShrink:0,background:"#0f172a",borderLeft:"1px solid #1e293b",padding:"20px 20px",overflowY:"auto"}}>
            <EntryDetail entryLight={activeEntry} onClose={()=>setActiveEntry(null)} onDelete={()=>handleDelete(activeEntry.id)}/>
          </div>
        )}
      </div>

      {showAdd&&<AddEntryModal onClose={()=>setShowAdd(false)} onSaved={()=>loadEntries()}/>}
      {showBulk&&<BulkUploadModal onClose={()=>setShowBulk(false)} onImported={()=>loadEntries()}/>}
    </div>
  );
}
ENDOFFILE
echo "done"
