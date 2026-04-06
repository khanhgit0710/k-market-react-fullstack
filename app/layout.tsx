import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'react-hot-toast';
import ChatAI from '@/components/layout/ChatAI';
import { ThemeProvider } from "@/components/layout/ThemeProvider";

export const metadata: Metadata = {
  title: "K-Market | Fullstack E-commerce Store",
  description: "A professional e-commerce platform built with Next.js 15, Tailwind CSS, and MongoDB. Developed by Minh Khánh.",
  // Thêm cái này để tăng điểm SEO cho CV
  keywords: ["ReactJS", "Next.js", "Front-end Developer", "E-commerce project"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning ở đây sẽ giúp bỏ qua lỗi mismatch do Dark Reader/Themes gây ra
    <html lang="vi" suppressHydrationWarning>
      <body className="bg-[#f5f5f5] dark:bg-gray-900 transition-colors duration-300 antialiased">
        <ClerkProvider>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="light" 
            enableSystem 
            disableTransitionOnChange // Thêm cái này để tránh bị "nháy" màu khi đổi trang
          >
            {children}
            <Toaster position="bottom-right" />
            <ChatAI />  
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}