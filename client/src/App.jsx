import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { Login, Register } from "./pages/AuthPages";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import Landing from "./pages/Landing";
import MarketplaceHome from "./pages/marketplace/MarketPlaceHome";
import BuyPage from "./pages/marketplace/BuyPage";
import SellPage from "./pages/marketplace/SellPage";
import ListingDetail from "./pages/marketplace/ListingDetail";
import Cart from "./pages/marketplace/Cart";
import PaymentStatus from "./pages/marketplace/PaymentStatus";
import SafeMeetups from "./pages/SafeMeetups";
import Messages from "./pages/Messages";
import CampusNavigation from "./components/CampusNavigation";
import ImageUploader from "./components/ImageUploader";
import PriceAdvisorPage from "./pages/PriceAdvisorPage";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";
import StudentProfile from "./pages/StudentProfile";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
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
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Payment Status Route - Must be before other routes to handle query parameters */}
        <Route
          path="/marketplace/payment-status"
          element={
            <PaymentStatus />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            
              <Layout>
                <Home />
              </Layout>
            
          }
        />

        {/* Marketplace Routes */}
        <Route
          path="/marketplace"
          element={
            
              <Layout>
                <MarketplaceHome />
              </Layout>
            
          }
        />

        <Route
          path="/marketplace/buy"
          element={
            
              <Layout>
                <BuyPage />
              </Layout>
            
          }
        />

        <Route
          path="/marketplace/sell"
          element={
            
              <Layout>
                <SellPage />
              </Layout>
            
          }
        />

        <Route
          path="/marketplace/listing/:id"
          element={
            
              <Layout>
                <ListingDetail />
              </Layout>
            
          }
        />

        <Route
          path="/marketplace/cart"
          element={
            
              <Layout>
                <Cart />
              </Layout>
            
          }
        />

        <Route
          path="/marketplace/category/:category"
          element={
            
              <Layout>
                <BuyPage />
              </Layout>
          }
        />

        <Route
          path="/admin"
          element={
            <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
              <div className={`flex-1 overflow-auto transition-all duration-300`}>
                <AdminPanel />
              </div>
            </div>
          }
        />

        {/* User Routes */}
        <Route
          path="/my-listings"
          element={
            
              <Layout>
                <MarketplaceHome />
              </Layout>
            
          }
        />

        <Route
          path="/favorites"
          element={
            
              <Layout>
                <MarketplaceHome />
              </Layout>
            
          }
        />

        <Route
          path="/messages"
          element={
            
              <Layout>
                <Messages />
              </Layout>
            
          }
        />

        <Route
          path="/notifications"
          element={
            
              <Layout>
                <div>Notifications Component</div>
              </Layout>
            
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-profile"
          element={
              <Layout>
                <StudentProfile />
              </Layout>
          }
        />

        <Route
          path="/scam"
          element={
            
              <Layout>
                <ImageUploader />
              </Layout>
            
          }
        />

        <Route
          path="/settings"
          element={
            
              <Layout>
                <div>Settings Component</div>
              </Layout>
            
          }
        />

        <Route
          path="/safe-meetups"
          element={
            
              <Layout>
                <SafeMeetups />
              </Layout>
            
          }
        />

        <Route
          path="/price-advisor"
          element={
            
              <Layout>
                <PriceAdvisorPage />
              </Layout>
            
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
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
