import { useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import NavBar from "../components/navBar";
import "../styles/about.css";

function About() {
  useEffect(() => {
    document.title = "О сайте — Mirimori";
  }, []);

  return (
    <div className="About-page">
      <Header />
      <NavBar />

      <div className="About-page-main Web-border">
        <h1 className="About_title">О сайте Mirimori</h1>

        <section className="About-section">
          <h2 className="About_subtitle">Цель проекта</h2>
          <p className="About-text">
            Mirimori — это экосистема управления личной цифровой жизнью, которая
            помогает пользователям удобно отслеживать просмотренное аниме,
            читать мангу, оставлять отзывы, оценивать тайтлы и вести собственные
            списки.
          </p>
        </section>

        <section className="About-section">
          <h2 className="About_subtitle">Особенности платформы</h2>
          <ul className="About-text">
            <li>Каталог аниме и манги с подробной информацией о тайтлах.</li>
            <li>
              Персональные списки: «Просматриваю», «В планах», «Завершено».
            </li>
            <li>Система рейтингов и отзывов от пользователей.</li>
            <li>Удобный поиск и фильтры по жанрам, типу и статусу.</li>
            <li>
              Динамическое управление личными данными и настройками профиля.
            </li>
          </ul>
        </section>

        <section className="About-section">
          <h2 className="About_subtitle">Команда и контакты</h2>
          <p className="About-text">Разработчик: Павел Стешин</p>
          <p className="About-text">
            Email:{" "}
            <a href="mailto:steshinpavel14@gmail.com" className="About-link">
              steshinpavel14@gmail.com
            </a>
          </p>
          <p className="About-text">
            GitHub:{" "}
            <a
              href="https://github.com/skvidos"
              target="_blank"
              rel="noopener noreferrer"
              className="About-link"
            >
              github.com/skvidos
            </a>
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default About;
