import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Change Switch to Routes
import Login from "./components/Login/Login.jsx";
import Signup from "./components/Signup/Signup.jsx";
import Main from "./components/Main/Main.jsx";
import Hero from "./components/Hero/Hero.jsx";
function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/hero" element={<Hero />} />

        <Route path="/homepage" element={<Main />} />
      </Routes>
    </Router>
  );
}

export default App;
