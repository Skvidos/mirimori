import { useEffect, useState } from "react";
import "../styles/postBox.css";

function PostBox({ user }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/api/users/${user.id}/reviews`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error(err));
  }, [user.id]);

  console.log(posts);

  return (
    <div className="PostBox">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div className="PostBox-item">
            <div className="PostBox-item-right">
              <div className="PostBox-item-header">
                <img
                  src={user.avatar_url}
                  alt=""
                  className="PostBox-avatar"
                  onClick={() => (window.location.href = `/user/${user.id}`)}
                />
                {console.log(post)}
                <div className="PostBox-title">
                  <div
                    className="PostBox-title-text"
                    onClick={() =>
                      (window.location.href = `/anime/${post.item_id}`)
                    }
                  >
                    {post.title}
                  </div>
                  <div
                    className="PostBox-username"
                    onClick={() => (window.location.href = `/user/${user.id}`)}
                  >
                    от {user.username}
                  </div>
                </div>
              </div>
              <div className="PostBox-text">{post.content}</div>
            </div>
            <div className="PostBox-item-left">
              <img
                src={post.poster}
                alt=""
                className="PostBox-image"
                onClick={() =>
                  (window.location.href = `/anime/${post.item_id}`)
                }
              />
              <div className="PostBox-date">{post.created_at.slice(0, 10)}</div>
            </div>
          </div>
        ))
      ) : (
        <div>Нет отзывов</div>
      )}
    </div>
  );
}
export default PostBox;
