import { useState } from "react";
import logo from "../assests/logo/Logo.png";
import SearchBar from "./SearchBar";
import UsersLogo from "../assests/svg/users.svg";
import userAvatarPlaceholder from "../assests/svg/user-avatar-placeholder.svg";
import "../styles/header.css";

function Header({ userLoggedIn, userAvatar, userName }) {
  const search = (text) => {
    console.log(text);
  };
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
                    <button>Профиль</button>
                    <button>Настройки</button>
                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        window.location.reload();
                      }}
                    >
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a href="/login" className="Login-button">
                Войти
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
