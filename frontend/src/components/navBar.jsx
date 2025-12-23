import "../styles/navbar.css";

function NavBar() {
  const navItems = [
    { label: "Аниме", link: "/anime" },
    { label: "Манга", link: "/manga" },
    { label: "Рецензии", link: "/reviews" },
    { label: "Пользователи", link: "/users" },
    { label: "Новости", link: "/news" },
    { label: "О сайте", link: "#" },
  ];
  return (
    <nav className="Nav-bar">
      <div className="Web-border">
        <div className="Nav-bar-items">
          {navItems.map((item, index) => (
            <a key={index} href={item.link} className="Nav-bar-item">
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
