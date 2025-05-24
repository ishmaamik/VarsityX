import React from "react";
import axios from "axios"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Login, Register } from "./pages/AuthPages";
import { ThemeProvider } from "./context/ThemeContext";
import { AnimatePresence } from "framer-motion";



function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const API_BASE = 'http://localhost:5000';
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [subMenuOpen, setSubMenuOpen] = useState({
      trips: false,
      users: false,
      content: false
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .get(`${API_BASE}/user/user-data`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error('Failed to fetch user data:', err));
  }, []);

  return (
    <AnimatePresence mode="wait">
      <Routes>
        

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
