import { useState, useEffect } from "react";
import "../styles/postNews.css";
import axios from "axios";

function PostNews() {
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3001/api/news");
      setNews(res.data || []);
      setLoading(false);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="postNews-box">
      <div className="News-list">
        {news.length > 0 ? (
          news.map((item) => (
            <div key={item.id} className="News-item">
              <div className="News-Title">{item.title}</div>
              <div className="News-Content">{item.content}</div>
              <img src={item.image} alt={item.title} className="News-Image" />
              <div className="News-Created">
                {item.created_at ? item.created_at.split("T")[0] : ""}
                {item.created_at
                  ? " " + item.created_at.split("T")[1].split(".")[0]
                  : ""}
              </div>
            </div>
          ))
        ) : loading ? (
          <p>Загрузка новостей</p>
        ) : (
          <p>Ошибка при загрузке новостей</p>
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
  );
}

export default PostNews;
