const db = require("../_db");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { id } = req.query;

  try {
    await db.initDb();

    // ── GET single entry (with xy_data for chart) ──────────────
    if (req.method === "GET") {
      const entry = await db.getById(id);
      if (!entry) return res.status(404).json({ ok: false, error: "Not found" });
      return res.status(200).json({ ok: true, data: entry });
    }

    // ── PUT update ─────────────────────────────────────────────
    if (req.method === "PUT") {
      const existing = await db.getById(id);
      if (!existing) return res.status(404).json({ ok: false, error: "Not found" });
      const merged = { ...existing, ...req.body };
      await db.update(id, merged);
      return res.status(200).json({ ok: true, data: await db.getById(id) });
    }

    // ── DELETE ─────────────────────────────────────────────────
    if (req.method === "DELETE") {
      const existing = await db.getById(id);
      if (!existing) return res.status(404).json({ ok: false, error: "Not found" });
      await db.remove(id);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ ok: false, error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};
