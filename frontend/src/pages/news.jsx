import Header from "../components/header";
import Footer from "../components/footer";
import NavBar from "../components/navBar";
import NewsLists from "../components/newsLists";
import "../styles/news.css";

function News() {
  return (
    <div className="Main-page">
      <div className="Main-page-header">
        <Header />
        <NavBar />
      </div>
      <div className="Main-content">
        <div className="Web-border">
          <div className="Main-new">
            <div className="Title">Новости</div>
            <NewsLists />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default News;
