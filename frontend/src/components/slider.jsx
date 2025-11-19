import { useRef, useState, useEffect } from "react";
import Poster from "../assests/img/anime.png";
import LeftArrow from "../assests/svg/angle-left-solid-full.svg";
import RightArrow from "../assests/svg/angle-right-solid-full.svg";
import "../styles/slider.css";

function Slider({ title, items, count }) {
  const sliderRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateArrows = () => {
    if (!sliderRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setShowLeft(scrollLeft > 0);
    setShowRight(scrollLeft + clientWidth < scrollWidth);
  };

  const scrollLeftFunc = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRightFunc = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  useEffect(() => {
    updateArrows();
    const slider = sliderRef.current;
    if (!slider) return;

    const handleScroll = () => updateArrows();
    slider.addEventListener("scroll", handleScroll);

    return () => slider.removeEventListener("scroll", handleScroll);
  }, [items]);

  const showArrows = items.length > count;

  return (
    <div className="Slider-block">
      <div className="Title">{title}</div>
      <div className="Slider-container">
        {showArrows && showLeft && (
          <div className="Slider-arrow left" onClick={scrollLeftFunc}>
            <img src={LeftArrow} alt="" className="Slider-Arrow-img" />
          </div>
        )}
        <div className="Slider" ref={sliderRef}>
          {items?.length > 0 ? (
            items.map((anime) => (
              <div
                key={anime.id}
                className="Slider-item"
                onClick={() => (window.location.href = `/anime/${anime.id}`)}
                style={{
                  minWidth: `calc((100% - 50px) / ${count})`,
                }}
              >
                <img
                  src={anime.poster ? anime.poster : Poster}
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
        {showArrows && showRight && (
          <div className="Slider-arrow right" onClick={scrollRightFunc}>
            <img src={RightArrow} alt="" className="Slider-Arrow-img" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Slider;
