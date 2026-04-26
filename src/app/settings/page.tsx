"use client";

import React, { useState } from "react";
import { User, RotateCcw, LogOut, ChevronRight, X, Smartphone, Store, CreditCard, Hash } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { language, setHasSeenTutorial, profile, updateProfile } = useAppContext();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState(profile);

  const t = {
    title: language === "en" ? "Settings" : "سیٹنگز",
    tutorialTitle: language === "en" ? "Tutorial Dobara Dekhein" : "ٹیوٹوریل دوبارہ دیکھیں",
    tutorialDesc: language === "en" ? "App kaise chalani hai, dobara seekhein" : "ایپ کیسے چلانی ہے، دوبارہ سیکھیں",
    logoutTitle: language === "en" ? "Log Out" : "لاگ آؤٹ",
    logoutDesc: language === "en" ? "App se bahar nikalne ke liye" : "ایپ سے باہر نکلنے کے لیے",
    edit: language === "en" ? "Edit" : "تبدیل کریں",
    save: language === "en" ? "Save Info" : "محفوظ کریں",
  };

  const handleResetTour = () => {
    setHasSeenTutorial(false);
    toast.success(language === "en" ? "Tutorial reset! Go to Home." : "Tutorial reset ho gaya! Home par jayein.");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(editForm);
    setShowEditModal(false);
    toast.success(language === "en" ? "Profile updated!" : "معلومات محفوظ ہوگئیں!");
  };

  return (
    <main className="flex-1 bg-[#f0fbf9] min-h-screen flex flex-col relative pb-20 md:pb-6">
      <div className="w-full max-w-5xl mx-auto flex flex-col min-h-screen">
        {/* Header - Brand Turquoise */}
        <div className="pt-6 px-6 pb-8 bg-[#1abc9c] text-white rounded-b-[2.5rem] shadow-xl flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black drop-shadow-md">{t.title}</h1>
          </div>
        </div>
        
        <div className="p-4 md:p-6 flex-1">
          {/* Profile Section with Bank Info */}
          <section className="bg-white rounded-[2.5rem] shadow-sm border border-[#1abc9c]/10 p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6">
               <button 
                onClick={() => { setEditForm(profile); setShowEditModal(true); }}
                className="text-[#1abc9c] font-black text-xs md:text-sm bg-[#1abc9c]/10 px-4 py-2 rounded-xl active:scale-95 transition-all border border-[#1abc9c]/20"
               >
                 {t.edit}
               </button>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-[#1abc9c]/10 rounded-full flex items-center justify-center text-[#1abc9c] mb-4 border-2 border-[#1abc9c]/5">
                <User size={48} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">{profile.name}</h2>
              <p className="text-gray-500 font-bold text-lg mt-1">{profile.phone}</p>
              
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <div className="bg-[#1abc9c] text-white text-[10px] md:text-xs font-black px-4 py-1.5 rounded-full shadow-md shadow-[#1abc9c]/20 uppercase tracking-widest">
                  {profile.storeName}
                </div>
                <div className="bg-orange-100 text-orange-700 text-[10px] md:text-xs font-black px-4 py-1.5 rounded-full border border-orange-200">
                  {profile.bankName}: {profile.accountNumber}
                </div>
              </div>
            </div>
          </section>

          {/* Simplified Action List */}
          <div className="space-y-4">
             {/* Restart Tutorial */}
             <button 
               onClick={handleResetTour} 
               className="w-full bg-white p-5 rounded-[2rem] flex items-center justify-between shadow-sm border border-[#1abc9c]/10 active:scale-[0.98] transition-all group"
             >
                <div className="flex items-center gap-4">
                   <div className="bg-[#1abc9c]/10 p-4 rounded-2xl text-[#1abc9c] group-hover:scale-110 transition-transform">
                     <RotateCcw size={24} />
                   </div>
                   <div className="text-left">
                      <p className="font-black text-gray-900 text-lg">{t.tutorialTitle}</p>
                      <p className="text-gray-500 text-sm font-bold opacity-80">{t.tutorialDesc}</p>
                   </div>
                </div>
                <ChevronRight size={24} className="text-[#1abc9c]/30" />
             </button>

             {/* Logout */}
             <button 
               className="w-full bg-white p-5 rounded-[2rem] flex items-center justify-between shadow-sm border border-rose-100 active:scale-[0.98] transition-all group"
             >
                <div className="flex items-center gap-4">
                   <div className="bg-rose-50 p-4 rounded-2xl text-rose-600 group-hover:scale-110 transition-transform">
                     <LogOut size={24} />
                   </div>
                   <div className="text-left">
                      <p className="font-black text-rose-600 text-lg">{t.logoutTitle}</p>
                      <p className="text-rose-400 text-sm font-bold opacity-80">{t.logoutDesc}</p>
                   </div>
                </div>
             </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-gray-900">{t.edit}</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 bg-gray-50 rounded-full text-gray-400">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="opacity-60 pointer-events-none">
                <label className="block text-sm font-black text-gray-700 mb-1">Naam (Name)</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" disabled value={editForm.name} className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl outline-none cursor-not-allowed" />
                </div>
              </div>

              <div className="opacity-60 pointer-events-none">
                <label className="block text-sm font-black text-gray-700 mb-1">Phone</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="tel" disabled value={editForm.phone} className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl outline-none cursor-not-allowed" />
                </div>
              </div>

              <div className="opacity-60 pointer-events-none">
                <label className="block text-sm font-black text-gray-700 mb-1">Dukaan ka Naam (Store)</label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" disabled value={editForm.storeName} className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl outline-none cursor-not-allowed" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-1">Bank (Easypaisa)</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" required value={editForm.bankName} onChange={e => setEditForm({...editForm, bankName: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1abc9c] outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-1">Account #</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" required value={editForm.accountNumber} onChange={e => setEditForm({...editForm, accountNumber: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1abc9c] outline-none" />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-[#1abc9c] text-white font-black text-lg rounded-2xl shadow-lg active:scale-95 transition-all mt-6">
                {t.save}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
