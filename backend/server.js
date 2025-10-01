const express = require("express");
const cors = require("cors");
const authRoutes = require("./auth");
const db = require("./db");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/search", (req, res) => {
  const search = req.query.query;
  if (!search) {
    return res.json([]);
  }

  const sql = `
    SELECT * FROM anime
    WHERE title LIKE ? OR title_jp LIKE ? OR title_en LIKE ? OR alt_titles LIKE ?
  `;
  const values = [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Ошибка поиска:", err);
      return res.status(500).json({ error: "Ошибка при поиске" });
    }
    res.json(results);
  });
});

app.listen(3001, () => {
  console.log("🚀 Бэкенд сервер запущен на http://localhost:3001");
});
