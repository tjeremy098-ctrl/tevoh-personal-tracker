import type { CategoryType, CurrencyCode, Expense, SavingsGoal, WishlistItem } from "./types";

export const CATEGORIES: CategoryType[] = [
  "Housing",
  "Food & Dining",
  "Transportation",
  "Utilities",
  "Entertainment",
  "Health",
  "Shopping",
  "Misc",
];

export const CATEGORY_COLORS: Record<CategoryType, string> = {
  Housing: "#6366f1",
  "Food & Dining": "#f59e0b",
  Transportation: "#06b6d4",
  Utilities: "#8b5cf6",
  Entertainment: "#ec4899",
  Health: "#10b981",
  Shopping: "#f97316",
  Misc: "#64748b",
};

export const CURRENCIES: Record<CurrencyCode, { symbol: string; label: string }> = {
  KES: { symbol: "KSh ", label: "Kenyan Shilling (KES)" },
  USD: { symbol: "$", label: "US Dollar" },
  EUR: { symbol: "€", label: "Euro" },
  GBP: { symbol: "£", label: "British Pound" },
  JPY: { symbol: "¥", label: "Japanese Yen" },
};

export const SEED_EXPENSES: Expense[] = [
  { id: "e1", title: "Monthly Rent", amount: 35000, category: "Housing", date: "2024-01-01", paymentMethod: "Transfer", notes: "Apartment rent" },
  { id: "e2", title: "Grocery Run", amount: 4500, category: "Food & Dining", date: "2024-01-03", paymentMethod: "Card" },
  { id: "e3", title: "Electric Bill", amount: 3200, category: "Utilities", date: "2024-01-05", paymentMethod: "Transfer" },
  { id: "e4", title: "Fuel Top-up", amount: 2500, category: "Transportation", date: "2024-01-06", paymentMethod: "Card" },
  { id: "e5", title: "Netflix Subscription", amount: 1100, category: "Entertainment", date: "2024-01-07", paymentMethod: "Card" },
  { id: "e6", title: "Gym Membership", amount: 3500, category: "Health", date: "2024-01-08", paymentMethod: "Card" },
  { id: "e7", title: "New Headphones", amount: 12500, category: "Shopping", date: "2024-01-10", paymentMethod: "Card", notes: "Sony WH-1000XM5" },
  { id: "e8", title: "Restaurant Dinner", amount: 2800, category: "Food & Dining", date: "2024-01-12", paymentMethod: "Cash" },
  { id: "e9", title: "Internet Bill", amount: 4500, category: "Utilities", date: "2024-01-14", paymentMethod: "Transfer" },
  { id: "e10", title: "Matatu Pass", amount: 3000, category: "Transportation", date: "2024-01-15", paymentMethod: "Card" },
  { id: "e11", title: "Concert Tickets", amount: 6000, category: "Entertainment", date: "2024-01-18", paymentMethod: "Card" },
  { id: "e12", title: "Pharmacy", amount: 1500, category: "Health", date: "2024-01-20", paymentMethod: "Cash" },
];

export const SEED_GOALS: SavingsGoal[] = [
  {
    id: "g1",
    name: "Emergency Fund",
    targetAmount: 150000,
    currentAmount: 96000,
    targetDate: "2024-06-30",
    color: "#10b981",
    milestones: [
      { label: "Start", amount: 0, reached: true },
      { label: "25%", amount: 37500, reached: true },
      { label: "50%", amount: 75000, reached: true },
      { label: "75%", amount: 112500, reached: false },
      { label: "Goal", amount: 150000, reached: false },
    ],
  },
  {
    id: "g2",
    name: "New Laptop",
    targetAmount: 120000,
    currentAmount: 51000,
    targetDate: "2024-09-01",
    color: "#06b6d4",
    milestones: [
      { label: "Start", amount: 0, reached: true },
      { label: "25%", amount: 30000, reached: true },
      { label: "50%", amount: 60000, reached: false },
      { label: "75%", amount: 90000, reached: false },
      { label: "Goal", amount: 120000, reached: false },
    ],
  },
  {
    id: "g3",
    name: "Vacation Fund",
    targetAmount: 200000,
    currentAmount: 72000,
    targetDate: "2024-12-15",
    color: "#f59e0b",
    milestones: [
      { label: "Start", amount: 0, reached: true },
      { label: "25%", amount: 50000, reached: true },
      { label: "50%", amount: 100000, reached: false },
      { label: "75%", amount: 150000, reached: false },
      { label: "Goal", amount: 200000, reached: false },
    ],
  },
];

export const SEED_WISHLIST: WishlistItem[] = [
  { id: "w1", title: "Mechanical Keyboard", estimatedCost: 9500, priority: "Medium", category: "Shopping", notes: "Keychron K3 Pro", purchased: false },
  { id: "w2", title: "Running Shoes", estimatedCost: 12000, priority: "High", category: "Health", notes: "Nike Pegasus 40", purchased: false },
  { id: "w3", title: "Standing Desk", estimatedCost: 32000, priority: "Low", category: "Misc", notes: "IKEA BEKANT", purchased: false },
  { id: "w4", title: "Kindle Paperwhite", estimatedCost: 9000, priority: "Medium", category: "Entertainment", purchased: false },
  { id: "w5", title: "Espresso Machine", estimatedCost: 25000, priority: "High", category: "Food & Dining", notes: "Breville Bambino", purchased: false },
];