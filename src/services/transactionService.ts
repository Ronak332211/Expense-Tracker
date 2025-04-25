
import { supabase } from "@/integrations/supabase/client";
import { Transaction, TransactionInput } from "@/lib/supabase";

export const getTransactions = async (): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }

  return data as Transaction[];
};

export const addTransaction = async (transaction: TransactionInput): Promise<Transaction> => {
  const { data, error } = await supabase
    .from("transactions")
    .insert([transaction])
    .select()
    .single();

  if (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }

  return data as Transaction;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};
