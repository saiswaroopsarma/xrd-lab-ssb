const db = require("./_db");

module.exports = async (req, res) => {
  try {
    await db.initDb();
    const n = await db.count();
    return res.status(200).json({ ok: true, entries: n });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};
