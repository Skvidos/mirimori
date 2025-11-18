import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/statistics.css";

function UserStats({ userId }) {
  const [animeStats, setAnimeStats] = useState({});
  const [mangaStats, setMangaStats] = useState({});
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    fetchStats();
    fetchTime();
  }, [userId]);

  const fetchStats = async () => {
    const anime = await axios.get(
      `http://localhost:3001/api/stats/anime/${userId}`
    );
    const manga = await axios.get(
      `http://localhost:3001/api/stats/manga/${userId}`
    );
    setAnimeStats(anime.data);
    setMangaStats(manga.data);
  };

  const fetchTime = async () => {
    const res = await axios.get(
      `http://localhost:3001/api/stats/time/${userId}`
    );
    setTotalTime(res.data.total_minutes);
  };

  const formatTime = (min) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h} часов ${m} минут`;
  };

  return (
    <div className="user-stats">
      <div className="stats-title">
        Время за просмотром аниме — {formatTime(totalTime)}
      </div>

      <div className="stats-block">
        <div className="stats-title">Аниме</div>
        <div className="stats-grid">
          <div className="stats-item planned">
            <div className="label">Запланировано</div>
            <div className="count">{animeStats.planned || 0}</div>
          </div>
          <div className="stats-item watching">
            <div className="label">Смотрю</div>
            <div className="count">{animeStats.watching || 0}</div>
          </div>
          <div className="stats-item completed">
            <div className="label">Просмотрено</div>
            <div className="count">{animeStats.completed || 0}</div>
          </div>
          <div className="stats-item dropped">
            <div className="label">Брошено</div>
            <div className="count">{animeStats.dropped || 0}</div>
          </div>
        </div>
      </div>

      <div className="stats-block">
        <div className="stats-title">Манга</div>
        <div className="stats-grid">
          <div className="stats-item planned">
            <div className="label">Запланировано</div>
            <div className="count">{mangaStats.planned || 0}</div>
          </div>
          <div className="stats-item watching">
            <div className="label">Читаю</div>
            <div className="count">{mangaStats.watching || 0}</div>
          </div>
          <div className="stats-item completed">
            <div className="label">Прочитано</div>
            <div className="count">{mangaStats.completed || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserStats;
