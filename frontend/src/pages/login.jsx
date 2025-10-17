import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import NavBar from "../components/navBar";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        setMessage("Вход успешен!");

        setTimeout(() => navigate("/"), 1000);
      } else {
        setMessage(data.error || data.message || "Ошибка входа");
      }
    } catch (err) {
      console.error(err);
      setMessage("Ошибка сервера");
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
    <div className="Login-page">
      <div className="Login-page-header">
        <Header
          userLoggedIn={!!user}
          userAvatar={user?.avatar_url}
          userName={user?.username}
        ></Header>
        <NavBar></NavBar>
      </div>
      <div className="Login-page-main">
        <div className="Web-border">
          <div className="Login-page-main-content">
            <div className="Login-title">Вход</div>
            <form onSubmit={handleLogin} className="Login-form">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="Login-input"
              />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="Login-input"
              />
              <button type="submit" className="Login-form-button">
                Войти
              </button>
              <button
                type="button"
                className="Login-form-button"
                onClick={() => navigate("/register")}
              >
                Регистрация
              </button>
            </form>
            <p>{message}</p>
          </div>
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
}

export default Login;
