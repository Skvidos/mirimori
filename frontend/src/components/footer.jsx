import { Link } from "react-router-dom";
import "../styles/footer.css";
import NavBar from "./navBar";
import VK from "../assests/svg/vk-brands-solid-full.svg";
import Telegram from "../assests/svg/telegram-brands-solid-full.svg";
import Discord from "../assests/svg/discord-brands-solid-full.svg";
import X from "../assests/svg/x-twitter-brands-solid-full.svg";

function Footer() {
  const socialIcons = [
    { name: "X", url: "#", icon: X },
    { name: "VK", url: "#", icon: VK },
    { name: "Telegram", url: "#", icon: Telegram },
    { name: "Discord", url: "#", icon: Discord },
  ];

  const importantLinks = [
    { label: "Условия и положения", link: "#" },
    { label: "Политика конфиденциальности", link: "#" },
    { label: "Политика использования файлов cookie", link: "#" },
    { label: "Настройки файлов cookie", link: "#" },
  ];
  return (
    <footer className="App-Footer">
      <div className="Web-border">
        <div className="App-footer-inner">
          <NavBar />
          <div className="Social-Links">
            <div className="Social-Links-title">Подписывайтесь на нас</div>
            <div className="Social-Links-icons">
              {socialIcons.map((icon, index) => (
                <a
                  key={index}
                  href={icon.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="Social-Links-icon"
                >
                  <img
                    src={icon.icon}
                    alt={icon.name}
                    className="Social-Icon"
                  />
                </a>
              ))}
            </div>
          </div>
          <div className="Social-important-links">
            {importantLinks.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="Social-important-item"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div
            className="ButtonToScrollTop"
            onClick={() => window.scrollTo(0, 0)}
          ></div>
          <div className="Footer-content">
            <p>mirimori Ltd. ©2025 All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
