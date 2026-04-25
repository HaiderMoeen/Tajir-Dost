import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import BottomNav from "@/components/BottomNav";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tajir - Kiryana Store Manager",
  description: "A simple, zero-friction Hisaab and Udhar manager for Kiryana stores.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0", // Mobile-first lock
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 flex justify-center min-h-screen text-slate-900`}>
        {/* Mobile constrained wrapper for desktop viewing */}
        <div className="w-full max-w-md bg-white min-h-screen relative shadow-2xl overflow-x-hidden flex flex-col pb-16">
          <AppProvider>
            {children}
            <BottomNav />
            <Toaster position="top-center" />
          </AppProvider>
        </div>
      </body>
    </html>
  );
}
