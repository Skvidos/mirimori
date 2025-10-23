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
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/users");
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const toggleMod = async (user) => {
    const newValue = !user.isMods;
    const actionKey = `mod-${user.id}`;

    setActionState((prev) => ({
      ...prev,
      [actionKey]: newValue ? "add" : "remove",
    }));

    try {
      await axios.put(`http://localhost:3001/api/users/${user.id}/addMods`, {
        isMods: newValue,
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isMods: newValue } : u))
      );

      showToast(
        newValue
          ? `Пользователь ${user.name} стал модератором`
          : `Пользователь ${user.name} больше не модератор`,
        newValue ? "success" : "danger"
      );

      setTimeout(() => {
        setActionState((prev) => ({ ...prev, [actionKey]: null }));
      }, 1000);
    } catch (err) {
      console.error("Ошибка при изменении модератора:", err);
      showToast("Ошибка при изменении роли модератора", "danger");
    }
  };

  const toggleAdmin = async (user) => {
    const newValue = !user.isAdmin;
    const actionKey = `admin-${user.id}`;

    setActionState((prev) => ({
      ...prev,
      [actionKey]: newValue ? "add" : "remove",
    }));

    try {
      await axios.put(`http://localhost:3001/api/users/${user.id}/addAdmin`, {
        isAdmin: newValue,
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isAdmin: newValue } : u))
      );

      showToast(
        newValue
          ? `Пользователь ${user.name} стал администратором`
          : `Пользователь ${user.name} больше не администратор`,
        newValue ? "success" : "danger"
      );

      setTimeout(() => {
        setActionState((prev) => ({ ...prev, [actionKey]: null }));
      }, 1000);
    } catch (err) {
      console.error("Ошибка при изменении администратора:", err);
      showToast("Ошибка при изменении роли администратора", "danger");
    }
  };

  const toggleBan = async (user) => {
    try {
      await axios.put(`http://localhost:3001/api/users/${user.id}/delete`);

      setUsers((prev) => prev.filter((u) => u.id !== user.id));

      showToast(`Пользователь ${user.name} был удалён`, "danger");
    } catch (err) {
      console.error("Ошибка при удалении пользователя:", err);
      showToast("Ошибка при удалении пользователя", "danger");
    }
  };

  if (loading) return <div>Загрузка пользователей...</div>;
  if (error) return <div>Ошибка загрузки пользователей: {error.message}</div>;

  return (
    <div className="UsersAdmin">
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

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
                    <div className="UsersAdmin-user-role">
                      {user.isAdmin
                        ? "Администратор"
                        : user.isMods
                        ? "Модератор"
                        : "Пользователь"}
                    </div>
                  </div>
                </div>

                <div className="UsersAdmin-user-email">{user.email}</div>

                <div className="UserAdmin-user-buttons">
                  <div
                    className={`UserAdmin-users-make-mod ${
                      actionState[`mod-${user.id}`] === "add"
                        ? "button-success"
                        : actionState[`mod-${user.id}`] === "remove"
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
                      actionState[`admin-${user.id}`] === "add"
                        ? "button-success"
                        : actionState[`admin-${user.id}`] === "remove"
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
                    className="UserAdmin-users-delete"
                    onClick={() => toggleBan(user)}
                  >
                    <img
                      src={Ban}
                      alt="Удалить пользователя"
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
