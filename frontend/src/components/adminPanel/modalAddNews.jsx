import { useState, useEffect, useRef } from "react";
import "../../styles/modal.css";

import axios from "axios";

function ModalAddNews({ news, onClose }) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const imageInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("content", form.content);

      if (form.image) {
        formData.append("image", form.image);
      }

      await axios.post("http://localhost:3001/api/news/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("Новость успешно добавлена", "success");
    } catch (err) {
      console.error("Ошибка при добавлении новости:", err);
      showToast("Ошибка при добавлении новости", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Modal-overlay">
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
      <div className="Modal-content">
        <div className="Title">Добавление новости</div>
        <div className="Modal-content-box">
          <div className="Modal-left">
            <input
              type="text"
              name="title"
              placeholder="Заголовок"
              value={form.title}
              onChange={handleChange}
              required={true}
              className="Modal-input"
            />
            <textarea
              type="text"
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Описание"
              className="Modal-textarea"
            />
            <div
              className="UploadImage"
              onClick={() =>
                imageInputRef.current && imageInputRef.current.click()
              }
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="Image-preview"
                />
              ) : (
                <div className="Image-placeholder">
                  Нажмите, чтобы выбрать изображение
                </div>
              )}
              {mounted && (
                <input
                  type="file"
                  name="image"
                  ref={imageInputRef}
                  onChange={handleChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              )}
            </div>
          </div>
          <div className="Modal-right second">
            <div
              className="Modal-button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Сохранение..." : "Сохранить"}
            </div>
            <div className="Modal-button" onClick={onClose}>
              Закрыть
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalAddNews;
