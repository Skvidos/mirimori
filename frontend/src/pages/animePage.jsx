import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../components/UserContext";
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
  const [isFavorite, setIsFavorite] = useState(false);

  const { user } = useContext(UserContext);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    fetch(`http://localhost:3001/anime/${id}`)
      .then((res) => res.json())
      .then((data) => setAnime(data))
      .catch((err) => console.error(err));

    if (user) {
      fetch(`http://localhost:3001/api/users/${user.id}/favorites/anime`)
        .then((res) => res.json())
        .then((data) => {
          const fav = data.find((item) => item.id === parseInt(id));
          setIsFavorite(!!fav);
        });
    }
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user) {
      showToast("Пожалуйста, войдите в систему", "danger");
      return;
    }

    try {
      if (isFavorite) {
        const res = await fetch(
          `http://localhost:3001/api/users/${user.id}/favorites/delete`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ item_id: id, item_type: "anime" }),
          }
        );
        if (!res.ok) throw new Error("Ошибка сервера");
        showToast("Аниме удалено из избранного!", "success");
        setIsFavorite(false);
      } else {
        const res = await fetch(
          `http://localhost:3001/api/users/${user.id}/favorites/add`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ item_id: id, item_type: "anime" }),
          }
        );
        if (!res.ok) throw new Error("Ошибка сервера");
        showToast("Аниме добавлено в избранное!", "success");
        setIsFavorite(true);
      }
    } catch (err) {
      console.error(err);
      showToast("Ошибка при изменении избранного", "danger");
    }
  };

  if (!anime) return <div>Загрузка...</div>;

  return (
    <div className="Anime-page">
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
      <div className="Anime-page-header">
        <Header />
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

              <div
                className={`Anime-fav-button ${isFavorite ? "favorite" : ""}`}
                onClick={toggleFavorite}
              >
                {isFavorite ? "В избранном ❤️" : "Добавить в избранное 🤍"}
              </div>
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
                  По-английски: {anime.title_en}
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
              <div className="Title">Рейтинг</div>
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
