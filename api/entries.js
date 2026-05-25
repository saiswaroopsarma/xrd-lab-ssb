const db = require("./_db");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    await db.initDb();

    // ── GET — list or search ───────────────────────────────────
    if (req.method === "GET") {
      const { q, elements } = req.query;
      let rows;
      if (q && q.trim()) {
        rows = await db.search(q.trim());
      } else if (elements) {
        const elList = elements.split(",").map(s => s.trim()).filter(Boolean);
        rows = await db.filterByElements(elList);
      } else {
        rows = await db.getAll();
      }
      // strip xy_data from list (too large)
      const light = rows.map(({ xy_data, ...r }) => r);
      return res.status(200).json({ ok: true, count: light.length, data: light });
    }

    // ── POST — create one entry ────────────────────────────────
    if (req.method === "POST") {
      const body = req.body;
      if (!body.composition) return res.status(400).json({ ok: false, error: "composition required" });
      const entry = {
        id:          db.makeId(),
        composition: body.composition,
        name:        body.name || body.composition,
        elements:    Array.isArray(body.elements) ? body.elements : db.parseElements(body.composition),
        phase:       body.phase || "",
        synthesis:   body.synthesis || "",
        temperature: body.temperature || "",
        atmosphere:  body.atmosphere || "",
        date:        body.date || new Date().toISOString().split("T")[0],
        notes:       body.notes || "",
        filename:    body.filename || "",
        xy_data:     body.xy_data || "",
        peaks:       body.peaks || [],
        intensities: body.intensities || [],
        added_by:    body.added_by || "lab",
      };
      await db.insert(entry);
      return res.status(201).json({ ok: true, data: entry });
    }

    return res.status(405).json({ ok: false, error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};
