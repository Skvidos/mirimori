import React from "react";
import "../styles/footer.css";
import NavBar from "./navBar";

function Footer() {
  return (
    <footer className="App-Footer">
      <div className="Web-border">
        <NavBar />
        <hr className="Footer-separator" />
        <div className="Footer-content">
          <p>© 2024 Mirimori. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
