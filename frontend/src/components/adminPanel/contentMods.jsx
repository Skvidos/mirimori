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
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchAnime = async (query = "", currentPage = 1) => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3001/api/anime", {
        params: { q: query, page: currentPage, limit },
      });

      setAnime(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  // 🔄 При первой загрузке
  useEffect(() => {
    fetchAnime(searchQuery, page);
  }, [page]);

  // 🔍 Поиск с debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1); // сбрасываем на первую страницу при поиске
      fetchAnime(searchQuery, 1);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // 🗑 Удаление аниме
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/anime/${id}/delete`);
      showToast("Аниме удалено", "success");
      fetchAnime(searchQuery, page); // обновляем текущую страницу
    } catch (err) {
      showToast("Ошибка при удалении аниме", "error");
    }
  };

  if (loading) return <div>Загрузка аниме...</div>;
  if (error) return <div>Ошибка загрузки: {error.message}</div>;

  return (
    <div className="Content-mods-page">
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
      <div className="Content-mods-main">
        <div className="Title-admin">Модерация контента</div>

        {/* 🔍 Поиск */}
        <div className="Content-search-box">
          <input
            type="text"
            placeholder="Поиск аниме по названию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="Content-search-input"
          />
        </div>

        {/* 📦 Контент */}
        <div className="Content-mods-inner">
          {anime.length > 0 ? (
            anime.map((item) => (
              <div key={item.id} className="Content-mods-item">
                <div
                  className="Content-mods-info-box"
                  onClick={() => (document.location = `/anime/${item.id}`)}
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
                      onClick={() =>
                        (document.location = `/adminpanel/editanime/${item.id}`)
                      }
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
          ) : (
            <div className="no-results">Аниме не найдено</div>
          )}
        </div>

        {/* 📄 Пагинация */}
        <div className="Pagination-box">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (num) =>
                num === 1 ||
                num === totalPages ||
                (num >= page - 2 && num <= page + 2)
            )
            .map((num, index, array) => (
              <>
                {index > 0 && array[index - 1] !== num - 1 && (
                  <span className="dots">...</span>
                )}
                <div
                  key={num}
                  className={`page-btn ${num === page ? "active" : ""}`}
                  onClick={() => setPage(num)}
                >
                  {num}
                </div>
              </>
            ))}
          <div
            className="next-btn"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            →
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentMods;
