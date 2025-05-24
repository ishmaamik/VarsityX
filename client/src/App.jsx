import React from "react";
import axios from "axios"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Login, Register } from "./pages/AuthPages";
import { ThemeProvider } from "./context/ThemeContext";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import MarketplaceHome from "./pages/marketplace/MarketPlaceHome";
import BuyPage from "./pages/marketplace/BuyPage";
import SellPage from "./pages/marketplace/SellPage";
import ListingDetail from "./pages/marketplace/ListingDetail";
import Cart from "./pages/marketplace/Cart";

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
        <Route path="/marketplace" element={<MarketplaceHome />} />
        <Route path="/marketplace/buy" element={<BuyPage />} />
        <Route path="/marketplace/sell" element={<SellPage />} />
        <Route path="/marketplace/listing/:id" element={<ListingDetail />} />
        <Route path="/marketplace/cart" element={<Cart />} />
        
        <Route path="/home" element={
          <div className="flex h-screen overflow-hidden">
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
            <div 
              className={`flex-1 overflow-auto transition-all duration-300 ease-in-out`}
            >
              <Home />
            </div>
          </div>
        }/>
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
