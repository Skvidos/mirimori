import { useContext, useEffect, useState } from "react";
import "../styles/main.css";
import Header from "../components/header";
import Footer from "../components/footer";
import NavBar from "../components/navBar";
import Slider from "../components/slider";
import PostNews from "../components/postNews";
import { UserContext } from "../components/UserContext";

function Main() {
  const { user } = useContext(UserContext);
  const [newTitles, setNewTitles] = useState([]);
  const [lastWatched, setLastWatched] = useState([]);

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
      <div className="Main-page-header">
        <Header />
        <NavBar />
      </div>

      <div className="Main-content">
        <div className="Web-border">
          <div className="Main-new">
            <Slider title="Новинки" items={newTitles} count={6} />
          </div>

          <div className="Main-last">
            <Slider
              title="Последние просмотренные"
              items={lastWatched}
              сount={6}
            />
          </div>

          <div className="Main-news">
            <div className="Title">Новости</div>
            <PostNews />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Main;
