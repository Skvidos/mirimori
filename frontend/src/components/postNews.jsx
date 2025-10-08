import "../styles/postNews.css";

function postNews() {
  return (
    <div className="PostNews">
      <div className="PostBox">
        <div className="PostHeader">
          <div className="UserAvatar"></div>
          <div className="PostTitle-box">
            <div className="PostTitle"></div>
            <div className="PostbyUser"></div>
          </div>
        </div>
        <div className="PostBox-Text">
          <img src="" alt="" className="PostBox-Poster"></img>
          <div className="PostBox-Text"></div>
        </div>
      </div>
    </div>
  );
}

export default postNews;
