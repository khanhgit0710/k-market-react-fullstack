import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'react-hot-toast';
import ChatAI from '@/components/layout/ChatAI';
import { ThemeProvider } from "@/components/layout/ThemeProvider";

export const metadata: Metadata = {
  title: "K-Market - Fullstack Store",
  description: "Built by Khanh Manager", // Đã sửa lỗi chính tả Build -> Built cho chuẩn tiếng Anh Senior nha!
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="vi" suppressHydrationWarning>
        <head>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" />
        </head>
        <body className="bg-[#f5f5f5] dark:bg-gray-900 transition-colors duration-300">
          <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
            <Toaster position="bottom-right" />
            <ChatAI />  
          </ThemeProvider>
          </ClerkProvider>
        </body>
      </html>
  );
}