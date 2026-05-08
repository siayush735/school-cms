const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const dbPath = path.join(__dirname, "db.json");

const readData = () => {
  const raw = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(raw);
};

const writeData = (data) => {
  fs.writeFileSync(
    dbPath,
    JSON.stringify(data, null, 2)
  );
};


// USERS
app.get("/users", (req, res) => {
  try {
    const data = readData();
    res.json(data.users || []);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: err.message,
    });
  }
});


// CONTENT
app.get("/content", (req, res) => {
  try {
    const data = readData();

    const { teacherId } = req.query;

    if (teacherId) {
      return res.json(
        data.content.filter(
          (item) => item.teacherId == teacherId
        )
      );
    }

    res.json(data.content || []);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


// POST CONTENT
app.post("/content", (req, res) => {
  try {
    const data = readData();

    const newContent = {
      ...req.body,
      id: Date.now().toString(),
    };

    data.content.push(newContent);

    writeData(data);

    res.status(201).json(newContent);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


// PATCH CONTENT
app.patch("/content/:id", (req, res) => {
  try {
    const data = readData();

    const index = data.content.findIndex(
      (item) => item.id == req.params.id
    );

    if (index === -1) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    data.content[index] = {
      ...data.content[index],
      ...req.body,
    };

    writeData(data);

    res.json(data.content[index]);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});