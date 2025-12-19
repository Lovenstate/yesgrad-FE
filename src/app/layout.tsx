import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ChatWidget from "@/components/ChatWidget";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YesGrad - Find Your Perfect Tutor | Online Tutoring Marketplace",
  description: "Connect with qualified tutors for personalized learning. Browse subjects, book sessions, and achieve your academic goals with YesGrad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      > <Header />
        {children}
        <ChatWidget />
        <Footer />
              </body>
    </html>
  );
}
