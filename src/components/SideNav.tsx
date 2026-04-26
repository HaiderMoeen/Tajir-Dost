"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Calculator, Settings, Store, User } from "lucide-react";
import clsx from "clsx";
import { useAppContext } from "@/context/AppContext";

export default function SideNav() {
  const pathname = usePathname();
  const { language } = useAppContext();

  const navItems = [
    { name: language === "en" ? "Home" : "Ghar", path: "/", icon: Home },
    { name: language === "en" ? "Udhar" : "Udhar", path: "/udhar", icon: BookOpen },
    { name: language === "en" ? "Hisaab" : "Hisaab", path: "/hisaab", icon: Calculator },
    { name: language === "en" ? "Settings" : "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 z-40 shadow-sm">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-gray-100 mb-6 bg-emerald-600">
        <Store className="text-white mr-3" size={28} />
        <span className="text-white font-bold text-xl tracking-wide">Tajir Dost</span>
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
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group",
                isActive 
                  ? "bg-emerald-50 text-emerald-700 font-bold" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-emerald-600 font-medium"
              )}
            >
              <Icon 
                size={22} 
                className={clsx(
                  "transition-transform group-hover:scale-110", 
                  isActive ? "text-emerald-600" : "text-gray-400 group-hover:text-emerald-500"
                )} 
              />
              <span className="text-[15px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Snippet (Bottom) */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
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
