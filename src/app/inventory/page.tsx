"use client";

import React, { useState, useMemo } from "react";
import { Package, Plus, X, Search, Trash2, AlertTriangle, Check } from "lucide-react";
import { useAppContext, ITEM_CATALOGUE, CATEGORY_META, InventoryItem } from "@/context/AppContext";
import toast from "react-hot-toast";

/* ─────────────────────────────────────────────
   Stock badge helper
───────────────────────────────────────────── */
function StockBadge({ stock, threshold }: { stock: number; threshold: number }) {
  if (stock === 0) return (
    <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
      <AlertTriangle size={11} /> 0
    </span>
  );
  if (stock <= threshold) return (
    <span className="inline-flex items-center gap-1 bg-orange-400 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
      {stock}
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
      {stock}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Stock Edit Bottom Sheet
───────────────────────────────────────────── */
function StockEditSheet({
  item,
  onClose,
}: {
  item: InventoryItem;
  onClose: () => void;
}) {
  const { updateStock, removeInventoryItem } = useAppContext();
  const [count, setCount] = useState(item.stock);

  const handleSave = () => {
    updateStock(item.id, count);
    toast.success("Stock update ho gaya! ✅");
    onClose();
  };

  const handleDelete = () => {
    if (confirm(`"${item.name}" ko inventory se hata dein?`)) {
      removeInventoryItem(item.id);
      toast.success("Item hata diya gaya");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">{item.name}</h2>
            <p className="text-base text-gray-500 font-medium" style={{ fontFamily: "var(--font-urdu)" }}>{item.nameUrdu}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>

        {/* Counter */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-5">
          <p className="text-sm font-semibold text-gray-500 mb-3 text-center">Stock Update karo ({item.unit})</p>
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => setCount(c => Math.max(0, c - 1))}
              className="w-14 h-14 rounded-full bg-red-100 text-red-600 text-3xl font-black flex items-center justify-center active:scale-95 transition-transform shadow-sm"
            >
              −
            </button>
            <div className="text-center">
              <span className="text-5xl font-black text-gray-900 tabular-nums">{count}</span>
              <p className="text-sm text-gray-400 font-medium mt-1">{item.unit}</p>
            </div>
            <button
              onClick={() => setCount(c => c + 1)}
              className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 text-3xl font-black flex items-center justify-center active:scale-95 transition-transform shadow-sm"
            >
              +
            </button>
          </div>
          {count <= item.lowStockThreshold && count > 0 && (
            <p className="text-center text-xs text-orange-500 font-bold mt-3">⚠️ Low Stock</p>
          )}
          {count === 0 && (
            <p className="text-center text-xs text-red-600 font-bold mt-3">🚨 Khatam ho gaya! Home par alert aayega.</p>
          )}
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-4 mt-6">
          {/* Delete Button (Left) */}
          <button
            onClick={handleDelete}
            className="p-4 bg-rose-50 text-red-500 rounded-2xl active:scale-95 transition-all border border-rose-100 shadow-sm"
          >
            <Trash2 size={22} />
          </button>

          {/* Save Button (Right - Primary) */}
          <button
            onClick={handleSave}
            className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white flex items-center justify-center rounded-2xl active:scale-95 transition-all shadow-lg shadow-emerald-600/20"
          >
            <Check size={28} strokeWidth={4} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Add Item Catalogue Sheet
───────────────────────────────────────────── */
function CatalogueSheet({ onClose }: { onClose: () => void }) {
  const { addInventoryItem, inventory } = useAppContext();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof ITEM_CATALOGUE[0] | null>(null);
  const [stock, setStock] = useState(0);
  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customNameUrdu, setCustomNameUrdu] = useState("");
  const [customUnit, setCustomUnit] = useState("packets");

  const filtered = useMemo(() =>
    ITEM_CATALOGUE.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.nameUrdu.includes(search)
    ), [search]);

  const handleAdd = () => {
    if (customMode) {
      if (!customName.trim()) return;
      addInventoryItem({
        name: customName.trim(),
        nameUrdu: customNameUrdu.trim() || customName.trim(),
        category: "other",
        stock,
        lowStockThreshold: 5,
        unit: customUnit,
        emoji: "📦",
      });
    } else {
      if (!selected) return;
      addInventoryItem({ ...selected, stock, lowStockThreshold: 5 });
    }
    toast.success("Item shamil ho gaya! 🎉");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
        style={{ maxHeight: "90vh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-3 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-xl font-black text-gray-900">Samaan List</h2>
            <p className="text-sm text-gray-500 font-bold" style={{ fontFamily: "var(--font-urdu)" }}>سامان کی فہرست</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 pt-4 pb-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Item dhoondo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-400 outline-none font-bold"
            />
          </div>
        </div>

        {/* Selected item config or catalogue grid */}
        {selected && !customMode ? (
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-200 rounded-3xl p-4 mb-6">
              <div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-emerald-100 shadow-sm flex items-center justify-center">
                {selected.imageUrl ? (
                  <img src={selected.imageUrl} alt={selected.name} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-3xl">{selected.emoji}</span>
                )}
              </div>
              <div>
                <p className="font-black text-gray-900 text-lg">{selected.name}</p>
                <p className="text-sm text-gray-600 font-bold" style={{ fontFamily: "var(--font-urdu)" }}>{selected.nameUrdu}</p>
              </div>
              <button onClick={() => setSelected(null)} className="ml-auto p-2 bg-white/50 rounded-full text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <label className="block text-sm font-black text-gray-700 mb-2">Kitni ({selected.unit})?</label>
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setStock(s => Math.max(0, s - 1))} className="w-12 h-12 rounded-full bg-red-100 text-red-600 text-2xl font-black flex items-center justify-center">−</button>
              <span className="text-3xl font-black text-gray-900 w-12 text-center tabular-nums">{stock}</span>
              <button onClick={() => setStock(s => s + 1)} className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 text-2xl font-black flex items-center justify-center">+</button>
            </div>

            <button onClick={handleAdd} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-all">
              ✓ Inventory mein Shamil Karo
            </button>
          </div>
        ) : customMode ? (
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <button onClick={() => setCustomMode(false)} className="text-sm text-emerald-600 font-semibold mb-4 flex items-center gap-1">
              ← Wapis
            </button>
            <label className="block text-sm font-bold text-gray-700 mb-1">Item ka Naam (English)</label>
            <input type="text" value={customName} onChange={e => setCustomName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl mb-3 focus:ring-2 focus:ring-emerald-400 outline-none" placeholder="e.g. Shampoo" />

            <label className="block text-sm font-bold text-gray-700 mb-1">Urdu Naam (optional)</label>
            <input type="text" value={customNameUrdu} onChange={e => setCustomNameUrdu(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl mb-3 focus:ring-2 focus:ring-emerald-400 outline-none text-right" placeholder="اردو نام" style={{ fontFamily: "var(--font-urdu)" }} />

            <label className="block text-sm font-bold text-gray-700 mb-1">Unit</label>
            <input type="text" value={customUnit} onChange={e => setCustomUnit(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-emerald-400 outline-none" placeholder="e.g. packets, bottles" />

            <label className="block text-sm font-bold text-gray-700 mb-1">Shuru ka Stock</label>
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setStock(s => Math.max(0, s - 1))} className="w-12 h-12 rounded-full bg-red-100 text-red-600 text-2xl font-black flex items-center justify-center">−</button>
              <span className="text-3xl font-black text-gray-900 w-12 text-center">{stock}</span>
              <button onClick={() => setStock(s => s + 1)} className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 text-2xl font-black flex items-center justify-center">+</button>
            </div>

            <button onClick={handleAdd} disabled={!customName.trim()} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-700 disabled:opacity-40 text-white font-bold text-lg rounded-2xl shadow-lg active:scale-95 transition-all">
              ✓ Inventory mein Shamil Karo
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 py-2">
            {filtered.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <Package size={40} className="mx-auto mb-2 opacity-40" />
                <p className="font-medium">Koi item nahi mila</p>
              </div>
            )}
            <div className="grid grid-cols-3 gap-3 pb-2">
              {filtered.map(item => (
                <button
                  key={item.name}
                  onClick={() => { setSelected(item); setStock(0); }}
                  className="bg-gray-50 border border-gray-200 rounded-2xl p-2 flex flex-col items-center gap-1 active:scale-95 transition-all hover:border-emerald-400 hover:bg-emerald-50 text-center"
                >
                  {item.imageUrl ? (
                    <div className="h-14 w-full flex items-center justify-center overflow-hidden rounded-lg bg-white">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                          (e.currentTarget.nextSibling as HTMLElement).style.display = "flex";
                        }}
                      />
                      <div className="hidden h-14 w-full items-center justify-center text-3xl">{item.emoji}</div>
                    </div>
                  ) : (
                    <span className="text-3xl">{item.emoji}</span>
                  )}
                  <p className="text-xs font-bold text-gray-800 leading-tight">{item.name}</p>
                  <p className="text-[10px] text-gray-400 leading-tight" style={{ fontFamily: "var(--font-urdu)" }}>{item.nameUrdu}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => { setCustomMode(true); setSearch(""); }}
              className="w-full mt-3 mb-4 py-3 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-semibold text-sm flex items-center justify-center gap-2 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
            >
              <Plus size={18} />
              Custom Item Daalo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Visual Store-Shelf Row
───────────────────────────────────────────── */
function StoreShelfRow({ items, onItemClick }: {
  items: InventoryItem[];
  onItemClick: (item: InventoryItem) => void;
}) {
  return (
    <div className="relative mb-1">
      {/* Shelf backing wall */}
      <div className="bg-[#f5efe6] border-x border-t border-[#d4b896] rounded-t-sm px-1 pt-4 pb-0 flex justify-around md:justify-center md:gap-8">
        {items.map(item => {
          const isEmpty  = item.stock === 0;
          const isLow    = !isEmpty && item.stock <= item.lowStockThreshold;
          const badgeBg  = isEmpty ? "bg-red-500" : isLow ? "bg-orange-400" : "bg-emerald-500";
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item)}
              className="shrink-0 flex flex-col items-center w-[80px] md:w-[180px] active:scale-95 transition-transform group"
            >
              {/* Product image / emoji */}
              <div className="relative w-full px-1">
                <div className={`w-full h-24 md:h-56 flex items-end justify-center rounded-t-sm overflow-hidden ${
                  isEmpty ? "opacity-40" : ""
                }`}>
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-contain object-bottom drop-shadow-md"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        img.style.display = "none";
                        const fallback = img.parentElement?.querySelector('.emoji-fallback');
                        if (fallback) (fallback as HTMLElement).style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`${item.imageUrl ? "hidden" : "flex"} emoji-fallback h-full w-full items-end justify-center text-4xl pb-1`}
                  >
                    {item.emoji}
                  </div>
                </div>
                {/* Stock badge top-right */}
                <span className={`absolute -top-1 -right-1 min-w-[20px] h-5 ${badgeBg} text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow`}>
                  {item.stock}
                </span>
              </div>
              {/* Name + unit below item */}
              <div className="w-full bg-[#ede0cf] border-x border-[#c8a87a] px-1 pb-1.5 pt-1 text-center">
                <p className="text-[10px] md:text-sm font-bold text-amber-900 leading-tight line-clamp-2">{item.name}</p>
                <p className="text-[9px] md:text-xs text-amber-700 font-medium">{item.unit}</p>
              </div>
            </button>
          );
        })}
      </div>
      {/* Wooden shelf board */}
      <div className="h-4 w-full bg-gradient-to-b from-[#b5813e] via-[#9e6e31] to-[#7a5320] rounded-b-sm shadow-[0_4px_8px_rgba(0,0,0,0.35)] border-x border-b border-[#6b4520]" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Inventory Page
───────────────────────────────────────────── */
export default function InventoryPage() {
  const { inventory } = useAppContext();
  const [showCatalogue, setShowCatalogue] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const lowStockCount   = inventory.filter(i => i.stock <= i.lowStockThreshold).length;
  const outOfStockCount = inventory.filter(i => i.stock === 0).length;

  // Chunk items into rows of 4 (fits nicely on both mobile and desktop now)
  const shelfRows = useMemo(() => {
    const ROW_SIZE = 4;
    const rows: InventoryItem[][] = [];
    for (let i = 0; i < inventory.length; i += ROW_SIZE) {
      rows.push(inventory.slice(i, i + ROW_SIZE));
    }
    return rows;
  }, [inventory]);

  return (
    <main className="flex-1 bg-[#f0fbf9] min-h-screen flex flex-col relative pb-20 md:pb-6">
      <div className="w-full max-w-5xl mx-auto flex flex-col min-h-screen">

        {/* Top Banner */}
        <div className="pt-6 px-6 pb-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-b-3xl shadow-md flex justify-between items-center mb-5">
          <div>
            <h1 className="text-2xl font-bold drop-shadow-md">Dukaan ka Samaan</h1>
            <p className="text-orange-100 text-xl font-bold mt-1 drop-shadow-md" style={{ fontFamily: "var(--font-urdu)" }}>دکان کا سامان</p>
          </div>
          <button
            onClick={() => setShowCatalogue(true)}
            className="bg-white text-orange-600 px-4 py-2.5 rounded-2xl font-bold text-sm shadow-md active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Plus size={18} />
            <span>Naya Item</span>
          </button>
        </div>

        {/* Low-stock warning strip (compact) */}
        {(lowStockCount > 0 || outOfStockCount > 0) && (
          <div className="mx-4 md:mx-6 mb-4 flex gap-2 flex-wrap">
            {outOfStockCount > 0 && (
              <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-xl px-3 py-1.5 text-xs font-bold text-red-700">
                <AlertTriangle size={13} /> {outOfStockCount} khatam!
              </div>
            )}
            {lowStockCount > outOfStockCount && (
              <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-xl px-3 py-1.5 text-xs font-bold text-orange-700">
                ⚠️ {lowStockCount - outOfStockCount} kam stock
              </div>
            )}
          </div>
        )}

        {/* Store Shelf Wall */}
        <div className="px-4 md:px-6 flex-1">
          {inventory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Package size={52} className="mb-4 opacity-40" />
              <p className="text-lg font-bold text-gray-500">Koi samaan nahi abhi</p>
              <p className="text-sm text-gray-400 mt-1">Upar se “Naya Item” daalo</p>
            </div>
          ) : (
            /* Shelf unit wrapper — cream wall background */
            <div className="rounded-2xl overflow-hidden border-2 border-[#c8a87a] shadow-xl"
              style={{ background: "#ede0cf" }}>
              {/* Top shelf edge */}
              <div className="h-3 bg-gradient-to-b from-[#9e6e31] to-[#b5813e]" />
              {/* Shelf rows */}
              <div className="px-2 pt-2 pb-0 space-y-1">
                {shelfRows.map((row, i) => (
                  <StoreShelfRow key={i} items={row} onItemClick={setEditingItem} />
                ))}
              </div>
              {/* Bottom baseboard */}
              <div className="h-5 bg-gradient-to-b from-[#9e6e31] to-[#7a5320] border-t border-[#6b4520]" />
            </div>
          )}

          {/* Tap-to-edit hint */}
          {inventory.length > 0 && (
            <p className="text-center text-xs text-gray-400 font-medium mt-3 mb-1">
              👆 Item par tap karo stock update karne ke liye
            </p>
          )}
        </div>
      </div>

      {/* Stock Edit Sheet */}
      {editingItem && (
        <StockEditSheet item={editingItem} onClose={() => setEditingItem(null)} />
      )}

      {/* Catalogue Sheet */}
      {showCatalogue && (
        <CatalogueSheet onClose={() => setShowCatalogue(false)} />
      )}
    </main>
  );
}
