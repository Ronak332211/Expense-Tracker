import { supabase } from "@/integrations/supabase/client";

export const checkDatabaseStructure = async (): Promise<{
  tableExists: boolean;
  hasUserIdColumn: boolean;
  error?: string;
}> => {
  try {
    // Check if transactions table exists
    const { data: tables, error: tableError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .eq('tablename', 'transactions');

    if (tableError) {
      console.error("Error checking table existence:", tableError);
      return { 
        tableExists: false, 
        hasUserIdColumn: false, 
        error: tableError.message 
      };
    }

    const tableExists = tables && tables.length > 0;
    
    if (!tableExists) {
      return { 
        tableExists: false, 
        hasUserIdColumn: false, 
        error: "Transactions table does not exist" 
      };
    }

    // Check if user_id column exists
    const { data: columns, error: columnError } = await supabase
      .rpc('get_table_columns', { table_name: 'transactions' });

    if (columnError) {
      console.error("Error checking columns:", columnError);
      return { 
        tableExists: true, 
        hasUserIdColumn: false, 
        error: columnError.message 
      };
    }

    const hasUserIdColumn = columns && columns.some((col: any) => col.column_name === 'user_id');

    return {
      tableExists: true,
      hasUserIdColumn,
      error: undefined
    };
  } catch (error: any) {
    console.error("Error checking database structure:", error);
    return {
      tableExists: false,
      hasUserIdColumn: false,
      error: error.message
    };
  }
};

export const addUserIdColumn = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check current structure first
    const structure = await checkDatabaseStructure();
    
    if (!structure.tableExists) {
      return { success: false, error: "Transactions table does not exist" };
    }
    
    if (structure.hasUserIdColumn) {
      return { success: true }; // Column already exists
    }
    
    // Add user_id column
    const { error } = await supabase.rpc('add_user_id_column');
    
    if (error) {
      console.error("Error adding user_id column:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Error adding user_id column:", error);
    return { success: false, error: error.message };
  }
}; 