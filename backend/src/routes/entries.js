const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("crypto").randomUUID ? { v4: () => require("crypto").randomUUID() } : { v4: () => `xrd-${Date.now()}-${Math.random().toString(36).slice(2,8)}` };

const {
  getAllEntries, getEntryById, insertEntry,
  updateEntry, deleteEntry, searchEntries
} = require("../db");

// ── GET /api/entries  — list all (or search) ──────────────────
router.get("/", (req, res) => {
  try {
    const { q, elements } = req.query;
    let results;
    if (q && q.trim()) {
      results = searchEntries(q.trim());
    } else {
      results = getAllEntries();
    }
    // filter by elements if provided
    if (elements) {
      const elList = elements.split(",").map(s => s.trim()).filter(Boolean);
      results = results.filter(e =>
        elList.some(el => e.elements.includes(el))
      );
    }
    // never send full xy_data in list view — too heavy
    const light = results.map(({ xy_data, ...rest }) => rest);
    res.json({ ok: true, count: light.length, data: light });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── GET /api/entries/:id  — single entry with full xy_data ────
router.get("/:id", (req, res) => {
  try {
    const entry = getEntryById(req.params.id);
    if (!entry) return res.status(404).json({ ok: false, error: "Not found" });
    res.json({ ok: true, data: entry });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── POST /api/entries  — create one entry ─────────────────────
router.post("/", (req, res) => {
  try {
    const body = req.body;
    if (!body.composition) return res.status(400).json({ ok: false, error: "composition is required" });

    const entry = {
      id:          `xrd-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      composition: body.composition,
      name:        body.name || body.composition,
      elements:    Array.isArray(body.elements) ? body.elements : parseElements(body.composition),
      phase:       body.phase       || "",
      synthesis:   body.synthesis   || "",
      temperature: body.temperature || "",
      atmosphere:  body.atmosphere  || "",
      date:        body.date        || new Date().toISOString().split("T")[0],
      notes:       body.notes       || "",
      filename:    body.filename    || "",
      xy_data:     body.xy_data     || "",   // full text of .xy file
      peaks:       body.peaks       || [],
      intensities: body.intensities || [],
      added_by:    body.added_by    || "lab",
    };

    insertEntry(entry);
    res.status(201).json({ ok: true, data: entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── POST /api/entries/bulk  — import many at once ─────────────
router.post("/bulk", (req, res) => {
  try {
    const { entries } = req.body;
    if (!Array.isArray(entries) || entries.length === 0)
      return res.status(400).json({ ok: false, error: "entries array required" });

    const saved = [];
    for (const body of entries) {
      if (!body.composition) continue;
      const entry = {
        id:          `xrd-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
        composition: body.composition,
        name:        body.name || body.composition,
        elements:    Array.isArray(body.elements) ? body.elements : parseElements(body.composition),
        phase:       body.phase       || "",
        synthesis:   body.synthesis   || "",
        temperature: body.temperature || "",
        atmosphere:  body.atmosphere  || "",
        date:        body.date        || new Date().toISOString().split("T")[0],
        notes:       body.notes       || "",
        filename:    body.filename    || "",
        xy_data:     body.xy_data     || "",
        peaks:       body.peaks       || [],
        intensities: body.intensities || [],
        added_by:    body.added_by    || "lab",
      };
      insertEntry(entry);
      saved.push(entry.id);
    }
    res.status(201).json({ ok: true, imported: saved.length, ids: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── PUT /api/entries/:id  — update ────────────────────────────
router.put("/:id", (req, res) => {
  try {
    const existing = getEntryById(req.params.id);
    if (!existing) return res.status(404).json({ ok: false, error: "Not found" });
    updateEntry(req.params.id, req.body);
    res.json({ ok: true, data: getEntryById(req.params.id) });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── DELETE /api/entries/:id ────────────────────────────────────
router.delete("/:id", (req, res) => {
  try {
    const existing = getEntryById(req.params.id);
    if (!existing) return res.status(404).json({ ok: false, error: "Not found" });
    deleteEntry(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── helper ────────────────────────────────────────────────────
function parseElements(formula) {
  const ALL_SYMS = new Set(["H","He","Li","Be","B","C","N","O","F","Ne","Na","Mg","Al","Si","P","S","Cl","Ar","K","Ca","Sc","Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn","Ga","Ge","As","Se","Br","Kr","Rb","Sr","Y","Zr","Nb","Mo","Tc","Ru","Rh","Pd","Ag","Cd","In","Sn","Sb","Te","I","Xe","Cs","Ba","La","Ce","Pr","Nd","Pm","Sm","Eu","Gd","Tb","Dy","Ho","Er","Tm","Yb","Lu","Hf","Ta","W","Re","Os","Ir","Pt","Au","Hg","Tl","Pb","Bi","Po","At","Rn","Fr","Ra","Ac","Th","Pa","U","Np","Pu"]);
  const elements = [];
  const re = /([A-Z][a-z]?)(\d*\.?\d*)/g;
  let m;
  while ((m = re.exec(formula)) !== null) {
    if (ALL_SYMS.has(m[1])) elements.push(m[1]);
  }
  return [...new Set(elements)];
}

module.exports = router;
