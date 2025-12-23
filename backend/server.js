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

app.post("/api/friends/toggle", (req, res) => {
  const { user_id, friend_id } = req.body;

  if (!user_id || !friend_id) {
    return res.status(400).json({ error: "user_id и friend_id обязательны" });
  }

  const userId = Number(user_id);
  const friendId = Number(friend_id);

  const checkSql = `
    SELECT * FROM friends
    WHERE (user_id = ? AND friend_id = ?)
       OR (user_id = ? AND friend_id = ?)
    LIMIT 1
  `;

  db.query(checkSql, [userId, friendId, friendId, userId], (err, rows) => {
    if (err) {
      console.error("DB check error:", err);
      return res.status(500).json({ error: "Ошибка проверки" });
    }

    const relation = rows[0];

    if (!relation) {
      const insertSql = `
        INSERT INTO friends (user_id, friend_id, status, created_at)
        VALUES (?, ?, 'pending', NOW())
      `;
      return db.query(insertSql, [userId, friendId], (err2) => {
        if (err2) {
          console.error("DB insert error:", err2);
          return res.status(500).json({ error: "Ошибка добавления" });
        }
        return res.json({ status: "pending", message: "Заявка отправлена" });
      });
    }

    if (
      relation.user_id === friendId &&
      relation.friend_id === userId &&
      relation.status === "pending"
    ) {
      const acceptSql = `
        UPDATE friends
        SET status = 'accepted'
        WHERE id = ?
      `;
      return db.query(acceptSql, [relation.id], (err3) => {
        if (err3) {
          console.error("DB accept error:", err3);
          return res.status(500).json({ error: "Ошибка подтверждения" });
        }
        return res.json({ status: "accepted", message: "Заявка подтверждена!" });
      });
    }

    if (relation.status === "accepted") {
      const deleteSql = `DELETE FROM friends WHERE id = ?`;
      return db.query(deleteSql, [relation.id], (err4) => {
        if (err4) {
          console.error("DB delete error:", err4);
          return res.status(500).json({ error: "Ошибка удаления" });
        }
        return res.json({ status: "removed", message: "Удалено из друзей" });
      });
    }

    if (
      relation.user_id === userId &&
      relation.friend_id === friendId &&
      relation.status === "pending"
    ) {
      const cancelSql = `DELETE FROM friends WHERE id = ?`;
      return db.query(cancelSql, [relation.id], (err5) => {
        if (err5) {
          console.error("DB cancel error:", err5);
          return res.status(500).json({ error: "Ошибка отмены заявки" });
        }
        return res.json({ status: "canceled", message: "Заявка отменена" });
      });
    }
  });
});

app.get("/api/users", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.q ? `%${req.query.q}%` : "%";
  const offset = (page - 1) * limit;

  const currentUserId = req.query.currentUserId
    ? Number(req.query.currentUserId)
    : null;

  const sql = `
    SELECT 
      u.id,
      u.username,
      u.avatar_url,
      u.email,
      u.age,
      u.sex,
      CASE 
        WHEN u.isAdmin = 1 THEN 'Admin'
        WHEN u.isMods = 1 THEN 'Moderator'
        ELSE 'User'
      END AS role,

      (
        SELECT f.status
        FROM friends f
        WHERE 
          (
            f.user_id = u.id AND f.friend_id = ?
          ) OR (
            f.user_id = ? AND f.friend_id = u.id
          )
        LIMIT 1
      ) AS friend_status

    FROM users u
    WHERE u.username LIKE ? OR u.email LIKE ?
    ORDER BY u.id DESC
    LIMIT ? OFFSET ?
  `;

  const countSql = `
    SELECT COUNT(*) AS total
    FROM users
    WHERE username LIKE ? OR email LIKE ?
  `;

  db.query(countSql, [search, search], (err, countResult) => {
    if (err) {
      console.error("Ошибка получения количества пользователей:", err);
      return res.status(500).json({ error: "Ошибка сервера" });
    }

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    db.query(
      sql,
      [
        currentUserId,
        currentUserId,
        search,
        search,
        limit,
        offset,
      ],
      (err, results) => {
        if (err) {
          console.error("Ошибка получения списка пользователей:", err);
          return res.status(500).json({ error: "Ошибка при получении данных" });
        }

        res.json({
          data: results,
          page,
          totalPages,
          total,
        });
      }
    );
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

app.get("/api/manga", (req, res) => {
  const {
    q = "",
    type = "",
    status = "",
    sort = "asc",
    page = 1,
    limit = 10,
  } = req.query;

  const offset = (page - 1) * limit;

  let sql = "SELECT * FROM manga WHERE 1=1";
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

  sql += ` ORDER BY id ${sort === "desc" ? "DESC" : "ASC"}`;
  sql += " LIMIT ? OFFSET ?";
  params.push(Number(limit), Number(offset));

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Ошибка получения списка аниме:", err);
      return res.status(500).json({ error: "Ошибка при получении данных" });
    }
    res.json(results);
  });
});

