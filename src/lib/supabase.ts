
import { supabase } from "@/integrations/supabase/client";

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

// Re-export supabase for backward compatibility
export { supabase };
