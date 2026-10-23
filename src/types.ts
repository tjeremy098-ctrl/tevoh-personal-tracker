export type CategoryType =
  | "Housing"
  | "Food & Dining"
  | "Transportation"
  | "Utilities"
  | "Entertainment"
  | "Health"
  | "Shopping"
  | "Misc";

export type PaymentMethod = "Card" | "Cash" | "Transfer";

export type Priority = "High" | "Medium" | "Low";

export type CurrencyCode = "KES" | "USD" | "EUR" | "GBP" | "JPY";

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: CategoryType;
  date: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  color: string;
  milestones: { label: string; amount: number; reached: boolean }[];
}

export interface WishlistItem {
  id: string;
  title: string;
  estimatedCost: number;
  priority: Priority;
  category: CategoryType;
  notes?: string;
  purchased: boolean;
  link?: string;
}

export interface FinancialSummary {
  totalExpenses: number;
  totalSavings: number;
  netPosition: number;
  wishlistTotal: number;
  monthlySpend: number;
  savingsRate: number;
}

export interface TrackerState {
  expenses: Expense[];
  savingsGoals: SavingsGoal[];
  wishlist: WishlistItem[];
  currency: CurrencyCode;
}