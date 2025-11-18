const express = require("express");
const cors = require("cors");
const authRoutes = require("./auth");
const db = require("./db");
const app = express();
const path = require("path");
const multer = require("multer");

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);

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

app.get("/api/users", (req, res) => {
  const sql = "SELECT id, username AS name, avatar_url, email, CASE WHEN isAdmin = 1 THEN 'Admin' WHEN isMods = 1 THEN 'Moderator' ELSE 'User' END AS role FROM users";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Ошибка получения списка пользователей:", err);
      return res.status(500).json({ error: "Ошибка при получении данных" });
    }
    res.json(results);
  });
});

app.get("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  const sql = "SELECT * FROM users WHERE id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Ошибка получения пользователя:", err);
      return res.status(500).json({ error: "Ошибка при получении данных" });
    }
    res.json(results[0]);
  });
});

app.put("/api/users/:id/addMods", (req, res) => {
  const userId = req.params.id;
  const { isMods } = req.body;
  const sql = "UPDATE users SET isMods = ? WHERE id = ?";
  db.query(sql, [isMods, userId], (err, result) => {
    if (err) {
      console.error("Ошибка обновления пользователя:", err);
      return res.status(500).json({ error: "Ошибка при обновлении данных" });
    }
    res.json(result);
  });
});

app.put("/api/users/:id/addAdmin", (req, res) => {
  const userId = req.params.id;
  const { isAdmin } = req.body;
  const sql = "UPDATE users SET isAdmin = ? WHERE id = ?";
  db.query(sql, [isAdmin, userId], (err, result) => {
    if (err) {
      console.error("Ошибка обновления пользователя:", err);
      return res.status(500).json({ error: "Ошибка при обновлении данных" });
    }
    res.json(result);
  });
});

app.delete("/api/users/:id/delete", async (req, res) => {
  const userId = req.params.id;
  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Ошибка удаления пользователя:", err);
      return res.status(500).json({ error: "Ошибка при удалении пользователя" });
    }
    res.json({ message: "Пользователь удален" });
  });
});

app.get("/api/anime", (req, res) => {
  const {
    q = "",
    type = "",
    status = "",
    year = "",
    sort = "asc",
    page = 1,
    limit = 10,
  } = req.query;

  const offset = (page - 1) * limit;

  let sql = "SELECT * FROM anime WHERE 1=1";
  const params = [];

  if (q) {
    sql += " AND (title LIKE ? OR title_en LIKE ? OR title_jp LIKE ?)";
    const searchTerm = `%${q}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }
  if (type) {
    sql += " AND type = ?";
    params.push(type);
  }
  if (status) {
    sql += " AND status = ?";
    params.push(status);
  }
  if (year) {
    sql += " AND release LIKE ?";
    params.push(`${year}%`);
  }

  sql += ` ORDER BY id ${sort === "desc" ? "DESC" : "ASC"}`;
  sql += " LIMIT ? OFFSET ?";
  params.push(Number(limit), Number(offset));

  let countSql = "SELECT COUNT(*) AS total FROM anime WHERE 1=1";
  const countParams = [];

  if (q) {
    countSql += " AND (title LIKE ? OR title_en LIKE ? OR title_jp LIKE ?)";
    const searchTerm = `%${q}%`;
    countParams.push(searchTerm, searchTerm, searchTerm);
  }
  if (type) {
    countSql += " AND type = ?";
    countParams.push(type);
  }
  if (status) {
    countSql += " AND status = ?";
    countParams.push(status);
  }
  if (year) {
    countSql += " AND release LIKE ?";
    countParams.push(`${year}%`);
  }

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error("Ошибка при загрузке аниме:", err);
      return res.status(500).json({ message: "Ошибка сервера" });
    }

    db.query(countSql, countParams, (err2, countResult) => {
      if (err2) {
        console.error("Ошибка при подсчете аниме:", err2);
        return res.status(500).json({ message: "Ошибка сервера" });
      }

      const total = countResult[0].total;

      res.json({
        data: rows,
        total,
        totalPages: Math.ceil(total / limit),
      });
    });
  });
});


app.delete("/api/anime/:id/delete", (req, res) => {
  const animeId = req.params.id;
  const sql = "DELETE FROM anime WHERE id = ?";
  db.query(sql, [animeId], (err, result) => {
    if (err) {
      console.error("Ошибка удаления аниме:", err);
      return res.status(500).json({ error: "Ошибка при удалении аниме" });
    }
    res.json({ message: "Аниме удалено" });
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

app.use("/uploads/posters", express.static(path.join(__dirname, "uploads/posters")));
app.use("/uploads/images", express.static(path.join(__dirname, "uploads/images")));


const storagePosters = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/posters");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "poster-" + unique + path.extname(file.originalname));
  }
});
const uploadPoster = multer({ storage: storagePosters });

const storageImages = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "image-" + unique + path.extname(file.originalname));
  }
});
const uploadImage = multer({ storage: storageImages });



app.post("/anime/upload", uploadPoster.single("poster"), (req, res) => {
  const { title, title_jp, title_en, alt_titles, description, type, episodes_total, episodes_duration, release_date, studio, source } = req.body;
  const poster_url = `/uploads/posters/${req.file.filename}`;

  const sql = `
    INSERT INTO anime (title, title_jp, title_en, alt_titles, description, poster, type, episodes_total,episode_duration, release_date, studio, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, title_jp, title_en, alt_titles, description, poster_url, type, episodes_total, episodes_duration, release_date, studio, source], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Ошибка при добавлении аниме" });
    }
    res.json({ message: "Аниме добавлено", id: result.insertId });
  });
});

