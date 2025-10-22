import { useEffect, useState } from "react";
import "../../styles/usersAdmin.css";
import axios from "axios";
import userAvatarPlaceholder from "../../assests/svg/user-avatar-placeholder.svg";
import Mods from "../../assests/svg/shield-halved-solid-full.svg";
import Admin from "../../assests/svg/user-tie-solid-full.svg";
import Ban from "../../assests/svg/ban-solid-full.svg";

function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionState, setActionState] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/users")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const updateUserRole = async (userId, newData, actionKey) => {
    try {
      setActionState((prev) => ({
        ...prev,
        [actionKey]: newData[actionKey] ? "add" : "remove",
      }));

      await axios.put(`http://localhost:3001/api/users/${userId}`, newData);

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, ...newData } : user
        )
      );

      setTimeout(() => {
        setActionState((prev) => ({ ...prev, [actionKey]: null }));
      }, 1000);
    } catch (err) {
      console.error("Ошибка при обновлении роли:", err);
    }
  };

  const toggleMod = (user) => {
    const newValue = !user.isMods;
    updateUserRole(
      user.id,
      { isAdmin: user.isAdmin, isMods: newValue },
      "isMods"
    );
  };

  const toggleAdmin = (user) => {
    const newValue = !user.isAdmin;
    updateUserRole(
      user.id,
      { isAdmin: newValue, isMods: user.isMods },
      "isAdmin"
    );
  };

  const toggleBan = async (user) => {
    try {
      await axios.put(`http://localhost:3001/api/users/${user.id}/delete`);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isBanned: !u.isBanned } : u
        )
      );
    } catch (err) {
      console.error("Ошибка при блокировке пользователя:", err);
    }
  };

  if (loading) return <div>Загрузка пользователей...</div>;
  if (error) return <div>Ошибка загрузки пользователей: {error.message}</div>;

  return (
    <div className="UsersAdmin">
      <div className="UsersAdmin-header">
        <div className="Title-admin">Пользователи</div>
      </div>
      <div className="UsersAdmin-main">
        <div className="UsersAdmin-main-inner">
          <div className="UsersAdmin-users">
            {users.map((user) => (
              <div className="UsersAdmin-user" key={user.id}>
                <div className="UsersAdmin-user-box">
                  <img
                    src={user?.avatar_url || userAvatarPlaceholder}
                    alt={user.name}
                    className="UsersAdmin-user-img"
                    onClick={() => (window.location.href = `/user/${user.id}`)}
                  />
                  <div
                    className="UsersAdmin-user-name-box"
                    onClick={() => (window.location.href = `/user/${user.id}`)}
                  >
                    <div className="UsersAdmin-user-name">{user.name}</div>
                    <div className="UsersAdmin-user-role">{user.role}</div>
                  </div>
                </div>
                <div className="UsersAdmin-user-email">{user.email}</div>

                <div className="UserAdmin-user-buttons">
                  <div
                    className={`UserAdmin-users-make-mod ${
                      actionState.isMods === "add"
                        ? "button-success"
                        : actionState.isMods === "remove"
                        ? "button-danger"
                        : ""
                    }`}
                    onClick={() => toggleMod(user)}
                  >
                    <img
                      src={Mods}
                      alt={
                        user.isMods
                          ? "Убрать модератора"
                          : "Сделать модератором"
                      }
                      width={25}
                      height={25}
                    />
                  </div>

                  <div
                    className={`UserAdmin-users-make-admin ${
                      actionState.isAdmin === "add"
                        ? "button-success"
                        : actionState.isAdmin === "remove"
                        ? "button-danger"
                        : ""
                    }`}
                    onClick={() => toggleAdmin(user)}
                  >
                    <img
                      src={Admin}
                      alt={
                        user.isAdmin
                          ? "Убрать администратора"
                          : "Сделать администратором"
                      }
                      width={25}
                      height={25}
                    />
                  </div>

                  <div
                    className={"UserAdmin-users-delete"}
                    onClick={() => toggleBan(user)}
                  >
                    <img
                      src={Ban}
                      alt="Заблокировать пользователя"
                      width={25}
                      height={25}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersAdmin;
