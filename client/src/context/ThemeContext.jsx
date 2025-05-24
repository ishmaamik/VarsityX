import React, { createContext, useState, useEffect, useContext } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    // Check for saved theme or user preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const toggle = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
  };

  useEffect(() => {
    // Apply to root element
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(mode);
    root.style.colorScheme = mode; // This helps with native form controls
    
    // Save preference
    localStorage.setItem('theme', mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};