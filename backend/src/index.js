require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const path = require("path");
const { initDb } = require("./db");
const entriesRouter = require("./routes/entries");

const app = express();
const PORT = process.env.PORT || 3001;

// ── middleware ────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// basic rate limiting — 200 requests per 15 min per IP
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// ── init database ─────────────────────────────────────────────
initDb();

// ── routes ────────────────────────────────────────────────────
app.use("/api/entries", entriesRouter);

// health check
app.get("/api/health", (req, res) => res.json({ status: "ok", entries: require("./db").countEntries() }));

// serve React frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../../frontend/build");
  app.use(express.static(frontendPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

app.listen(PORT, () => console.log(`XRD Lab server running on port ${PORT}`));
