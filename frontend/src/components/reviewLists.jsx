import { useEffect, useState } from "react";
import "../styles/contentMods.css";
import axios from "axios";
import useDebouncedState from "../hooks/useDebouncedState.jsx";

function ReviewLists() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [searchQuery, searchInput, setSearchInput] = useDebouncedState(
    "",
    1000
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3001/api/reviews", {
          params: {
            q: searchQuery,
            page,
            limit,
          },
        });
        setReviews(res.data.data || []);
        setLoading(false);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [searchQuery, page, limit]);

  if (loading) return <div>Загрузка рецензии...</div>;
  if (error) return <div>Ошибка загрузки: {error.message}</div>;

  return (
    <div className="Content-mods-page">
      <div className="Content-mods-main">
        <div className="Content-filters-box">
          <input
            type="text"
            placeholder="Поиск рецензии..."
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
          {reviews.length > 0 ? (
            reviews.map((reviews) => (
              <div className="PostBox-item" key={reviews.id}>
                <div className="PostBox-item-right">
                  <div className="PostBox-item-header">
                    <img
                      src={reviews.avatar_url}
                      alt=""
                      className="PostBox-avatar"
                      onClick={() =>
                        (window.location.href = `/user/${reviews.user_id}`)
                      }
                    />
                    <div className="PostBox-title">
                      <div
                        className="PostBox-title-text"
                        onClick={() =>
                          (window.location.href = `/anime/${reviews.item_id}`)
                        }
                      >
                        {reviews.anime_title}
                      </div>

                      <div
                        className="PostBox-username"
                        onClick={() =>
                          (window.location.href = `/user/${reviews.user_id}`)
                        }
                      >
                        от {reviews.username}
                      </div>
                    </div>
                  </div>

                  <div className="PostBox-text">{reviews.content}</div>
                </div>

                <div className="PostBox-item-left">
                  <img
                    src={reviews.anime_poster}
                    alt=""
                    className="PostBox-image"
                    onClick={() =>
                      (window.location.href = `/anime/${reviews.item_id}`)
                    }
                  />
                  <div className="PostBox-date">
                    {reviews.created_at?.slice(0, 10)}
                  </div>
                </div>
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

export default ReviewLists;
