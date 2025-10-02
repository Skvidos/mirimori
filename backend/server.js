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

app.get("/watched/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT a.id, a.title, a.poster_url, w.status, w.episodes_watched
    FROM watched w
    JOIN anime a ON w.anime_id = a.id
    WHERE w.user_id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Ошибка получения списка просмотренного:", err);
      return res.status(500).json({ error: "Ошибка при получении данных" });
    }
    res.json(results);
  });
});

app.post("/watched", (req, res) => {
  const { user_id, anime_id, status, episodes_watched } = req.body;

  const sql = `
    INSERT INTO watched (user_id, anime_id, status, episodes_watched)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE status = VALUES(status), episodes_watched = VALUES(episodes_watched)
  `;

  db.query(sql, [user_id, anime_id, status, episodes_watched], (err, result) => {
    if (err) {
      console.error("Ошибка добавления/обновления:", err);
      return res.status(500).json({ error: "Ошибка при добавлении/обновлении" });
    }
    res.json({ message: "Запись сохранена" });
  });
});

app.get("/anime/new", (req, res) => {
  const sql = `
    SELECT id, title, type, poster 
    FROM anime 
    ORDER BY created_at DESC 
    LIMIT 10
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Ошибка выборки новинок:", err);
      return res.status(500).json({ error: "Ошибка при получении новинок" });
    }
    res.json(results);
  });
});

app.get("/anime/last-watched", (req, res) => {
  const sql = `
    SELECT w.id, a.title, a.type, a.poster, w.watched_at
    FROM watched w
    JOIN anime a ON w.anime_id = a.id
    ORDER BY w.watched_at DESC
    LIMIT 10
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Ошибка выборки последних просмотренных:", err);
      return res.status(500).json({ error: "Ошибка при получении последних просмотренных" });
    }
    res.json(results);
  });
});

app.get("/anime/:id", (req, res) => {
  const animeId = req.params.id;
  const sql = "SELECT * FROM anime WHERE id = ?";
  db.query(sql, [animeId], (err, results) => {
    if (err) return res.status(500).json({ error: "Ошибка при получении аниме" });
    if (results.length === 0) return res.status(404).json({ error: "Аниме не найдено" });
    res.json(results[0]);
  });
});

app.listen(3001, () => {
  console.log("🚀 Бэкенд сервер запущен на http://localhost:3001");
});
