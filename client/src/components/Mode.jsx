import React from "react";
import { useTheme } from "../context/ThemeContext";

const DarkModeToggle = () => {
  const { toggle, mode } = useTheme();

  return (
    <div
      className="w-10 h-6 border-2 border-[#53c28b70] rounded-full flex items-center justify-between p-1 cursor-pointer relative"
      onClick={toggle}
      role="button"
      aria-label={`Toggle ${mode === "dark" ? "light" : "dark"} mode`}
    >
      <div className="text-xs">🌙</div>
      <div className="text-xs">🔆</div>
      <div
        className={`w-4 h-4 rounded-full absolute transition-all ${
          mode === "light"
            ? "bg-[#FFE4B5] left-1"
            : "bg-[#FFE4B5] right-1"
        }`}
      />
    </div>
  );
};

export default DarkModeToggle;
