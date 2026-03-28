"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeProvider({ children, ...props }: any) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ĐỪNG RETURN CHILDREN THÔ Ở ĐÂY NỮA
  // Hãy luôn bọc NextThemesProvider, chỉ ẩn nội dung bên trong nếu chưa mounted để tránh hydrations error
  return (
    <NextThemesProvider {...props}>
      <div style={{ visibility: mounted ? "visible" : "hidden" }}>
        {children}
      </div>
    </NextThemesProvider>
  );
}