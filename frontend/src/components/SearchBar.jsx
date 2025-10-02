import { useState, useEffect } from "react";
import "../styles/header.css";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timeout = setTimeout(() => {
      fetch(`http://localhost:3001/search?query=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data);
          setShowDropdown(true);
        })
        .catch((err) => console.error("Ошибка поиска:", err));
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="Searchbar-box relative">
      <input
        type="text"
        className="Searchbar-input"
        placeholder="Введите название аниме..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
      />
      <div
        className="Search-icon"
        onClick={() =>
          (window.location.href = `/search?query=${encodeURIComponent(query)}`)
        }
      ></div>

      {showDropdown && results.length > 0 && (
        <ul className="Searchbar-results">
          {results.map((item) => (
            <li
              key={item.id}
              className="Searchbar-item"
              onClick={() => (window.location.href = `/anime/${item.id}`)}
            >
              <span className="Searchbar-title">{item.title}</span>
              {item.title_en && (
                <span className="Searchbar-subtitle">({item.title_en})</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
