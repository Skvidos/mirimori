import { useState, useRef, useEffect } from "react";
import "../../styles/modal.css";
import axios from "axios";

function EditAnimeModal({ anime, onClose, onUpdate }) {
  const [form, setForm] = useState({
    title: anime.title || "",
    title_jp: anime.title_jp || "",
    title_en: anime.title_en || "",
    alt_titles: anime.alt_titles || "",
    description: anime.description || "",
    type: anime.type || "TV",
    status: anime.status || "",
    episodes_total: anime.episodes_total || 0,
    episodes_duration: anime.episodes_duration || 0,
    release_date: anime.release_date || "",
    studio: anime.studio || "",
    source: anime.source || "",
    poster: anime.poster || null,
  });

  const [posterPreview, setPosterPreview] = useState(anime.poster || null);
  const posterInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "poster" && files && files[0]) {
      setForm({ ...form, poster: files[0] });
      setPosterPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = new FormData();
      for (let key in form) data.append(key, form[key]);

      const res = await axios.put(
        `http://localhost:3001/api/anime/${anime.id}/edit`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (onUpdate) onUpdate(res.data); // обновляем список аниме в родителе
      onClose(); // закрываем модалку
    } catch (err) {
      console.error(err);
      setError("Ошибка при сохранении изменений");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Modal-overlay">
      <div className="Modal-content">
        <div className="Title">Редактирование аниме</div>
        {error && <div className="error">{error}</div>}
        <div className="Modal-content-box">
          <div className="Modal-left">
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Название"
              className="Modal-input"
            />
            <input
              type="text"
              name="title_jp"
              value={form.title_jp}
              onChange={handleChange}
              placeholder="Название на японском"
              className="Modal-input"
            />
            <input
              type="text"
              name="title_en"
              value={form.title_en}
              onChange={handleChange}
              placeholder="Название на английском"
              className="Modal-input"
            />
            <input
              type="text"
              name="alt_titles"
              value={form.alt_titles}
              onChange={handleChange}
              placeholder="Другие названия"
              className="Modal-input"
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Описание"
              className="Modal-textarea"
            />
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="Modal-select"
            >
              <option value="TV">TV</option>
              <option value="Movie">Movie</option>
              <option value="OVA">OVA</option>
              <option value="ONA">ONA</option>
              <option value="Special">Special</option>
            </select>
            <input
              type="text"
              name="status"
              value={form.status}
              onChange={handleChange}
              placeholder="Статус"
              className="Modal-input"
            />
            <input
              type="number"
              name="episodes_total"
              value={form.episodes_total}
              onChange={handleChange}
              placeholder="Эпизодов"
              className="Modal-input"
            />
            <input
              type="number"
              name="episodes_duration"
              value={form.episodes_duration}
              onChange={handleChange}
              placeholder="Длительность эпизода"
              className="Modal-input"
            />
            <input
              type="date"
              name="release_date"
              value={form.release_date}
              onChange={handleChange}
              className="Modal-input"
            />
            <input
              type="text"
              name="studio"
              value={form.studio}
              onChange={handleChange}
              placeholder="Студия"
              className="Modal-input"
            />
            <input
              type="text"
              name="source"
              value={form.source}
              onChange={handleChange}
              placeholder="Источник"
              className="Modal-input"
            />
          </div>
          <div className="Modal-right">
            <div
              className="Modal-poster"
              onClick={() =>
                posterInputRef.current && posterInputRef.current.click()
              }
            >
              {posterPreview ? (
                <img
                  src={posterPreview}
                  alt="Poster preview"
                  className="Modal-Poster-preview"
                />
              ) : (
                <div className="Modal-Poster-placeholder">
                  Нажмите, чтобы выбрать постер
                </div>
              )}
              <input
                type="file"
                name="poster"
                ref={posterInputRef}
                onChange={handleChange}
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>

            <div className="modal-buttons">
              <div
                className="Modal-button"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Сохраняем..." : "Сохранить"}
              </div>
              <div
                className="Modal-button"
                onClick={onClose}
                disabled={loading}
              >
                Отмена
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditAnimeModal;
