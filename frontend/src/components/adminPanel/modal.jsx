import { useState, useRef, useEffect } from "react";
import "../../styles/modal.css";
import axios from "axios";

function Modal({ anime, onClose }) {
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
    poster: null,
  });

  const [posterPreview, setPosterPreview] = useState(anime.poster || null);
  const posterInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "poster" && files && files[0]) {
      const file = files[0];
      setForm((prev) => ({ ...prev, poster: file }));
      setPosterPreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = new FormData();

      for (let key in form) {
        if (key !== "poster" && form[key] !== null && form[key] !== undefined) {
          data.append(key, form[key]);
        }
      }

      if (form.poster) {
        data.append("poster", form.poster);
      }

      await axios.put(
        `http://localhost:3001/api/anime/${anime.id}/edit`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      showToast("Аниме успешно обновлено!", "success");
    } catch (err) {
      console.error("Ошибка при обновлении аниме:", err);
      showToast("Ошибка при обновлении аниме", "danger");
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { name: "title", placeholder: "Название", type: "text", required: true },
    {
      name: "title_jp",
      placeholder: "Название на японском",
      type: "text",
      required: true,
    },
    {
      name: "title_en",
      placeholder: "Название на английском",
      type: "text",
      required: true,
    },
    { name: "alt_titles", placeholder: "Другие названия", type: "text" },
    {
      name: "episodes_total",
      placeholder: "Эпизодов",
      type: "number",
      required: true,
    },
    {
      name: "episodes_duration",
      placeholder: "Длительность эпизода",
      type: "number",
      required: true,
    },
    { name: "release_date", placeholder: "Дата выхода", type: "date" },
    { name: "studio", placeholder: "Студия", type: "text" },
    { name: "source", placeholder: "Источник", type: "text" },
  ];

  return (
    <div className="Modal-overlay">
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
      <div className="Modal-content">
        <div className="Title">Редактирование аниме</div>
        <div className="Modal-content-box">
          <div className="Modal-left">
            {inputFields.map((field) => (
              <input
                key={field.name}
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
                required={field.required}
                className="Modal-input"
              />
            ))}
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
          </div>

          <div className="Modal-right">
            <div
              className="Modal-poster"
              onClick={() => posterInputRef.current?.click()}
            >
              {posterPreview ? (
                <img
                  src={posterPreview}
                  alt="Poster preview"
                  className="Modal-poster-preview"
                />
              ) : (
                <div className="Poster-placeholder">
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

export default Modal;
