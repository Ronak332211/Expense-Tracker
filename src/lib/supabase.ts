
import { createClient } from "@supabase/supabase-js";

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are defined
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are not set. Please check your .env file.");
  
  // Provide fallback values when in development to avoid crashes
  if (import.meta.env.DEV) {
    console.warn("Using placeholder values for Supabase in development mode.");
  }
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder-url.supabase.co", 
  supabaseAnonKey || "placeholder-key"
);

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
