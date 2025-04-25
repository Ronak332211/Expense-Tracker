import { supabase } from "@/integrations/supabase/client";

// Define the transaction types explicitly instead of relying on Database generic
export type Transaction = {
  id: string;
  created_at: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  description: string;
  date: string;
  user_id?: string; // Make user_id optional to handle both schemas
};

export type TransactionInput = Omit<Transaction, "id" | "created_at" | "user_id">;

export const transactionCategories = {
  income: ["Salary", "Freelance", "Investments", "Gift", "Other"],
  expense: ["Food", "Housing", "Transport", "Entertainment", "Utilities", "Healthcare", "Education", "Shopping", "Other"]
};

// Re-export supabase for backward compatibility
export { supabase };
