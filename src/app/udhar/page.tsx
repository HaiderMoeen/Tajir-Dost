"use client";

import React, { useState } from "react";
import { Plus, MessageCircle, CheckCircle2, User, Phone, DollarSign, CalendarDays } from "lucide-react";
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
    dateTaken: (days: number) => {
      const d = new Date();
      d.setDate(d.getDate() - days);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    },
    remind: language === "en" ? "Remind" : "Yaad Dilayein",
    markPaid: language === "en" ? "Paid" : "Wasool",
    addNew: language === "en" ? "New Udhaar" : "Naya Udhar",
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
    <main className="flex-1 bg-white min-h-screen flex flex-col relative pb-20 md:pb-6">
      <div className="w-full max-w-5xl mx-auto flex flex-col min-h-screen">
      <div className="pt-6 px-6 pb-6 bg-yellow-400 text-white rounded-b-3xl shadow-md flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold drop-shadow-md">Udhaar</h1>
            <h1 className="text-3xl font-bold drop-shadow-md" style={{ fontFamily: 'var(--font-urdu)' }}>(ادھار)</h1>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-white text-yellow-600 px-4 py-2 rounded-2xl shadow-md active:scale-95 transition-all flex items-center gap-2">
          <span className="font-bold text-sm">+ {t.addNew}</span>
          <span className="font-bold text-xl" style={{ fontFamily: 'var(--font-urdu)' }}>(نیا ادھار)</span>
        </button>
      </div>

      {udharList.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <CheckCircle2 size={48} className="mb-4 text-emerald-300" />
          <p className="text-lg font-medium">{t.empty}</p>
        </div>
      ) : (
        <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {udharList.map((item) => (
            <div key={item.id} className="bg-yellow-400 hover:bg-yellow-500 shadow-lg shadow-yellow-400/40 rounded-3xl p-5 flex flex-col justify-between min-h-[160px] transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white drop-shadow-md leading-tight">{item.name}</h3>
                  <p className="text-sm text-yellow-100 font-medium drop-shadow-md mt-0.5">{item.phone}</p>
                  <div className="flex items-center gap-1.5 text-sm text-yellow-50 font-bold mt-2 drop-shadow-md">
                    <CalendarDays size={14} />
                    <span>{t.dateTaken(item.daysOverdue)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-white drop-shadow-md">{formatCurrency(item.amount)}</span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2 mt-auto">
                <button
                  onClick={() => handleSendReminder(item.name, item.phone, item.amount)}
                  className="flex-1 bg-white text-[#25D366] hover:bg-gray-50 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageCircle size={18} />
                  {t.remind}
                </button>
                <button
                  onClick={() => {
                    markUdharPaid(item.id);
                    toast.success(language === "en" ? "Udhar cleared" : "Udhar wasool ho gaya");
                  }}
                  className="flex-1 bg-white text-yellow-600 hover:bg-yellow-50 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <CheckCircle2 size={18} />
                  {t.markPaid}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}



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
