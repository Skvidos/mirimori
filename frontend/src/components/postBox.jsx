import { useEffect, useState, useContext } from "react";
import { UserContext } from "../components/UserContext";
import Delete from "../assests/svg/ban-solid-full.svg";
import "../styles/postBox.css";

function PostBox({ anime, currentUser }) {
  const [posts, setPosts] = useState([]);
  const [toast, setToast] = useState(null);

  const { user } = useContext(UserContext);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    let url = null;

    if (currentUser) {
      url = `http://localhost:3001/api/users/${currentUser.id}/reviews`;
    }

    if (anime) {
      url = `http://localhost:3001/api/anime/${anime.id}/reviews`;
    }

    if (!url) return;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error(err));
  }, [currentUser, anime]);

  const deletePost = (postId) => {
    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) {
        showToast("Отзыв не найден", "danger");
        return;
      }

      if (user.id !== post.user_id) {
        showToast("Вы не можете удалить этот отзыв", "danger");
        return;
      }

      fetch(`http://localhost:3001/api/reviews/${postId}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.id }),
      })
        .then(async (res) => {
          if (res.ok) {
            setPosts(posts.filter((p) => p.id !== postId));
            showToast("Отзыв удален", "success");
          } else {
            const err = await res.json();
            showToast(err.error || "Ошибка при удалении", "danger");
          }
        })
        .catch((err) => {
          console.error(err);
          showToast("Ошибка при удалении", "danger");
        });
    } catch (err) {
      console.error(err);
      showToast("Ошибка при удалении", "danger");
    }
  };

  return (
    <div className="PostBox">
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
      {posts.length > 0 ? (
        posts.map((post) => (
          <div className="PostBox-item" key={post.id}>
            <div className="PostBox-item-right">
              <div className="PostBox-item-header">
                <img
                  src={post.avatar_url}
                  alt=""
                  className="PostBox-avatar"
                  onClick={() =>
                    (window.location.href = `/user/${post.user_id}`)
                  }
                />

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
                    onClick={() =>
                      (window.location.href = `/user/${post.user_id}`)
                    }
                  >
                    от {post.username}
                  </div>
                </div>
              </div>

              <div className="PostBox-text">{post.content}</div>
              {user && user.id === post.user_id && (
                <div
                  className="PostBox-delete-btn"
                  onClick={() => deletePost(post.id)}
                >
                  <img
                    src={Delete}
                    alt="Удалить отзыв"
                    className="PostBox-delete-btn-img"
                    width={25}
                    height={25}
                  />
                </div>
              )}
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
              <div className="PostBox-date">
                {post.created_at?.slice(0, 10)}
              </div>
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
