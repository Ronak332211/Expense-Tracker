import { supabase } from "@/integrations/supabase/client";
import { Transaction, TransactionInput } from "@/lib/supabase";
import { getCurrentUser } from "@/services/authService";

// Simple fetch function that handles user_id issues
const simpleFetch = async (userId: string) => {
  try {
    // First try with user_id filter
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error);
      
      // If error is about column not existing, try without user_id filter
      if (error.message.includes("column \"user_id\" does not exist")) {
        console.log("Falling back to simplified query without user_id filter");
        const { data: allData } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false });
          
        return allData || [];
      }
      
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in simpleFetch:", error);
    return [];
  }
};

// Simple insert function that handles user_id issues
const simpleInsert = async (userId: string, transaction: TransactionInput) => {
  try {
    // Try with user_id first
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...transaction, user_id: userId }])
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      
      // If error is about column not existing, try without user_id
      if (error.message.includes("column \"user_id\" does not exist")) {
        console.log("Falling back to insert without user_id");
        const { data: oldData, error: oldError } = await supabase
          .from('transactions')
          .insert([transaction])
          .select()
          .single();
          
        if (oldError) {
          throw oldError;
        }
        
        return oldData;
      }
      
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in simpleInsert:", error);
    throw error;
  }
};

// Exported functions that use the simple helpers
export const getTransactions = async (): Promise<Transaction[]> => {
  const user = await getCurrentUser();
  
  if (!user) {
    return [];
  }

  return await simpleFetch(user.id);
};

export const addTransaction = async (transaction: TransactionInput): Promise<Transaction> => {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("You must be logged in to add a transaction");
  }
  
  // Input validation
  if (!transaction.category) {
    throw new Error("Category is required");
  }
  
  if (!transaction.date) {
    throw new Error("Date is required");
  }
  
  if (transaction.amount === 0) {
    throw new Error("Amount must not be zero");
  }

  return await simpleInsert(user.id, transaction) as Transaction;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("You must be logged in to delete a transaction");
  }

  try {
    // Try with user_id
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    // If error is about column not existing, try without user_id filter
    if (error && error.message.includes("column \"user_id\" does not exist")) {
      const { error: simpleError } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
        
      if (simpleError) {
        throw simpleError;
      }
    } else if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

export const initializeDatabase = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if transactions table exists by attempting to select from it
    const { error: checkError } = await supabase
      .from('transactions')
      .select('id')
      .limit(1);
    
    // If the table doesn't exist or has issues, try to recreate it
    if (checkError) {
      console.log("Database needs initialization:", checkError.message);
      
      // Use SQL to create the table with proper structure
      const { error: createError } = await supabase.rpc('create_transactions_table');
      
      if (createError) {
        console.error("Failed to create transactions table:", createError);
        return { 
          success: false, 
          message: `Failed to create transactions table: ${createError.message}` 
        };
      }
      
      return { 
        success: true, 
        message: "Transactions table created successfully" 
      };
    }
    
    return { 
      success: true, 
      message: "Database already initialized" 
    };
  } catch (error: any) {
    console.error("Error initializing database:", error);
    return { 
      success: false, 
      message: `Error initializing database: ${error.message}` 
    };
  }
};
