import { useEffect, useState } from "react";
import "../styles/contentMods.css";
import axios from "axios";
import useDebouncedState from "../hooks/useDebouncedState.jsx";

function NewsLists() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const [searchQuery, searchInput, setSearchInput] = useDebouncedState(
    "",
    1000
  );

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3001/api/news", {
          params: {
            q: searchQuery,
            page,
            limit,
          },
        });
        setNews(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchNews();
  }, [page, limit, searchQuery]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p className="error">Ошибка: {error}</p>;

  return (
    <div className="Content-mods-page">
      <div className="Content-mods-main">
        <div className="Content-filters-box">
          <input
            type="text"
            placeholder="Поиск новостей..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
            className="Content-search-input"
          />
        </div>
        .
        <div className="Content-mods-inner">
          {news.length > 0 ? (
            news.map((news) => (
              <div key={news.id} className="News-item">
                <div className="News-Title">{news.title}</div>
                <div className="News-Content">{news.content}</div>
                <img src={news.image} alt={news.title} className="News-Image" />
              </div>
            ))
          ) : (
            <div className="no-results">Результаты не найдены</div>
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
export default NewsLists;
