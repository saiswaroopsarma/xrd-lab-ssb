const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// Store DB file in a persistent location
const DB_DIR = process.env.DB_DIR || path.join(__dirname, "../../data");
const DB_PATH = path.join(DB_DIR, "xrd_lab.db");

let db;

function initDb() {
  // ensure data directory exists
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL"); // better concurrent reads
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS entries (
      id          TEXT PRIMARY KEY,
      composition TEXT NOT NULL,
      name        TEXT NOT NULL,
      elements    TEXT NOT NULL,          -- JSON array e.g. ["La","Fe","O"]
      phase       TEXT DEFAULT '',
      synthesis   TEXT DEFAULT '',
      temperature TEXT DEFAULT '',
      atmosphere  TEXT DEFAULT '',
      date        TEXT DEFAULT '',
      notes       TEXT DEFAULT '',
      filename    TEXT DEFAULT '',
      xy_data     TEXT DEFAULT '',        -- full raw .xy file content as text
      peaks       TEXT DEFAULT '[]',     -- JSON array of 2theta values
      intensities TEXT DEFAULT '[]',     -- JSON array of intensity values (0-100)
      added_by    TEXT DEFAULT 'lab',
      created_at  TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_elements  ON entries(elements);
    CREATE INDEX IF NOT EXISTS idx_created   ON entries(created_at);
    CREATE INDEX IF NOT EXISTS idx_composition ON entries(composition);
  `);

  // seed demo data if empty
  const count = db.prepare("SELECT COUNT(*) as n FROM entries").get().n;
  if (count === 0) seedDemo();

  console.log(`Database ready at ${DB_PATH} (${db.prepare("SELECT COUNT(*) as n FROM entries").get().n} entries)`);
}

function getDb() {
  if (!db) initDb();
  return db;
}

function countEntries() {
  return getDb().prepare("SELECT COUNT(*) as n FROM entries").get().n;
}

// ── CRUD helpers ──────────────────────────────────────────────

function getAllEntries() {
  return getDb().prepare("SELECT * FROM entries ORDER BY created_at DESC").all().map(deserialize);
}

function getEntryById(id) {
  const row = getDb().prepare("SELECT * FROM entries WHERE id = ?").get(id);
  return row ? deserialize(row) : null;
}

function insertEntry(entry) {
  const stmt = getDb().prepare(`
    INSERT INTO entries (id, composition, name, elements, phase, synthesis, temperature,
      atmosphere, date, notes, filename, xy_data, peaks, intensities, added_by)
    VALUES (@id, @composition, @name, @elements, @phase, @synthesis, @temperature,
      @atmosphere, @date, @notes, @filename, @xy_data, @peaks, @intensities, @added_by)
  `);
  stmt.run(serialize(entry));
  return entry;
}

function updateEntry(id, fields) {
  const allowed = ["composition","name","elements","phase","synthesis","temperature",
                   "atmosphere","date","notes","filename","xy_data","peaks","intensities","added_by"];
  const updates = Object.keys(fields).filter(k => allowed.includes(k));
  if (!updates.length) return;
  const set = updates.map(k => `${k} = @${k}`).join(", ");
  const entry = serialize({ ...fields, id });
  getDb().prepare(`UPDATE entries SET ${set} WHERE id = @id`).run(entry);
}

function deleteEntry(id) {
  getDb().prepare("DELETE FROM entries WHERE id = ?").run(id);
}

function searchEntries(query) {
  const q = `%${query}%`;
  return getDb().prepare(`
    SELECT * FROM entries
    WHERE composition LIKE ? OR name LIKE ? OR elements LIKE ?
       OR phase LIKE ? OR synthesis LIKE ? OR notes LIKE ?
    ORDER BY created_at DESC
  `).all(q, q, q, q, q, q).map(deserialize);
}

function getEntriesByElements(elementList) {
  // Returns all entries, filtering done in JS for flexibility
  return getAllEntries().filter(e => {
    return elementList.some(el => e.elements.includes(el));
  });
}

// ── serialise / deserialise JSON fields ───────────────────────
function serialize(e) {
  return {
    ...e,
    elements:    Array.isArray(e.elements)    ? JSON.stringify(e.elements)    : (e.elements    || "[]"),
    peaks:       Array.isArray(e.peaks)       ? JSON.stringify(e.peaks)       : (e.peaks       || "[]"),
    intensities: Array.isArray(e.intensities) ? JSON.stringify(e.intensities) : (e.intensities || "[]"),
    xy_data:     e.xy_data || "",
    added_by:    e.added_by || "lab",
  };
}

function deserialize(row) {
  return {
    ...row,
    elements:    safeJSON(row.elements,    []),
    peaks:       safeJSON(row.peaks,       []),
    intensities: safeJSON(row.intensities, []),
  };
}

function safeJSON(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

// ── demo seed ─────────────────────────────────────────────────
function seedDemo() {
  const demos = [
    { id:"xrd-001", composition:"BaTiO₃", name:"BaTiO3 Tetragonal", elements:["Ba","Ti","O"],
      phase:"Tetragonal P4mm", date:"2024-03-15", synthesis:"Solid-state, 1200°C, 4h",
      temperature:"1200", atmosphere:"Air",
      notes:"Sharp peaks. Tetragonal distortion confirmed at ~45°.",
      peaks:[22.1,31.5,38.9,45.2,51.1,56.1,65.7,75.9], intensities:[100,85,30,60,20,25,15,10],
      filename:"BaTiO3_1200C.xy", xy_data:"", added_by:"seed" },
    { id:"xrd-002", composition:"LaFeO₃", name:"LaFeO3 Orthorhombic", elements:["La","Fe","O"],
      phase:"Orthorhombic Pbnm", date:"2024-04-02", synthesis:"Sol-gel, 800°C, 6h",
      temperature:"800", atmosphere:"Air", notes:"Pure perovskite phase.",
      peaks:[23.0,32.8,40.2,46.8,53.0,58.2,67.5,76.1], intensities:[95,100,45,70,28,32,18,12],
      filename:"LaFeO3_800C.xy", xy_data:"", added_by:"seed" },
    { id:"xrd-003", composition:"La₀.₈Sr₀.₂FeO₃", name:"La0.8Sr0.2FeO3", elements:["La","Sr","Fe","O"],
      phase:"Orthorhombic Pbnm (distorted)", date:"2024-04-18", synthesis:"Sol-gel, 900°C, 6h",
      temperature:"900", atmosphere:"Air", notes:"Sr doping causes slight peak shift.",
      peaks:[23.2,33.0,40.5,47.1,53.3,58.5,67.8,76.3], intensities:[90,100,42,68,26,30,17,11],
      filename:"LSFO_x02.xy", xy_data:"", added_by:"seed" },
    { id:"xrd-004", composition:"ZnO", name:"ZnO Wurtzite", elements:["Zn","O"],
      phase:"Hexagonal P63mc", date:"2024-05-10", synthesis:"Hydrothermal, 180°C, 12h",
      temperature:"180", atmosphere:"Autoclave", notes:"Strong (002) preferred orientation.",
      peaks:[31.8,34.4,36.3,47.5,56.6,62.9,66.4,67.9,69.1], intensities:[55,45,100,22,32,28,5,22,15],
      filename:"ZnO_hydrothermal.xy", xy_data:"", added_by:"seed" },
    { id:"xrd-005", composition:"NiO", name:"NiO Rock-salt", elements:["Ni","O"],
      phase:"Cubic Fm3m", date:"2024-06-01", synthesis:"Precipitation, 500°C, 2h",
      temperature:"500", atmosphere:"Air", notes:"Nanocrystalline ~12 nm by Scherrer.",
      peaks:[37.2,43.3,62.9,75.5], intensities:[100,45,25,20],
      filename:"NiO_500C.xy", xy_data:"", added_by:"seed" },
  ];
  demos.forEach(insertEntry);
}

module.exports = { initDb, getDb, countEntries, getAllEntries, getEntryById,
                   insertEntry, updateEntry, deleteEntry, searchEntries, getEntriesByElements };
