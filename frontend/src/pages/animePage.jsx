import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import NavBar from "../components/navBar";
import Poster from "../assests/img/anime.png";
import "../styles/animePage.css";
import StarRating from "../components/StarRating";
import Slider from "../components/slider";

function AnimePage() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);

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

  useEffect(() => {
    fetch(`http://localhost:3001/anime/${id}`)
      .then((res) => res.json())
      .then((data) => setAnime(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!anime) return <div>Загрузка...</div>;

  return (
    <div className="Anime-page">
      <div className="Anime-page-header">
        <Header
          userLoggedIn={!!user}
          userAvatar={user?.avatar_url}
          userName={user?.username}
        />
        <NavBar />
      </div>
      <div className="Anime-page-main">
        <div className="Web-border">
          <div className="Anime-page-title">{anime.title}</div>

          <div className="Anime-page-main-inner">
            <div className="Anime-main-right">
              <img
                src={anime.poster ? `${anime.poster}` : Poster}
                alt={anime.title}
                className="Anime-postres-img"
              />
            </div>

            <div className="Anime-main-middle">
              <div className="Anime-stats">
                <div className="Anime-type">{anime.type}</div>
                <div className="Anime-episodes">
                  Эпизоды: {anime.episodes_total}
                </div>
                <div className="Anime-duraction">
                  Длительность эпизода: {anime.duration}
                </div>
                <div className="Anime-jap-title">
                  По-японски: {anime.title_jp}
                </div>
                <div className="Anime-eng-title">
                  По-английски: {anime.title_en}
                </div>
                <div className="Anime-date-box">
                  <div className="Anime-date">
                    {new Date(anime.release_date).toLocaleDateString("ru-RU")}
                  </div>
                  <div className="Anime-status">
                    {anime.status === "ongoing"
                      ? "В процессе"
                      : anime.status === "released"
                      ? "Завершено"
                      : "Планируется"}
                  </div>
                </div>
              </div>
              <div className="Anime-description-box">
                <div className="Title">Описание</div>
                <div className="Anime-description">{anime.description}</div>
              </div>
            </div>

            <div className="Anime-main-right">
              <div className="Title">Рейтинг</div>
              <div className="Anime-rating-stars-box">
                <div className="Anime-rating-stars">
                  <StarRating animeId={id} userId={user?.id} />
                </div>
              </div>
            </div>
          </div>

          <div className="Title">Главные герои</div>
          <div className="Anime-characters-box">
            <Slider title="" items="" />
          </div>

          <div className="Title">Авторы</div>
          <div className="Anime-authors-box">
            <Slider title="" items="" />
          </div>

          <div className="Title">Отзывы</div>
          <div className="Anime-reviews-box">Отзывы отсутствуют</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AnimePage;
