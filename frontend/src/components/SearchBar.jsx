import { useState, useEffect } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    console.log(query);

    const timeout = setTimeout(() => {
      fetch(`http://localhost:3001/search?query=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => setResults(data))
        .catch((err) => console.error("Ошибка поиска:", err));
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="relative w-80">
      <input
        type="text"
        className="w-full border rounded p-2"
        placeholder="Введите запрос..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 bg-white border rounded mt-1 shadow-lg z-10">
          {results.map((item) => (
            <li
              key={item.id}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => alert(`Открыть: ${item.title}`)}
            >
              {item.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
