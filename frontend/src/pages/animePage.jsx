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
import PostBox from "../components/postBox";

function AnimePage() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [watchStatus, setWatchStatus] = useState("planned");
  const [progress, setProgress] = useState(0);
  const [reviewText, setReviewText] = useState("");

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

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3001/api/users/${user.id}/anime-status/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setWatchStatus(data.status);
            setProgress(data.progress || 0);
          }
        });
    }
  }, [user, id]);

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

  const saveStatus = async (newStatus, newEpisodes) => {
    if (!user) {
      showToast("Пожалуйста, войдите", "danger");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3001/api/users/${user.id}/anime-status/${id}`, // <- id вместо "save"
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: newStatus,
            progress: newEpisodes,
          }),
        }
      );

      if (!res.ok) throw new Error("Ошибка сервера");

      showToast("Статус обновлён!", "success");
    } catch (err) {
      console.error(err);
      showToast("Ошибка при обновлении статуса", "danger");
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;

    let episodesToSave = progress;

    if (newStatus === "completed") {
      episodesToSave = anime.episodes_total;
      setProgress(anime.episodes_total);
    }

    setWatchStatus(newStatus);
    saveStatus(newStatus, episodesToSave);
  };

  const updateWatchedEpisodes = async (newEpisodes) => {
    if (!user) {
      showToast("Пожалуйста, войдите в систему", "danger");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3001/api/users/${user.id}/anime-status/${id}/episodes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ progress: newEpisodes }),
        }
      );

      if (!res.ok) throw new Error("Ошибка сервера");

      setProgress(newEpisodes);
      showToast("Количество просмотренных серий обновлено!", "success");
    } catch (err) {
      console.error(err);
      showToast("Ошибка при обновлении серий", "danger");
    }
  };

  const addReview = async (reviewText) => {
    if (!user) {
      showToast("Пожалуйста, войдите в систему", "danger");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3001/api/users/${user.id}/reviews/anime/${id}/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            content: reviewText,
          }),
        }
      );

      if (!res.ok) throw new Error("Ошибка сервера");

      showToast("Отзыв успешно добавлен!", "success");
    } catch (err) {
      console.error(err);
      showToast("Ошибка при добавлении отзыва", "danger");
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

              <div className="Anime-status-box">
                <div className="Anime-status-title">Статус просмотра</div>

                <select
                  className="Anime-status-select"
                  value={watchStatus}
                  onChange={handleStatusChange}
                >
                  <option value="watching">Смотрю</option>
                  <option value="completed">Просмотрено</option>
                  <option value="planned">В планах</option>
                  <option value="dropped">Отложено</option>
                </select>

                {watchStatus === "watching" && (
                  <div className="Episodes-box">
                    <div className="Anime-status-title">Просмотрено серий:</div>
                    <div className="Episodes-controls">
                      <button
                        className="Episode-btn"
                        onClick={() =>
                          updateWatchedEpisodes(Math.max(0, progress - 1))
                        }
                      >
                        -
                      </button>

                      <input
                        type="number"
                        className="Episodes-input"
                        value={progress}
                        onChange={(e) =>
                          updateWatchedEpisodes(
                            Math.min(
                              Math.max(0, Number(e.target.value)),
                              anime.episodes_total
                            )
                          )
                        }
                        min="0"
                        max={anime.episodes_total}
                      />

                      <button
                        className="Episode-btn"
                        onClick={() =>
                          updateWatchedEpisodes(
                            Math.min(progress + 1, anime.episodes_total)
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
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
          <div className="Anime-reviews-box">
            <div className="Anime-reviews-create">
              <div className="Anime-reviews-create-box">
                <div className="Anime-reviews-title">Добавить отзыв</div>
                <input
                  type="text"
                  className="Anime-reviews-input"
                  placeholder="Оставьте отзыв"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
                <div
                  className="Anime-reviews-create-btn"
                  onClick={() => {
                    addReview(reviewText);
                  }}
                >
                  Добавить
                </div>
              </div>
            </div>
            <PostBox anime={anime} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AnimePage;
