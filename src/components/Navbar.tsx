import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, PiggyBank, Heart, LayoutDashboard, ChevronDown, Coins } from "lucide-react";
import { useTracker } from "../context/TrackerContext";
import type { CurrencyCode } from "../types";
import { CURRENCIES } from "../constants";

type Tab = "dashboard" | "expenses" | "savings" | "wishlist";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "expenses", label: "Expenses", icon: Wallet },
  { id: "savings", label: "Savings", icon: PiggyBank },
  { id: "wishlist", label: "Wishlist", icon: Heart },
];

export default function Navbar({ activeTab, setActiveTab }: { activeTab: Tab; setActiveTab: (t: Tab) => void }) {
  const { summary, fmt, currency, setCurrency } = useTracker();
  const [currencyOpen, setCurrencyOpen] = useState(false);

  return (
    <>
      {/* Desktop Topbar */}
      <header className="hidden md:flex items-center justify-between px-6 py-4 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
            <Wallet size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Tevoh</span>
        </div>

        <nav className="flex items-center gap-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id ? "text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-slate-700/60 rounded-lg"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-xs font-semibold text-emerald-400">{fmt(summary.totalSavings)} saved</span>
          </div>
          <div className="relative">
            <button
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 transition-colors"
            >
              <Coins size={14} />
              <span>{currency}</span>
              <ChevronDown size={12} />
            </button>
            <AnimatePresence>
              {currencyOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-36 rounded-xl bg-slate-800 border border-slate-700 shadow-xl p-1 z-50"
                >
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map(c => (
                    <button
                      key={c}
                      onClick={() => { setCurrency(c); setCurrencyOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        currency === c ? "bg-emerald-500/20 text-emerald-300" : "text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {CURRENCIES[c].symbol} {c}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/50 px-2 py-2">
        <div className="flex items-center justify-around">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                  active ? "text-emerald-400" : "text-slate-500"
                }`}
              >
                <Icon size={20} weight={active ? "fill" : undefined} />
                <span className="text-[10px] font-medium">{tab.label}</span>
                {active && <motion.div layoutId="mobile-indicator" className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5" />}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
