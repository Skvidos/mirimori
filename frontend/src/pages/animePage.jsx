import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function AnimePage() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/anime/${id}`)
      .then((res) => res.json())
      .then((data) => setAnime(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!anime) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>{anime.title}</h1>
      <img src={anime.poster_url} alt={anime.title} />
      <p>Тип: {anime.type}</p>
      <p>Эпизодов: {anime.episodes_total}</p>
      <p>Описание: {anime.description}</p>
    </div>
  );
}

export default AnimePage;
