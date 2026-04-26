"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Calculator, Settings } from "lucide-react";
import clsx from "clsx";
import { useAppContext } from "@/context/AppContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { language } = useAppContext();

  const navItems = [
    { name: language === "en" ? "Home" : "Ghar", path: "/", icon: Home },
    { name: language === "en" ? "Udhar" : "Udhar", path: "/udhar", icon: BookOpen },
    { name: language === "en" ? "Hisaab" : "Hisaab", path: "/hisaab", icon: Calculator },
    { name: language === "en" ? "Settings" : "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={clsx(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-emerald-600" : "text-gray-400 hover:text-emerald-500"
              )}
            >
              <Icon size={24} className={clsx(isActive && "fill-emerald-100/50")} />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
