"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true),[]);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
      title="Chế độ Tối/Sáng"
    >
      {theme === "dark" ? (
        <i className="fa-solid fa-sun text-yellow-400 text-xl"></i>
      ) : (
        <i className="fa-solid fa-moon text-gray-600 text-xl"></i>
      )}
    </button>
  );
}