import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/header';
import Register from './pages/register';
import Login from './pages/login';

function App() {
  return (
    <div className="App">
      <Header />
    </div>
    // <Router>
    //   <Routes>
    //     <Route path="/register" element={<Register />} />
    //     <Route path="/login" element={<Login />} />
    //   </Routes>
    // </Router>
  )
}

export default App;
