import { useEffect, useState } from "react";
import Poster from "../../assests/img/anime.png";
import "../../styles/contentMods.css";
import Edit from "../../assests/svg/wrench-solid-full.svg";
import Delete from "../../assests/svg/ban-solid-full.svg";
import axios from "axios";

function ContentMods() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [anime, setAnime] = useState([]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    fetchAnime();
  }, []);

  const fetchAnime = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/anime");
      setAnime(res.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/anime/${id}/delete`);
      showToast("Аниме удалено", "success");
      fetchAnime();
    } catch (err) {
      showToast("Ошибка при удалении аниме", "error");
    }
  };

  if (loading) return <div>Загрузка аниме...</div>;
  if (error) return <div>Ошибка загрузки аниме: {error.message}</div>;

  return (
    <div className="Content-mods-page">
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
      <div className="Content-mods-main">
        <div className="Title-admin">Модерация контента</div>
        <div className="Content-mods-inner">
          {anime
            .map((item) => (
              <div key={item.id} className="Content-mods-item">
                <div
                  className="Content-mods-info-box"
                  onClick={() => {
                    document.location = `/anime/${item.id}`;
                  }}
                >
                  <img
                    src={item.poster ? `${item.poster}` : Poster}
                    alt={item.title}
                    className="Content-mods-item-poster"
                  />
                  <div className="Content-mods-item-info">
                    <div className="Content-mods-item-title">{item.title}</div>
                    <div className="Content-mods-item-id">ID: {item.id}</div>
                    <div className="Content-mods-item-type">{item.type}</div>
                    <div className="Content-mods-item-release">
                      {item.release}
                    </div>
                  </div>
                </div>

                <div className="Content-mods-item-actions">
                  <div className="Content-mods-action-button edit">
                    <img
                      src={Edit}
                      alt="Редактировать"
                      width={25}
                      height={25}
                      onClick={() => {
                        document.location = `/adminpanel/editanime/${item.id}`;
                      }}
                    />
                  </div>
                  <div
                    className="Content-mods-action-button delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    <img src={Delete} alt="Удалить" width={25} height={25} />
                  </div>
                </div>
              </div>
            ))
            .reverse()}
        </div>
      </div>
    </div>
  );
}

export default ContentMods;
