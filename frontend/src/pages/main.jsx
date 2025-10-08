import React, { useEffect } from "react";
import "../styles/main.css";
import Header from "../components/header";
import NavBar from "../components/navBar";
import Slider from "../components/slider";
import PostNews from "../components/postNews";

function Main() {
  const [newTitles, setNewTitles] = React.useState([]);
  const [lastWatched, setLastWatched] = React.useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/anime/new")
      .then((res) => res.json())
      .then((data) => setNewTitles(data))
      .catch((err) => console.error(err));

    fetch("http://localhost:3001/anime/last-watched")
      .then((res) => res.json())
      .then((data) => setLastWatched(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="Main-page">
      <Header userLoggedIn={false} userName={"Username"} />
      <NavBar />
      <div className="Main-content">
        <div className="Web-border">
          <div className="Main-new">
            <Slider title="Новинки" items={newTitles} />
          </div>

          <div className="Main-last">
            <Slider title="Последние просмотренные" items={lastWatched} />
          </div>

          <div className="Main-news">
            <div className="Title">Новости</div>
            <PostNews />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
