"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Calculator, Settings, Package } from "lucide-react";
import clsx from "clsx";
import { useAppContext } from "@/context/AppContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { language, inventory } = useAppContext();

  const lowStockCount = inventory.filter(i => i.stock <= i.lowStockThreshold).length;

  const navItems = [
    { name: language === "en" ? "Home"             : "Ghar",             path: "/",          icon: Home      },
    { name: language === "en" ? "Hisaab Kitaab"    : "حساب کتاب",         path: "/hisaab",    icon: Calculator},
    { name: language === "en" ? "Udhaar"           : "ادھار",             path: "/udhar",     icon: BookOpen  },
    { name: language === "en" ? "Dukaan ka Samaan" : "دکان کا سامان",      path: "/inventory", icon: Package, badge: lowStockCount },
    { name: language === "en" ? "Settings"         : "سیٹنگز",            path: "/settings",  icon: Settings  },
  ];

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-[#f0fbf9] border-t border-[#1abc9c]/10 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={clsx(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative",
                isActive ? "text-[#1abc9c]" : "text-gray-400 hover:text-[#1abc9c]/80"
              )}
            >
              <div className="relative">
                <Icon size={22} className={clsx(isActive && "fill-[#1abc9c]/20")} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold leading-none">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
