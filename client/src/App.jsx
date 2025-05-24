import React from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Login, Register } from "./pages/AuthPages";
import { ThemeProvider } from "./context/ThemeContext";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import PriceAdvisorPage from "./pages/PriceAdvisorPage"; // ✅ adjust path if needed
import Payment from "./pages/Payment"; // ✅ adjust path if needed


function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const API_BASE = "http://localhost:5000";
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [subMenuOpen, setSubMenuOpen] = useState({
    trips: false,
    users: false,
    content: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(`${API_BASE}/user/user-data`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Failed to fetch user data:", err));
  }, []);

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <div className="flex h-screen overflow-hidden">
              <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
              <div
                className={`flex-1 overflow-auto transition-all duration-300 ease-in-out`}
              >
                <Home />
              </div>
            </div>
          }
        />
        <Route
          path="/price-advisor"
          element={
            <div className="flex h-screen overflow-hidden">
              <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
              <div
                className={`flex-1 overflow-auto transition-all duration-300 ease-in-out`}
              >
                <PriceAdvisorPage />
              </div>
            </div>
          }
        />
        <Route path="/payment" element={<Payment />} />
       
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
