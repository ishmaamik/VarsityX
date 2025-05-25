import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, UserPlus, GraduationCap } from "lucide-react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
const API_BASE = "https://varsityx-backend-1.onrender.com";

export const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    university: ""
  });
  
  // Replace hardcoded ObjectIds with simple university names
  const universities = [
    "IUT",
    "BUET",
    "DU",
    "BRAC",
    "NSU"
  ];

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    const errors = {};
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!formData.university) {
      errors.university = "Please select a university";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/api/auth/register`, {
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName,
        university: formData.university
      });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        alert("Registered successfully! Please log in.");
        window.location.href = '/login';
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 dark:from-blue-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/80 dark:bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-3xl font-bold text-center mb-6">
          Create an Account
        </h2>
        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-3">
              <Mail className="text-indigo-500" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="bg-transparent outline-none flex-1 text-gray-900 dark:text-white"
                required
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-3">
              <UserPlus className="text-indigo-500" size={20} />
              <input
                type="text"
                name="displayName"
                placeholder="Display Name"
                value={formData.displayName}
                onChange={handleChange}
                className="bg-transparent outline-none flex-1 text-gray-900 dark:text-white"
                required
              />
            </div>
            {errors.displayName && <p className="text-red-500 text-sm">{errors.displayName}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-3">
              <GraduationCap className="text-indigo-500" size={20} />
              <select
                name="university"
                value={formData.university}
                onChange={handleChange}
                className="bg-transparent outline-none flex-1 text-gray-900 dark:text-white w-full"
                required
              >
                <option value="">Select University</option>
                {universities.map((university) => (
                  <option key={university} value={university}>
                    {university}
                  </option>
                ))}
              </select>
            </div>
            {errors.university && <p className="text-red-500 text-sm">{errors.university}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-3">
              <Lock className="text-indigo-500" size={20} />
              <input
                type="password"
                name="password"
                placeholder="Password (min. 6 characters)"
                value={formData.password}
                onChange={handleChange}
                className="bg-transparent outline-none flex-1 text-gray-900 dark:text-white"
                required
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-3">
              <Lock className="text-indigo-500" size={20} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="bg-transparent outline-none flex-1 text-gray-900 dark:text-white"
                required
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
          <a
            href={`${API_BASE}/user/google`}
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-center block transition"
          >
            Sign up with Google
          </a>
        </form>
      </motion.div>
    </div>
  );
};

export const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/user/login`, formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res.data.user.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 dark:from-blue-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/80 dark:bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-3">
            <Mail className="text-indigo-500" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="bg-transparent outline-none flex-1 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-3">
            <Lock className="text-indigo-500" size={20} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="bg-transparent outline-none flex-1 text-gray-900 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
          >
            Login
          </button>
          <a
            href={`${API_BASE}/user/google`}
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-center block transition"
          >
            Login with Google
          </a>
        </form>
      </motion.div>
    </div>
  );
};
