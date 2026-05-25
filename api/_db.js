// api/_db.js  — shared Postgres connection used by all API functions
const { Pool } = require("pg");

let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 3, // keep connections low for serverless
    });
  }
  return pool;
}

async function query(sql, params = []) {
  const client = await getPool().connect();
  try {
    const res = await client.query(sql, params);
    return res;
  } finally {
    client.release();
  }
}

// ── create tables if they don't exist ────────────────────────
async function initDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS entries (
      id           TEXT PRIMARY KEY,
      composition  TEXT NOT NULL,
      name         TEXT NOT NULL DEFAULT '',
      elements     JSONB NOT NULL DEFAULT '[]',
      phase        TEXT DEFAULT '',
      synthesis    TEXT DEFAULT '',
      temperature  TEXT DEFAULT '',
      atmosphere   TEXT DEFAULT '',
      date         TEXT DEFAULT '',
      notes        TEXT DEFAULT '',
      filename     TEXT DEFAULT '',
      xy_data      TEXT DEFAULT '',
      peaks        JSONB DEFAULT '[]',
      intensities  JSONB DEFAULT '[]',
      added_by     TEXT DEFAULT 'lab',
      created_at   TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await query(`CREATE INDEX IF NOT EXISTS idx_elements   ON entries USING gin(elements)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_created    ON entries(created_at DESC)`);

  // seed demo data if table is empty
  const { rows } = await query("SELECT COUNT(*) AS n FROM entries");
  if (parseInt(rows[0].n) === 0) await seedDemo();
}

// ── CRUD ──────────────────────────────────────────────────────
async function getAll() {
  const { rows } = await query(
    "SELECT id,composition,name,elements,phase,synthesis,temperature,atmosphere,date,notes,filename,peaks,intensities,added_by,created_at FROM entries ORDER BY created_at DESC"
  );
  return rows;
}

async function getById(id) {
  const { rows } = await query("SELECT * FROM entries WHERE id=$1", [id]);
  return rows[0] || null;
}

async function search(q) {
  const like = `%${q}%`;
  const { rows } = await query(
    `SELECT id,composition,name,elements,phase,synthesis,temperature,atmosphere,date,notes,filename,peaks,intensities,added_by,created_at
     FROM entries
     WHERE composition ILIKE $1 OR name ILIKE $1 OR phase ILIKE $1
        OR synthesis ILIKE $1 OR notes ILIKE $1
        OR elements::text ILIKE $1
     ORDER BY created_at DESC`,
    [like]
  );
  return rows;
}

async function filterByElements(elList) {
  // matches entries that contain ANY of the given elements
  const { rows } = await query(
    `SELECT id,composition,name,elements,phase,synthesis,temperature,atmosphere,date,notes,filename,peaks,intensities,added_by,created_at
     FROM entries
     WHERE elements ?| $1
     ORDER BY created_at DESC`,
    [elList]
  );
  return rows;
}

