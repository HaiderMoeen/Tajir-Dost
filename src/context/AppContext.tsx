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
  stock: number;
  lowStockThreshold: number;
}

interface AppState {
  earnings: number;
  expenses: number;
  udharList: Udhar[];
  inventory: InventoryItem[];
  language: "en" | "ur";
  hasSeenTutorial: boolean;
  setEarnings: (val: number) => void;
  setExpenses: (val: number) => void;
  addUdhar: (udhar: Omit<Udhar, "id">) => void;
  markUdharPaid: (id: string) => void;
  restockItem: (id: string) => void;
  setLanguage: (lang: "en" | "ur") => void;
  setHasSeenTutorial: (val: boolean) => void;
  resetData: () => void;
}

const initialUdharList: Udhar[] = [
  { id: "1", name: "Rashid Bhai", amount: 4500, daysOverdue: 12, phone: "03001234567" },
  { id: "2", name: "Moazzam (Electrician)", amount: 2100, daysOverdue: 4, phone: "03211234567" },
  { id: "3", name: "Shahabuddin", amount: 1600, daysOverdue: 1, phone: "03331234567" },
];

const initialInventory: InventoryItem[] = [
  { id: "i1", name: "Shan Biryani Masala", stock: 0, lowStockThreshold: 10 },
  { id: "i2", name: "Nestle Milkpak 1L", stock: 2, lowStockThreshold: 5 },
  { id: "i3", name: "Tapal Danedar 200g", stock: 15, lowStockThreshold: 5 },
];

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  
  const [earnings, setEarnings] = useState(14500);
  const [expenses, setExpenses] = useState(3200);
  const [udharList, setUdharList] = useState<Udhar[]>(initialUdharList);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [language, setLanguageState] = useState<"en" | "ur">("en");
  const [hasSeenTutorial, setHasSeenTutorialState] = useState(false);

  useEffect(() => {
    // Load from local storage
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
      } catch(e) { console.error("Could not parse state", e); }
    }
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("tajir_mvp_state", JSON.stringify({
        earnings, expenses, udharList, inventory, language, hasSeenTutorial
      }));
    }
  }, [earnings, expenses, udharList, inventory, language, hasSeenTutorial, isClient]);

  const addUdhar = (udhar: Omit<Udhar, "id">) => {
    const newUdhar = { ...udhar, id: Math.random().toString(36).substr(2, 9) };
    setUdharList([...udharList, newUdhar]);
  };

  const markUdharPaid = (id: string) => {
    setUdharList(udharList.filter(u => u.id !== id));
  };

  const restockItem = (id: string) => {
    // For MVP, just remove it from low stock view by setting stock above threshold
    setInventory(inventory.map(item => 
      item.id === id ? { ...item, stock: item.lowStockThreshold + 10 } : item
    ));
  };

  const setLanguage = (lang: "en" | "ur") => setLanguageState(lang);
  const setHasSeenTutorial = (val: boolean) => setHasSeenTutorialState(val);
  const resetData = () => {
    setEarnings(14500);
    setExpenses(3200);
    setUdharList(initialUdharList);
    setInventory(initialInventory);
    setLanguageState("en");
    setHasSeenTutorialState(false);
    localStorage.removeItem("tajir_mvp_state");
  };

  if (!isClient) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <AppContext.Provider value={{
      earnings, expenses, udharList, inventory, language, hasSeenTutorial,
      setEarnings, setExpenses, addUdhar, markUdharPaid, restockItem, 
      setLanguage, setHasSeenTutorial, resetData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
