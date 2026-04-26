"use client";

import React from "react";
import { User, Globe, RotateCcw, Shield, Bell, ChevronRight, LogOut, Trash2 } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { language, setLanguage, setHasSeenTutorial, resetData } = useAppContext();

  const t = {
    title: language === "en" ? "Settings" : "Settings",
    profile: language === "en" ? "Profile" : "Profile",
    name: "Manzoor Ali",
    phone: "0300-1234567",
    store: "Bismillah General Store",
    preferences: language === "en" ? "Preferences" : "Pasandeeda",
    langToggle: language === "en" ? "Language (English/Urdu)" : "Zaban (English/Urdu)",
    resetTour: language === "en" ? "Restart Tutorial" : "Tutorial Dobara Dekhein",
    resetData: language === "en" ? "Reset All Data" : "Saara Data Delete Karein",
    notifications: language === "en" ? "Notifications" : "Itlaat",
    privacy: language === "en" ? "Privacy & Security" : "Privacy & Hifazat",
    logout: language === "en" ? "Log Out" : "Log Out",
  };

  const handleResetTour = () => {
    setHasSeenTutorial(false);
    toast.success(language === "en" ? "Tutorial reset! Go to Home." : "Tutorial reset ho gaya! Home par jayein.");
  };

  const handleResetData = () => {
    if (confirm(language === "en" ? "Are you sure you want to reset all data?" : "Kiya aap waqai saara data delete karna chahte hain?")) {
      resetData();
      toast.success(language === "en" ? "Data reset successfully" : "Data delete ho gaya");
    }
  };

  return (
    <main className="flex-1 bg-white min-h-screen flex flex-col relative pb-20 md:pb-6">
      <div className="w-full max-w-5xl mx-auto flex flex-col min-h-screen">
      <div className="pt-6 px-6 pb-6 bg-slate-800 text-white rounded-b-3xl shadow-md flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="text-slate-300 text-sm font-medium mt-1">App Configuration</p>
        </div>
      </div>
      
      <div className="p-4 md:p-6 flex-1">
      {/* Profile Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
          <User size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t.name}</h2>
          <p className="text-gray-500 text-sm">{t.phone}</p>
          <div className="mt-1 bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded-md inline-block">
            {t.store}
          </div>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="mb-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">{t.preferences}</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          <div className="flex items-center justify-between p-4 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><Globe size={20} /></div>
              <span className="font-medium text-gray-700">{t.langToggle}</span>
            </div>
            <button
              onClick={() => setLanguage(language === "en" ? "ur" : "en")}
              className={`w-14 h-8 rounded-full transition-colors relative ${language === 'ur' ? 'bg-emerald-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm transition-all duration-300 ${language === 'ur' ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          <button onClick={handleResetTour} className="w-full flex items-center justify-between p-4 border-b border-gray-50 active:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="bg-purple-50 p-2 rounded-xl text-purple-600"><RotateCcw size={20} /></div>
              <span className="font-medium text-gray-700">{t.resetTour}</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          
          <button onClick={handleResetData} className="w-full flex items-center justify-between p-4 active:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="bg-rose-50 p-2 rounded-xl text-rose-600"><Trash2 size={20} /></div>
              <span className="font-medium text-gray-700">{t.resetData}</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>

        </div>
      </section>

      {/* Other Settings (Mock) */}
      <section className="mb-8">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">More</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          <div className="flex items-center justify-between p-4 border-b border-gray-50 opacity-60">
            <div className="flex items-center gap-3">
              <div className="bg-orange-50 p-2 rounded-xl text-orange-600"><Bell size={20} /></div>
              <span className="font-medium text-gray-700">{t.notifications}</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>

          <div className="flex items-center justify-between p-4 opacity-60">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-xl text-gray-600"><Shield size={20} /></div>
              <span className="font-medium text-gray-700">{t.privacy}</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>

        </div>
      </section>

      {/* Logout */}
      <button className="w-full flex items-center justify-center gap-2 py-4 bg-white text-rose-600 font-bold rounded-2xl shadow-sm border border-rose-100 hover:bg-rose-50 transition-colors mt-4">
        <LogOut size={20} />
        {t.logout}
      </button>
      </div>
      </div>
    </main>
  );
}
