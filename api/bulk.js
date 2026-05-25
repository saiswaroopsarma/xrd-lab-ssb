const db = require("./_db");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  try {
    await db.initDb();
    const { entries } = req.body;
    if (!Array.isArray(entries) || entries.length === 0)
      return res.status(400).json({ ok: false, error: "entries array required" });

    let imported = 0;
    for (const body of entries) {
      if (!body.composition) continue;
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
      imported++;
    }

    return res.status(201).json({ ok: true, imported });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};
