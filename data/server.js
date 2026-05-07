const express = require("express");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

const data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));

app.get("/data", (req, res) => {
  res.json(data);
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});