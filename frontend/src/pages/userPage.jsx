import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../components/UserContext";
import Header from "../components/header";
import Footer from "../components/footer";
import NavBar from "../components/navBar";
import Poster from "../assests/img/anime.png";
import "../styles/userPage.css";
import StarRating from "../components/StarRating";
import SliderMini from "../components/sliderMini";
import UserStats from "../components/statistics";

function UserPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [userAnimes, setUserAnimes] = useState([]);
  const [userReviews, setUserReviews] = useState([]);

  const { user: currentUser } = useContext(UserContext);

  useEffect(() => {
    fetch(`http://localhost:3001/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:3001/api/users/${id}/animes`)
      .then((res) => res.json())
      .then((data) => setUserAnimes(data))
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:3001/api/users/${id}/reviews`)
      .then((res) => res.json())
      .then((data) => setUserReviews(data))
      .catch((err) => console.error(err));
  }, [id]);

  const formatAge = (age) => {
    if (age === null || age === undefined) return "";
    const n = Math.abs(Number(age));
    const lastTwo = n % 100;
    if (lastTwo >= 11 && lastTwo <= 14) return `${age} лет`;
    const last = n % 10;
    if (last === 1) return `${age} год`;
    if (last >= 2 && last <= 4) return `${age} года`;
    return `${age} лет`;
  };

  return user ? (
    <div className="User-page">
      <div className="User-page-header">
        <Header />
        <NavBar />
      </div>

      <div className="User-page-main">
        <div className="Web-border">
          <div className="User-page-container">
            <div className="User-page-left">
              <div className="Title">{user.username}</div>
              <img
                className="User-avatar-box"
                src={user.avatar_url}
                alt="user-avatar"
              />
              <div className="User-info-box">
                <span className="User-sex">
                  {user.sex === "male" ? "Муж." : "Женск."}
                </span>
                <span className="User-age">{formatAge(user.age)}</span>
              </div>
              <div className="User-registration">
                Дата регистрации: {user.created_at.slice(0, 10)}
              </div>
            </div>

            <div className="User-page-content">
              <UserStats userId={id} />
            </div>

            <div className="User-page-right">
              <div className="User-animes-section">
                <div className="User-animes-title">История</div>
                <SliderMini items={userAnimes} itemType="anime" />
              </div>
            </div>
            {/* <div className="User-reviews-section">
              <h2>Отзывы пользователя</h2>
              {userReviews.length > 0 ? (
                userReviews.map((review) => (
                  <div key={review.id} className="User-review-item">
                    <div className="User-review-item-title">{review.title}</div>
                    <div className="User-review-item-content">
                      {review.content}
                    </div>
                    <div className="User-review-item-rating">
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="Empty">Нет данных</div>
              )}
            </div> */}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  ) : (
    <div>Загрузка...</div>
  );
}

export default UserPage;
