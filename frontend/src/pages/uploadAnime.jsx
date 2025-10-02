import React, { useState } from "react";
import axios from "axios";

function UploadAnime() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "TV",
    episodes_total: 0,
    studio: "",
    source: "",
    poster: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "poster") setForm({ ...form, poster: files[0] });
    else setForm({ ...form, [name]: value });
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

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Название"
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Описание"
        onChange={handleChange}
      />
      <input
        type="number"
        name="episodes_total"
        placeholder="Эпизодов"
        onChange={handleChange}
      />
      <input
        type="text"
        name="studio"
        placeholder="Студия"
        onChange={handleChange}
      />
      <input
        type="text"
        name="source"
        placeholder="Источник"
        onChange={handleChange}
      />
      <select name="type" onChange={handleChange}>
        <option value="TV">TV</option>
        <option value="Movie">Movie</option>
        <option value="OVA">OVA</option>
        <option value="ONA">ONA</option>
        <option value="Special">Special</option>
      </select>
      <input
        type="file"
        name="poster"
        onChange={handleChange}
        accept="image/*"
        required
      />
      <button type="submit">Добавить аниме</button>
    </form>
  );
}

export default UploadAnime;
