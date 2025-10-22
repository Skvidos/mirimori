import { useState, useRef, useEffect } from "react";
import "../../styles/uploadAnime.css";
import axios from "axios";

function UploadAnime() {
  const [form, setForm] = useState({
    title: "",
    title_jp: "",
    title_en: "",
    alt_titles: "",
    description: "",
    type: "TV",
    episodes_total: 0,
    episodes_duration: 0,
    release_date: "",
    studio: "",
    source: "",
    poster: null,
  });

  const [posterPreview, setPosterPreview] = useState(null);
  const posterInputRef = useRef(null);
  const [mounted, setMounted] = useState(false); // для безопасного рендера input

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "poster" && files && files[0]) {
      setForm({ ...form, poster: files[0] });
      setPosterPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in form) data.append(key, form[key]);

    try {
      const res = await axios.post("http://localhost:3001/anime/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Аниме добавлено! ID: " + res.data.id);
    } catch (err) {
      console.error(err);
      alert("Ошибка при добавлении аниме");
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
    { name: "episodes_total", placeholder: "Эпизодов", type: "number" },
    {
      name: "episodes_duration",
      placeholder: "Длительность эпизода",
      type: "number",
    },
    { name: "release_date", placeholder: "Дата выхода", type: "date" },
    { name: "studio", placeholder: "Студия", type: "text" },
    { name: "source", placeholder: "Источник", type: "text" },
  ];

  return (
    <div className="Upload-page">
      <div className="Upload-page-main">
        <div className="Title-admin">Добавление аниме</div>
        <form onSubmit={handleSubmit} className="Upload-form">
          <div className="Upload-main">
            <div className="Upload-inputs">
              {inputFields.map(({ name, placeholder, type, required }) => (
                <input
                  key={name}
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  onChange={handleChange}
                  required={required}
                  className="Upl"
                />
              ))}

              <textarea
                name="description"
                placeholder="Описание"
                onChange={handleChange}
              />

              <select name="type" onChange={handleChange}>
                <option value="TV">TV</option>
                <option value="Movie">Movie</option>
                <option value="OVA">OVA</option>
                <option value="ONA">ONA</option>
                <option value="Special">Special</option>
              </select>

              <button type="submit">Добавить аниме</button>
            </div>

            <div
              className="Upload-poster"
              onClick={() => {
                if (posterInputRef.current) posterInputRef.current.click();
              }}
            >
              {posterPreview ? (
                <img
                  src={posterPreview}
                  alt="Poster preview"
                  className="Poster-preview"
                />
              ) : (
                <div className="Poster-placeholder">
                  Нажмите, чтобы выбрать постер
                </div>
              )}
              {mounted && (
                <input
                  type="file"
                  name="poster"
                  ref={posterInputRef}
                  onChange={handleChange}
                  accept="image/*"
                  style={{ display: "none" }}
                  required
                />
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadAnime;
