"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusCircle, ShoppingCart, TrendingUp, AlertTriangle } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import TourGuide from "@/components/TourGuide";

export default function Home() {
  const router = useRouter();
  const { earnings, udharList, inventory, restockItem, language } = useAppContext();

  const totalPendingUdhar = useMemo(() => {
    return udharList.reduce((sum, item) => sum + item.amount, 0);
  }, [udharList]);

  const lowStockItems = useMemo(() => {
    return inventory.filter((item) => item.stock <= item.lowStockThreshold);
  }, [inventory]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(amount);
  };

  const t = {
    greeting: language === "en" ? "Hello, Manzoor Bhai 👋" : "Assalam o Alaikum, Manzoor Bhai 👋",
    store: "Bismillah General Store",
    startHisaab: language === "en" ? "Start Daily Hisaab" : "Aaj ka Hisaab Karein",
    todaySales: language === "en" ? "Today's Sales" : "Aaj ki Sales",
    pendingUdhar: language === "en" ? "Total Pending Udhar" : "Kul Baqi Udhar",
    needsRestocking: language === "en" ? "Needs Restocking" : "Samaan Mangwayein",
    reorder: language === "en" ? "Reorder on Tajir" : "Tajir se Mangwayein",
    stockStatus: (stock: number) => language === "en" ? `Only ${stock} left in stock` : `Sirf ${stock} reh gaye`,
  };

  const handleRestock = (id: string) => {
    restockItem(id);
    toast.success(language === "en" ? "Added to Tajir Cart" : "Tajir Cart mein shamil ho gaya", {
      icon: "🛒",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-4 pb-20">
      <TourGuide />

      {/* Header */}
      <header className="mb-8 mt-2">
        <h1 className="text-2xl font-bold text-gray-900">{t.store}</h1>
        <p className="text-gray-500 mt-1">{t.greeting}</p>
      </header>

      {/* Primary CTA */}
      <div className="mb-8 tour-hisaab-btn">
        <Link
          href="/hisaab"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-emerald-600/20 active:scale-95 transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/30 p-2 rounded-xl">
              <PlusCircle className="text-white" size={28} />
            </div>
            <span className="text-xl font-semibold tracking-wide">{t.startHisaab}</span>
          </div>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link href="/hisaab" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2 active:bg-gray-50">
          <div className="flex items-center gap-2 text-emerald-600">
            <TrendingUp size={18} />
            <span className="text-sm font-medium">{t.todaySales}</span>
          </div>
          <span className="text-xl font-bold text-gray-900">{formatCurrency(earnings)}</span>
        </Link>

        <Link href="/udhar" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2 active:bg-gray-50 tour-udhar-card">
          <div className="flex items-center gap-2 text-rose-500">
            <AlertTriangle size={18} />
            <span className="text-sm font-medium">{t.pendingUdhar}</span>
          </div>
          <span className="text-xl font-bold text-gray-900">{formatCurrency(totalPendingUdhar)}</span>
        </Link>
      </div>

      {/* Tajir Integration Widget */}
      {lowStockItems.length > 0 && (
        <section className="mb-6 tour-tajir-widget">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">{t.needsRestocking}</h2>
            <div className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
              Tajir Integration
            </div>
          </div>

          <div className="space-y-3">
            {lowStockItems.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-orange-100 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-orange-500 font-medium">{t.stockStatus(item.stock)}</p>
                </div>
                <button
                  onClick={() => handleRestock(item.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors active:scale-95"
                >
                  <ShoppingCart size={16} />
                  <span className="hidden sm:inline">{t.reorder}</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
