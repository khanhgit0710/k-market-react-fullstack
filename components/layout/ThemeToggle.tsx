"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MoonStar, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true),[]);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-7 h-7 flex items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-white/25 to-white/5 backdrop-blur-sm hover:from-white/35 hover:to-white/10 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_4px_14px_rgba(0,0,0,0.18)]"
      title="Chế độ Tối/Sáng"
      aria-label="Chế độ Tối/Sáng"
    >
      {theme === "dark" ? (
        <Sun size={18} className="text-amber-300 drop-shadow-[0_0_6px_rgba(252,211,77,0.65)]" />
      ) : (
        <MoonStar size={18} className="text-amber-300 drop-shadow-[0_0_6px_rgba(252,211,77,0.65)]" />
      )}
    </button>
  );
}