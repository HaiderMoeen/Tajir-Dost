"use client";

import React, { useState } from "react";
import { Plus, MessageCircle, CheckCircle2, User, Phone, DollarSign } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

export default function UdharPage() {
  const { udharList, markUdharPaid, addUdhar, language } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(amount);
  };

  const t = {
    title: language === "en" ? "Udhar Book" : "Udhar Khata",
    empty: language === "en" ? "No pending Udhar. Great job!" : "Koi Udhar baqi nahi. Zabardast!",
    daysOverdue: (days: number) => language === "en" ? `${days} days overdue` : `${days} din oopar`,
    remind: language === "en" ? "Remind" : "Yaad Dilayein",
    markPaid: language === "en" ? "Paid" : "Wasool",
    addNew: language === "en" ? "Add New Udhar" : "Naya Udhar Likhain",
    name: language === "en" ? "Customer Name" : "Gahak Ka Naam",
    phone: language === "en" ? "Phone Number" : "Phone Number",
    amount: language === "en" ? "Amount (Rs)" : "Raqam (Rs)",
    save: language === "en" ? "Save Udhar" : "Mahfooz Karein",
    cancel: language === "en" ? "Cancel" : "Wapis",
    message: (name: string, amount: number) => language === "en" 
      ? `Assalam-o-Alaikum ${name}, aap ka Bismillah Store par Rs. ${amount} ka udhar pending hai. Barae meherbani jald clear kar dein.`
      : `Assalam-o-Alaikum ${name}, aap ka Bismillah Store par Rs. ${amount} ka udhar pending hai. Barae meherbani jald clear kar dein.`
  };

  const handleSendReminder = (name: string, phone: string, amount: number) => {
    const text = encodeURIComponent(t.message(name, amount));
    // For MVP, we assume the phone is in Pakistan format starting with 0, convert to 92
    const formattedPhone = phone.startsWith("0") ? "92" + phone.slice(1) : phone;
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, "_blank");
  };

  const handleAddUdhar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAmount) return;
    
    addUdhar({
      name: newName,
      phone: newPhone || "03000000000", // dummy if empty
      amount: parseInt(newAmount),
      daysOverdue: 0,
    });
    
    setNewName("");
    setNewPhone("");
    setNewAmount("");
    setShowModal(false);
    toast.success(language === "en" ? "Udhar added successfully" : "Udhar darj ho gaya");
  };

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-4 pb-24 md:p-8 relative min-h-screen">
      <div className="max-w-4xl mx-auto">
      <header className="mb-6 pt-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
      </header>

      {udharList.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <CheckCircle2 size={48} className="mb-4 text-emerald-300" />
          <p className="text-lg font-medium">{t.empty}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {udharList.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-rose-500 font-medium">{t.daysOverdue(item.daysOverdue)}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-gray-900">{formatCurrency(item.amount)}</span>
                </div>
              </div>
              
              <div className="flex gap-2 border-t border-gray-50 pt-3 mt-2">
                <button
                  onClick={() => handleSendReminder(item.name, item.phone, item.amount)}
                  className="flex-1 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle size={18} />
                  {t.remind}
                </button>
                <button
                  onClick={() => {
                    markUdharPaid(item.id);
                    toast.success(language === "en" ? "Udhar cleared" : "Udhar wasool ho gaya");
                  }}
                  className="flex-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle2 size={18} />
                  {t.markPaid}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 right-4 sm:right-[calc(50%-13rem)] w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-600/30 hover:bg-emerald-700 active:scale-95 transition-all z-40"
      >
        <Plus size={28} />
      </button>

      {/* Add Udhar Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-6 text-gray-900">{t.addNew}</h2>
            
            <form onSubmit={handleAddUdhar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.name}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Ali Bhai"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="03001234567"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.amount}</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="number"
                    required
                    min="1"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="1500"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </main>
  );
}
