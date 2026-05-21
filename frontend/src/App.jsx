import { useState, useEffect, useRef, useCallback } from "react";
import { api } from "./api";

/* ═══════════════════════════════════════════════════════════════
   ELEMENT DATA
═══════════════════════════════════════════════════════════════ */
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

const ALL_SYMS = new Set(ELEMENTS.map(e => e.symbol));

const CAT_COLORS = {
  alkali:"#e74c3c",alkaline:"#e67e22",transition:"#3498db",
  metal:"#95a5a6",metalloid:"#27ae60",nonmetal:"#d4ac0d",
  noble:"#9b59b6",lanthanide:"#1abc9c",actinide:"#e91e63",
};

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */
function parseXY(text) {
  const pts = [];
  for (const l of text.split(/\r?\n/)) {
    const t = l.trim();
    if (!t || t.startsWith("#") || t.startsWith("'") || /^[a-zA-Z_]/.test(t)) continue;
    const p = t.split(/[\s,;]+/);
    if (p.length >= 2) {
      const x = parseFloat(p[0]), y = parseFloat(p[1]);
      if (!isNaN(x) && !isNaN(y)) pts.push([x, y]);
    }
  }
  return pts;
}

function detectPeaks(pts, topN = 12) {
  if (!pts.length) return { peaks: [], intensities: [] };
  const maxI = Math.max(...pts.map(p => p[1]));
  const threshold = maxI * 0.04;
  const peaks = [];
  for (let i = 3; i < pts.length - 3; i++) {
    const v = pts[i][1];
    if (v > threshold && v >= pts[i-1][1] && v >= pts[i+1][1] && v > pts[i-2][1] && v > pts[i+2][1] && v > pts[i-3][1] && v > pts[i+3][1]) {
      peaks.push({ two_theta: pts[i][0], intensity: v });
    }
  }
  peaks.sort((a,b) => b.intensity - a.intensity);
  const top = peaks.slice(0, topN);
  return {
    peaks: top.map(p => +p.two_theta.toFixed(2)),
    intensities: top.map(p => Math.round((p.intensity / maxI) * 100)),
  };
}

function parseComposition(formula) {
  const els = [];
  const re = /([A-Z][a-z]?)(\d*\.?\d*)/g;
  let m;
  while ((m = re.exec(formula)) !== null) if (ALL_SYMS.has(m[1])) els.push(m[1]);
  return [...new Set(els)];
}

function readText(file) {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = e => res(e.target.result); r.onerror = rej; r.readAsText(file); });
}
function readAB(file) {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = e => res(e.target.result); r.onerror = rej; r.readAsArrayBuffer(file); });
}

