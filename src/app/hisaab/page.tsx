"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, CheckCircle2, DollarSign, Receipt, ListTodo, CalendarDays, TrendingUp, TrendingDown } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

export default function HisaabPage() {
  const router = useRouter();
  const { setEarnings, setExpenses, earnings, expenses, language, hisaabLedger, updateHisaab } = useAppContext();
  
  const [view, setView] = useState<'ledger' | 'wizard'>('ledger');
  const [selectedHisaabId, setSelectedHisaabId] = useState<string | null>(null);

  const [step, setStep] = useState(1);
  const [newEarnings, setNewEarnings] = useState(earnings.toString());
  const [newExpenses, setNewExpenses] = useState(expenses.toString());
  const [itemsChecked, setItemsChecked] = useState(false);

  const t = {
    title: language === "en" ? "Daily Hisaab" : "Rozana Hisaab",
    step1: language === "en" ? "Today's Earnings" : "Aaj ki Kamai",
    step1Desc: language === "en" ? "How much cash did you collect today?" : "Aaj gallay mein kitne paise aye?",
    step2: language === "en" ? "Today's Expenses" : "Aaj ke Kharchay",
    step2Desc: language === "en" ? "Any payments made to suppliers or bills?" : "Supplier ya bill ke paise diye?",
    step3: language === "en" ? "Summary" : "Khulasa",
    next: language === "en" ? "Next" : "Agla",
    back: language === "en" ? "Back" : "Peechay",
    save: language === "en" ? "Save Hisaab" : "Mahfooz Karein",
    success: language === "en" ? "Hisaab saved successfully!" : "Hisaab darj ho gaya!",
    inventoryCheck: language === "en" ? "Did you check items that need restocking?" : "Kiya aapne khatam hone wala samaan check kiya?",
  };

  const openWizard = (id: string | null = null) => {
    if (id) {
      const record = hisaabLedger.find(h => h.id === id);
      if (record) {
        setNewEarnings(record.earnings.toString());
        setNewExpenses(record.expenses.toString());
        setSelectedHisaabId(id);
      }
    } else {
      setNewEarnings(earnings.toString());
      setNewExpenses(expenses.toString());
      setSelectedHisaabId(null);
    }
    setStep(1);
    setItemsChecked(false);
    setView('wizard');
  };

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSave = () => {
    const e = parseInt(newEarnings) || 0;
    const ex = parseInt(newExpenses) || 0;

    if (selectedHisaabId) {
      updateHisaab(selectedHisaabId, e, ex);
    } else {
      setEarnings(e);
      setExpenses(ex);
    }
    toast.success(t.success);
    setView('ledger');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <main className="flex-1 bg-white min-h-screen flex flex-col relative pb-20 md:pb-6">
      <div className="w-full max-w-5xl mx-auto flex flex-col min-h-screen">
      
      {view === 'ledger' ? (
        <div className="flex-1 flex flex-col animate-in fade-in duration-300">
          <div className="pt-6 px-6 pb-6 bg-emerald-600 text-white rounded-b-3xl shadow-md flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{t.title}</h1>
              <p className="text-emerald-100 text-sm font-medium mt-1">Past 30 Days History</p>
            </div>
            <button onClick={() => openWizard(null)} className="bg-white text-emerald-700 px-4 py-3 rounded-2xl font-bold text-sm shadow-md active:scale-95 transition-all">
              + New Today
            </button>
          </div>

          <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {hisaabLedger.map((record) => {
              const net = record.earnings - record.expenses;
              const isProfit = net >= 0;

              return (
                <button 
                  key={record.id} 
                  onClick={() => openWizard(record.id)}
                  className={`p-5 rounded-3xl shadow-lg border-none flex flex-col justify-between min-h-[130px] active:scale-[0.98] transition-all text-left ${isProfit ? 'bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 shadow-emerald-600/30' : 'bg-gradient-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 shadow-rose-600/30'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`flex items-center gap-2 ${isProfit ? 'text-emerald-50' : 'text-rose-50'}`}>
                      <CalendarDays size={18} />
                      <span className="font-semibold">{new Date(record.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    {isProfit ? <TrendingUp size={20} className="text-emerald-100" /> : <TrendingDown size={20} className="text-rose-100" />}
                  </div>
                  
                  <div>
                    <p className={`text-sm font-bold ${isProfit ? 'text-emerald-200' : 'text-rose-200'}`}>Net {isProfit ? 'Profit' : 'Loss'}</p>
                    <p className="text-2xl font-black text-white">{formatCurrency(Math.abs(net))}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <>
          {/* Progress Header */}
          <div className="pt-6 px-4 pb-4 bg-emerald-600 text-white rounded-b-3xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">{t.title}</h1>
        <div className="flex justify-between items-center px-6 relative">
          <div className="absolute left-10 right-10 top-1/2 h-1 bg-emerald-700 -z-10 -translate-y-1/2"></div>
          <div className={`absolute left-10 top-1/2 h-1 bg-emerald-300 -z-10 -translate-y-1/2 transition-all duration-500 ${step === 1 ? 'w-0' : step === 2 ? 'w-1/2' : 'w-full'}`}></div>
          
          {[1, 2, 3].map((num) => (
            <div key={num} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
              step >= num ? "bg-emerald-200 text-emerald-800 ring-4 ring-emerald-600" : "bg-emerald-700 text-emerald-400"
            }`}>
              {num}
            </div>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 flex flex-col justify-center animate-in fade-in duration-300">
        
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-emerald-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
                <DollarSign size={40} className="text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.step1}</h2>
              <p className="text-gray-500">{t.step1Desc}</p>
            </div>
            
            <div className="relative mt-8">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">Rs.</span>
              <input
                type="number"
                value={newEarnings}
                onChange={(e) => setNewEarnings(e.target.value)}
                className="w-full pl-20 pr-6 py-6 text-4xl font-bold text-gray-900 bg-white border-2 border-emerald-100 rounded-2xl focus:ring-0 focus:border-emerald-500 outline-none text-center transition-all shadow-sm"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-rose-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
                <Receipt size={40} className="text-rose-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.step2}</h2>
              <p className="text-gray-500">{t.step2Desc}</p>
            </div>
            
            <div className="relative mt-8">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">Rs.</span>
              <input
                type="number"
                value={newExpenses}
                onChange={(e) => setNewExpenses(e.target.value)}
                className="w-full pl-20 pr-6 py-6 text-4xl font-bold text-gray-900 bg-white border-2 border-emerald-100 rounded-2xl focus:ring-0 focus:border-rose-500 outline-none text-center transition-all shadow-sm"
              />
            </div>

            <div className="mt-8 bg-blue-50 p-4 rounded-xl flex items-start gap-3 border border-blue-100 cursor-pointer" onClick={() => setItemsChecked(!itemsChecked)}>
              <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded flex items-center justify-center transition-colors ${itemsChecked ? 'bg-blue-600 text-white' : 'bg-white border-2 border-blue-200'}`}>
                {itemsChecked && <CheckCircle2 size={16} />}
              </div>
              <div>
                <p className="text-blue-900 font-medium">{t.inventoryCheck}</p>
                <p className="text-blue-700/70 text-sm mt-1">Tajir app will remind you tomorrow to order these items.</p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
                <ListTodo size={40} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.step3}</h2>
            </div>
            
            <div className="bg-white rounded-2xl p-6 space-y-4 border border-emerald-100 shadow-sm">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-500 font-medium">{t.step1}</span>
                <span className="text-xl font-bold text-emerald-600">+{formatCurrency(parseInt(newEarnings) || 0)}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-500 font-medium">{t.step2}</span>
                <span className="text-xl font-bold text-rose-600">-{formatCurrency(parseInt(newExpenses) || 0)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-900 font-bold">Net Total</span>
                <span className={`text-2xl font-black ${parseInt(newEarnings) - parseInt(newExpenses) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatCurrency((parseInt(newEarnings) || 0) - (parseInt(newExpenses) || 0))}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Navigation Footer */}
      <div className="p-6 flex gap-4">
        {step === 1 ? (
          <button
            onClick={() => setView('ledger')}
            className="flex-1 py-4 bg-emerald-100 text-emerald-800 font-bold rounded-2xl flex justify-center items-center gap-2 active:bg-emerald-200"
          >
            <ArrowLeft size={20} />
            Cancel
          </button>
        ) : (
          <button
            onClick={handleBack}
            className="flex-1 py-4 bg-emerald-100 text-emerald-800 font-bold rounded-2xl flex justify-center items-center gap-2 active:bg-emerald-200"
          >
            <ArrowLeft size={20} />
            {t.back}
          </button>
        )}
        
        {step < 3 ? (
          <button
            onClick={handleNext}
            className="flex-[2] py-4 bg-emerald-600 text-white font-bold rounded-2xl flex justify-center items-center gap-2 shadow-lg shadow-emerald-600/20 active:bg-emerald-700"
          >
            {t.next}
            <ArrowRight size={20} />
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="flex-[2] py-4 bg-gray-900 text-white font-bold rounded-2xl flex justify-center items-center gap-2 shadow-lg shadow-gray-900/20 active:bg-black"
          >
            <CheckCircle2 size={20} />
            {t.save}
          </button>
        )}
      </div>
      </>
      )}
      </div>
    </main>
  );
}