app.get("/api/anime", (req, res) => {
  const {
    q = "",
    type = "",
    status = "",
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

app.get("/api/reviews", (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  let q = req.query.q || "";

  const offset = (page - 1) * limit;

  let baseWhere = "";
  let paramsWhere = [];

  if (q) {
    baseWhere = `
      WHERE 
        reviews.content LIKE ? OR
        users.username LIKE ? OR
        anime.title LIKE ?
    `;
    paramsWhere.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }

  const countSql = `
    SELECT COUNT(*) AS total
    FROM reviews
    JOIN users ON reviews.user_id = users.id
    LEFT JOIN anime ON reviews.item_id = anime.id 
        AND reviews.item_type = 'anime'
    ${baseWhere}
  `;

  db.query(countSql, paramsWhere, (err, countResult) => {
    if (err) {
      console.error("Ошибка COUNT:", err);
      return res.status(500).json({ error: "Ошибка подсчёта" });
    }

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    let selectSql = `
      SELECT 
        reviews.*,
        users.username,
        users.id AS user_id,
        users.avatar_url,
        anime.title AS anime_title,
        anime.poster AS anime_poster
      FROM reviews
      JOIN users ON reviews.user_id = users.id
      LEFT JOIN anime ON reviews.item_id = anime.id 
          AND reviews.item_type = 'anime'
      ${baseWhere}
      ORDER BY reviews.created_at DESC
      LIMIT ? OFFSET ?
    `;

    let paramsSelect = [...paramsWhere, limit, offset];

    db.query(selectSql, paramsSelect, (err, results) => {
      if (err) {
        console.error("Ошибка SELECT:", err);
        return res.status(500).json({ error: "Ошибка получения данных" });
      }

      res.json({
        data: results,
        total,
        totalPages,
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
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  let q = req.query.q || "";

  const offset = (page - 1) * limit;

  let baseWhere = "";
  let paramsWhere = [];

  if (q) {
    baseWhere = `
      WHERE 
        news.title LIKE ? OR
        news.content LIKE ?
    `;
    paramsWhere.push(`%${q}%`, `%${q}%`);
  }

  const countSql = `
    SELECT COUNT(*) AS total
    FROM news
    ${baseWhere}
  `;

  db.query(countSql, paramsWhere, (err, countResult) => {
    if (err) {
      console.error("Ошибка COUNT:", err);
      return res.status(500).json({ error: "Ошибка подсчёта" });
    }

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    const selectSql = `
      SELECT 
        news.*
      FROM news
      ${baseWhere}
      ORDER BY news.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const paramsSelect = [...paramsWhere, limit, offset];

    db.query(selectSql, paramsSelect, (err, results) => {
      if (err) {
        console.error("Ошибка SELECT:", err);
        return res.status(500).json({ error: "Ошибка получения данных" });
      }

      res.json({
        data: results,
        total,
        totalPages,
      });
    });
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

app.get("/api/users/:id/anime", (req, res) => {
  const userId = req.params.id;
  const sql = `
    SELECT a.*, ul.added_at AS added_at
    FROM user_lists AS ul
    JOIN anime AS a ON a.id = ul.item_id
    WHERE ul.user_id = ?
    ORDER BY ul.added_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("SQL error in /api/users/:id/anime:", err);
      return res.status(500).json({ error: "Ошибка при получении списка аниме" });
    }

    res.json(results);
  });
});

app.get("/api/users/:id/favorites/anime", (req, res) => {
  const userId = req.params.id;

  const sql = `
    SELECT a.*, f.added_at
    FROM favorites f
    JOIN anime a ON a.id = f.item_id
    WHERE f.user_id = ? AND f.item_type = 'anime'
    ORDER BY f.added_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("SQL error:", err);
      return res.status(500).json({ error: "Ошибка при получении избранных аниме" });
    }
    res.json(results);
  });
});

app.get("/api/users/:id/favorites/manga", (req, res) => {
  const userId = req.params.id;

  const sql = `
    SELECT m.*, f.added_at
    FROM favorites f
    JOIN manga m ON m.id = f.item_id
    WHERE f.user_id = ? AND f.item_type = 'manga'
    ORDER BY f.added_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("SQL error:", err);
      return res.status(500).json({ error: "Ошибка при получении избранной манги" });
    }
    res.json(results);
  });
});

app.get("/api/users/:id/favorites/anime/stats", (req, res) => {
  const userId = req.params.id;

  const sql = `
    SELECT COUNT(*) AS count
    FROM favorites
    WHERE user_id = ? AND item_type = 'anime'
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("SQL error:", err);
      return res.status(500).json({ error: "Ошибка при получении статистики избранного аниме" });
    }

    res.json({ count: results[0].count });
  });
});

app.get("/api/users/:id/favorites/manga/stats", (req, res) => {
  const userId = req.params.id;

  const sql = `
    SELECT COUNT(*) AS count
    FROM favorites
    WHERE user_id = ? AND item_type = 'manga'
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("SQL error:", err);
      return res.status(500).json({ error: "Ошибка при получении статистики избранной манги" });
    }

    res.json({ count: results[0].count });
  });
});

app.get("/api/users/:id/reviews", (req, res) => {
  const userId = req.params.id;

  const sql = `
    SELECT 
      r.id AS id,
      r.content,
      r.rating,
      r.item_type,
      r.item_id,
      r.created_at,

      -- Автор отзыва
      u.id AS user_id,
      u.username,
      u.avatar_url,

      CASE 
        WHEN r.item_type = 'anime' THEN a.title
        WHEN r.item_type = 'manga' THEN m.title
      END AS title,

      CASE 
        WHEN r.item_type = 'anime' THEN a.poster
        ELSE NULL
      END AS poster

    FROM reviews r
    JOIN users u ON r.user_id = u.id
    LEFT JOIN anime a 
      ON r.item_type = 'anime' 
      AND r.item_id = a.id
    LEFT JOIN manga m 
      ON r.item_type = 'manga' 
      AND r.item_id = m.id

    WHERE r.user_id = ?
    ORDER BY r.created_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("SQL error:", err);
      return res.status(500).json({ error: "Ошибка при получении отзывов пользователя" });
    }

    res.json(results);
  });
});

app.get("/api/anime/:id/reviews", (req, res) => {
  const animeId = req.params.id;

  const sql = `
    SELECT 
      r.id AS id,
      r.content,
      r.rating,
      r.item_type,
      r.item_id,
      r.created_at,

      u.id AS user_id,
      u.username,
      u.avatar_url,

      a.title AS title,
      a.poster AS poster

    FROM reviews r
    JOIN users u ON r.user_id = u.id
    JOIN anime a ON r.item_id = a.id AND r.item_type = 'anime'

    WHERE r.item_id = ?
      AND r.item_type = 'anime'
    ORDER BY r.created_at DESC
  `;

  db.query(sql, [animeId], (err, results) => {
    if (err) {
      console.error("SQL error:", err);
      return res.status(500).json({ error: "Ошибка при получении отзывов об аниме" });
    }

    res.json(results);
  });
});

app.post("/api/users/:userId/reviews/anime/:animeId/add", (req, res) => {
  const { userId } = req.params;
  const { animeId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Недостаточно данных для создания отзыва" });
  }

  const sql = `
    INSERT INTO reviews (user_id, item_id, item_type, content, rating, created_at)
    VALUES (?, ?, 'anime', ?, 0, NOW())
  `;

  db.query(sql, [userId, animeId, content], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Ошибка при добавлении отзыва" });
    }
    res.json({ success: true });
  });
});

app.delete("/api/reviews/:postId/delete", (req, res) => {
  const { user_id } = req.body;
  const { postId } = req.params;

  db.query("SELECT * FROM reviews WHERE id = ?", [postId], (err, result) => {
    if (err) return res.status(500).json({ error: "Ошибка сервера" });
    if (!result.length) return res.status(404).json({ error: "Отзыв не найден" });

    const post = result[0];

    if (post.user_id !== user_id) {
      return res.status(403).json({ error: "Нет прав на удаление" });
    }

    db.query("DELETE FROM reviews WHERE id = ?", [postId], (err2) => {
      if (err2) return res.status(500).json({ error: "Ошибка при удалении" });
      res.json({ success: true });
    });
  });
});


app.post("/api/users/:userId/favorites/add", (req, res) => {
  const { userId } = req.params;
  const { item_id, item_type } = req.body;

  if (!item_id || !item_type) {
    return res.status(400).json({ error: "Не указан item_id или item_type" });
  }

  const sql = `
    INSERT INTO favorites (user_id, item_id, item_type, added_at)
    VALUES (?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE added_at = NOW()
  `;

  db.query(sql, [userId, item_id, item_type], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Ошибка при добавлении в избранное" });
    }
    res.json({ success: true });
  });
});

app.delete("/api/users/:userId/favorites/delete", (req, res) => {
  const { userId } = req.params;
  const { item_id, item_type } = req.body;

  if (!item_id || !item_type) {
    return res.status(400).json({ error: "Не указан item_id или item_type" });
  }

  const sql = "DELETE FROM favorites WHERE user_id = ? AND item_id = ? AND item_type = ?";

  db.query(sql, [userId, item_id, item_type], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Ошибка при удалении из избранного" });
    }
    res.json({ success: true });
  });
});

app.get("/api/users/:userId/anime-status/:animeId", (req, res) => {
  const { userId, animeId } = req.params;

  const sql = `
    SELECT status, progress 
    FROM user_lists
    WHERE user_id = ? AND item_id = ? AND item_type = 'anime'
  `;

  db.query(sql, [userId, animeId], (err, results) => {
    if (err) return res.status(500).json({ error: "Ошибка сервера" });

    if (results.length === 0) {
      return res.json({ status: null, progress: 0 });
    }

    res.json(results[0]);
  });
});

app.get("/api/users/:userId/anime-status", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT item_id, status, progress
    FROM user_lists
    WHERE user_id = ? AND item_type = 'anime'
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Ошибка сервера" });

    res.json(results);
  });
});

app.post("/api/users/:userId/anime-status/:animeId", (req, res) => {
  const { userId, animeId } = req.params;
  const { status, progress } = req.body;

  if (!status) return res.status(400).json({ error: "Статус обязателен" });

  const sql = `
    INSERT INTO user_lists (user_id, item_id, item_type, status, progress)
    VALUES (?, ?, 'anime', ?, ?)
    ON DUPLICATE KEY UPDATE
      status = VALUES(status),
      progress = VALUES(progress)
  `;

  db.query(sql, [userId, animeId, status, progress ?? 0], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Ошибка сервера" });
    }

    res.json({ success: true });
  });
});

app.post("/api/users/:userId/anime-status/:animeId/episodes", (req, res) => {
  const { userId, animeId } = req.params;
  const { progress } = req.body;

  const sql = `
    UPDATE user_lists
    SET progress = ?
    WHERE user_id = ? AND item_id = ? AND item_type = 'anime'
  `;

  db.query(sql, [progress, userId, animeId], (err) => {
    if (err) return res.status(500).json({ error: "Ошибка сервера" });
    res.json({ success: true });
  });
});


app.get("/api/users/:userId/friends", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT 
      u.id,
      u.username,
      u.avatar_url
    FROM friends f
    JOIN users u 
      ON (
        (f.user_id = ? AND u.id = f.friend_id)
        OR
        (f.friend_id = ? AND u.id = f.user_id)
      )
  `;

  db.query(sql, [userId, userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Ошибка при получении друзей" });
    }
    res.json(results);
  });
});


app.delete("/api/users/:userId/friends/:friendId", (req, res) => {
  const { userId, friendId } = req.params;

  const sql = "DELETE FROM friends WHERE user_id = ? AND friend_id = ?";

  db.query(sql, [userId, friendId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Ошибка при удалении друга" });
    }
    res.json({ success: true });
  });
});

app.put("/api/users/:id/username", (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  if (!username || username.length < 3) {
    return res.status(400).json({ error: "Некорректный username" });
  }

  const sql = `
    UPDATE users 
    SET username = ? 
    WHERE id = ?
  `;

  db.query(sql, [username, id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Ошибка обновления username" });
    }
    res.json({ success: true });
  });
});

