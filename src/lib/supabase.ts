
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Transaction = {
  id: string;
  created_at: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  description: string;
  date: string;
};

export type TransactionInput = Omit<Transaction, "id" | "created_at">;

export const transactionCategories = {
  income: ["Salary", "Freelance", "Investments", "Gift", "Other"],
  expense: ["Food", "Housing", "Transport", "Entertainment", "Utilities", "Healthcare", "Education", "Shopping", "Other"]
};
