import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";
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
  const { user, setUser } = useContext(UserContext);

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

  return (
    <div className="Register-page">
      <div className="Register-page-header">
        <Header />
        <NavBar />
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
            {message && (
              <p className="Register-message">
                {typeof message === "string"
                  ? message
                  : message.sqlMessage || "Ошибка на сервере"}
              </p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Register;
