import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, X, Heart, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import { useTracker } from "../context/TrackerContext";
import { CATEGORIES, CATEGORY_COLORS } from "../constants";
import type { CategoryType, Priority } from "../types";

const PRIORITY_COLORS: Record<Priority, string> = { High: "#f43f5e", Medium: "#f59e0b", Low: "#64748b" };

export default function WishlistManager() {
  const { wishlist, addWishlistItem, deleteWishlistItem, purchaseWishlistItem, summary, fmt, savingsGoals } = useTracker();
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({ title: "", estimatedCost: "", priority: "Medium" as Priority, category: "Shopping" as CategoryType, notes: "", link: "" });

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!form.title || !form.estimatedCost) { toast.error("Title and cost required"); return; }
    addWishlistItem({ title: form.title, estimatedCost: parseFloat(form.estimatedCost), priority: form.priority, category: form.category, notes: form.notes || undefined, link: form.link || undefined });
    toast.success("Added to wishlist");
    setForm({ title: "", estimatedCost: "", priority: "Medium", category: "Shopping", notes: "", link: "" });
    setShowForm(false);
  };

  const handlePurchase = (id: string, title: string) => {
    purchaseWishlistItem(id);
    toast.success(`"${title}" marked as purchased and logged as expense`);
  };

  const activeItems = wishlist.filter(w => !w.purchased);
  const purchasedItems = wishlist.filter(w => w.purchased);
  const totalSavings = savingsGoals.reduce((s, g) => s + g.currentAmount, 0);
  const avgDailySavings = totalSavings / 90; // rough 90-day average

  const daysUntilAffordable = (cost: number) => avgDailySavings > 0 ? Math.ceil(cost / avgDailySavings) : Infinity;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Wishlist</h2>
          <p className="text-sm text-slate-400 mt-0.5">{activeItems.length} items · {fmt(summary.wishlistTotal)} total</p>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20">
          {showForm ? <X size={16} /> : <Plus size={16} />}
          <span className="hidden sm:inline">{showForm ? "Cancel" : "Add Item"}</span>
        </motion.button>
      </div>

      {/* Affordability Bar */}
      <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400">Savings vs Wishlist</span>
          <span className="text-xs font-semibold text-white">{fmt(totalSavings)} / {fmt(summary.wishlistTotal)}</span>
        </div>
        <div className="h-2 rounded-full bg-slate-700/50 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((totalSavings / (summary.wishlistTotal || 1)) * 100, 100)}%` }}
            transition={{ duration: 0.8, type: "spring" }} className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
        </div>
        <p className="text-[10px] text-slate-500 mt-1.5">
          {totalSavings >= summary.wishlistTotal ? "You can afford everything on your list!" : `Need ${fmt(summary.wishlistTotal - totalSavings)} more`}
        </p>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit} className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-4 space-y-3 overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input placeholder="Item name" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500" />
              <input placeholder="Estimated cost" type="number" min="0" step="0.01" value={form.estimatedCost} onChange={e => setForm({ ...form, estimatedCost: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as Priority })}
                className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500">
                <option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
              </select>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as CategoryType })}
                className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input placeholder="Link (optional)" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500" />
            </div>
            <input placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500" />
            <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-400 transition-colors">
              Add to Wishlist
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence>
          {activeItems.map(item => {
            const days = daysUntilAffordable(item.estimatedCost);
            return (
              <motion.div key={item.id} layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-4 backdrop-blur-sm hover:border-slate-600/50 transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{ background: `${PRIORITY_COLORS[item.priority]}20`, color: PRIORITY_COLORS[item.priority] }}>
                    <Star size={10} /> {item.priority}
                  </span>
                  <button onClick={() => { deleteWishlistItem(item.id); toast.success("Removed"); }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                    <Trash2 size={13} />
                  </button>
                </div>
                <p className="text-sm font-semibold text-white mb-1">{item.title}</p>
                {item.notes && <p className="text-xs text-slate-500 mb-2">{item.notes}</p>}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/30">
                  <span className="text-sm font-bold text-emerald-400">{fmt(item.estimatedCost)}</span>
                  <span className="text-[10px] text-slate-500">
                    {days === Infinity ? "No savings data" : `~${days}d to afford`}
                  </span>
                </div>
                <button onClick={() => handlePurchase(item.id, item.title)}
                  className="w-full mt-3 py-2 rounded-lg bg-slate-700/50 text-xs text-slate-300 font-medium hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors flex items-center justify-center gap-1.5">
                  <ShoppingCart size={12} /> Mark Purchased
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Purchased Section */}
      {purchasedItems.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-400 mb-3">Purchased</h3>
          <div className="space-y-2">
            {purchasedItems.map(item => (
              <div key={item.id} className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <div className="flex items-center gap-2">
                  <Heart size={14} className="text-emerald-400" />
                  <span className="text-sm text-slate-400 line-through">{item.title}</span>
                </div>
                <span className="text-xs text-slate-500">{fmt(item.estimatedCost)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeItems.length === 0 && !showForm && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <Heart size={36} className="mb-3 opacity-50" />
          <p className="text-sm">Your wishlist is empty. Add items to plan future purchases!</p>
        </div>
      )}
    </div>
  );
}
