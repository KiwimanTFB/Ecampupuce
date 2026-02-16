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

app.listen(process.env.PORT || 3000);