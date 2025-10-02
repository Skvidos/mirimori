import React from "react";
import { Link } from "react-router-dom";
import Poster from "../assests/img/anime.png";

function Slider({ title, items }) {
  return (
    <div className="Slider-block">
      <div className="Title">{title}</div>
      <div className="Slider">
        {items.length > 0 ? (
          items.map((anime) => (
            <div key={anime.id} className="Slider-item">
              <Link to={`/anime/${anime.id}`}>
                <img src={anime.poster_url || Poster} alt={anime.title} />
              </Link>
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
