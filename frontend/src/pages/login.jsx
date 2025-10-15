import React, { use, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

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

  return (
    <div style={styles.container}>
      <h2>Вход</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Войти
        </button>
      </form>
      <p style={styles.message}>{message}</p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "300px",
    margin: "100px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    textAlign: "center",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
  form: { display: "flex", flexDirection: "column" },
  input: {
    margin: "10px 0",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "10px",
    background: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  message: { marginTop: "10px", color: "red" },
};

export default Login;
