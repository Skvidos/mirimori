import { useState, useEffect } from "react";

import Header from "../components/header";
import Footer from "../components/footer";
import NavBar from "../components/navBar";

import AnimeLists from "../components/adminPanel/animeLists";

function AnimeList() {
  return (
    <div className="Main-page">
      <div className="Main-page-header">
        <Header />
        <NavBar />
      </div>

      <div className="Main-content">
        <div className="Web-border">
          <div className="Main-new">
            <div className="Title">Список аниме</div>
            <AnimeLists />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AnimeList;
