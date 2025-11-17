import React, { useState, useEffect } from "react";
import axios from "axios";

function StarRating({ animeId, userId }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [avgRating, setAvgRating] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    if (userId) {
      axios
        .get(`/api/ratings/${userId}/${animeId}`)
        .then((res) => setRating(res.data.rating || 0))
        .catch(() => {});
    }

    updateAverageRating();
  }, [userId, animeId]);

  const updateAverageRating = () => {
    axios
      .get(`/api/anime/${animeId}/average-rating`)
      .then((res) => {
        setAvgRating(Number(res.data.avg_rating).toFixed(1));
        setTotalVotes(res.data.total);
      })
      .catch(() => {});
  };

  const handleRating = async (value) => {
    if (!userId) {
      alert("Войдите в систему, чтобы поставить оценку!");
      return;
    }

    setRating(value);

    await axios.post("/api/ratings", { userId, animeId, rating: value });

    updateAverageRating();
  };

  return (
    <div className="Anime-rating-stars-items">
      <div className="Anime-rating-stars-item">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => handleRating(star)}
            onMouseEnter={() => userId && setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="Stars"
            style={{
              color: star <= (hover || rating) ? "#FFD700" : "#CCC",
              cursor: userId ? "pointer" : "not-allowed",
              transition: "color 0.2s, transform 0.1s",
              transform: star === hover && userId ? "scale(1.2)" : "scale(1.0)",
              opacity: userId ? 1 : 0.5,
            }}
            title={
              userId ? `Поставить ${star}★` : "Войдите, чтобы поставить оценку"
            }
          >
            ★
          </span>
        ))}
      </div>

      {avgRating !== null && <div className="Anime-rating">{avgRating}</div>}
    </div>
  );
}

export default StarRating;