app.put("/api/users/:id/age", (req, res) => {
  const { id } = req.params;
  const { age } = req.body;

  const sql = `
    UPDATE users 
    SET age = ? 
    WHERE id = ?
  `;

  db.query(sql, [age, id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Ошибка обновления возраста" });
    }
    res.json({ success: true });
  });
});

app.put("/api/users/:id/gender", (req, res) => {
  const { id } = req.params;
  const { gender } = req.body;

  if (!gender || !['male', 'female'].includes(gender)) {
    return res.status(400).json({ error: "Неверное значение пола (male или female)" });
  }

  const sql = `
    UPDATE users 
    SET sex = ?
    WHERE id = ?
  `;

  db.query(sql, [gender, parseInt(id)], (err, result) => {
    if (err) {
      console.error('SQL Error:', err.code, err.message);
      return res.status(500).json({ error: "Ошибка обновления пола", details: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    res.json({ success: true });
  });
});

const storage = multer.diskStorage({
  destination: "uploads/avatars",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

app.post(
  "/api/users/:id/avatar",
  upload.single("avatar"),
  (req, res) => {
    const { id } = req.params;
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    const sql = `
      UPDATE users 
      SET avatar_url = ? 
      WHERE id = ?
    `;

    db.query(sql, [avatarUrl, id], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Ошибка загрузки аватара" });
      }
      res.json({ avatar_url: avatarUrl });
    });
  }
);

app.get("/api/users/:id/anime/export", (req, res) => {
  const userId = req.user?.id || req.params.id;
  const { id } = req.params;

  if (req.user && req.user.id !== parseInt(id)) {
    return res.status(403).json({ error: "Доступ запрещён" });
  }

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: "Неверный ID пользователя" });
  }

  const sql = `
    SELECT 
      ul.id, ul.item_id, ul.status, ul.progress, ul.added_at,
      a.title, a.title_jp, a.title_en, a.poster, a.episodes_total, a.episode_duration, a.release_date, a.rating, a.status
    FROM user_lists ul
    INNER JOIN anime a ON ul.item_id = a.id 
    WHERE ul.user_id = ? 
      AND ul.item_type = 'anime'
    ORDER BY ul.added_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Export error:', err);
      return res.status(500).json({ error: "Ошибка экспорта данных" });
    }

    const exportData = results.map(row => ({
      anime: {
        id: row.item_id,
        title: row.title,
        title_jp: row.title_jp || null,
        title_en: row.title_en || null,
        episodes_total: row.episodes_total || null,
        episode_duration: row.episode_duration || null,
        release_date: row.release_date || null,
        rating: row.rating || null,
        status: row.status || null,
        poster: row.poster || null,
      },
      status: row.status,
      progress: row.progress,
      added_at: row.added_at,
      list_id: row.id
    }));

    res.json({
      user_id: userId,
      export_date: new Date().toISOString(),
      anime_list: exportData
    });
  });
});



app.listen(3001, () => {
  console.log("Бэкенд сервер запущен на http://localhost:3001");
});