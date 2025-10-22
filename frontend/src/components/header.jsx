import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assests/logo/Logo.png";
import SearchBar from "./SearchBar";
import UsersLogo from "../assests/svg/users.svg";
import userAvatarPlaceholder from "../assests/svg/user-avatar-placeholder.svg";
import "../styles/header.css";
import { UserContext } from "../components/UserContext";

function Header() {
  const navigate = useNavigate();
  const { userLoggedIn, setUserLoggedIn, userAvatar, user } =
    useContext(UserContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isAdmin = user?.isAdmin || user?.isMods;

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserLoggedIn(false);
    setDropdownOpen(false);
    navigate("/login");
  };

  const search = (text) => {
    console.log(text);
  };

  return (
    <header className="App-header">
      <div className="Web-border">
        <div className="App-header-inner">
          <img
            src={logo}
            className="App-logo"
            alt="logo"
            onClick={() => navigate("/")}
          />

          <SearchBar onSearch={search} />

          <div className="Header-right">
            <img src={UsersLogo} alt="Users Logo" className="Users-logo" />

            {userLoggedIn ? (
              <div className="User-block" style={{ position: "relative" }}>
                <img
                  src={user?.avatar_url || userAvatarPlaceholder}
                  alt="User Avatar"
                  className="User-avatar"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{ cursor: "pointer" }}
                />

                {dropdownOpen && (
                  <div className="User-dropdown">
                    <Link to="/profile" className="User-dropdown-button">
                      Профиль
                    </Link>
                    <Link to="/settings" className="User-dropdown-button">
                      Настройки
                    </Link>

                    {isAdmin && (
                      <Link to="/adminPanel" className="User-dropdown-button">
                        Админ панель
                      </Link>
                    )}

                    <div
                      onClick={handleLogout}
                      className="User-dropdown-button"
                    >
                      Выйти
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="Header-user-button">
                Войти
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
