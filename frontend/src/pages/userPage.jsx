import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import NavBar from "../components/navBar";
import "../styles/userPage.css";
import SliderMini from "../components/sliderMini";
import Slider from "../components/slider";
import UserStats from "../components/statistics";
import PostBox from "../components/postBox";

function UserPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [userAnimes, setUserAnimes] = useState([]);
  const [userFavAnimes, setUserFavAnimes] = useState([]);
  const [userFavMangas, setUserFavMangas] = useState([]);
  const [countFavAnimes, setCountFavAnimes] = useState(0);
  const [countFavMangas, setCountFavMangas] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:3001/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:3001/api/users/${id}/anime`)
      .then((res) => res.json())
      .then((data) => setUserAnimes(data))
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:3001/api/users/${id}/favorites/anime`)
      .then((res) => res.json())
      .then((data) => setUserFavAnimes(data))
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:3001/api/users/${id}/favorites/manga`)
      .then((res) => res.json())
      .then((data) => setUserFavMangas(data))
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:3001/api/users/${id}/favorites/anime/stats`)
      .then((res) => res.json())
      .then((data) => setCountFavAnimes(data.count))
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:3001/api/users/${id}/favorites/manga/stats`)
      .then((res) => res.json())
      .then((data) => setCountFavMangas(data.count))
      .catch((err) => console.error(err));
  }, [id]);

  const formatAge = (age) => {
    if (age === null || age === undefined) return "";
    const n = Math.abs(Number(age));
    const lastTwo = n % 100;
    if (lastTwo >= 11 && lastTwo <= 14) return `${age} лет`;
    const last = n % 10;
    if (last === 1) return `${age} год`;
    if (last >= 2 && last <= 4) return `${age} года`;
    return `${age} лет`;
  };

  return user ? (
    <div className="User-page">
      <div className="User-page-header">
        <Header />
        <NavBar />
      </div>

      <div className="User-page-main">
        <div className="Web-border">
          <div className="User-page-container">
            <div className="User-page-left">
              <div className="Title">{user.username}</div>
              <img
                className="User-avatar-box"
                src={user.avatar_url}
                alt="user-avatar"
              />
              <div className="User-info-box">
                <span className="User-sex">
                  {user.sex === "male" ? "Муж." : "Женск."}
                </span>
                <span className="User-age">{formatAge(user.age)}</span>
              </div>
              <div className="User-registration">
                Дата регистрации: {user.created_at.slice(0, 10)}
              </div>
            </div>

            <div className="User-page-content">
              <UserStats userId={id} />
            </div>

            <div className="User-page-right">
              <div className="User-animes-section">
                <div className="User-animes-title">История</div>
                <SliderMini items={userAnimes} itemType="anime" />
              </div>
            </div>
          </div>

          <div className="User-favorite-box">
            <div className="Title">Избранное</div>
            <div className="User-favorite-anime">
              <div className="User-title">Аниме ({countFavAnimes})</div>
              <Slider items={userFavAnimes} itemType="anime" count={6} />
            </div>
            <div className="User-favorite-manga">
              <div className="User-title">Манга ({countFavMangas})</div>
              <Slider items={userFavMangas} itemType="manga" count={6} />
            </div>
          </div>

          <div className="User-reviews-section">
            <div className="Title">Отзывы пользователя</div>
            <PostBox user={user} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  ) : (
    <div>Загрузка...</div>
  );
}

export default UserPage;
