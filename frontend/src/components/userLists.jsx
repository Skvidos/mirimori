import { useEffect, useState, useContext } from "react";
import "../styles/contentMods.css";
import axios from "axios";
import useDebouncedState from "../hooks/useDebouncedState.jsx";
import AddUser from "../assests/svg/user-plus-solid-full.svg";
import { UserContext } from "../components/UserContext";

function ReviewLists() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [actionState, setActionState] = useState({});
  const [searchQuery, searchInput, setSearchInput] = useDebouncedState(
    "",
    1000
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const { user: UserId, userLoggedIn } = useContext(UserContext);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3001/api/users", {
          params: {
            q: searchQuery,
            page,
            limit,
          },
        });
        setUsers(res.data.data || []);
        setLoading(false);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchQuery, page, limit]);

  const toggleFriend = async (user) => {
    try {
      const currentUserId = UserId.id;

      if (!currentUserId) {
        showToast("Вы не авторизованы", "danger");
        return;
      }

      const action = user.isFriend ? "remove" : "add";

      setActionState((prev) => ({
        ...prev,
        [`friend-${user.id}`]: action,
      }));

      await axios.post("http://localhost:3001/api/friends/toggle", {
        user_id: currentUserId,
        friend_id: user.id,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isFriend: !u.isFriend } : u
        )
      );

      showToast(
        action === "add"
          ? `Пользователь ${user.username} добавлен в друзья`
          : `Пользователь ${user.username} удалён из друзей`,
        action === "add" ? "success" : "danger"
      );
    } catch (err) {
      console.error("Ошибка при изменении друга:", err);
      showToast("Ошибка при изменении друга", "danger");
    }
  };

  if (loading) return <div>Загрузка пользователей...</div>;
  if (error) return <div>Ошибка загрузки: {error.message}</div>;

  return (
    <div className="Content-mods-page">
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
      <div className="Content-mods-main">
        <div className="Content-filters-box">
          <input
            type="text"
            placeholder="Поиск пользователей..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
            className="Content-search-input"
          />
        </div>
        .
        <div className="Content-mods-inner">
          {users.length > 0 ? (
            users.map((user) => (
              <div className="UsersAdmin-user" key={user.id}>
                <div className="UsersAdmin-user-box">
                  <img
                    src={user?.avatar_url}
                    alt={user.name}
                    className="UsersAdmin-user-img"
                    onClick={() => (window.location.href = `/user/${user.id}`)}
                  />
                  <div
                    className="UsersAdmin-user-name-box"
                    onClick={() => (window.location.href = `/user/${user.id}`)}
                  >
                    <div className="UsersAdmin-user-name">{user.username}</div>
                    <div className="UsersAdmin-user-role">
                      {user.role === "Admin"
                        ? "Администратор"
                        : user.role === "Moderator"
                        ? "Модератор"
                        : user.isAdmin && user.isMods
                        ? "Администратор и модератор"
                        : "Пользователь"}
                    </div>
                  </div>
                </div>

                <div className="UsersAdmin-user-email">{user.email}</div>

                <div className="UserAdmin-user-buttons">
                  {userLoggedIn && UserId.id !== user.id && (
                    <div
                      className={`UserAdmin-users-addFriend ${
                        actionState[`friend-${user.id}`] === "add"
                          ? "button-success"
                          : actionState[`friend-${user.id}`] === "remove"
                          ? "button-danger"
                          : ""
                      }`}
                      onClick={() => toggleFriend(user)}
                    >
                      <img
                        src={AddUser}
                        alt={
                          user.isFriend
                            ? "Удалить из друзей"
                            : "Добавить в друзья"
                        }
                        width={25}
                        height={25}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">Результаты не найдены</div>
          )}
        </div>
        <div className="Pagination-box">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (num) =>
                num === 1 ||
                num === totalPages ||
                (num >= page - 2 && num <= page + 2)
            )
            .map((num, index, array) => (
              <span key={num} className="Pagination-pages">
                {index > 0 && array[index - 1] !== num - 1 && (
                  <span className="dots">...</span>
                )}
                <div
                  className={`page-btn ${num === page ? "active" : ""}`}
                  onClick={() => setPage(num)}
                >
                  {num}
                </div>
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ReviewLists;
