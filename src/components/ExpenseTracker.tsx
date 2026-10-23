import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Trash2, X, Receipt } from "lucide-react";
import { toast } from "sonner";
import { useTracker } from "../context/TrackerContext";
import { CATEGORIES, CATEGORY_COLORS } from "../constants";
import type { CategoryType, PaymentMethod } from "../types";

export default function ExpenseTracker() {
  const { expenses, addExpense, deleteExpense, fmt } = useTracker();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<CategoryType | "All">("All");

  const [form, setForm] = useState({
    title: "", amount: "", category: "Food & Dining" as CategoryType,
    date: new Date().toISOString().split("T")[0], paymentMethod: "Card" as PaymentMethod, notes: "",
  });

  const filtered = expenses.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCat === "All" || e.category === filterCat;
    return matchesSearch && matchesCat;
  });

  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!form.title || !form.amount) { toast.error("Title and amount are required"); return; }
    addExpense({ title: form.title, amount: parseFloat(form.amount), category: form.category, date: form.date, paymentMethod: form.paymentMethod, notes: form.notes || undefined });
    toast.success("Expense added");
    setForm({ title: "", amount: "", category: "Food & Dining", date: new Date().toISOString().split("T")[0], paymentMethod: "Card", notes: "" });
    setShowForm(false);
  };

  const handleDelete = (id: string, title: string) => {
    deleteExpense(id);
    toast.success(`"${title}" deleted`);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Expenses</h2>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          <span className="hidden sm:inline">{showForm ? "Cancel" : "Add Expense"}</span>
        </motion.button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-4 space-y-3 overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500" />
              <input placeholder="Amount" type="number" step="0.01" min="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as CategoryType })}
                className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500" />
              <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value as PaymentMethod })}
                className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500">
                <option value="Card">Card</option><option value="Cash">Cash</option><option value="Transfer">Transfer</option>
              </select>
            </div>
            <input placeholder="Notes (optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500" />
            <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-400 transition-colors">
              Save Expense
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input placeholder="Search expenses..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => setFilterCat("All")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${filterCat === "All" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-slate-800 text-slate-400 border border-slate-700"}`}>
            All
          </button>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setFilterCat(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${filterCat === c ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">{filtered.length} expenses</span>
        <span className="text-rose-400 font-semibold">{fmt(totalFiltered)}</span>
      </div>

      {/* List */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.map(e => (
            <motion.div
              key={e.id} layout
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 hover:border-slate-600/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: CATEGORY_COLORS[e.category] }} />
                <div>
                  <p className="text-sm text-white font-medium">{e.title}</p>
                  <p className="text-xs text-slate-500">{e.date} · {e.category} · {e.paymentMethod}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-rose-400">-{fmt(e.amount)}</span>
                <button onClick={() => handleDelete(e.id, e.title)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Receipt size={32} className="mb-3 opacity-50" />
            <p className="text-sm">No expenses found</p>
          </div>
        )}
      </div>
    </div>
  );
}
