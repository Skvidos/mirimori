import { useEffect, useContext, useState, useRef } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import NavBar from "../components/navBar";
import { UserContext } from "../components/UserContext";
import "../styles/settings.css";

function Settings() {
  const { user } = useContext(UserContext);
  const [username, setUsername] = useState(user.username || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.sex || "");
  const [avatarPreview, setAvatarPreview] = useState(user.avatar_url || null);
  const [toast, setToast] = useState(null);
  const avatarInputRef = useRef(null);
  const [saving, setSaving] = useState(false);

  console.log(user);

  useEffect(() => {
    setUsername(user.username || "");
    setAge(user.age || "");
    setGender(user.gender || "");
    setAvatarPreview(user.avatar_url || null);
  }, [user]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(URL.createObjectURL(file));
    uploadAvatar(file);
  };

  const uploadAvatar = async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      await fetch(`http://localhost:3001/api/users/${user.id}/avatar`, {
        method: "POST",
        body: formData,
      });

      showToast("Аватар обновлён", "success");
    } catch {
      showToast("Ошибка обновления аватара", "danger");
    }
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      const updates = [];

      if (username !== user.username) {
        updates.push(
          fetch(`http://localhost:3001/api/users/${user.id}/username`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
          })
        );
      }

      if (age !== user.age) {
        updates.push(
          fetch(`http://localhost:3001/api/users/${user.id}/age`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ age }),
          })
        );
      }

      if (gender !== user.sex) {
        updates.push(
          fetch(`http://localhost:3001/api/users/${user.id}/gender`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gender }),
          })
        );
      }

      if (updates.length === 0) {
        showToast("Изменений нет", "info");
        return;
      }

      await Promise.all(updates);
      showToast("Данные профиля обновлены", "success");
    } catch (error) {
      console.error("Update error:", error);
      showToast("Ошибка при обновлении данных", "danger");
    } finally {
      setSaving(false);
    }
  };

  const exportAnime = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/users/${user.id}/anime/export`
      );
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "watched-anime.json";
      a.click();
      a.remove();
      showToast("Данные экспортированы", "success");
    } catch {
      showToast("Ошибка экспорта данных", "danger");
    }
  };

  return (
    <div className="Main-page">
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
      <div className="Main-page-header">
        <Header />
        <NavBar />
      </div>
      <div className="Main-content">
        <div className="Web-border">
          <div className="Main-new">
            <div className="Title">Настройки</div>

            <div className="Settings-section">
              <div className="Settings-title">Профиль</div>
              <div className="Settings-box">
                <div className="Settings-item">
                  <div className="Settings-label">Имя пользователя:</div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="Settings-input"
                  />

                  <div className="Settings-label">Возраст:</div>
                  <input
                    type="number"
                    className="Settings-input"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />

                  <div className="Settings-label">Пол:</div>
                  <select
                    className="Settings-input"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="male">Мужчина</option>
                    <option value="female">Женщина</option>
                  </select>

                  <div
                    onClick={saveAll}
                    className={`Settings-button ${saving ? "disabled" : ""}`}
                  >
                    {saving ? "Сохраняем..." : "Сохранить"}
                  </div>
                </div>

                <div className="Settings-item avatar">
                  <div className="Settings-label">Аватар:</div>
                  <div
                    className="Settings-change-avatar"
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="Avatar-preview"
                      />
                    ) : (
                      <div className="Avatar-placeholder">
                        Нажмите чтобы выбрать файл
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      ref={avatarInputRef}
                      style={{ display: "none" }}
                      onChange={handleAvatarChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="Settings-section">
              <div className="Settings-title">Экспорт данных</div>
              <div className="Settings-box export">
                <div className="Settings-item">
                  <div className="Settings-text">
                    Экспорт просмотренных данных пользователя в формате JSON
                  </div>
                  <div onClick={exportAnime} className="Settings-button">
                    Экспортировать просмотренное аниме
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Settings;
