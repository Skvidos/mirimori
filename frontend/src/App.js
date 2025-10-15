import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from './pages/register';
import Login from './pages/login';
import Main from './pages/main';
import AnimePage from './pages/animePage';
import UploadAnime from './pages/uploadAnime';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/anime/:id" element={<AnimePage />} />
        <Route path="/upload-anime" element={<UploadAnime />} />
      </Routes>
    </Router>
  )
}

export default App;
