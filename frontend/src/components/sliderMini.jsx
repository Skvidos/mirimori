import Poster from "../assests/img/anime.png";

function SliderMini({ items, count = 5 }) {
  const itemHeight = 100;
  const containerHeight = Math.min(items.length, count) * itemHeight;

  return (
    <div className="SliderMini-block">
      <div
        className="Slider-mini"
        style={{
          maxHeight: `${containerHeight}px`,
          overflowY: items.length > count ? "auto" : "hidden",
        }}
      >
        {items.length > 0 ? (
          items.map((anime) => (
            <div
              key={anime.id}
              className="SliderMini-item"
              onClick={() => (window.location.href = `/anime/${anime.id}`)}
            >
              <img
                src={anime.poster ? anime.poster : Poster}
                alt={anime.title}
                className="Anime-poster-mini"
              />
              <div className="Anime-info-mini">
                <div className="Anime-title-mini">{anime.title}</div>
                <div className="Anime-type">{anime.type || "TV"}</div>
                <div className="Anime-addDate">
                  {anime.created_at.slice(0, 10)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="Empty">Нет данных</div>
        )}
      </div>
    </div>
  );
}

export default SliderMini;
