import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import NavBar from "../components/navBar";
import "../styles/register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setMessage("Заполните все поля!");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Регистрация успешна! Перенаправление на страницу входа...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage(data.error || "Ошибка при регистрации");
      }
    } catch (err) {
      console.error(err);
      setMessage("Ошибка соединения с сервером");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3001/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) setUser(data);
        })
        .catch((err) => console.error("Ошибка проверки токена:", err));
    }
  }, []);

  return (
    <div className="Register-page">
      <div className="Register-page-header">
        <Header
          userLoggedIn={!!user}
          userAvatar={user?.avatar_url}
          userName={user?.username}
          userPermission={{ isAdmin: user?.isAdmin, isMods: user?.isMods }}
        ></Header>
        <NavBar></NavBar>
      </div>
      <div className="Register-page-main">
        <div className="Web-border">
          <div className="Register-page-main-content">
            <div className="Register-title">Регистрация</div>
            <form onSubmit={handleRegister} className="Register-form">
              <input
                type="text"
                placeholder="Имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="Register-input"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="Register-input"
              />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="Register-input"
              />
              <button type="submit" className="Register-form-button">
                Зарегистрироваться
              </button>
            </form>
            {message && <p className="Register-message">{message}</p>}
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Register;
