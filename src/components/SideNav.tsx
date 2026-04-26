"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Calculator, Settings, Store, User, Package } from "lucide-react";
import clsx from "clsx";
import { useAppContext } from "@/context/AppContext";

export default function SideNav() {
  const pathname = usePathname();
  const { language, inventory } = useAppContext();

  const lowStockCount = inventory.filter(i => i.stock <= i.lowStockThreshold).length;

  const navItems = [
    { name: language === "en" ? "Home"             : "Ghar",             path: "/",          icon: Home      },
    { name: language === "en" ? "Hisaab Kitaab"    : "حساب کتاب",         path: "/hisaab",    icon: Calculator},
    { name: language === "en" ? "Udhaar"           : "ادھار",             path: "/udhar",     icon: BookOpen  },
    { name: language === "en" ? "Dukaan ka Samaan" : "دکان کا سامان",      path: "/inventory", icon: Package,  badge: lowStockCount },
    { name: language === "en" ? "Settings"         : "سیٹنگز",            path: "/settings",  icon: Settings  },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-[#f0fbf9] border-r border-[#1abc9c]/10 min-h-screen fixed left-0 top-0 z-40 shadow-sm">
      {/* Brand Header - Brand Color Redesign */}
      <div className="h-20 flex items-center px-6 border-b border-gray-100 mb-6 bg-[#1abc9c]">
        <Store className="text-white mr-3" size={28} />
        <span className="text-white font-black text-xl tracking-wide">Tajir Dost</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={clsx(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative",
                isActive
                  ? "bg-[#1abc9c]/10 text-[#1abc9c] font-black"
                  : "text-gray-500 hover:bg-gray-50 hover:text-[#1abc9c] font-medium"
              )}
            >
              <div className="relative">
                <Icon
                  size={22}
                  className={clsx(
                    "transition-transform group-hover:scale-110",
                    isActive ? "text-[#1abc9c]" : "text-gray-400 group-hover:text-[#1abc9c]/70"
                  )}
                />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[15px]">{item.name}</span>
              {item.badge && item.badge > 0 && (
                <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge} low
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Snippet (Bottom) */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="w-10 h-10 bg-[#1abc9c]/10 rounded-full flex items-center justify-center text-[#1abc9c] flex-shrink-0">
            <User size={20} />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-gray-900 truncate">Manzoor Ali</p>
            <p className="text-xs text-gray-500 truncate">Bismillah General Store</p>
          </div>
        </div>
      </div>
    </div>
  );
}
