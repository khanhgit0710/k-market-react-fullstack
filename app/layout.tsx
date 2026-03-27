import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'react-hot-toast';
import ChatAI from '@/components/layout/ChatAI'

export const metadata: Metadata = {
  title: "K-Market - Fullstack Store",
  description: "Build by Khanh Manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" />
        </head>
        <body>
          {children}
          <Toaster position="bottom-right" />
          <ChatAI />
        </body>
      </html>
    </ClerkProvider>
  );
}