import Poster from "../assests/img/anime.png";

function Slider({ title, items }) {
  return (
    <div className="Slider-block">
      <div className="Title">{title}</div>
      <div className="Slider">
        {items.length > 0 ? (
          items.map((anime) => (
            <div
              key={anime.id}
              className="Slider-item"
              onClick={() => (window.location.href = `/anime/${anime.id}`)}
            >
              <img
                src={anime.poster ? `${anime.poster}` : Poster}
                alt={anime.title}
                className="Anime-poster"
              />
              <div className="Anime-title">{anime.title}</div>
              <div className="Anime-type">{anime.type || "TV"}</div>
            </div>
          ))
        ) : (
          <div className="Empty">Нет данных</div>
        )}
      </div>
    </div>
  );
}

export default Slider;
