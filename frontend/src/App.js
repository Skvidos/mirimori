import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from './pages/register';
import Login from './pages/login';
import Main from './pages/main';
import AnimePage from './pages/animePage';
import UploadAnime from './pages/uploadAnime';
import ProtectedRoute from './components/protectedRoute';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3001/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) setUser(data);
        })
        .catch((err) => console.error("Ошибка проверки токена:", err));
    }
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/anime/:id" element={<AnimePage />} />
        <Route path="/UploadAnime" element={
          <ProtectedRoute user={user} requiredRole="mod"><UploadAnime /></ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App;
