"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusCircle, ShoppingCart, TrendingUp, Banknote, Store } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import TourGuide from "@/components/TourGuide";

export default function Home() {
  const router = useRouter();
  const { earnings, expenses, udharList, inventory, restockItem, language } = useAppContext();

  const totalPendingUdhar = useMemo(() => {
    return udharList.reduce((sum, item) => sum + item.amount, 0);
  }, [udharList]);

  const lowStockItems = useMemo(() => {
    return inventory.filter((item) => item.stock <= item.lowStockThreshold);
  }, [inventory]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(amount);
  };

  const munafa = earnings - expenses;

  const t = {
    greeting: language === "en" ? "Hello, Manzoor Bhai 👋" : "Assalam o Alaikum, Manzoor Bhai 👋",
    store: "Bismillah General Store",
    startHisaab: "Aaj ka Hisaab karte!",
    startHisaabUrdu: "(آج کا حساب کرتے ہیں!)",
    todaySales: "Aaj ka Munafa",
    todaySalesUrdu: "(آج کا منافع)",
    pendingUdhar: "Udhaar",
    pendingUdharUrdu: "(ادھار)",
    needsRestocking: "Samaan Mangwaiye",
    needsRestockingUrdu: "(سامان منگوائیے)",
    reorder: "Tajir se Mangwayein (تاجر سے منگوائیں)",
    stockStatus: (stock: number) => `Sirf ${stock} reh gaye (صرف ${stock} رہ گئے)`,
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
    <main className="flex-1 overflow-y-auto bg-gray-50 p-4 pb-24 md:p-8">
      <div className="max-w-5xl mx-auto">
      <TourGuide />

      {/* Header */}
      <header className="mb-8 mt-2">
        <h1 className="text-2xl font-bold text-gray-900">{t.store}</h1>
        <p className="text-gray-500 mt-1">{t.greeting}</p>
      </header>

      {/* Consolidated Top Grid: Hisaab CTA, Munafa, Udhar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        
        {/* Primary CTA as a Card */}
        <Link
          href="/hisaab"
          className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white flex flex-col justify-between min-h-[140px] shadow-xl shadow-emerald-600/30 active:scale-[0.98] transition-all tour-hisaab-btn"
        >
          <div className="flex items-center gap-2">
            <PlusCircle size={20} />
            <span className="text-sm font-bold leading-tight uppercase tracking-wider text-emerald-100">Naya Hisaab</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-black leading-tight">{t.startHisaab}</span>
            <span className="text-xl font-bold mt-2 text-emerald-100" style={{ fontFamily: 'var(--font-urdu)' }}>{t.startHisaabUrdu}</span>
          </div>
        </Link>

        {/* Munafa Card */}
        <Link 
          href="/hisaab" 
          className={`p-6 rounded-3xl shadow-md border flex flex-col justify-between min-h-[140px] active:scale-[0.98] transition-all ${munafa >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}
        >
          <div className={`flex items-start gap-2 ${munafa >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
            <TrendingUp size={20} className="mt-0.5" />
            <div className="flex flex-row flex-wrap items-center gap-x-2">
              <span className="text-sm font-bold leading-tight">{t.todaySales}</span>
              <span className="text-xl font-bold leading-tight" style={{ fontFamily: 'var(--font-urdu)' }}>{t.todaySalesUrdu}</span>
            </div>
          </div>
          <span className={`text-2xl font-black ${munafa >= 0 ? 'text-emerald-800' : 'text-red-800'}`}>{formatCurrency(munafa)}</span>
        </Link>

        {/* Udhar Card */}
        <Link 
          href="/udhar" 
          className="bg-yellow-50 p-6 rounded-3xl shadow-md border border-yellow-200 flex flex-col justify-between min-h-[140px] active:scale-[0.98] transition-all tour-udhar-card"
        >
          <div className="flex items-start gap-2 text-yellow-700">
            <Banknote size={20} className="mt-0.5" />
            <div className="flex flex-row flex-wrap items-center gap-x-2">
              <span className="text-sm font-bold leading-tight">{t.pendingUdhar}</span>
              <span className="text-xl font-bold leading-tight" style={{ fontFamily: 'var(--font-urdu)' }}>{t.pendingUdharUrdu}</span>
            </div>
          </div>
          <span className="text-2xl font-black text-yellow-900">{formatCurrency(totalPendingUdhar)}</span>
        </Link>

      </div>

      {/* Tajir Integration Widget */}
      {lowStockItems.length > 0 && (
        <section className="mb-6 tour-tajir-widget">
          <div className="flex flex-col mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{t.needsRestocking}</h2>
              <div className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                Tajir Integration
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-4" style={{ fontFamily: 'var(--font-urdu)' }}>{t.needsRestockingUrdu}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {lowStockItems.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-3xl shadow-md border border-orange-100 flex flex-col h-full min-h-[300px]">
                <h3 className="font-semibold text-gray-800 text-lg leading-tight text-center">{item.name}</h3>
                <h4 className="font-bold text-gray-600 text-xl mt-1 text-center" style={{ fontFamily: 'var(--font-urdu)' }}>
                  {item.id === 'i1' ? 'شان بریانی مصالحہ' : item.id === 'i2' ? 'نیسلے ملک پیک 1 لیٹر' : ''}
                </h4>
                
                <img 
                  src={item.id === 'i1' ? '/shan_biryani.png' : item.id === 'i2' ? '/milkpak.png' : '/file.svg'} 
                  alt={item.name} 
                  className="w-full h-40 object-contain my-4 mix-blend-multiply"
                />

                <p className="text-xl text-orange-500 font-bold mb-4 text-center" style={{ fontFamily: 'var(--font-urdu)' }}>
                  {t.stockStatus(item.stock)}
                </p>

                <div className="mt-auto">
                  <button
                    onClick={() => handleRestock(item.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl flex items-center justify-center gap-3 transition-colors active:scale-95 shadow-lg shadow-blue-600/20"
                  >
                    <ShoppingCart size={22} />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    <Store size={22} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      </div>
    </main>
  );
}
