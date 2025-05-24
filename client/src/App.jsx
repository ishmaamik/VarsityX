import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { Login, Register } from "./pages/AuthPages";
import { ThemeProvider } from "./context/ThemeContext";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import SafeMeetups from "./pages/SafeMeetups";
import ImageUploader from './components/ImageUploader';
import MarketplaceHome from "./pages/marketplace/MarketPlaceHome";
import BuyPage from "./pages/marketplace/BuyPage";
import SellPage from "./pages/marketplace/SellPage";
import ListingDetail from "./pages/marketplace/ListingDetail";
import Cart from "./pages/marketplace/Cart";

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
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
          path="/image-uploader"
          element={
            <ProtectedRoute>
              <Layout>
                <ImageUploader />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/marketplace" element={<MarketplaceHome />} />
        <Route path="/marketplace/buy" element={<BuyPage />} />
        <Route path="/marketplace/sell" element={<SellPage />} />
        <Route path="/marketplace/listing/:id" element={<ListingDetail />} />
        <Route path="/marketplace/cart" element={<Cart />} />
        
        <Route path="/home" element={
          <ProtectedRoute>
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
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
