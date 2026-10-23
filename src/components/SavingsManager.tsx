import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, X, Coins, Target, ArrowDownRight } from "lucide-react";
import { toast } from "sonner";
import { useTracker } from "../context/TrackerContext";
import type { SavingsGoal } from "../types";
import { CURRENCIES } from "../constants";

const GOAL_COLORS = ["#10b981", "#06b6d4", "#f59e0b", "#ec4899", "#8b5cf6", "#f97316"];

export default function SavingsManager() {
  const { savingsGoals, addGoal, deleteGoal, depositToGoal, withdrawFromGoal, fmt, currency } = useTracker();
  const [showForm, setShowForm] = useState(false);
  const [depositModal, setDepositModal] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [isWithdraw, setIsWithdraw] = useState(false);

  const [form, setForm] = useState({ name: "", targetAmount: "", targetDate: "", color: GOAL_COLORS[0] });

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!form.name || !form.targetAmount) { toast.error("Name and target are required"); return; }
    addGoal({ name: form.name, targetAmount: parseFloat(form.targetAmount), currentAmount: 0, targetDate: form.targetDate || "2025-12-31", color: form.color });
    toast.success("Goal created");
    setForm({ name: "", targetAmount: "", targetDate: "", color: GOAL_COLORS[0] });
    setShowForm(false);
  };

  const handleDeposit = () => {
    if (!depositModal || !depositAmount) return;
    const amt = parseFloat(depositAmount);
    if (amt <= 0) { toast.error("Enter a valid amount"); return; }
    if (isWithdraw) {
      withdrawFromGoal(depositModal.id, amt);
      toast.success(`Withdrew ${fmt(amt)} from ${depositModal.name}`);
    } else {
      depositToGoal(depositModal.id, amt);
      toast.success(`Deposited ${fmt(amt)} to ${depositModal.name}`);
    }
    setDepositAmount("");
    setDepositModal(null);
    setIsWithdraw(false);
  };

  const quickDeposit = (goal: SavingsGoal, amt: number) => {
    depositToGoal(goal.id, amt);
    toast.success(`+${fmt(amt)} to ${goal.name}`);
  };

  const totalSaved = savingsGoals.reduce((s, g) => s + g.currentAmount, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Savings Goals</h2>
          <p className="text-sm text-slate-400 mt-0.5">Total saved: <span className="text-emerald-400 font-semibold">{fmt(totalSaved)}</span></p>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20">
          {showForm ? <X size={16} /> : <Plus size={16} />}
          <span className="hidden sm:inline">{showForm ? "Cancel" : "New Goal"}</span>
        </motion.button>
      </div>

      {/* New Goal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit} className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-4 space-y-3 overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input placeholder="Goal name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500" />
              <input placeholder="Target amount" type="number" min="1" value={form.targetAmount} onChange={e => setForm({ ...form, targetAmount: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="date" value={form.targetDate} onChange={e => setForm({ ...form, targetDate: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500" />
              <div className="flex items-center gap-2">
                {GOAL_COLORS.map(c => (
                  <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                    className={`w-7 h-7 rounded-full transition-transform ${form.color === c ? "scale-125 ring-2 ring-white/30" : "hover:scale-110"}`}
                    style={{ background: c }} />
                ))}
              </div>
            </div>
            <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-400 transition-colors">
              Create Goal
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {savingsGoals.map(goal => {
            const pct = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
            const complete = pct >= 100;
            return (
              <motion.div key={goal.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-5 backdrop-blur-sm hover:border-slate-600/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${goal.color}20` }}>
                      <Target size={16} style={{ color: goal.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{goal.name}</p>
                      <p className="text-xs text-slate-500">Due {goal.targetDate}</p>
                    </div>
                  </div>
                  <button onClick={() => { deleteGoal(goal.id); toast.success("Goal removed"); }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400">{fmt(goal.currentAmount)}</span>
                    <span className="text-slate-400">{fmt(goal.targetAmount)}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-700/50 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
                      className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${goal.color}, ${goal.color}cc)` }} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{pct.toFixed(1)}% complete</p>
                </div>

                {/* Milestones */}
                <div className="flex items-center gap-1 mb-3">
                  {goal.milestones.map((m, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className={`w-2 h-2 rounded-full ${m.reached ? "bg-emerald-400" : "bg-slate-600"}`} />
                      <span className="text-[9px] text-slate-500 mt-0.5">{m.label}</span>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                  <button onClick={() => quickDeposit(goal, 500)} className="px-2.5 py-1 rounded-lg bg-slate-700/50 text-xs text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors">{`+${CURRENCIES[currency].symbol}500`}</button>
                  <button onClick={() => quickDeposit(goal, 1000)} className="px-2.5 py-1 rounded-lg bg-slate-700/50 text-xs text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors">{`+${CURRENCIES[currency].symbol}1,000`}</button>
                  <button onClick={() => quickDeposit(goal, 5000)} className="px-2.5 py-1 rounded-lg bg-slate-700/50 text-xs text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors">{`+${CURRENCIES[currency].symbol}5,000`}</button>
                  <button onClick={() => setDepositModal(goal)} className="ml-auto px-3 py-1 rounded-lg bg-emerald-500/20 text-xs text-emerald-300 font-medium hover:bg-emerald-500/30 transition-colors">
                    Custom
                  </button>
                </div>

                {complete && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-xs text-emerald-300 font-medium">Goal reached! You saved {fmt(goal.targetAmount)}</p>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {savingsGoals.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <Coins size={36} className="mb-3 opacity-50" />
          <p className="text-sm">No savings goals yet. Create one to start!</p>
        </div>
      )}

      {/* Deposit Modal */}
      <AnimatePresence>
        {depositModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDepositModal(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-slate-800 border border-slate-700 p-5">
              <h3 className="text-lg font-bold text-white mb-1">{depositModal.name}</h3>
              <p className="text-sm text-slate-400 mb-4">{fmt(depositModal.currentAmount)} / {fmt(depositModal.targetAmount)}</p>
              <div className="flex gap-2 mb-3">
                <button onClick={() => setIsWithdraw(false)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${!isWithdraw ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-700 text-slate-400"}`}>Deposit</button>
                <button onClick={() => setIsWithdraw(true)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${isWithdraw ? "bg-rose-500/20 text-rose-300" : "bg-slate-700 text-slate-400"}`}>Withdraw</button>
              </div>
              <input type="number" placeholder="Amount" value={depositAmount} onChange={e => setDepositAmount(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900/60 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 mb-3" />
              <div className="flex gap-2">
                <button onClick={handleDeposit} className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400 transition-colors">
                  {isWithdraw ? "Withdraw" : "Deposit"}
                </button>
                <button onClick={() => setDepositModal(null)} className="px-4 py-2.5 rounded-xl bg-slate-700 text-slate-300 text-sm hover:bg-slate-600 transition-colors">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}