app.put("/api/anime/:id/edit", uploadPoster.single("poster"), (req, res) => {
  const animeId = req.params.id;

  const {
    title,
    title_en,
    title_jp,
    alt_titles,
    description,
    type,
    status,
    episodes_total,
    episode_duration,
    release_date,
    studio,
    source,
  } = req.body;

  const poster_url = req.file ? `/uploads/posters/${req.file.filename}` : null;

  const sql = `
    UPDATE anime
    SET
      title = ?,
      title_en = ?,
      title_jp = ?,
      alt_titles = ?,
      description = ?,
      poster = CASE WHEN ? IS NOT NULL THEN ? ELSE poster END,
      type = ?,
      status = ?,
      episodes_total = ?,
      episode_duration = ?,
      release_date = ?,
      studio = ?,
      source = ?
    WHERE id = ?
  `;

  const values = [
    title || null,
    title_en || null,
    title_jp || null,
    alt_titles || null,
    description || null,
    poster_url,
    poster_url,
    type || null,
    status || null,
    episodes_total || null,
    episode_duration || null,
    release_date || null,
    studio || null,
    source || null,
    animeId,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Ошибка обновления аниме:", err);
      return res.status(500).json({ error: "Ошибка при обновлении аниме" });
    }

    res.json({ message: "Аниме успешно обновлено" });
  });
});



app.post("/api/ratings", (req, res) => {
  const { userId, animeId, rating } = req.body;
  if (!userId || !animeId || !rating) {
    return res.status(400).json({ error: "Недостаточно данных" });
  }

  const sql = `
    INSERT INTO ratings (user_id, anime_id, rating)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE rating = VALUES(rating)
  `;

  db.query(sql, [userId, animeId, rating], (err, results) => {
    if (err) {
      console.error("Ошибка при сохранении рейтинга:", err);
      return res.status(500).json({ error: "Ошибка при сохранении рейтинга" });
    }
    res.json({ success: true });
  });
});

app.get("/api/ratings/:userId/:animeId", (req, res) => {
  const { userId, animeId } = req.params;
  const sql = "SELECT rating FROM ratings WHERE user_id = ? AND anime_id = ?";

  db.query(sql, [userId, animeId], (err, results) => {
    if (err) {
      console.error("Ошибка при получении рейтинга:", err);
      return res.status(500).json({ error: "Ошибка при получении рейтинга" });
    }
    if (results.length > 0) {
      res.json({ rating: results[0].rating });
    } else {
      res.json({ rating: null });
    }
  });
});

app.get("/api/anime/:animeId/average-rating", (req, res) => {
  const { animeId } = req.params;
  const sql = "SELECT AVG(rating) AS avg_rating, COUNT(*) AS total FROM ratings WHERE anime_id = ?";

  db.query(sql, [animeId], (err, results) => {
    if (err) {
      console.error("Ошибка при получении среднего рейтинга:", err);
      return res.status(500).json({ error: "Ошибка при получении среднего рейтинга" });
    }
    res.json({
      avg_rating: results[0].avg_rating ? Number(results[0].avg_rating).toFixed(1) : 0,
      total: results[0].total,
    });
  });
});

app.get("/api/news", (req, res) => {
  const q = req.query.q || "";
  let sql = "SELECT * FROM news";
  const params = [];
  if (q) {
    sql += " WHERE title LIKE ?";
    params.push(`%${q}%`);
  }
  sql += " ORDER BY created_at DESC";
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: "Ошибка" });
    res.json(results);
  });
});


app.post("/api/news/add", uploadImage.single("image"), (req, res) => {
  const { title, content } = req.body;
  const image = req.file ? `/uploads/images/${req.file.filename}` : null;

  const sql = `
    INSERT INTO news (title, content, image)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [title, content, image], (err, result) => {
    if (err) {
      console.error("Ошибка добавления новости:", err);
      return res.status(500).json({ error: "Ошибка при добавлении новости" });
    }
    res.json({ message: "Новость добавлена", id: result.insertId });
  });
});

app.delete("/api/news/:id", (req, res) => {
  const newsId = req.params.id;
  const sql = "DELETE FROM news WHERE id = ?";
  db.query(sql, [newsId], (err, result) => {
    if (err) {
      console.error("Ошибка удаления новости:", err);
      return res.status(500).json({ error: "Ошибка при удалении новости" });
    }
    res.json({ message: "Новость удалена" });
  });
});


app.get("/api/stats/anime/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT status, COUNT(*) AS count
    FROM user_lists
    WHERE user_id = ? AND item_type='anime'
    GROUP BY status
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Ошибка при получении статистики" });
    }

    const stats = { planned: 0, watching: 0, completed: 0, dropped: 0, on_hold: 0 };
    rows.forEach(r => stats[r.status] = r.count);

    res.json(stats);
  });
});

app.get("/api/stats/manga/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT status, COUNT(*) AS count
    FROM user_lists
    WHERE user_id = ? AND item_type='manga'
    GROUP BY status
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Ошибка при получении статистики" });
    }

    const stats = { planned: 0, watching: 0, completed: 0 };
    rows.forEach(r => stats[r.status] = r.count);

    res.json(stats);
  });
});

app.get("/api/stats/time/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT SUM(a.episodes_total * a.episode_duration) AS total_minutes
    FROM user_lists ul
    JOIN anime a ON a.id = ul.item_id
    WHERE ul.user_id = ? AND ul.status = 'completed'
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Ошибка при получении статистики" });
    }

    const total_minutes = rows[0]?.total_minutes || 0;
    res.json({ total_minutes });
  });
});



app.listen(3001, () => {
  console.log("Бэкенд сервер запущен на http://localhost:3001");
});