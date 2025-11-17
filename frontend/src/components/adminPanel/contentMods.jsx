import { useEffect, useState } from "react";
import Poster from "../../assests/img/anime.png";
import "../../styles/contentMods.css";
import Edit from "../../assests/svg/wrench-solid-full.svg";
import Delete from "../../assests/svg/ban-solid-full.svg";
import Modal from "./modalEditAnime";
import axios from "axios";
import useDebouncedState from "../../hooks/useDebouncedState.jsx";

function ContentMods() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [anime, setAnime] = useState([]);
  const [searchQuery, searchInput, setSearchInput] = useDebouncedState(
    "",
    1000
  );
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [editAnime, setEditAnime] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchAnime = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3001/api/anime", {
        params: {
          q: searchQuery,
          type: filterType,
          status: filterStatus,
          year: filterYear,
          sort: sortOrder,
          page,
          limit,
        },
      });

      setAnime(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnime();
  }, [searchQuery, filterType, filterStatus, filterYear, sortOrder, page]);

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
  if (error) return <div>Ошибка загрузки: {error.message}</div>;

  return (
    <div className="Content-mods-page">
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
      {editAnime && (
        <Modal
          anime={editAnime}
          onClose={() => setEditAnime(null)}
          onSave={fetchAnime}
        />
      )}
      <div className="Content-mods-main">
        <div className="Title-admin">Модерация контента</div>

        <div className="Content-filters-box">
          <input
            type="text"
            placeholder="Поиск аниме..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
            className="Content-search-input"
          />

          <div className="Content-sort-box">
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setPage(1);
              }}
              className="Content-filter-select"
            >
              <option value="">Все типы</option>
              <option value="TV">TV</option>
              <option value="Movie">Movie</option>
              <option value="OVA">OVA</option>
              <option value="ONA">ONA</option>
              <option value="Special">Special</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className="Content-filter-select"
            >
              <option value="">Все статусы</option>
              <option value="released">Вышло</option>
              <option value="ongoing">Онгоинг</option>
              <option value="upcoming">Анонс</option>
            </select>

            <input
              type="number"
              placeholder="Год"
              value={filterYear}
              onChange={(e) => {
                setFilterYear(e.target.value);
                setPage(1);
              }}
              className="Content-filter-input"
            />

            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setPage(1);
              }}
              className="Content-filter-select"
            >
              <option value="asc">ID ↑</option>
              <option value="desc">ID ↓</option>
            </select>
          </div>
        </div>

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
                      onClick={() => setEditAnime(item)}
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

        <div className="Pagination-box">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (num) =>
                num === 1 ||
                num === totalPages ||
                (num >= page - 2 && num <= page + 2)
            )
            .map((num, index, array) => (
              <span key={num} className="Pagination-pages">
                {index > 0 && array[index - 1] !== num - 1 && (
                  <span className="dots">...</span>
                )}
                <div
                  className={`page-btn ${num === page ? "active" : ""}`}
                  onClick={() => setPage(num)}
                >
                  {num}
                </div>
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ContentMods;
