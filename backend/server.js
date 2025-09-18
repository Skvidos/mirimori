const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/test-db', (req, res) => {
  db.query('SELECT 1 + 1 AS result', (err, results) => {
    if (err) {
      console.error('Ошибка запроса:', err);
      return res.status(500).json({ error: 'Ошибка запроса к БД' });
    }
    res.json({ success: true, result: results[0].result });
  });
});

app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/users', (req, res) => {
  const { username, email } = req.body;
  db.query(
    'INSERT INTO users (username, email) VALUES (?, ?)',
    [username, email],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, username, email });
    }
  );
});

app.listen(3001, () => {
  console.log('🚀 Бэкенд сервер запущен на http://localhost:3001');
});
