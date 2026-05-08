const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

const readDB = () =>
  JSON.parse(fs.readFileSync("./db.json", "utf-8"));

const writeDB = (data) =>
  fs.writeFileSync("./db.json", JSON.stringify(data, null, 2));

// ✅ GET all content
app.get("/content", (req, res) => {
  const db = readDB();
  res.json(db.content);
});

// ✅ GET by teacherId
app.get("/content", (req, res) => {
  const db = readDB();
  const { teacherId } = req.query;

  let result = db.content;

  if (teacherId) {
    result = result.filter(
      (c) => c.teacherId == teacherId
    );
  }

  res.json(result);
});

// ✅ POST content
app.post("/content", (req, res) => {
  const db = readDB();
  const newItem = { id: Date.now().toString(), ...req.body };

  db.content.push(newItem);
  writeDB(db);

  res.json(newItem);
});

// ✅ PATCH update
app.patch("/content/:id", (req, res) => {
  const db = readDB();

  const index = db.content.findIndex(
    (c) => c.id === req.params.id
  );

  if (index === -1) return res.status(404).send("Not found");

  db.content[index] = {
    ...db.content[index],
    ...req.body,
  };

  writeDB(db);

  res.json(db.content[index]);
});

app.get("/content", (req, res) => {
  res.json(db.content);
});

app.patch("/content/:id", (req, res) => {
  const db = readDB();

  const index = db.content.findIndex(
    (item) => item.id === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({ message: "Not found" });
  }

  db.content[index] = {
    ...db.content[index],
    ...req.body,
  };

  writeDB(db);

  res.json(db.content[index]);
});

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});