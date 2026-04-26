"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { PlusCircle, TrendingUp, Banknote, User, AlertTriangle, Receipt, ArrowRight, Package } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import TourGuide from "@/components/TourGuide";

export default function Home() {
  const { udharList, inventory, language, hisaabLedger } = useAppContext();

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
    startHisaab: "Aaj ka Hisaab karte!",
    startHisaabUrdu: "آج کا حساب کرتے ہیں",
    pendingUdhar: "Udhaar",
    pendingUdharUrdu: "ادھار",
    needsRestocking: "Samaan Mangwaiye",
    needsRestockingUrdu: "سامان منگوائیے",
  };

  return (
    <main className="flex-1 bg-[#f0fbf9] min-h-screen flex flex-col relative pb-20 md:pb-6">
      <div className="w-full max-w-5xl mx-auto flex flex-col min-h-screen">
      <TourGuide />

      {/* Header Banner - Balanced Turquoise Redesign */}
      <div className="pt-6 px-6 pb-8 bg-[#1abc9c] text-white rounded-b-[2.5rem] shadow-xl flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black drop-shadow-md">{t.store}</h1>
          <p className="text-cyan-50 font-bold mt-1 opacity-90 drop-shadow-md">{t.greeting}</p>
        </div>
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner border border-white/30 shrink-0">
          <User size={28} className="text-white drop-shadow-sm" />
        </div>
      </div>

      <div className="p-4 md:p-6 flex-1">
        {/* Naya Hisaab CTA - Simplified Bilingual Layout */}
        <Link
          href="/hisaab"
          className="mb-8 p-6 rounded-[2rem] bg-[#1abc9c] text-white flex flex-col justify-between min-h-[140px] shadow-xl shadow-teal-500/20 active:scale-[0.98] transition-all tour-hisaab-btn"
        >
          <div className="flex justify-between items-start">
            <div className="bg-white/20 p-3 rounded-2xl">
              <PlusCircle size={24} className="text-white" />
            </div>
            <div className="bg-white/10 p-2 rounded-xl">
              <ArrowRight size={20} className="text-white/60" />
            </div>
          </div>

          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl md:text-2xl font-black leading-tight">{t.startHisaab}</h2>
            <h2 className="text-xl md:text-2xl font-bold opacity-90 text-right" style={{ fontFamily: 'var(--font-urdu)' }}>{t.startHisaabUrdu}</h2>
          </div>
        </Link>

        {/* Summary Tiles - Matching Hisaab Page Design */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Mahinay ka Munafa Tile */}
          <Link 
            href="/hisaab"
            className="bg-gradient-to-br from-emerald-500 to-teal-700 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] text-white shadow-xl shadow-emerald-500/20 flex flex-col justify-between min-h-[150px] md:min-h-[180px] active:scale-[0.98] transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                <TrendingUp size={22} className="text-white md:hidden" />
                <TrendingUp size={28} className="text-white hidden md:block" />
              </div>
            </div>
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-1.5">
                <p className="text-[10px] md:text-xs font-bold text-emerald-100 opacity-90 uppercase tracking-wider">Mahinay ka Munafa</p>
                <p className="text-xs md:text-lg font-bold text-emerald-50 opacity-90 text-right md:text-left" style={{ fontFamily: "var(--font-urdu)" }}>مہینے کا منافع</p>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-4xl font-black truncate leading-none">{formatCurrency(hisaabLedger.reduce((acc, h) => acc + (h.earnings - h.expenses), 0))}</h2>
            </div>
          </Link>

          {/* Udhaar Tile */}
          <Link 
            href="/udhar"
            className="bg-gradient-to-br from-yellow-500 to-orange-600 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] text-white shadow-xl shadow-yellow-500/20 flex flex-col justify-between min-h-[150px] md:min-h-[180px] active:scale-[0.98] transition-all tour-udhar-card"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                <Receipt size={22} className="text-white md:hidden" />
                <Receipt size={28} className="text-white hidden md:block" />
              </div>
            </div>
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-1.5">
                <p className="text-[10px] md:text-xs font-bold text-yellow-100 opacity-90 uppercase tracking-wider">Udhaar</p>
                <p className="text-xs md:text-lg font-bold text-yellow-50 opacity-90 text-right md:text-left" style={{ fontFamily: "var(--font-urdu)" }}>ادھار</p>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-4xl font-black truncate leading-none">{formatCurrency(totalPendingUdhar)}</h2>
            </div>
          </Link>
        </div>

        {/* Samaan mangwaiye Section - Detailed List */}
        {lowStockItems.length > 0 && (
          <section className="mb-10 tour-tajir-widget">
            <div className="flex items-center justify-between mb-5 px-2">
              <h2 className="text-base md:text-xl font-bold text-gray-800 flex items-center gap-2 tracking-tight">
                {t.needsRestocking}
                <span className="bg-red-500 text-white text-[10px] md:text-xs font-black px-2 py-0.5 rounded-full shadow-md">{lowStockItems.length}</span>
              </h2>
              <h2 className="text-lg md:text-2xl font-bold text-gray-700 text-right" style={{ fontFamily: "var(--font-urdu)" }}>{t.needsRestockingUrdu}</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {lowStockItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-[#f5efe6] border border-[#d4b896] rounded-[2rem] p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center w-full sm:w-auto gap-4">
                    {/* Item Image */}
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/50 rounded-2xl overflow-hidden flex-shrink-0 border border-[#d4b896]/30 shadow-inner group-hover:scale-105 transition-transform text-gray-400">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/30">
                          <Package size={28} />
                        </div>
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-x-2 mb-0.5">
                        <h3 className="font-black text-gray-900 text-sm md:text-lg truncate">{item.name}</h3>
                        <span className="text-[9px] md:text-xs font-black bg-rose-50 text-rose-600 px-2 py-0.5 rounded-lg border border-rose-100 whitespace-nowrap">
                          {item.stock} left
                        </span>
                      </div>
                      <p className="text-lg md:text-2xl font-bold text-gray-800 leading-tight" style={{ fontFamily: 'var(--font-urdu)' }}>{item.nameUrdu}</p>
                    </div>
                  </div>

                  {/* Reorder Button (Pushed to right on laptop) */}
                  <button 
                    onClick={() => toast.success(`${item.name} ordered from Tajir!`)}
                    className="w-full sm:w-auto sm:ml-auto bg-[#1abc9c] text-white px-5 md:px-8 py-3.5 md:py-4 rounded-2xl md:rounded-3xl shadow-xl shadow-teal-500/20 active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5 sm:min-w-[140px] md:min-w-[180px] group/btn"
                  >
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-wider leading-none">Dobara Mangwayein</span>
                    <span className="text-sm md:text-lg font-bold leading-none" style={{ fontFamily: 'var(--font-urdu)' }}>دوبارہ منگوائیں</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      </div>
    </main>
  );
}
