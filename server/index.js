const express = require("express");
const path = require("path");

const app = express();

// API
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Vue build (client/dist)
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("*", (req, res) => {
 res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const PORT = process.env.PORT;
app.listen(PORT, "0.0.0.0");