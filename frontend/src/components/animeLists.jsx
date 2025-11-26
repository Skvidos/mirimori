import { useEffect, useState } from "react";
import Poster from "../assests/img/anime.png";
import "../styles/contentMods.css";
import axios from "axios";
import useDebouncedState from "../hooks/useDebouncedState.jsx";

function AnimeLists() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anime, setAnime] = useState([]);
  const [searchQuery, searchInput, setSearchInput] = useDebouncedState(
    "",
    1000
  );
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3001/api/anime", {
          params: {
            q: searchQuery,
            type: filterType,
            status: filterStatus,
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

    fetchAnime();
  }, [searchQuery, filterType, filterStatus, sortOrder, page, limit]);

  if (loading) return <div>Загрузка аниме...</div>;
  if (error) return <div>Ошибка загрузки: {error.message}</div>;

  return (
    <div className="Content-mods-page">
      <div className="Content-mods-main">
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

export default AnimeLists;
