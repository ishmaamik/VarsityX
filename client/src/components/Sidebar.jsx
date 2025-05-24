import { Link, useNavigate } from "react-router-dom";
import React from "react";
import DarkModeToggle from "./Mode";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  MessageSquare,
  User,
  Search,
  ShoppingBag,
  PlusCircle,
  Heart,
  Bell,
  ShieldCheck,
  Settings,
  LogOut,
  GraduationCap,
  History,
  MapPin,
  Book,
  Laptop,
  Bike,
  DollarSign,
  ShoppingCart,
  Tag,
} from "lucide-react";

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const Menus = [
    { title: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/home" },
    { title: "Browse", icon: <ShoppingBag size={20} />, path: "/marketplace" },
    {
      title: "Sell Item",
      icon: <PlusCircle size={20} />,
      path: "/marketplace/sell",
    },
    { title: "Buy", icon: <DollarSign size={20} />, path: "/marketplace/buy" },
    {
      title: "Cart",
      icon: <ShoppingCart size={20} />,
      path: "/marketplace/cart",
    },
    { title: "My Listings", icon: <Book size={20} />, path: "/my-listings" },
    {
      title: "Categories",
      icon: <Book size={20} />,
      gap: true,
      submenu: [
        {
          title: "Textbooks",
          icon: <Book size={20} />,
          path: "/marketplace/category/textbooks",
        },
        {
          title: "Electronics",
          icon: <Laptop size={20} />,
          path: "/marketplace/category/electronics",
        },
        {
          title: "Transport",
          icon: <Bike size={20} />,
          path: "/marketplace/category/transport",
        },
        {
          title: "Tutoring",
          icon: <GraduationCap size={20} />,
          path: "/marketplace/category/tutoring",
        },
        {
          title: "Skill Exchange",
          icon: <MessageSquare size={20} />,
          path: "/marketplace/category/skill-exchange",
        },
      ],
    },
    {
      title: "Price-Advisor",
      icon: <Tag size={20} />,
      gap: true,
      path: "/price-advisor",
    },
    {
      title: "Scam-check",
      icon: <Settings size={20} />,
      gap: true,
      path: "/scam",
    },
    {
      title: "Safe Meetups",
      icon: <MapPin size={20} />,
      path: "/safe-meetups",
    },
    { title: "Saved Items", icon: <Heart size={20} />, path: "/favorites" },
    {
      title: "Messages",
      icon: <MessageSquare size={20} />,
      gap: true,
      path: "/messages",
    },
    {
      title: "Notifications",
      icon: <Bell size={20} />,
      path: "/notifications",
    },
    { title: "Profile", icon: <User size={20} />, path: "/profile" },
    {
      title: "Settings",
      icon: <Settings size={20} />,
      gap: true,
      path: "/settings",
    },
  ];

  return (
    <div
      className={`${
        open ? "w-64" : "w-20"
      } bg-gradient-to-br from-gray-900 to-gray-800 text-white h-screen flex flex-col transition-all duration-300 shadow-lg z-50`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-x-4">
          <div
            className={`w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center transition-transform duration-500 ${
              open && "rotate-[360deg]"
            }`}
          >
            <GraduationCap size={24} />
          </div>
          <h1
            className={`text-xl font-bold tracking-wide transition-all duration-300 ${
              !open && "scale-0"
            }`}
          >
            VarsityX
          </h1>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className={`p-1 rounded-md hover:bg-gray-700 ${!open && "ml-auto"}`}
        >
          {open ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Scrollable Menu Items */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <nav className="p-4">
          <ul className="space-y-2">
            {Menus.map((menu, index) => (
              <li key={index}>
                <Link
                  to={menu.path}
                  className={`flex items-center gap-x-4 p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                    menu.gap ? "mt-4" : ""
                  }`}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    {menu.icon}
                  </div>
                  <span
                    className={`whitespace-nowrap transition-opacity duration-200 ${
                      !open && "opacity-0"
                    }`}
                  >
                    {menu.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Footer Section */}
      <div className="p-4 border-t border-gray-700 flex-shrink-0 space-y-4">
        <DarkModeToggle />
        <button
          onClick={handleLogout}
          className="flex items-center gap-x-4 p-3 rounded-lg hover:bg-gray-700 transition-colors w-full"
        >
          <LogOut size={20} />
          <span
            className={`whitespace-nowrap transition-opacity duration-200 ${
              !open && "opacity-0"
            }`}
          >
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
