import { UserContext } from "../components/UserContext";
import { useContext, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/adminPanel.css";
// import UserManagement from "../components/adminPanel/UserManagement";
// import ContentModeration from "../components/adminPanel/ContentModeration";
// import AddAnime from "../components/adminPanel/AddAnime";
// import AddNews from "../components/adminPanel/AddNews";

function AdminPanel() {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("userManagement");

  return (
    <div className="Admin-panel-page">
      <div className="Admin-panel-page-header">
        <Header />
      </div>
      <div className="Admin-panel-page-main">
        <div className="Web-border">
          <div className="Title">Панель Администратора</div>
          <div className="Admin-panel-tabs">
            <button
              className={`Admin-panel-tab-button ${
                activeTab === "userManagement" ? "active" : ""
              }`}
              onClick={() => setActiveTab("userManagement")}
            >
              Управление пользователями
            </button>
            <button
              className={`Admin-panel-tab-button ${
                activeTab === "contentModeration" ? "active" : ""
              }`}
              onClick={() => setActiveTab("contentModeration")}
            >
              Модерация контента
            </button>

            {user?.isMods && (
              <button
                className={`Admin-panel-tab-button ${
                  activeTab === "addAnime" ? "active" : ""
                }`}
                onClick={() => setActiveTab("addAnime")}
              >
                Добавление аниме
              </button>
            )}

            <button
              className={`Admin-panel-tab-button ${
                activeTab === "addNews" ? "active" : ""
              }`}
              onClick={() => setActiveTab("addNews")}
            >
              Добавление новостей
            </button>

            <button
              className={`Admin-panel-tab-button ${
                activeTab === "siteSettings" ? "active" : ""
              }`}
              onClick={() => setActiveTab("siteSettings")}
            >
              Настройки сайта
            </button>
          </div>

          <div className="Admin-panel-content">
            {/* Вставляем содержимое вкладок */}
            {/* {activeTab === "userManagement" && <UserManagement />}
            {activeTab === "contentModeration" && <ContentModeration />}
            {activeTab === "addAnime" && user?.role === "moderator" && <AddAnime />}
            {activeTab === "addNews" && <AddNews />}
            {activeTab === "siteSettings" && <SiteSettings />} */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminPanel;
