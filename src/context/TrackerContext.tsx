import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CurrencyCode, Expense, FinancialSummary, SavingsGoal, TrackerState, WishlistItem } from "../types";
import { SEED_EXPENSES, SEED_GOALS, SEED_WISHLIST, CURRENCIES } from "../constants";

const STORAGE_KEY = "tevoh_tracker_v2";

function loadState(): TrackerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { expenses: SEED_EXPENSES, savingsGoals: SEED_GOALS, wishlist: SEED_WISHLIST, currency: "KES" };
}

function saveState(state: TrackerState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

interface TrackerContextType extends TrackerState {
  summary: FinancialSummary;
  addExpense: (e: Omit<Expense, "id">) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (id: string, e: Partial<Expense>) => void;
  addGoal: (g: Omit<SavingsGoal, "id" | "milestones">) => void;
  deleteGoal: (id: string) => void;
  depositToGoal: (id: string, amount: number) => void;
  withdrawFromGoal: (id: string, amount: number) => void;
  addWishlistItem: (w: Omit<WishlistItem, "id" | "purchased">) => void;
  deleteWishlistItem: (id: string) => void;
  purchaseWishlistItem: (id: string) => void;
  setCurrency: (c: CurrencyCode) => void;
  fmt: (n: number) => string;
}

const TrackerContext = createContext<TrackerContextType | null>(null);

export function TrackerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TrackerState>(loadState);

  useEffect(() => { saveState(state); }, [state]);

  const summary: FinancialSummary = (() => {
    const totalExpenses = state.expenses.reduce((s, e) => s + e.amount, 0);
    const totalSavings = state.savingsGoals.reduce((s, g) => s + g.currentAmount, 0);
    const wishlistTotal = state.wishlist.filter(w => !w.purchased).reduce((s, w) => s + w.estimatedCost, 0);
    const now = new Date();
    const monthlySpend = state.expenses
      .filter(e => { const d = new Date(e.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); })
      .reduce((s, e) => s + e.amount, 0);
    const savingsRate = totalExpenses + totalSavings > 0 ? (totalSavings / (totalExpenses + totalSavings)) * 100 : 0;
    return { totalExpenses, totalSavings, netPosition: totalSavings - totalExpenses, wishlistTotal, monthlySpend, savingsRate };
  })();

  const fmt = (n: number) =>
    `${CURRENCIES[state.currency].symbol}${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)}`;

  const addExpense = (e: Omit<Expense, "id">) => {
    setState(prev => ({ ...prev, expenses: [{ ...e, id: crypto.randomUUID() }, ...prev.expenses] }));
  };

  const deleteExpense = (id: string) => {
    setState(prev => ({ ...prev, expenses: prev.expenses.filter(e => e.id !== id) }));
  };

  const updateExpense = (id: string, patch: Partial<Expense>) => {
    setState(prev => ({ ...prev, expenses: prev.expenses.map(e => e.id === id ? { ...e, ...patch } : e) }));
  };

  const addGoal = (g: Omit<SavingsGoal, "id" | "milestones">) => {
    const milestones = [
      { label: "Start", amount: 0, reached: true },
      { label: "25%", amount: g.targetAmount * 0.25, reached: g.currentAmount >= g.targetAmount * 0.25 },
      { label: "50%", amount: g.targetAmount * 0.5, reached: g.currentAmount >= g.targetAmount * 0.5 },
      { label: "75%", amount: g.targetAmount * 0.75, reached: g.currentAmount >= g.targetAmount * 0.75 },
      { label: "Goal", amount: g.targetAmount, reached: g.currentAmount >= g.targetAmount },
    ];
    setState(prev => ({ ...prev, savingsGoals: [...prev.savingsGoals, { ...g, id: crypto.randomUUID(), milestones }] }));
  };

  const deleteGoal = (id: string) => {
    setState(prev => ({ ...prev, savingsGoals: prev.savingsGoals.filter(g => g.id !== id) }));
  };

  const depositToGoal = (id: string, amount: number) => {
    setState(prev => ({
      ...prev,
      savingsGoals: prev.savingsGoals.map(g => {
        if (g.id !== id) return g;
        const newAmt = Math.min(g.currentAmount + amount, g.targetAmount);
        const milestones = g.milestones.map(m => ({ ...m, reached: newAmt >= m.amount }));
        return { ...g, currentAmount: newAmt, milestones };
      }),
    }));
  };

  const withdrawFromGoal = (id: string, amount: number) => {
    setState(prev => ({
      ...prev,
      savingsGoals: prev.savingsGoals.map(g => {
        if (g.id !== id) return g;
        const newAmt = Math.max(g.currentAmount - amount, 0);
        const milestones = g.milestones.map(m => ({ ...m, reached: newAmt >= m.amount }));
        return { ...g, currentAmount: newAmt, milestones };
      }),
    }));
  };

  const addWishlistItem = (w: Omit<WishlistItem, "id" | "purchased">) => {
    setState(prev => ({ ...prev, wishlist: [{ ...w, id: crypto.randomUUID(), purchased: false }, ...prev.wishlist] }));
  };

  const deleteWishlistItem = (id: string) => {
    setState(prev => ({ ...prev, wishlist: prev.wishlist.filter(w => w.id !== id) }));
  };

  const purchaseWishlistItem = (id: string) => {
    setState(prev => {
      const item = prev.wishlist.find(w => w.id === id);
      if (!item) return prev;
      const expense: Expense = {
        id: crypto.randomUUID(),
        title: item.title,
        amount: item.estimatedCost,
        category: item.category,
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "Card",
        notes: `Purchased from wishlist`,
      };
      return {
        ...prev,
        wishlist: prev.wishlist.map(w => w.id === id ? { ...w, purchased: true } : w),
        expenses: [expense, ...prev.expenses],
      };
    });
  };

  const setCurrency = (c: CurrencyCode) => setState(prev => ({ ...prev, currency: c }));

  return (
    <TrackerContext.Provider value={{ ...state, summary, addExpense, deleteExpense, updateExpense, addGoal, deleteGoal, depositToGoal, withdrawFromGoal, addWishlistItem, deleteWishlistItem, purchaseWishlistItem, setCurrency, fmt }}>
      {children}
    </TrackerContext.Provider>
  );
}

export function useTracker() {
  const ctx = useContext(TrackerContext);
  if (!ctx) throw new Error("useTracker must be inside TrackerProvider");
  return ctx;
}