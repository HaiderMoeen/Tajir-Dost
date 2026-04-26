"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, CheckCircle2, DollarSign, Receipt, ListTodo, CalendarDays, TrendingUp, TrendingDown, X, Check } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

export default function HisaabPage() {
  const router = useRouter();
  const { setEarnings, setExpenses, earnings, expenses, udharList, language, hisaabLedger, updateHisaab, addHisaab } = useAppContext();
  
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
    let targetId = id;
    
    // Smart detection: If no ID provided, check if today's record already exists
    if (!targetId) {
      const today = new Date().toISOString().split('T')[0];
      const existingToday = hisaabLedger.find(h => h.date.startsWith(today));
      if (existingToday) targetId = existingToday.id;
    }

    if (targetId) {
      const record = hisaabLedger.find(h => h.id === targetId);
      if (record) {
        setNewEarnings(record.earnings.toString());
        setNewExpenses(record.expenses.toString());
        setSelectedHisaabId(targetId);
      }
    } else {
      // New hisaab for the day
      setNewEarnings("0");
      setNewExpenses("0");
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

    // Use addHisaab which handles both create/update and global sync
    addHisaab(e, ex);
    
    toast.success(t.success);
    setView('ledger');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <main className="flex-1 bg-[#f0fbf9] min-h-screen flex flex-col relative pb-20 md:pb-6">
      <div className="w-full max-w-5xl mx-auto flex flex-col min-h-screen">
      
      {view === 'ledger' ? (
        <div className="flex-1 flex flex-col animate-in fade-in duration-300">
          <div className="pt-6 px-6 pb-6 bg-emerald-600 text-white rounded-b-3xl shadow-md flex justify-between items-center mb-6">
            <div className="flex flex-1 items-center justify-between">
              <div className="flex flex-col items-start">
                <h1 className="text-xl md:text-2xl font-bold">Hisaab Kitaab</h1>
                {/* Urdu title - stacked on mobile, hidden on laptop to be shown on the right instead */}
                <h1 className="text-xl font-bold opacity-90 mt-1 md:hidden" style={{ fontFamily: "var(--font-urdu)" }}>حساب کتاب</h1>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Urdu title - shown only on laptop, on the right side */}
                <h1 className="hidden md:block text-3xl font-bold opacity-90" style={{ fontFamily: "var(--font-urdu)" }}>حساب کتاب</h1>
                
                <button 
                   onClick={() => openWizard(null)} 
                   className="bg-white text-emerald-700 px-4 md:px-5 py-2.5 md:py-3 rounded-2xl font-bold shadow-md active:scale-95 transition-all flex items-center gap-2"
                >
                  <span className="text-lg md:text-xl font-black">+</span>
                  <div className="flex items-center gap-2 leading-tight">
                    <span className="hidden md:inline text-sm font-bold">Aaj ka Hisaab</span>
                    <span className="text-sm md:text-base" style={{ fontFamily: "var(--font-urdu)" }}>آج کا حساب</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Monthly Summary Section */}
          <div className="px-4 md:px-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-700 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] text-white shadow-xl shadow-emerald-500/20 flex flex-col justify-between min-h-[150px] md:min-h-[180px]">
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
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] text-white shadow-xl shadow-yellow-500/20 flex flex-col justify-between min-h-[150px] md:min-h-[180px]">
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
                  <h2 className="text-xl sm:text-2xl md:text-4xl font-black truncate leading-none">{formatCurrency(udharList.reduce((acc, u) => acc + u.amount, 0))}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 mb-4 flex items-center justify-between">
            <h2 className="text-base md:text-xl font-bold text-gray-800">Rozana ka Hisaab</h2>
            <h2 className="text-lg md:text-2xl font-bold text-gray-700 text-right" style={{ fontFamily: "var(--font-urdu)" }}>روزانہ کا حساب</h2>
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
                    <div className="flex justify-between items-center mb-1">
                      <p className={`text-sm font-bold ${isProfit ? 'text-emerald-200' : 'text-rose-200'}`}>
                        {isProfit ? 'Munafa' : 'Nuqsaan'}
                      </p>
                      <p className={`text-base font-bold ${isProfit ? 'text-emerald-100' : 'text-rose-100'}`} style={{ fontFamily: "var(--font-urdu)" }}>
                        {isProfit ? 'منافع' : 'نقصان'}
                      </p>
                    </div>
                    <p className="text-2xl font-black text-white">
                      {!isProfit && "- "}{formatCurrency(Math.abs(net))}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-[#1abc9c] flex flex-col p-6 text-white animate-in fade-in zoom-in duration-300 min-h-screen">
           {/* Header Titles */}
           <div className="text-center pt-20 md:pt-8 pb-12">
             <h2 className="text-3xl md:text-4xl font-black mb-8 md:mb-12">
               {step === 1 ? "Aaj ki kamai" : step === 2 ? "Aaj ke kharchay" : (parseInt(newEarnings) - parseInt(newExpenses) >= 0 ? "Aaj ka Munafa" : "Aaj ka Nuqsaan")}
             </h2>
             <h2 className="text-4xl md:text-5xl font-bold opacity-90" style={{ fontFamily: "var(--font-urdu)" }}>
               {step === 1 ? "آج کی کمائی" : step === 2 ? "آج کے خرچے" : (parseInt(newEarnings) - parseInt(newExpenses) >= 0 ? "آج کا منافع" : "آج کا نقصان")}
             </h2>
           </div>

           <div className="flex-1 flex flex-col items-center justify-center md:justify-center w-full max-w-lg mx-auto">
             {step === 1 && (
               <div className="flex-1 flex flex-col items-center justify-center md:justify-center gap-y-12 w-full animate-in slide-in-from-bottom-8 duration-500">
                 <div className="w-full max-w-[280px] md:max-w-md">
                   <input
                     type="number"
                     placeholder="0"
                     value={newEarnings}
                     onChange={(e) => setNewEarnings(e.target.value)}
                     className="w-full bg-transparent border-b-2 border-white/40 focus:border-white text-6xl md:text-8xl font-black text-white outline-none text-center pb-2 transition-all placeholder:text-white/10"
                     autoFocus
                   />
                 </div>
               </div>
             )}

             {step === 2 && (
               <div className="flex-1 flex flex-col items-center justify-center md:justify-center gap-y-12 w-full animate-in slide-in-from-bottom-8 duration-500">
                 <div className="w-full max-w-[280px] md:max-w-md">
                   <input
                     type="number"
                     placeholder="0"
                     value={newExpenses}
                     onChange={(e) => setNewExpenses(e.target.value)}
                     className="w-full bg-transparent border-b-2 border-white/40 focus:border-white text-6xl md:text-8xl font-black text-white outline-none text-center pb-2 transition-all placeholder:text-white/10"
                     autoFocus
                   />
                 </div>
               </div>
             )}

             {step === 3 && (
               <div className="flex-1 flex flex-col items-center justify-center md:justify-center gap-y-12 w-full animate-in zoom-in duration-500">
                 {(() => {
                    const e = parseInt(newEarnings) || 0;
                    const ex = parseInt(newExpenses) || 0;
                    const net = e - ex;
                    const isProfit = net >= 0;
                    return (
                      <>
                        <div className={`px-10 py-8 md:px-16 md:py-12 rounded-[2.5rem] md:rounded-[4rem] ${isProfit ? 'bg-white text-emerald-700' : 'bg-rose-500 text-white'} shadow-2xl transition-transform w-full max-w-[300px] md:max-w-xl text-center`}>
                          <p className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] mb-3 md:mb-6 opacity-60">Result</p>
                          <p className="text-4xl md:text-7xl font-black">{isProfit ? "" : "- "}{formatCurrency(Math.abs(net))}</p>
                        </div>

                        <button 
                          className={`flex items-center gap-4 px-6 py-4 rounded-3xl border transition-all ${itemsChecked ? 'bg-white text-[#1abc9c]' : 'bg-white/10 text-white border-white/20'}`}
                          onClick={() => setItemsChecked(!itemsChecked)}
                        >
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${itemsChecked ? 'bg-[#1abc9c] text-white' : 'border-2 border-white/30'}`}>
                            {itemsChecked && <CheckCircle2 size={16} />}
                          </div>
                          <span className="text-sm md:text-base font-bold">Stock check kiya?</span>
                        </button>
                      </>
                    );
                 })()}
               </div>
             )}
           </div>

           <div className="mt-4 mb-24 md:mt-8 md:mb-12 flex gap-4 w-full max-w-lg mx-auto">
             {step === 1 ? (
               <button 
                 onClick={() => setView('ledger')} 
                 className="flex-1 py-5 rounded-3xl bg-rose-500/10 text-rose-100 flex justify-center items-center hover:bg-rose-500/20 transition-all"
               >
                 <X size={32} strokeWidth={3} />
               </button>
             ) : (
               <button 
                 onClick={handleBack} 
                 className="flex-1 py-5 rounded-3xl bg-white/10 text-emerald-50 flex justify-center items-center hover:bg-white/20 transition-all"
               >
                 <ArrowLeft size={32} strokeWidth={3} />
               </button>
             )}
             
             <button 
               onClick={step === 3 ? handleSave : handleNext}
               className="flex-[2] py-5 rounded-3xl bg-white text-[#1abc9c] flex justify-center items-center shadow-xl active:scale-95 transition-all"
             >
               {step === 3 ? (
                 <Check size={40} strokeWidth={4} />
               ) : (
                 <ArrowRight size={40} strokeWidth={4} />
               )}
             </button>
           </div>
         </div>
      )}
      </div>
    </main>
  );
}
