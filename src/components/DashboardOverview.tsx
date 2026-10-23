import { motion } from "framer-motion";
import { TrendingUp, Wallet, PiggyBank, Heart, AlertCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useTracker } from "../context/TrackerContext";
import { CATEGORY_COLORS, CATEGORIES } from "../constants";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } } };

export default function DashboardOverview() {
  const { summary, expenses, savingsGoals, wishlist, fmt } = useTracker();

  const categoryData = CATEGORIES.map(cat => ({
    name: cat,
    value: expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter(d => d.value > 0);

  const monthlyData = [
    { month: "Jan", expenses: 820, savings: 450 },
    { month: "Feb", expenses: 690, savings: 520 },
    { month: "Mar", expenses: 1100, savings: 380 },
    { month: "Apr", expenses: 750, savings: 610 },
    { month: "May", expenses: 920, savings: 490 },
    { month: "Jun", expenses: 680, savings: 720 },
  ];

  const topCategory = categoryData.sort((a, b) => b.value - a.value)[0];
  const nearComplete = savingsGoals.filter(g => g.currentAmount / g.targetAmount >= 0.7 && g.currentAmount < g.targetAmount);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <motion.div variants={item} className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-4 md:p-5 backdrop-blur-sm hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <Wallet size={16} className="text-rose-400" />
            </div>
          </div>
          <p className="text-xs text-slate-400 font-medium">Total Spent</p>
          <p className="text-lg md:text-xl font-bold text-white mt-1">{fmt(summary.totalExpenses)}</p>
        </motion.div>

        <motion.div variants={item} className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-4 md:p-5 backdrop-blur-sm hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <PiggyBank size={16} className="text-emerald-400" />
            </div>
          </div>
          <p className="text-xs text-slate-400 font-medium">Total Saved</p>
          <p className="text-lg md:text-xl font-bold text-white mt-1">{fmt(summary.totalSavings)}</p>
        </motion.div>

        <motion.div variants={item} className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-4 md:p-5 backdrop-blur-sm hover:border-cyan-500/30 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <TrendingUp size={16} className="text-cyan-400" />
            </div>
          </div>
          <p className="text-xs text-slate-400 font-medium">Savings Rate</p>
          <p className="text-lg md:text-xl font-bold text-white mt-1">{summary.savingsRate.toFixed(1)}%</p>
        </motion.div>

        <motion.div variants={item} className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-4 md:p-5 backdrop-blur-sm hover:border-amber-500/30 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Heart size={16} className="text-amber-400" />
            </div>
          </div>
          <p className="text-xs text-slate-400 font-medium">Wishlist Total</p>
          <p className="text-lg md:text-xl font-bold text-white mt-1">{fmt(summary.wishlistTotal)}</p>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <motion.div variants={item} className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-5 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Spending by Category</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {categoryData.map((entry) => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] || "#64748b"} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {categoryData.slice(0, 4).map(d => (
              <span key={d.name} className="text-xs text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: CATEGORY_COLORS[d.name as keyof typeof CATEGORY_COLORS] }} />
                {d.name}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-5 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Monthly Trend</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} barGap={4}>
                <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", color: "#fff" }} />
                <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="savings" name="Savings" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topCategory && (
          <motion.div variants={item} className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${CATEGORY_COLORS[topCategory.name as keyof typeof CATEGORY_COLORS]}20` }}>
                <AlertCircle size={18} style={{ color: CATEGORY_COLORS[topCategory.name as keyof typeof CATEGORY_COLORS] }} />
              </div>
              <div>
                <p className="text-xs text-slate-400">Top Spending Category</p>
                <p className="text-sm font-semibold text-white">{topCategory.name} {fmt(topCategory.value)}</p>
              </div>
            </div>
          </motion.div>
        )}

        {nearComplete.length > 0 && (
          <motion.div variants={item} className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <PiggyBank size={18} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Almost There</p>
                <p className="text-sm font-semibold text-white">{nearComplete[0].name} ({Math.round((nearComplete[0].currentAmount / nearComplete[0].targetAmount) * 100)}%)</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Recent Transactions */}
      <motion.div variants={item} className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-5 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Recent Transactions</h3>
        <div className="space-y-2">
          {expenses.slice(0, 5).map(e => (
            <div key={e.id} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full" style={{ background: CATEGORY_COLORS[e.category] }} />
                <div>
                  <p className="text-sm text-white font-medium">{e.title}</p>
                  <p className="text-xs text-slate-500">{e.date}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-rose-400">-{fmt(e.amount)}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
