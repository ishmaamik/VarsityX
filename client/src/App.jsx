import React from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Login, Register } from "./pages/AuthPages";
import { ThemeProvider } from "./context/ThemeContext";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import Landing from "./pages/Landing";
import MarketplaceHome from "./pages/marketplace/MarketPlaceHome";
import BuyPage from "./pages/marketplace/BuyPage";
import SellPage from "./pages/marketplace/SellPage";
import ListingDetail from "./pages/marketplace/ListingDetail";
import Cart from "./pages/marketplace/Cart";
import SafeMeetups from "./pages/SafeMeetups";
import Messages from "./pages/Messages";
import CampusNavigation from "./components/CampusNavigation";
import ImageUploader from "./components/ImageUploader";
import PriceAdvisorPage from "./pages/PriceAdvisorPage";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Layout Component with Sidebar
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 overflow-auto transition-all duration-300 ease-in-out">
        {children}
      </div>
    </div>
  );
};

function AppContent() {
  const API_BASE = "http://localhost:5000";
  const [user, setUser] = useState(null);

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
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Marketplace Routes */}
        <Route
          path="/marketplace"
          element={
            <ProtectedRoute>
              <Layout>
                <MarketplaceHome />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/marketplace/buy"
          element={
            <ProtectedRoute>
              <Layout>
                <BuyPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/marketplace/sell"
          element={
            <ProtectedRoute>
              <Layout>
                <SellPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/marketplace/listing/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <ListingDetail />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/marketplace/cart"
          element={
            <ProtectedRoute>
              <Layout>
                <Cart />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/marketplace/category/:category"
          element={
            <ProtectedRoute>
              <Layout>
                <BuyPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* User Routes */}
        <Route
          path="/my-listings"
          element={
            <ProtectedRoute>
              <Layout>
                <MarketplaceHome />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Layout>
                <MarketplaceHome />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Layout>
                <Messages />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Layout>
                <div>Notifications Component</div>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <div>Profile Component</div>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/scam"
          element={
            <ProtectedRoute>
              <Layout>
                <ImageUploader />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <div>Settings Component</div>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/safe-meetups"
          element={
            <ProtectedRoute>
              <Layout>
                <SafeMeetups />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/price-advisor"
          element={
            <ProtectedRoute>
              <Layout>
                <PriceAdvisorPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
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
