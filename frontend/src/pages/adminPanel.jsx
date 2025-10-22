import { UserContext } from "../components/UserContext";
import { useContext, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/adminPanel.css";
import UploadAnime from "../components/adminPanel/uploadAnime";
// import UserManagement from "../components/adminPanel/UserManagement";
// import ContentModeration from "../components/adminPanel/ContentModeration";
// import AddAnime from "../components/adminPanel/AddAnime";
// import AddNews from "../components/adminPanel/AddNews";

function AdminPanel() {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("userManagement");

  const tabs = [
    { id: "userManagement", label: "Управление пользователями" },
    { id: "contentModeration", label: "Модерация контента" },
    { id: "addAnime", label: "Добавление аниме", onlyMods: true },
    { id: "addNews", label: "Добавление новостей" },
    { id: "siteSettings", label: "Настройки сайта" },
  ];

  return (
    <div className="Admin-panel-page">
      <div className="Admin-panel-page-header">
        <Header />
      </div>
      <div className="Admin-panel-page-main">
        <div className="Web-border">
          <div className="Title">Панель администратора</div>

          <div className="Admin-panel-box">
            <div className="Admin-panel-tabs">
              {tabs.map((tab) => {
                if (tab.onlyMods && !user?.isMods) return null;

                return (
                  <div
                    key={tab.id}
                    className={`Admin-panel-tab-button ${
                      activeTab === tab.id ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </div>
                );
              })}
            </div>
            <div className="Admin-panel-content">
              {/* {activeTab === "userManagement" && <UserManagement />}
            {activeTab === "contentModeration" && <ContentModeration />} */}
              {activeTab === "addAnime" && user?.isMods && <UploadAnime />}
              {/* {activeTab === "addNews" && <AddNews />}
            {activeTab === "siteSettings" && <SiteSettings />} */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminPanel;
