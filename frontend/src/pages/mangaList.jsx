import Header from "../components/header";
import Footer from "../components/footer";
import NavBar from "../components/navBar";

import MangaLists from "../components/mangaLists";

function MangaList() {
  return (
    <div className="Main-page">
      <div className="Main-page-header">
        <Header />
        <NavBar />
      </div>

      <div className="Main-content">
        <div className="Web-border">
          <div className="Main-new">
            <div className="Title">Список манг</div>
            <MangaLists />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default MangaList;
