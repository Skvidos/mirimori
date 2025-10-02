import React from "react";
import "../styles/navbar.css";
import { Link } from "react-router-dom";

function NavBar() {
  const navItems = [
    { label: "Аниме", link: "#" },
    { label: "Манга", link: "#" },
    { label: "Ранобэ", link: "#" },
    { label: "Рецензии", link: "#" },
    { label: "Пользователи", link: "#" },
    { label: "Новости", link: "#" },
    { label: "О сайте", link: "#" },
  ];
  return (
    <nav className="Nav-bar">
      <div className="Web-border">
        <div className="Nav-bar-items">
          {navItems.map((item, index) => (
            <Link key={index} href={item.link} className="Nav-bar-item">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
