import { useEffect, useState } from "react";
import ModalAddNews from "./modalAddNews";
import Delete from "../../assests/svg/ban-solid-full.svg";

import axios from "axios";

import "../../styles/addnews.css";

function AddNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState(null);

  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const [addNews, setAddNews] = useState(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3001/api/news");
      setNews(res.data || []);
      setLoading(false);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setToast({ message: err.message, type: "error" });
      setLoading(false);
    }
  };

  const deleteNews = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/news/${id}`);
      showToast("Новость успешно удалена!", "success");
      fetchNews();
    } catch (err) {
      console.error("Ошибка при удалении новости:", err);
      showToast("Ошибка при удалении новости", "danger");
    }
  };

  const searchNews = async (query) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/news?q=${query}`);
      setNews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="AddNews-page">
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
      {addNews && <ModalAddNews news={{}} onClose={() => setAddNews(false)} />}

      <div className="Title-admin">Добавление новостей</div>

      <div className="AddNews-filter">
        <input
          type="text"
          placeholder="Поиск по заголовкам"
          onChange={(e) => searchNews(e.target.value)}
          className="AddNews-search"
        />

        <div
          className="AddNews-button"
          onClick={() => {
            setAddNews(true);
          }}
        >
          Добавить новость
        </div>
      </div>

      <div className="News-list">
        {news.length > 0 ? (
          news.map((item) => (
            <div key={item.id} className="News-item">
              <div className="Delete-News" onClick={() => deleteNews(item.id)}>
                <img src={Delete} alt="Delete" className="Delete-img" />
              </div>
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
          <p>Новостей пока нет</p>
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

export default AddNews;
