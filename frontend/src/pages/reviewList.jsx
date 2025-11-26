import Header from "../components/header";
import Footer from "../components/footer";
import NavBar from "../components/navBar";
import ReviewLists from "../components/reviewLists";

function ReviewList() {
  return (
    <div className="Main-page">
      <div className="Main-page-header">
        <Header />
        <NavBar />
      </div>

      <div className="Main-content">
        <div className="Web-border">
          <div className="Main-new">
            <div className="Title">Список отзывов</div>
            <ReviewLists />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ReviewList;