async function insert(e) {
  await query(
    `INSERT INTO entries (id,composition,name,elements,phase,synthesis,temperature,atmosphere,date,notes,filename,xy_data,peaks,intensities,added_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
    [
      e.id, e.composition, e.name || e.composition,
      JSON.stringify(e.elements || []),
      e.phase || "", e.synthesis || "", e.temperature || "",
      e.atmosphere || "", e.date || "", e.notes || "",
      e.filename || "", e.xy_data || "",
      JSON.stringify(e.peaks || []),
      JSON.stringify(e.intensities || []),
      e.added_by || "lab",
    ]
  );
}

async function update(id, f) {
  await query(
    `UPDATE entries SET
      composition=$2, name=$3, elements=$4, phase=$5, synthesis=$6,
      temperature=$7, atmosphere=$8, date=$9, notes=$10, filename=$11,
      xy_data=$12, peaks=$13, intensities=$14, added_by=$15
     WHERE id=$1`,
    [
      id,
      f.composition, f.name, JSON.stringify(f.elements || []),
      f.phase || "", f.synthesis || "", f.temperature || "",
      f.atmosphere || "", f.date || "", f.notes || "",
      f.filename || "", f.xy_data || "",
      JSON.stringify(f.peaks || []),
      JSON.stringify(f.intensities || []),
      f.added_by || "lab",
    ]
  );
}

async function remove(id) {
  await query("DELETE FROM entries WHERE id=$1", [id]);
}

async function count() {
  const { rows } = await query("SELECT COUNT(*) AS n FROM entries");
  return parseInt(rows[0].n);
}

// ── demo seed ─────────────────────────────────────────────────
async function seedDemo() {
  const demos = [
    { id:"xrd-001", composition:"BaTiO₃", name:"BaTiO3 Tetragonal", elements:["Ba","Ti","O"], phase:"Tetragonal P4mm", date:"2024-03-15", synthesis:"Solid-state, 1200°C, 4h", temperature:"1200", atmosphere:"Air", notes:"Tetragonal distortion confirmed at ~45°.", peaks:[22.1,31.5,38.9,45.2,51.1,56.1,65.7,75.9], intensities:[100,85,30,60,20,25,15,10], filename:"BaTiO3_1200C.xy", xy_data:"", added_by:"seed" },
    { id:"xrd-002", composition:"LaFeO₃", name:"LaFeO3 Orthorhombic", elements:["La","Fe","O"], phase:"Orthorhombic Pbnm", date:"2024-04-02", synthesis:"Sol-gel, 800°C, 6h", temperature:"800", atmosphere:"Air", notes:"Pure perovskite phase.", peaks:[23.0,32.8,40.2,46.8,53.0,58.2,67.5,76.1], intensities:[95,100,45,70,28,32,18,12], filename:"LaFeO3_800C.xy", xy_data:"", added_by:"seed" },
    { id:"xrd-003", composition:"La₀.₈Sr₀.₂FeO₃", name:"La0.8Sr0.2FeO3", elements:["La","Sr","Fe","O"], phase:"Orthorhombic Pbnm", date:"2024-04-18", synthesis:"Sol-gel, 900°C, 6h", temperature:"900", atmosphere:"Air", notes:"Sr doping causes peak shift.", peaks:[23.2,33.0,40.5,47.1,53.3,58.5,67.8,76.3], intensities:[90,100,42,68,26,30,17,11], filename:"LSFO_x02.xy", xy_data:"", added_by:"seed" },
    { id:"xrd-004", composition:"ZnO", name:"ZnO Wurtzite", elements:["Zn","O"], phase:"Hexagonal P63mc", date:"2024-05-10", synthesis:"Hydrothermal, 180°C, 12h", temperature:"180", atmosphere:"Autoclave", notes:"Strong (002) preferred orientation.", peaks:[31.8,34.4,36.3,47.5,56.6,62.9,66.4,67.9,69.1], intensities:[55,45,100,22,32,28,5,22,15], filename:"ZnO_hydrothermal.xy", xy_data:"", added_by:"seed" },
    { id:"xrd-005", composition:"NiO", name:"NiO Rock-salt", elements:["Ni","O"], phase:"Cubic Fm3m", date:"2024-06-01", synthesis:"Precipitation, 500°C, 2h", temperature:"500", atmosphere:"Air", notes:"Nanocrystalline ~12 nm by Scherrer.", peaks:[37.2,43.3,62.9,75.5], intensities:[100,45,25,20], filename:"NiO_500C.xy", xy_data:"", added_by:"seed" },
  ];
  for (const d of demos) await insert(d);
}

function makeId() {
  return `xrd-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
}

function parseElements(formula) {
  const ALL = new Set(["H","He","Li","Be","B","C","N","O","F","Ne","Na","Mg","Al","Si","P","S","Cl","Ar","K","Ca","Sc","Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn","Ga","Ge","As","Se","Br","Kr","Rb","Sr","Y","Zr","Nb","Mo","Tc","Ru","Rh","Pd","Ag","Cd","In","Sn","Sb","Te","I","Xe","Cs","Ba","La","Ce","Pr","Nd","Pm","Sm","Eu","Gd","Tb","Dy","Ho","Er","Tm","Yb","Lu","Hf","Ta","W","Re","Os","Ir","Pt","Au","Hg","Tl","Pb","Bi","Po","At","Rn","Fr","Ra","Ac","Th","Pa","U","Np","Pu"]);
  const els = []; const re = /([A-Z][a-z]?)(\d*\.?\d*)/g; let m;
  while ((m = re.exec(formula)) !== null) if (ALL.has(m[1])) els.push(m[1]);
  return [...new Set(els)];
}

module.exports = { initDb, getAll, getById, search, filterByElements, insert, update, remove, count, makeId, parseElements };
