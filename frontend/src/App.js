import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from './pages/register';
import Login from './pages/login';
import Main from './pages/main';
import AnimePage from './pages/animePage';
import ProtectedRoute from './components/protectedRoute';
import AdminPanel from './pages/adminPanel';
import UserPage from './pages/userPage';
import AnimeList from './pages/animeList';
import MangaList from './pages/mangaList';
import ReviewList from './pages/reviewList';
import UsersList from './pages/usersList';
import News from './pages/news';
import About from './pages/about';
import PageTitle from './hooks/pageTitle';
import Friends from './pages/friends';

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
        <Route path="/" element={
          <PageTitle title="Главная">
            <Main />
          </PageTitle>
        } />
        <Route path="/register" element={
          <PageTitle title="Регистрация">
            <Register />
          </PageTitle>
        } />
        <Route path="/login" element={
          <PageTitle title="Вход">
            <Login setUser={setUser} />
          </PageTitle>
        } />
        <Route path="/anime" element={
          <PageTitle title="Аниме">
            <AnimeList />
          </PageTitle>
        } />
        <Route path="/manga" element={
          <PageTitle title="Манга">
            <MangaList />
          </PageTitle>
        } />
        <Route path="/reviews" element={
          <PageTitle title="Отзывы">
            <ReviewList />
          </PageTitle>
        } />
        <Route path="/users" element={
          <PageTitle title="Пользователи">
            <UsersList />
          </PageTitle>
        } />
        <Route path="/anime/:id" element={<AnimePage />} />
        <Route path="/user/:id" element={<UserPage />} />
        <Route path="/news" element={
          <PageTitle title="Новости">
            <News />
          </PageTitle>
        } />
        <Route path="/about" element={
          <PageTitle title="О сайте">
            <About />
          </PageTitle>
        } />
        <Route path='/friends' element={
          <PageTitle title="Друзья">
            <Friends />
          </PageTitle>
        } />
        <Route path="/adminPanel" element={
          <ProtectedRoute user={user}>
            <PageTitle title="Панель администратора">
              <AdminPanel /></PageTitle>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App;
