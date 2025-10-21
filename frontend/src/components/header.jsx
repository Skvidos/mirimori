import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assests/logo/Logo.png";
import SearchBar from "./SearchBar";
import UsersLogo from "../assests/svg/users.svg";
import userAvatarPlaceholder from "../assests/svg/user-avatar-placeholder.svg";
import "../styles/header.css";

function Header({ userLoggedIn, userAvatar, userName, userPermission }) {
  const search = (text) => {
    console.log(text);
  };
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const canUpload =
    userPermission && (userPermission.isAdmin || userPermission.isMods);

  return (
    <header className="App-header">
      <div className="Web-border">
        <div className="App-header-inner">
          <img
            src={logo}
            className="App-logo"
            alt="logo"
            onClick={() => (window.location.href = `/`)}
          />
          <SearchBar onSearch={search} />
          <div className="Header-right">
            <img src={UsersLogo} alt="Users Logo" className="Users-logo" />
            {userLoggedIn ? (
              <div className="User-block" style={{ position: "relative" }}>
                <img
                  src={userAvatar || userAvatarPlaceholder}
                  alt="User Avatar"
                  className="User-avatar"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{ cursor: "pointer" }}
                />

                {dropdownOpen && (
                  <div className="User-dropdown">
                    <div>Профиль</div>
                    <div>Настройки</div>
                    {canUpload && (
                      <Link to="/uploadAnime" className="Upload-button">
                        Админ панель
                      </Link>
                    )}
                    <div
                      onClick={() => {
                        localStorage.removeItem("token");
                        window.location.reload();
                      }}
                    >
                      Выйти
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="Login-button">
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
