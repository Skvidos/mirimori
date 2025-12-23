import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Header from "../components/header";
import Footer from "../components/footer";
import NavBar from "../components/navBar";
import Delete from "../assests/svg/ban-solid-full.svg";
import { UserContext } from "../components/UserContext";
import "../styles/friends.css";

function Friends() {
  const { user } = useContext(UserContext);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    if (user) {
      const fetchFriends = async () => {
        try {
          const res = await axios.get(
            `http://localhost:3001/api/users/${user.id}/friends`
          );
          setFriends(res.data || []);
          setLoading(false);
        } catch (err) {
          console.error("Ошибка при загрузке друзей:", err);
          setLoading(false);
        }
      };
      fetchFriends();
    }
  }, [user]);

  const removeFriend = async (friendId) => {
    try {
      await axios.delete(
        `http://localhost:3001/api/users/${user.id}/friends/${friendId}`
      );
      setFriends(friends.filter((f) => f.id !== friendId));
      showToast("Друг удален", "success");
    } catch (err) {
      console.error("Ошибка при удалении друга:", err);
      showToast("Ошибка при удалении друга", "danger");
    }
  };

  if (!user)
    return <div>Пожалуйста, войдите в систему, чтобы видеть друзей.</div>;
  if (loading) return <div>Загрузка друзей...</div>;

  return (
    <div className="Friends-page">
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
      <Header />
      <NavBar />

      <div className="Friends-page-main Web-border">
        <div className="Title">Мои друзья</div>

        <div className="Content-mods-inner">
          {friends.length > 0 ? (
            friends.map((friend) => (
              <div className="UsersAdmin-user" key={friend.id}>
                <div className="UsersAdmin-user-box">
                  <img
                    src={friend.avatar_url || "/default-avatar.png"}
                    alt={friend.username}
                    className="UsersAdmin-user-img"
                    onClick={() =>
                      (window.location.href = `/user/${friend.id}`)
                    }
                  />

                  <div
                    className="UsersAdmin-user-name-box"
                    onClick={() =>
                      (window.location.href = `/user/${friend.id}`)
                    }
                  >
                    <div className="UsersAdmin-user-name">
                      {friend.username}
                    </div>
                  </div>
                </div>

                <div className="UserAdmin-user-buttons">
                  <div
                    className="UserAdmin-users-addFriend"
                    onClick={() => removeFriend(friend.id)}
                  >
                    <img
                      src={Delete}
                      alt="Удалить из друзей"
                      width={25}
                      height={25}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">У вас пока нет друзей</div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Friends;
