import React from "react";
import logo from "../assests/logo/Logo.png";
import SearchBar from "./SearchBar";
import "../styles/header.css";

function Header() {
  const search = (text) => {
    console.log(text);
  };

  return (
    <header className="App-header">
      <div className="Web-border">
        <div className="App-header-inner">
          <img src={logo} className="App-logo" alt="logo" />
          <SearchBar onSearch={search} />
        </div>
      </div>
    </header>
  );
}

export default Header;