/* ═══════════════════════════════════════════════════════════════
   XRD CHART
═══════════════════════════════════════════════════════════════ */
function XRDChart({ entry, small = false }) {
  const w = small ? 220 : 460, h = small ? 70 : 120;

  if (entry.xyData && entry.xyData.length > 10) {
    const pts = entry.xyData;
    const xs = pts.map(p=>p[0]), ys = pts.map(p=>p[1]);
    const xMin=Math.min(...xs), xMax=Math.max(...xs), yMax=Math.max(...ys);
    const toX = x => ((x-xMin)/(xMax-xMin||1))*w;
    const toY = y => (h-6) - (y/yMax)*(h-14);
    const d = pts.map((p,i) => `${i===0?"M":"L"}${toX(p[0]).toFixed(1)},${toY(p[1]).toFixed(1)}`).join(" ");
    const ticks = small?[]:[20,30,40,50,60,70].filter(t=>t>=xMin&&t<=xMax);
    return (
      <svg width="100%" viewBox={`0 0 ${w} ${h+(small?8:18)}`} style={{display:"block"}}>
        <line x1={0} y1={h-6} x2={w} y2={h-6} stroke="#334155" strokeWidth={0.5}/>
        {ticks.map(t=>{const x=toX(t);return <g key={t}><line x1={x} y1={h-6} x2={x} y2={h-3} stroke="#334155" strokeWidth={0.5}/><text x={x} y={h+8} textAnchor="middle" fontSize={8} fill="#64748b">{t}°</text></g>;})}
        {!small&&<text x={w/2} y={h+18} textAnchor="middle" fontSize={8} fill="#94a3b8">2θ (degrees)</text>}
        <path d={d+` L${toX(xs[xs.length-1])},${h-6} L${toX(xs[0])},${h-6} Z`} fill="#3498db" fillOpacity={0.1}/>
        <path d={d} fill="none" stroke="#3498db" strokeWidth={1.2}/>
      </svg>
    );
  }
  // synthetic from peaks
  const tMin=10, tMax=80;
  const pts2=[];
  for (let t=tMin;t<=tMax;t+=0.08) {
    let I=0;
    (entry.peaks||[]).forEach((pk,i)=>{ I+=(((entry.intensities||[])[i]||50)/100)*Math.exp(-0.5*Math.pow((t-pk)/0.18,2)); });
    pts2.push(`${((t-tMin)/(tMax-tMin)*w).toFixed(1)},${((h-10)-(I*(h-18))).toFixed(1)}`);
  }
  const path="M "+pts2.join(" L ");
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h+(small?8:18)}`} style={{display:"block"}}>
      <line x1={0} y1={h-8} x2={w} y2={h-8} stroke="#334155" strokeWidth={0.5}/>
      {!small&&[20,30,40,50,60,70].map(t=>{const x=((t-tMin)/(tMax-tMin))*w;return <g key={t}><line x1={x} y1={h-8} x2={x} y2={h-4} stroke="#334155" strokeWidth={0.5}/><text x={x} y={h+8} textAnchor="middle" fontSize={8} fill="#64748b">{t}°</text></g>;})}
      {!small&&<text x={w/2} y={h+18} textAnchor="middle" fontSize={8} fill="#94a3b8">2θ (degrees)</text>}
      <path d={path+` L ${w},${h-8} L 0,${h-8} Z`} fill="#3498db" fillOpacity={0.08}/>
      <path d={path} fill="none" stroke="#3498db" strokeWidth={1.4}/>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PERIODIC TABLE
═══════════════════════════════════════════════════════════════ */
function PeriodicTable({ selected, onToggle, highlighted }) {
  const sz=30,gap=2;
  const Cell = ({el}) => {
    const isSel=selected.includes(el.symbol), isHigh=highlighted?.includes(el.symbol);
    const c=CAT_COLORS[el.cat]||"#aaa";
    return <div onClick={()=>onToggle(el.symbol)} title={`${el.name} (${el.Z})`} style={{gridColumn:el.col,gridRow:el.row,width:sz,height:sz,borderRadius:3,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",userSelect:"none",transition:"all 0.1s",border:isSel?`2px solid ${c}`:isHigh?`2px dashed ${c}`:"1px solid transparent",background:isSel?c:isHigh?c+"28":"#1a1f2e",color:isSel?"#fff":"#e2e8f0"}}>
      <span style={{fontSize:6,opacity:0.6,lineHeight:1}}>{el.Z}</span>
      <span style={{fontSize:10,fontWeight:600,lineHeight:1.1}}>{el.symbol}</span>
    </div>;
  };
  const gs = {display:"grid",gridTemplateColumns:`repeat(18,${sz}px)`,gap:`${gap}px`,width:"fit-content"};
  return (
    <div style={{overflowX:"auto",paddingBottom:4}}>
      <div style={{...gs,gridTemplateRows:`repeat(7,${sz}px)`}}>{ELEMENTS.filter(e=>e.row<=7).map(el=><Cell key={el.symbol} el={el}/>)}</div>
      <div style={{...gs,gridTemplateRows:`${sz}px`,marginTop:4}}>
        <div style={{gridColumn:"1/4",display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:4}}><span style={{fontSize:8,color:"#64748b"}}>Ln</span></div>
        {ELEMENTS.filter(e=>e.row===8).map(el=><Cell key={el.symbol} el={el}/>)}
      </div>
      <div style={{...gs,gridTemplateRows:`${sz}px`,marginTop:2}}>
        <div style={{gridColumn:"1/4",display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:4}}><span style={{fontSize:8,color:"#64748b"}}>An</span></div>
        {ELEMENTS.filter(e=>e.row===9).map(el=><Cell key={el.symbol} el={el}/>)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DROP ZONE
═══════════════════════════════════════════════════════════════ */
function DropZone({ accept, multiple, onFiles, children }) {
  const [over, setOver] = useState(false);
  const ref = useRef();
  return (
    <div onDragOver={e=>{e.preventDefault();setOver(true);}} onDragLeave={()=>setOver(false)}
      onDrop={e=>{e.preventDefault();setOver(false);onFiles([...e.dataTransfer.files]);}}
      onClick={()=>ref.current.click()}
      style={{border:`1.5px dashed ${over?"#3498db":"#2d3748"}`,borderRadius:8,padding:"16px 12px",cursor:"pointer",textAlign:"center",background:over?"#3498db0a":"#1a1f2e",transition:"all 0.15s"}}>
      <input ref={ref} type="file" accept={accept} multiple={multiple} style={{display:"none"}} onChange={e=>onFiles([...e.target.files])}/>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ADD SINGLE ENTRY MODAL
═══════════════════════════════════════════════════════════════ */
function AddEntryModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ composition:"", name:"", phase:"", synthesis:"", temperature:"", atmosphere:"", date:new Date().toISOString().split("T")[0], notes:"", added_by:"" });
  const [xyFile, setXyFile] = useState(null);
  const [xyStatus, setXyStatus] = useState(null);
  const [xyParsed, setXyParsed] = useState(null);
  const [xyRaw, setXyRaw] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleXY = async files => {
    const f = files[0]; if (!f) return;
    setXyFile(f); setXyStatus("parsing");
    try {
      const text = await readText(f);
      const pts = parseXY(text);
      if (pts.length < 5) throw new Error("Too few points — check file format");
      const { peaks, intensities } = detectPeaks(pts);
      setXyParsed({ pts, peaks, intensities });
      setXyRaw(text);
      setXyStatus(`ok:${pts.length} points · ${peaks.length} peaks`);
    } catch(e) { setXyStatus("err:"+e.message); }
  };

  const handleSave = async () => {
    if (!form.composition.trim()) return alert("Composition is required.");
    setSaving(true);
    try {
      const { peaks, intensities } = xyParsed || { peaks:[], intensities:[] };
      const entry = {
        ...form,
        name: form.name || form.composition,
        elements: parseComposition(form.composition),
        peaks, intensities,
        xy_data: xyRaw,
        filename: xyFile?.name || form.composition.replace(/\s+/g,"_")+".xy",
      };
      const res = await api.create(entry);
      onSaved(res.data);
      onClose();
    } catch(e) { alert("Save failed: "+e.message); }
    finally { setSaving(false); }
  };

  const inp = {width:"100%",padding:"6px 10px",fontSize:13,border:"0.5px solid #2d3748",borderRadius:6,background:"#0f1117",color:"#e2e8f0",boxSizing:"border-box"};
  const lbl = {fontSize:12,color:"#94a3b8",marginBottom:3,display:"block"};

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#0f1117",border:"0.5px solid #334155",borderRadius:12,padding:24,width:520,maxHeight:"90vh",overflowY:"auto"}}>
        <h3 style={{margin:"0 0 4px",fontSize:16,fontWeight:500}}>Add XRD Pattern</h3>
        <p style={{margin:"0 0 16px",fontSize:12,color:"#64748b"}}>Only composition is required — everything else is optional.</p>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div style={{gridColumn:"span 2"}}>
            <label style={lbl}>Composition formula <span style={{color:"#e74c3c"}}>*</span></label>
            <input value={form.composition} onChange={e=>set("composition",e.target.value)} placeholder="e.g. BaTiO3 or La0.8Sr0.2FeO3" style={{...inp,borderColor:form.composition?"#2d3748":"#e74c3c88"}}/>
            {form.composition && <div style={{fontSize:11,color:"#27ae60",marginTop:3}}>Elements: {parseComposition(form.composition).join(", ")||"none detected"}</div>}
          </div>

          <div style={{gridColumn:"span 2"}}>
            <label style={lbl}>Sample name <span style={{fontSize:11,color:"#64748b"}}>(defaults to composition)</span></label>
            <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. BaTiO3 Tetragonal — 1200°C" style={inp}/>
          </div>

          <div style={{gridColumn:"span 2"}}>
            <label style={lbl}>Upload .xy / .dat / .xye file</label>
            <DropZone accept=".xy,.xye,.dat,.txt,.csv,.asc" multiple={false} onFiles={handleXY}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                <span style={{fontSize:22}}>📂</span>
                <span style={{fontSize:13,color:"#94a3b8"}}>{xyFile?xyFile.name:"Drop .xy file here or click to browse"}</span>
                {xyStatus&&<span style={{fontSize:11,color:xyStatus.startsWith("ok")?"#27ae60":xyStatus==="parsing"?"#3498db":"#e74c3c"}}>{xyStatus.startsWith("ok")?"✓ "+xyStatus.slice(3):xyStatus==="parsing"?"Parsing…":"✗ "+xyStatus.slice(4)}</span>}
              </div>
            </DropZone>
          </div>

          {[
            {label:"Phase / space group",key:"phase",placeholder:"e.g. Tetragonal P4mm",span:2},
            {label:"Synthesis method",key:"synthesis",placeholder:"e.g. Sol-gel, 800°C, 6h",span:2},
            {label:"Temperature (°C)",key:"temperature",placeholder:"800",span:1},
            {label:"Atmosphere",key:"atmosphere",placeholder:"Air",span:1},
            {label:"Date",key:"date",type:"date",span:1},
            {label:"Your name / initials",key:"added_by",placeholder:"e.g. Priya",span:1},
          ].map(({label,key,placeholder,span,type})=>(
            <div key={key} style={{gridColumn:`span ${span}`}}>
              <label style={lbl}>{label}</label>
              <input type={type||"text"} value={form[key]} onChange={e=>set(key,e.target.value)} placeholder={placeholder} style={inp}/>
            </div>
          ))}

          <div style={{gridColumn:"span 2"}}>
            <label style={lbl}>Notes</label>
            <textarea value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Phase purity, crystallite size, observations…" rows={2} style={{...inp,resize:"vertical"}}/>
          </div>
        </div>

        <div style={{display:"flex",gap:8,marginTop:16,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{padding:"6px 16px",borderRadius:6,border:"0.5px solid #2d3748",background:"transparent",cursor:"pointer",color:"#94a3b8",fontSize:13}}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{padding:"6px 18px",borderRadius:6,border:"none",background:saving?"#1e3a5f":"#3498db",color:"#fff",cursor:saving?"not-allowed":"pointer",fontSize:13,fontWeight:500}}>
            {saving?"Saving…":"Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BULK UPLOAD MODAL
═══════════════════════════════════════════════════════════════ */
function BulkUploadModal({ onClose, onImported }) {
  const [xyFiles, setXyFiles] = useState({});
  const [xlsRows, setXlsRows] = useState(null);
  const [xyStatus, setXyStatus] = useState("");
  const [xlsStatus, setXlsStatus] = useState("");
  const [preview, setPreview] = useState([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState("");

  const processXYFiles = async (files) => {
    const list = files.filter(f=>/\.(xy|xye|dat|txt|asc|csv)$/i.test(f.name));
    setXyStatus(`Parsing ${list.length} file(s)…`);
    const map = {};
    await Promise.all(list.map(async f=>{
      try { const text=await readText(f); const pts=parseXY(text); const {peaks,intensities}=detectPeaks(pts); map[f.name]={pts,peaks,intensities,raw:text}; }
      catch(e){ map[f.name]=null; }
    }));
    setXyFiles(map);
    setXyStatus(`✓ ${Object.keys(map).length} files loaded`);
    rebuildPreview(map, xlsRows);
  };

  const processZip = async (files) => {
    const zipFile = files.find(f=>/\.zip$/i.test(f.name));
    if (!zipFile) { setXyStatus("No .zip found"); return; }
    setXyStatus("Unpacking ZIP…");
    try {
      const ab = await readAB(zipFile);
      const zip = await window.JSZip.loadAsync(ab);
      const map = {}; const tasks = [];
      zip.forEach((path, entry) => {
        if (!entry.dir && /\.(xy|xye|dat|txt|asc|csv)$/i.test(path)) {
          const fname = path.split("/").pop();
          tasks.push(entry.async("text").then(text=>{ const pts=parseXY(text); const {peaks,intensities}=detectPeaks(pts); map[fname]={pts,peaks,intensities,raw:text}; }).catch(()=>{ map[path.split("/").pop()]=null; }));
        }
      });
      await Promise.all(tasks);
      setXyFiles(map);
      setXyStatus(`✓ ${Object.keys(map).length} patterns from ZIP`);
      rebuildPreview(map, xlsRows);
    } catch(e) { setXyStatus("✗ "+e.message); }
  };

  const processExcel = async (files) => {
    const f = files.find(f=>/\.(xlsx|xls|csv)$/i.test(f.name));
    if (!f) { setXlsStatus("No Excel/CSV found"); return; }
    setXlsStatus("Reading spreadsheet…");
    try {
      let rows;
      if (/\.csv$/i.test(f.name)) {
        const text = await readText(f);
        const lines = text.split(/\r?\n/).filter(Boolean);
        const headers = lines[0].split(",").map(h=>h.trim().toLowerCase().replace(/\s+/g,"_"));
        rows = lines.slice(1).map(l=>{ const vals=l.split(","); const row={}; headers.forEach((h,i)=>{row[h]=(vals[i]||"").trim();}); return row; });
      } else {
        const ab = await readAB(f);
        const wb = window.XLSX.read(ab,{type:"array"});
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw = window.XLSX.utils.sheet_to_json(ws,{defval:""});
        rows = raw.map(r=>{ const n={}; Object.keys(r).forEach(k=>{n[k.toLowerCase().trim().replace(/\s+/g,"_")]=String(r[k]).trim();}); return n; });
      }
      setXlsRows(rows);
      setXlsStatus(`✓ ${rows.length} rows loaded`);
      rebuildPreview(xyFiles, rows);
    } catch(e) { setXlsStatus("✗ "+e.message); }
  };

  const rebuildPreview = (xyMap, rows) => {
    const items = [];
    // from excel rows
    if (rows) {
      for (const row of rows) {
        const fnKey = Object.keys(row).find(k=>k.includes("file")||k==="filename")||Object.keys(row)[0];
        const fname = row[fnKey]||"";
        const matchKey = Object.keys(xyMap).find(k=>k===fname||k.replace(/\.[^.]+$/,"")===(fname.replace(/\.[^.]+$/,""))||fname.replace(/\.[^.]+$/,"")===(k.replace(/\.[^.]+$/,"")));
        const xy = matchKey?xyMap[matchKey]:null;
        items.push({
          filename:fname,
          composition:row.composition||row.formula||row.comp||"",
          name:row.name||row.sample||row.sample_name||"",
          phase:row.phase||row.space_group||"",
          synthesis:row.synthesis||row.method||"",
          temperature:row.temperature||row.temp||"",
          atmosphere:row.atmosphere||row.atm||"",
          date:row.date||"",
          notes:row.notes||row.note||row.remarks||"",
          added_by:row.added_by||row.contributor||"",
          matched:!!xy, xyData:xy?.pts||null,
          peaks:xy?.peaks||[], intensities:xy?.intensities||[],
          raw:xy?.raw||"",
        });
      }
    }
    // unmatched xy files
    const matchedFnames = new Set(items.filter(i=>i.matched).map(i=>i.filename).concat(items.filter(i=>i.matched).map(i=>{const m=Object.keys(xyMap).find(k=>k===i.filename||k.replace(/\.[^.]+$/,"")===(i.filename?.replace(/\.[^.]+$/,""))); return m||"";})));
    for (const [fname, xy] of Object.entries(xyMap)) {
      if (!items.some(i=>i.filename===fname||i.filename===fname.replace(/\.[^.]+$/,""))) {
        items.push({ filename:fname, composition:fname.replace(/\.[^.]+$/,""), name:"", phase:"", synthesis:"", temperature:"", atmosphere:"", date:"", notes:"", added_by:"", matched:false, xyData:xy?.pts||null, peaks:xy?.peaks||[], intensities:xy?.intensities||[], raw:xy?.raw||"" });
      }
    }
    setPreview(items);
  };

  const doImport = async () => {
    const valid = preview.filter(p=>p.composition);
    if (!valid.length) return;
    setImporting(true);
    setProgress("Preparing entries…");
    try {
      const entries = valid.map(p=>({
        composition:p.composition, name:p.name||p.composition,
        elements:parseComposition(p.composition),
        phase:p.phase||"", synthesis:p.synthesis||"", temperature:p.temperature||"",
        atmosphere:p.atmosphere||"", date:p.date||new Date().toISOString().split("T")[0],
        notes:p.notes||"", added_by:p.added_by||"lab",
        filename:p.filename||p.composition+".xy",
        xy_data:p.raw||"", peaks:p.peaks, intensities:p.intensities,
      }));
      setProgress(`Uploading ${entries.length} entries to database…`);
      const res = await api.bulk(entries);
      setProgress(`✓ Imported ${res.imported} patterns`);
      setTimeout(() => { onImported(res.imported); onClose(); }, 800);
    } catch(e) { setProgress("✗ Import failed: "+e.message); setImporting(false); }
  };

  const readyCount = preview.filter(p=>p.composition).length;

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#0f1117",border:"0.5px solid #334155",borderRadius:12,padding:24,width:640,maxHeight:"92vh",overflowY:"auto"}}>
        <h3 style={{margin:"0 0 4px",fontSize:16,fontWeight:500}}>Bulk Import XRD Patterns</h3>
        <p style={{margin:"0 0 18px",fontSize:12,color:"#64748b"}}>Upload your .xy files (or a ZIP), then an Excel/CSV with metadata. Files are matched by filename.</p>

        <div style={{marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:500,marginBottom:8,color:"#e2e8f0"}}>① XRD Pattern Files</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <DropZone accept=".xy,.xye,.dat,.txt,.asc,.csv" multiple={true} onFiles={processXYFiles}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <span style={{fontSize:22}}>📄</span>
                <span style={{fontSize:12,color:"#94a3b8"}}>Multiple .xy files</span>
                <span style={{fontSize:11,color:"#64748b"}}>drag & drop or click</span>
              </div>
            </DropZone>
            <DropZone accept=".zip" multiple={false} onFiles={processZip}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <span style={{fontSize:22}}>🗜</span>
                <span style={{fontSize:12,color:"#94a3b8"}}>ZIP archive</span>
                <span style={{fontSize:11,color:"#64748b"}}>containing .xy files</span>
              </div>
            </DropZone>
          </div>
          {xyStatus&&<div style={{fontSize:12,marginTop:6,color:xyStatus.startsWith("✓")?"#27ae60":xyStatus.startsWith("✗")?"#e74c3c":"#3498db"}}>{xyStatus}</div>}
        </div>

        <div style={{marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:500,marginBottom:8,color:"#e2e8f0"}}>② Metadata Spreadsheet <span style={{fontSize:11,fontWeight:400,color:"#64748b"}}>(optional)</span></div>
          <DropZone accept=".xlsx,.xls,.csv" multiple={false} onFiles={processExcel}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <span style={{fontSize:22}}>📊</span>
              <span style={{fontSize:12,color:"#94a3b8"}}>Excel (.xlsx) or CSV</span>
              <span style={{fontSize:11,color:"#64748b"}}>Columns: filename, composition, name, phase, synthesis, temperature, atmosphere, date, notes</span>
            </div>
          </DropZone>
          {xlsStatus&&<div style={{fontSize:12,marginTop:6,color:xlsStatus.startsWith("✓")?"#27ae60":xlsStatus.startsWith("✗")?"#e74c3c":"#3498db"}}>{xlsStatus}</div>}
        </div>

        {preview.length>0&&(
          <div style={{marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:500,marginBottom:6}}>{preview.length} entries previewed · {readyCount} ready</div>
            <div style={{maxHeight:200,overflowY:"auto",border:"0.5px solid #1e293b",borderRadius:8}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead><tr style={{background:"#1a1f2e"}}>
                  {["File","Composition","Phase","XY"].map(h=><th key={h} style={{padding:"5px 10px",textAlign:"left",fontWeight:500,borderBottom:"0.5px solid #1e293b",color:"#94a3b8"}}>{h}</th>)}
                </tr></thead>
                <tbody>{preview.map((p,i)=>(
                  <tr key={i} style={{borderBottom:"0.5px solid #1e293b"}}>
                    <td style={{padding:"4px 10px",color:"#64748b",maxWidth:130,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.filename||"—"}</td>
                    <td style={{padding:"4px 10px",fontWeight:500,color:p.composition?"#e2e8f0":"#e74c3c"}}>{p.composition||"missing"}</td>
                    <td style={{padding:"4px 10px",color:"#64748b"}}>{p.phase||"—"}</td>
                    <td style={{padding:"4px 10px"}}><span style={{fontSize:10,padding:"1px 7px",borderRadius:10,background:p.matched?"#27ae6022":"#e67e2222",color:p.matched?"#27ae60":"#e67e22"}}>{p.matched?"✓ linked":"XY only"}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}

        <div style={{background:"#1a1f2e",borderRadius:8,padding:"8px 12px",marginBottom:14,fontSize:11,color:"#64748b"}}>
          <strong style={{color:"#94a3b8"}}>Excel tip:</strong> Column headers (case-insensitive): <code style={{color:"#3498db"}}>filename, composition, name, phase, synthesis, temperature, atmosphere, date, notes</code>. The <code style={{color:"#3498db"}}>filename</code> column links each row to its .xy file.
        </div>

        {progress&&<div style={{fontSize:13,color:progress.startsWith("✓")?"#27ae60":progress.startsWith("✗")?"#e74c3c":"#3498db",marginBottom:10}}>{progress}</div>}

        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:12,color:"#64748b"}}>{readyCount} pattern{readyCount!==1?"s":""} will be saved to database</span>
          <div style={{display:"flex",gap:8}}>
            <button onClick={onClose} style={{padding:"6px 16px",borderRadius:6,border:"0.5px solid #2d3748",background:"transparent",cursor:"pointer",color:"#94a3b8",fontSize:13}}>Cancel</button>
            <button onClick={doImport} disabled={readyCount===0||importing} style={{padding:"6px 18px",borderRadius:6,border:"none",background:readyCount>0&&!importing?"#3498db":"#1e3a5f",color:"#fff",cursor:readyCount>0&&!importing?"pointer":"not-allowed",fontSize:13,fontWeight:500}}>
              {importing?"Importing…":`Import ${readyCount} Patterns`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ENTRY DETAIL PANEL
═══════════════════════════════════════════════════════════════ */
function EntryDetail({ entryLight, onClose, onDelete }) {
  const [entry, setEntry] = useState(entryLight);
  const [loading, setLoading] = useState(false);

  // load full entry (with xy_data) on mount
  useEffect(() => {
    setLoading(true);
    api.get(entryLight.id)
      .then(res => {
        const full = res.data;
        // parse xy_data text back into points for chart
        if (full.xy_data) {
          full.xyData = parseXY(full.xy_data);
        }
        setEntry(full);
      })
      .catch(() => {}) // use light entry as fallback
      .finally(() => setLoading(false));
  }, [entryLight.id]);

  return (
    <div style={{paddingBottom:16}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12}}>
        <div>
          <h2 style={{margin:0,fontSize:15,fontWeight:500}}>{entry.name}</h2>
          <p style={{margin:"2px 0 0",fontSize:12,color:"#94a3b8"}}>{entry.composition}{entry.date?" · "+entry.date:""}</p>
          {entry.added_by&&<p style={{margin:"1px 0 0",fontSize:11,color:"#64748b"}}>Added by {entry.added_by}</p>}
        </div>
        <div style={{display:"flex",gap:5,flexShrink:0}}>
          <button onClick={onDelete} style={{padding:"4px 9px",borderRadius:5,border:"0.5px solid #e74c3c44",background:"transparent",color:"#e74c3c",cursor:"pointer",fontSize:11}}>Delete</button>
          <button onClick={onClose} style={{padding:"4px 9px",borderRadius:5,border:"0.5px solid #2d3748",background:"transparent",color:"#94a3b8",cursor:"pointer",fontSize:11}}>✕</button>
        </div>
      </div>

      <div style={{background:"#1a1f2e",borderRadius:8,padding:"10px 12px",marginBottom:10}}>
        {loading ? <div style={{height:120,display:"flex",alignItems:"center",justifyContent:"center",color:"#64748b",fontSize:12}}>Loading pattern…</div> : <XRDChart entry={entry}/>}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:8}}>
        {[
          {label:"Phase",value:entry.phase||"—"},
          {label:"Synthesis",value:entry.synthesis||"—"},
          {label:"Temperature",value:entry.temperature?entry.temperature+"°C":"—"},
          {label:"Atmosphere",value:entry.atmosphere||"—"},
          {label:"File",value:entry.filename||"—"},
          {label:"Elements",value:(entry.elements||[]).join(", ")||"—"},
        ].map(({label,value})=>(
          <div key={label} style={{background:"#1a1f2e",borderRadius:6,padding:"6px 10px"}}>
            <div style={{fontSize:10,color:"#64748b",marginBottom:1}}>{label}</div>
            <div style={{fontSize:12,fontWeight:500,wordBreak:"break-all",color:"#e2e8f0"}}>{value}</div>
          </div>
        ))}
      </div>

      {entry.peaks?.length>0&&(
        <div style={{background:"#1a1f2e",borderRadius:6,padding:"8px 10px",marginBottom:6}}>
          <div style={{fontSize:10,color:"#64748b",marginBottom:4}}>Detected peaks (2θ)</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
            {entry.peaks.map((p,i)=><span key={i} style={{fontSize:11,background:"#3498db22",color:"#3498db",borderRadius:4,padding:"1px 7px"}}>{Number(p).toFixed(1)}°</span>)}
          </div>
        </div>
      )}

      {entry.notes&&(
        <div style={{background:"#1a1f2e",borderRadius:6,padding:"8px 10px"}}>
          <div style={{fontSize:10,color:"#64748b",marginBottom:3}}>Notes</div>
          <div style={{fontSize:12,lineHeight:1.6,color:"#e2e8f0"}}>{entry.notes}</div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [db, setDb] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);
  const [activeEntry, setActiveEntry] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("periodic");
  const searchTimeout = useRef(null);

  // ── load entries from API ──────────────────────────────────
  const loadEntries = useCallback(async (params = {}) => {
    setLoading(true); setError(null);
    try {
      const res = await api.list(params);
      setDb(res.data);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadEntries(); }, [loadEntries]);

  // search debounce
  useEffect(() => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      if (search.length > 1) { loadEntries({ q: search }); setSelected([]); }
      else if (search.length === 0) { loadEntries(); }
    }, 300);
  }, [search, loadEntries]);

  // element filter
  useEffect(() => {
    if (selected.length > 0) loadEntries({ elements: selected });
    else if (!search) loadEntries();
  }, [selected]);

  const toggleEl = sym => {
    setSelected(s => s.includes(sym) ? s.filter(x=>x!==sym) : [...s, sym]);
    setActiveEntry(null);
    setSearch("");
  };
  const clearSel = () => { setSelected([]); setActiveEntry(null); loadEntries(); };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try { await api.delete(id); setActiveEntry(null); loadEntries(); }
    catch(e) { alert("Delete failed: "+e.message); }
  };

  // match badges
  const allElements = [...new Set(db.flatMap(e=>e.elements||[]))];
  const exactMatches = selected.length===0 ? [] : db.filter(e=>selected.every(s=>e.elements?.includes(s))&&e.elements?.every(s=>selected.includes(s)));
  const partialMatches = selected.length===0 ? [] : db.filter(e=>!exactMatches.includes(e)&&selected.some(s=>e.elements?.includes(s)));
  const highlighted = [...new Set([...exactMatches,...partialMatches].flatMap(e=>e.elements||[]))];

  const matchBadge = entry => {
    if (exactMatches.includes(entry)) return { label:"Exact match", color:"#27ae60" };
    if (partialMatches.includes(entry)) return { label:`${entry.elements?.filter(e=>selected.includes(e)).length}/${selected.length} elements`, color:"#e67e22" };
    return null;
  };

  return (
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",maxWidth:960,margin:"0 auto",padding:"16px 12px",minHeight:"100vh",background:"#0f1117",color:"#e2e8f0"}}>

      {/* header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <div>
          <div style={{fontSize:18,fontWeight:500}}>🔬 XRD Lab Database</div>
          <div style={{fontSize:12,color:"#94a3b8"}}>{loading?"Loading…":`${db.length} patterns · ${allElements.length} unique elements`}</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setShowBulk(true)} style={{padding:"7px 13px",borderRadius:8,border:"0.5px solid #334155",background:"transparent",cursor:"pointer",color:"#e2e8f0",fontSize:13,fontWeight:500}}>⬆ Bulk Import</button>
          <button onClick={()=>setShowAdd(true)} style={{padding:"7px 16px",borderRadius:8,border:"none",background:"#3498db",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:500}}>+ Add Pattern</button>
        </div>
      </div>

      {error&&<div style={{background:"#e74c3c22",border:"0.5px solid #e74c3c55",borderRadius:8,padding:"10px 14px",marginBottom:12,fontSize:13,color:"#e74c3c"}}>⚠ {error} — <button onClick={()=>loadEntries()} style={{background:"transparent",border:"none",color:"#e74c3c",cursor:"pointer",textDecoration:"underline"}}>retry</button></div>}

      {/* search */}
      <input value={search} onChange={e=>{setSearch(e.target.value);setSelected([]);setActiveEntry(null);}}
        placeholder="Search by name, composition, phase, element, synthesis…"
        style={{width:"100%",padding:"8px 14px",fontSize:13,marginBottom:10,border:"0.5px solid #2d3748",borderRadius:8,background:"#1a1f2e",color:"#e2e8f0",boxSizing:"border-box"}}/>

      {/* tabs */}
      <div style={{display:"flex",gap:2,marginBottom:12,borderBottom:"0.5px solid #1e293b"}}>
        {[{id:"periodic",label:"Periodic Table Selector"},{id:"list",label:"All Patterns"}].map(t=>(
          <button key={t.id} onClick={()=>{setTab(t.id);clearSel();setSearch("");}} style={{padding:"6px 14px",fontSize:13,border:"none",cursor:"pointer",background:"transparent",fontWeight:tab===t.id?500:400,color:tab===t.id?"#e2e8f0":"#64748b",borderBottom:tab===t.id?"2px solid #3498db":"2px solid transparent",marginBottom:-1}}>{t.label}</button>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:activeEntry?"1fr 350px":"1fr",gap:16,alignItems:"start"}}>
        <div>
          {tab==="periodic"&&!search&&(
            <div style={{marginBottom:12}}>
              <PeriodicTable selected={selected} onToggle={toggleEl} highlighted={highlighted}/>
              <div style={{display:"flex",flexWrap:"wrap",gap:5,margin:"8px 0"}}>
                {Object.entries(CAT_COLORS).map(([cat,color])=>(
                  <span key={cat} style={{fontSize:10,padding:"2px 8px",borderRadius:12,background:color+"22",color,fontWeight:500}}>{cat}</span>
                ))}
              </div>
              {selected.length>0&&(
                <>
                  <div style={{display:"flex",alignItems:"center",gap:8,padding:"7px 12px",background:"#1a1f2e",borderRadius:8,marginBottom:4}}>
                    <span style={{fontSize:12,color:"#94a3b8"}}>Selected:</span>
                    {selected.map(s=><span key={s} style={{fontSize:12,background:"#3498db22",color:"#3498db",borderRadius:4,padding:"2px 10px",fontWeight:500}}>{s}</span>)}
                    <button onClick={clearSel} style={{marginLeft:"auto",fontSize:12,color:"#64748b",background:"transparent",border:"none",cursor:"pointer"}}>Clear</button>
                  </div>
                  <div style={{display:"flex",gap:12,fontSize:12,color:"#94a3b8"}}>
                    <span>✅ {exactMatches.length} exact match{exactMatches.length!==1?"es":""}</span>
                    <span>🟡 {partialMatches.length} partial</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* list */}
          {loading && db.length===0 ? (
            <div style={{textAlign:"center",padding:"40px 16px",color:"#64748b"}}>Loading patterns…</div>
          ) : db.length===0 ? (
            <div style={{textAlign:"center",padding:"40px 16px",color:"#64748b",fontSize:13}}>
              {search ? "No patterns match your search." : "No entries yet. Add your first pattern!"}
            </div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {db.map(entry=>{
                const badge=matchBadge(entry);
                const isActive=activeEntry?.id===entry.id;
                return (
                  <div key={entry.id} onClick={()=>setActiveEntry(entry)} style={{display:"grid",gridTemplateColumns:"1fr 190px",gap:10,padding:"10px 12px",background:isActive?"#1a2535":"#1a1f2e",borderRadius:8,cursor:"pointer",border:isActive?"0.5px solid #3b82f6":"0.5px solid #1e293b",transition:"background 0.1s"}}>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
                        <span style={{fontSize:13,fontWeight:500,color:"#e2e8f0"}}>{entry.name}</span>
                        {badge&&<span style={{fontSize:10,padding:"1px 8px",borderRadius:10,background:badge.color+"22",color:badge.color,fontWeight:500}}>{badge.label}</span>}
                      </div>
                      <div style={{fontSize:12,color:"#64748b",marginTop:1}}>{entry.composition}{entry.phase?" · "+entry.phase:""}</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:5,alignItems:"center"}}>
                        {(entry.elements||[]).map(el=><span key={el} style={{fontSize:10,padding:"1px 6px",borderRadius:3,background:selected.includes(el)?"#3498db33":"#0f1117",color:selected.includes(el)?"#3498db":"#94a3b8",border:"0.5px solid #1e293b"}}>{el}</span>)}
                        {entry.added_by&&<span style={{fontSize:10,color:"#64748b",marginLeft:4}}>{entry.added_by}</span>}
                        {entry.date&&<span style={{fontSize:10,color:"#64748b",marginLeft:"auto"}}>{entry.date}</span>}
                      </div>
                    </div>
                    <div style={{opacity:0.8}}><XRDChart entry={entry} small/></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {activeEntry&&(
          <div style={{background:"#0f1117",border:"0.5px solid #1e293b",borderRadius:10,padding:14,position:"sticky",top:16}}>
            <EntryDetail entryLight={activeEntry} onClose={()=>setActiveEntry(null)} onDelete={()=>handleDelete(activeEntry.id)}/>
          </div>
        )}
      </div>

      {showAdd&&<AddEntryModal onClose={()=>setShowAdd(false)} onSaved={()=>loadEntries()}/>}
      {showBulk&&<BulkUploadModal onClose={()=>setShowBulk(false)} onImported={()=>loadEntries()}/>}
    </div>
  );
}
