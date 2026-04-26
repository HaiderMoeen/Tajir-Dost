"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Types
export interface Udhar {
  id: string;
  name: string;
  amount: number;
  daysOverdue: number;
  phone: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  nameUrdu: string;
  category: "masalay" | "dairy" | "drinks" | "snacks" | "ghee_oil" | "cleaning" | "tea" | "other";
  stock: number;
  lowStockThreshold: number;
  unit: string;
  emoji: string;
  imageUrl?: string;
  price?: number;
}

export interface HisaabRecord {
  id: string;
  date: string;
  earnings: number;
  expenses: number;
}

// Catalogue of common Kiryana store items (pre-built)
export const ITEM_CATALOGUE: Omit<InventoryItem, "id" | "stock">[] = [
  // Masalay
  { name: "Shan Biryani Masala", nameUrdu: "شان بریانی مصالحہ", category: "masalay", lowStockThreshold: 5, unit: "packets", emoji: "🌶️", imageUrl: "/inventory/Shan-Biryani-Masala.png" },
  { name: "Lal Mirch Powder", nameUrdu: "لال مرچ پاؤڈر", category: "masalay", lowStockThreshold: 5, unit: "packets", emoji: "🫙", imageUrl: "https://www.shanfoods.com/wp-content/uploads/2016/11/Tez-Lal-Mirch-Powder-2.png" },
  { name: "Haldi Powder", nameUrdu: "ہلدی پاؤڈر", category: "masalay", lowStockThreshold: 5, unit: "packets", emoji: "🟡", imageUrl: "/inventory/haldi-powder.png" },
  { name: "Shan Nihari Masala", nameUrdu: "شان نہاری مصالحہ", category: "masalay", lowStockThreshold: 5, unit: "packets", emoji: "🌶️", imageUrl: "https://www.shanfoods.com/wp-content/uploads/2016/11/Nihari.png" },
  // Dairy
  { name: "Nestle Milkpak 1L", nameUrdu: "نیسلے ملک پیک 1 لیٹر", category: "dairy", lowStockThreshold: 5, unit: "cartons", emoji: "🥛", imageUrl: "/inventory/milk-pak.png" },
  { name: "Tarang Milk 1L", nameUrdu: "ترنگ ملک 1 لیٹر", category: "dairy", lowStockThreshold: 5, unit: "cartons", emoji: "🥛", imageUrl: "/inventory/Tarang.png" },
  { name: "Olpers Cream 200ml", nameUrdu: "اولپرز کریم 200 ملی", category: "dairy", lowStockThreshold: 5, unit: "packs", emoji: "🧴", imageUrl: "/inventory/olpers-cream-200ml.png" },
  // Drinks
  { name: "Pepsi 1.5L", nameUrdu: "پیپسی 1.5 لیٹر", category: "drinks", lowStockThreshold: 5, unit: "bottles", emoji: "🥤", imageUrl: "/inventory/Pepsi.png" },
  { name: "7UP 1.5L", nameUrdu: "سیون اپ 1.5 لیٹر", category: "drinks", lowStockThreshold: 5, unit: "bottles", emoji: "🥤", imageUrl: "/inventory/7up.png" },
  { name: "Sting Energy Drink", nameUrdu: "اسٹنگ انرجی ڈرنک", category: "drinks", lowStockThreshold: 5, unit: "cans", emoji: "⚡", imageUrl: "/inventory/Sting.png" },
  { name: "Rooh Afza 800ml", nameUrdu: "روح افزا 800 ملی", category: "drinks", lowStockThreshold: 5, unit: "bottles", emoji: "🌹", imageUrl: "https://hibalife.com/cdn/shop/products/RoohAfza1500ml.png?v=1642667874" },
  // Snacks
  { name: "Lays Chips", nameUrdu: "لیز چپس", category: "snacks", lowStockThreshold: 5, unit: "packets", emoji: "🍟", imageUrl: "/inventory/Lays.png" },
  { name: "Sooper Biscuits", nameUrdu: "سوپر بسکٹ", category: "snacks", lowStockThreshold: 5, unit: "packs", emoji: "🍪", imageUrl: "https://www.ebm.com.pk/assets/images/Classic_FP-_45_degree.png" },
  { name: "Nimco Mix", nameUrdu: "نمکو مکس", category: "snacks", lowStockThreshold: 5, unit: "packets", emoji: "🧂", imageUrl: "/inventory/Nimco-mix.png" },
  // Ghee & Oil
  { name: "Dalda Ghee 1kg", nameUrdu: "ڈالڈا گھی 1 کلو", category: "ghee_oil", lowStockThreshold: 5, unit: "tins", emoji: "🫙", imageUrl: "/inventory/dalda-ghee.png" },
  { name: "Sufi Cooking Oil 1L", nameUrdu: "صوفی کوکنگ آئل 1 لیٹر", category: "ghee_oil", lowStockThreshold: 5, unit: "bottles", emoji: "🫒", imageUrl: "/inventory/sufi-cooking-oil.png" },
  // Cleaning
  { name: "Surf Excel 500g", nameUrdu: "سرف ایکسل 500 گرام", category: "cleaning", lowStockThreshold: 5, unit: "packets", emoji: "🧺", imageUrl: "/inventory/surf-excel.png" },
  { name: "Lifebuoy Soap", nameUrdu: "لائف بوائے صابن", category: "cleaning", lowStockThreshold: 5, unit: "bars", emoji: "🧼", imageUrl: "/inventory/lifebouy-soap.png" },
  // Tea
  { name: "Tapal Danedar 200g", nameUrdu: "ٹپال دانے دار 200 گرام", category: "tea", lowStockThreshold: 5, unit: "packets", emoji: "🍵", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKR6ghLaGzXQ8xZBjyRIW41SeD8Ukq7iqU-A&s" },
  { name: "Lipton Yellow Label", nameUrdu: "لپٹن یلو لیبل", category: "tea", lowStockThreshold: 5, unit: "packets", emoji: "🍵", imageUrl: "/inventory/Lipton-Yellow-Label.png" },
];

export const CATEGORY_META: Record<InventoryItem["category"], { label: string; labelUrdu: string; emoji: string; color: string }> = {
  masalay:   { label: "Masalay",     labelUrdu: "مصالحے",    emoji: "🌶️", color: "bg-orange-100 border-orange-300" },
  dairy:     { label: "Dairy",       labelUrdu: "ڈیری",       emoji: "🥛", color: "bg-sky-100 border-sky-300" },
  drinks:    { label: "Drinks",      labelUrdu: "مشروبات",   emoji: "🥤", color: "bg-blue-100 border-blue-300" },
  snacks:    { label: "Snacks",      labelUrdu: "سنیکس",     emoji: "🍟", color: "bg-yellow-100 border-yellow-300" },
  ghee_oil:  { label: "Ghee / Oil", labelUrdu: "گھی / تیل", emoji: "🫙", color: "bg-amber-100 border-amber-300" },
  cleaning:  { label: "Cleaning",    labelUrdu: "صفائی",     emoji: "🧺", color: "bg-teal-100 border-teal-300" },
  tea:       { label: "Tea / Chai",  labelUrdu: "چائے",      emoji: "🍵", color: "bg-green-100 border-green-300" },
  other:     { label: "Other",       labelUrdu: "دیگر",      emoji: "📦", color: "bg-gray-100 border-gray-300" },
};

export interface UserProfile {
  name: string;
  phone: string;
  storeName: string;
  bankName: string;
  accountNumber: string;
}

interface AppState {
  earnings: number;
  expenses: number;
  udharList: Udhar[];
  inventory: InventoryItem[];
  language: "en" | "ur";
  hasSeenTutorial: boolean;
  hisaabLedger: HisaabRecord[];
  profile: UserProfile;
  setEarnings: (val: number) => void;
  setExpenses: (val: number) => void;
  addUdhar: (udhar: Omit<Udhar, "id">) => void;
  markUdharPaid: (id: string) => void;
  restockItem: (id: string) => void;
  addInventoryItem: (item: Omit<InventoryItem, "id">) => void;
  updateStock: (id: string, newStock: number) => void;
  removeInventoryItem: (id: string) => void;
  setLanguage: (lang: "en" | "ur") => void;
  setHasSeenTutorial: (val: boolean) => void;
  updateHisaab: (id: string, earnings: number, expenses: number) => void;
  addHisaab: (earnings: number, expenses: number) => void;
  updateProfile: (profile: UserProfile) => void;
  resetData: () => void;
}

const initialProfile: UserProfile = {
  name: "Manzoor Ali",
  phone: "0300-1234567",
  storeName: "Bismillah General Store",
  bankName: "Easypaisa",
  accountNumber: "03224341747",
};

const initialUdharList: Udhar[] = [
  { id: "1", name: "Rashid Bhai", amount: 4500, daysOverdue: 12, phone: "03001234567" },
  { id: "2", name: "Moazzam (Electrician)", amount: 2100, daysOverdue: 4, phone: "03211234567" },
  { id: "3", name: "Shahabuddin", amount: 1600, daysOverdue: 1, phone: "03331234567" },
];

const initialInventory: InventoryItem[] = [
  { id: "i1", name: "Shan Biryani Masala", nameUrdu: "شان بریانی مصالحہ", category: "masalay", stock: 0,  lowStockThreshold: 5, unit: "packets", emoji: "🌶️", imageUrl: "/inventory/Shan-Biryani-Masala.png" },
  { id: "i2", name: "Nestle Milkpak 1L",   nameUrdu: "نیسلے ملک پیک 1 لیٹر", category: "dairy",   stock: 2,  lowStockThreshold: 5,  unit: "cartons", emoji: "🥛", imageUrl: "/inventory/milk-pak.png" },
  { id: "i3", name: "Tapal Danedar 200g",  nameUrdu: "ٹپال دانے دار 200 گرام", category: "tea",     stock: 15, lowStockThreshold: 5,  unit: "packets", emoji: "🍵", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKR6ghLaGzXQ8xZBjyRIW41SeD8Ukq7iqU-A&s" },
  { id: "i4", name: "Lays Chips",           nameUrdu: "لیز چپس",              category: "snacks",  stock: 30, lowStockThreshold: 5, unit: "packets", emoji: "🍟", imageUrl: "/inventory/Lays.png" },
  { id: "i5", name: "Pepsi 1.5L",           nameUrdu: "پیپسی 1.5 لیٹر",      category: "drinks",  stock: 3,  lowStockThreshold: 5,  unit: "bottles", emoji: "🥤", imageUrl: "/inventory/Pepsi.png" },
  { id: "i6", name: "Dalda Ghee 1kg",       nameUrdu: "ڈالڈا گھی 1 کلو",     category: "ghee_oil",stock: 8,  lowStockThreshold: 5,  unit: "tins",    emoji: "🫙", imageUrl: "/inventory/dalda-ghee.png" },
  { id: "i7", name: "Surf Excel 500g",      nameUrdu: "سرف ایکسل 500 گرام",  category: "cleaning",stock: 1,  lowStockThreshold: 5,  unit: "packets", emoji: "🧺", imageUrl: "/inventory/surf-excel.png" },
  { id: "i8", name: "Lipton Yellow Label",  nameUrdu: "لپٹن یلو لیبل",       category: "tea",     stock: 12, lowStockThreshold: 5,  unit: "packets", emoji: "🍵", imageUrl: "/inventory/Lipton-Yellow-Label.png" },
];

const generatePast30DaysHisaab = (): HisaabRecord[] => {
  const records: HisaabRecord[] = [];
  const today = new Date();
  for (let i = 1; i <= 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const isLoss = i % 7 === 0;
    const baseEarnings = 10000 + (i * 4321) % 15000;
    const earnings = isLoss ? baseEarnings * 0.5 : baseEarnings;
    const expenses = isLoss ? earnings + 2000 + (i * 123) % 3000 : baseEarnings * 0.4 + (i * 321) % 2000;
    records.push({ id: `h_${i}`, date: d.toISOString().split("T")[0], earnings: Math.floor(earnings), expenses: Math.floor(expenses) });
  }
  return records;
};

const initialHisaabLedger: HisaabRecord[] = generatePast30DaysHisaab();

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [earnings, setEarnings] = useState(14500);
  const [expenses, setExpenses] = useState(3200);
  const [udharList, setUdharList] = useState<Udhar[]>(initialUdharList);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [language, setLanguageState] = useState<"en" | "ur">("en");
  const [hasSeenTutorial, setHasSeenTutorialState] = useState(false);
  const [hisaabLedger, setHisaabLedger] = useState<HisaabRecord[]>(initialHisaabLedger);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);

  useEffect(() => {
    const stored = localStorage.getItem("tajir_mvp_state");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.earnings !== undefined) setEarnings(parsed.earnings);
        if (parsed.expenses !== undefined) setExpenses(parsed.expenses);
        if (parsed.udharList !== undefined) setUdharList(parsed.udharList);
        if (parsed.inventory !== undefined) setInventory(parsed.inventory);
        if (parsed.language !== undefined) setLanguageState(parsed.language);
        if (parsed.hasSeenTutorial !== undefined) setHasSeenTutorialState(parsed.hasSeenTutorial);
        if (parsed.hisaabLedger !== undefined) setHisaabLedger(parsed.hisaabLedger);
        if (parsed.profile !== undefined) setProfile(parsed.profile);
      } catch (e) { console.error("Could not parse state", e); }
    }
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("tajir_mvp_state", JSON.stringify({
        earnings, expenses, udharList, inventory, language, hasSeenTutorial, hisaabLedger, profile,
      }));
    }
  }, [earnings, expenses, udharList, inventory, language, hasSeenTutorial, hisaabLedger, profile, isClient]);

  const addUdhar = (udhar: Omit<Udhar, "id">) => {
    setUdharList([...udharList, { ...udhar, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const markUdharPaid = (id: string) => {
    const item = udharList.find(u => u.id === id);
    if (item) {
      setEarnings(prev => prev + item.amount);
      setUdharList(prev => prev.filter(u => u.id !== id));
    }
  };

  // Legacy restock — bumps stock above threshold
  const restockItem = (id: string) => {
    setInventory(inventory.map(item =>
      item.id === id ? { ...item, stock: item.lowStockThreshold + 10 } : item
    ));
  };

  const addInventoryItem = (item: Omit<InventoryItem, "id">) => {
    const newItem: InventoryItem = { ...item, id: `inv_${Date.now()}` };
    setInventory(prev => [...prev, newItem]);
  };

  const updateStock = (id: string, newStock: number) => {
    setInventory(prev => prev.map(item => item.id === id ? { ...item, stock: Math.max(0, newStock) } : item));
  };

  const removeInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  const setLanguage = (lang: "en" | "ur") => setLanguageState(lang);
  const setHasSeenTutorial = (val: boolean) => setHasSeenTutorialState(val);

  const updateHisaab = (id: string, newEarnings: number, newExpenses: number) => {
    setHisaabLedger(hisaabLedger.map(h =>
      h.id === id ? { ...h, earnings: newEarnings, expenses: newExpenses } : h
    ));
    
    // If we're updating today's record, sync the global state for the Home page
    const record = hisaabLedger.find(h => h.id === id);
    const today = new Date().toISOString().split('T')[0];
    if (record && record.date.startsWith(today)) {
      setEarnings(newEarnings);
      setExpenses(newExpenses);
    }
  };

  const addHisaab = (earningsValue: number, expensesValue: number) => {
    const today = new Date().toISOString().split('T')[0];
    const existing = hisaabLedger.find(h => h.date.startsWith(today));
    
    // Sync global state for Home page
    setEarnings(earningsValue);
    setExpenses(expensesValue);

    if (existing) {
      updateHisaab(existing.id, earningsValue, expensesValue);
    } else {
      const newRecord: HisaabRecord = {
        id: Math.random().toString(36).substr(2, 9),
        date: today,
        earnings: earningsValue,
        expenses: expensesValue
      };
      setHisaabLedger([newRecord, ...hisaabLedger]);
    }
  };

  const updateProfile = (newProfile: UserProfile) => setProfile(newProfile);

  const resetData = () => {
    setEarnings(14500);
    setExpenses(3200);
    setUdharList(initialUdharList);
    setInventory(initialInventory);
    setLanguageState("en");
    setHasSeenTutorialState(false);
    setHisaabLedger(initialHisaabLedger);
    setProfile(initialProfile);
    localStorage.removeItem("tajir_mvp_state");
  };

  if (!isClient) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <AppContext.Provider value={{
      earnings, expenses, udharList, inventory, language, hasSeenTutorial, hisaabLedger, profile,
      setEarnings, setExpenses, addUdhar, markUdharPaid, restockItem,
      addInventoryItem, updateStock, removeInventoryItem,
      setLanguage, setHasSeenTutorial, updateHisaab, addHisaab, updateProfile, resetData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error("useAppContext must be used within an AppProvider");
  return context;
}
