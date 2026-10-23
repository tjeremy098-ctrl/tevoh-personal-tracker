import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import { TrackerProvider } from "./context/TrackerContext";
import Navbar from "./components/Navbar";
import DashboardOverview from "./components/DashboardOverview";
import ExpenseTracker from "./components/ExpenseTracker";
import SavingsManager from "./components/SavingsManager";
import WishlistManager from "./components/WishlistManager";

type Tab = "dashboard" | "expenses" | "savings" | "wishlist";

const TAB_COMPONENTS: Record<Tab, React.ComponentType> = {
  dashboard: DashboardOverview,
  expenses: ExpenseTracker,
  savings: SavingsManager,
  wishlist: WishlistManager,
};

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-white">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-40 h-40 rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="relative z-10 px-4 md:px-6 py-6 pb-24 md:pb-8 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </main>

      <Toaster richColors position="top-right" closeButton theme="dark" />
    </div>
  );
}

export default function App() {
  return (
    <TrackerProvider>
      <AppContent />
    </TrackerProvider>
  );
}
