const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("./db");

const router = express.Router();
const JWT_SECRET = "secret_key";


router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Все поля обязательны" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  connection.query(
    "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
    [username, email, hashedPassword],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Пользователь зарегистрирован" });
    }
  );
});


router.post("/login", (req, res) => {
  const { email, password } = req.body;

  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) return res.status(401).json({ error: "Неверный email или пароль" });

      const user = results[0];
      const isValid = await bcrypt.compare(password, user.password_hash);

      if (!isValid) return res.status(401).json({ error: "Неверный email или пароль" });

      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });

      res.json({ message: "Успешный вход", token, user: { id: user.id, username: user.username, email: user.email, avatar_url: user.avatar_url } });
    }
  );
});

router.post("/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Токен отсутствует" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Неверный токен" });

    res.json({ id: decoded.id, username: decoded.username });
  });
});


module.exports = router;
