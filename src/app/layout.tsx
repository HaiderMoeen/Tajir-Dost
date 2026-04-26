import type { Metadata } from "next";
import { Inter, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import BottomNav from "@/components/BottomNav";
import SideNav from "@/components/SideNav";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });
const notoNastaliq = Noto_Nastaliq_Urdu({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-urdu" });

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
      <body className={`${inter.className} ${notoNastaliq.variable} bg-gray-50 flex min-h-screen text-slate-900`}>
        <AppProvider>
          {/* Desktop Side Navigation */}
          <SideNav />

          {/* Main Content Area */}
          <div className="w-full md:pl-64 flex flex-col min-h-screen relative overflow-x-hidden">
            {children}
            
            {/* Mobile Bottom Navigation */}
            <BottomNav />
          </div>

          <Toaster position="top-center" />
        </AppProvider>
      </body>
    </html>
  );
}
