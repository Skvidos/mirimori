import React from "react";
import logo from "../assests/logo/Logo.png";
import SearchBar from "./SearchBar";
import UsersLogo from "../assests/svg/users.svg";
import userAvatarPlaceholder from "../assests/svg/user-avatar-placeholder.svg";
import "../styles/header.css";

function Header({ userLoggedIn, userAvatar, userName }) {
  const search = (text) => {
    console.log(text);
  };

  return (
    <header className="App-header">
      <div className="Web-border">
        <div className="App-header-inner">
          <img src={logo} className="App-logo" alt="logo" />
          <SearchBar onSearch={search} />
          <div className="Header-right">
            <img src={UsersLogo} alt="Users-logo" className="Users-logo" />
            <img
              src={userAvatar || userAvatarPlaceholder}
              alt="User Avatar"
              className="User-avatar"
            />
            {userLoggedIn && (
              <div className="User-dropdown">
                <button>Профиль</button>
                <button>Настройки</button>
                <button>Выйти</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
