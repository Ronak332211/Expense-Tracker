import { useEffect, useState } from "react";
import DashboardSummary from "@/components/DashboardSummary";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import { Transaction } from "@/lib/supabase";
import { getTransactions } from "@/services/transactionService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function Index() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>(null);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [fixingTable, setFixingTable] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { user } = useAuth();

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await getTransactions();
      setTransactions(data);
    } catch (error: any) {
      if (error.message && error.message.includes("user_id")) {
        setHasError(true);
      }
      toast.error("Failed to fetch transactions");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fix database immediately
  const fixDatabaseImmediately = async () => {
    try {
      setFixingTable(true);
      toast.info("Fixing database structure...");
      
      // Get values directly from the initialized client
      const supabaseUrl = "https://vtdkbrakyeyprgdyzzfo.supabase.co";
      const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0ZGticmFreWV5cHJnZHl6emZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1OTgwNzksImV4cCI6MjA2MTE3NDA3OX0.lJ1KqKnaMM27Pg6KH98XzQtUB8rcibZx_aFXYA792Oc";
      
      // Drop and recreate the transactions table with the correct structure
      await fetch(`${supabaseUrl}/rest/v1/rpc/reset_transactions_table`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      
      toast.success("Database fixed! You can now add transactions.");
      setHasError(false);
      
      // Refresh transactions
      await fetchTransactions();
    } catch (error: any) {
      toast.error(`Couldn't fix database: ${error.message}`);
      console.error(error);
    } finally {
      setFixingTable(false);
    }
  };

  // Function to run diagnostics
  const runDiagnostics = async () => {
    try {
      setDiagnosticInfo({ status: "running" });

      // Check user
      const currentUser = user;
      
      // Check transactions table with direct SQL
      const { data: tableInfo, error: tableError } = await supabase
        .from('transactions')
        .select('id')
        .limit(1);
      
      // Don't create any test transactions, just check if we can access the table
      setDiagnosticInfo({
        status: "complete",
        user: currentUser ? { 
          id: currentUser.id,
          email: currentUser.email
        } : null,
        tableExists: tableInfo !== null,
        tableError: tableError?.message,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      setDiagnosticInfo({ 
        status: "error", 
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  };

  // Function to clean up test transactions
  const cleanupTestTransactions = async () => {
    try {
      // Delete all test transactions
      await supabase
        .from('transactions')
        .delete()
        .eq('category', 'Test')
        .eq('description', 'Diagnostic test');
      
      // Refresh transactions after cleanup
      await fetchTransactions();
    } catch (error) {
      console.error("Error cleaning up test transactions:", error);
    }
  };

  // Function to reset transactions table
  const resetTransactionsTable = async () => {
    try {
      if (!confirm("This will delete all your transactions and recreate the table. Continue?")) {
        return;
      }
      
      setFixingTable(true);
      toast.info("Attempting to reset transactions table...");
      
      // Get values directly from the initialized client
      const supabaseUrl = "https://vtdkbrakyeyprgdyzzfo.supabase.co";
      const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0ZGticmFreWV5cHJnZHl6emZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1OTgwNzksImV4cCI6MjA2MTE3NDA3OX0.lJ1KqKnaMM27Pg6KH98XzQtUB8rcibZx_aFXYA792Oc";
      
      // Use a direct fetch to call the RPC endpoint
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/reset_transactions_table`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset table');
      }
      
      toast.success("Transactions table has been reset.");
      await fetchTransactions();
      await runDiagnostics();
      setHasError(false);
    } catch (error: any) {
      console.error("Failed to reset transactions table:", error);
      toast.error(`Failed to reset: ${error.message}`);
    } finally {
      setFixingTable(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
      // Don't run diagnostics on page load
      // Clean up any existing test transactions
      cleanupTestTransactions();
    }
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Balance Sheet</h1>
      
      {/* Database fix message */}
      {hasError && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg shadow-sm">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-yellow-800">Database structure issue detected</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Your transactions table needs to be updated to work with user accounts.
                Click the button below to fix it (this will reset your transactions).
              </p>
              <div className="mt-3">
                <Button 
                  onClick={fixDatabaseImmediately} 
                  disabled={fixingTable}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  {fixingTable ? "Fixing..." : "Fix Database Now"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          <DashboardSummary transactions={transactions} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-1">
              <TransactionForm onTransactionAdded={fetchTransactions} />

              <div className="mt-6">
                <Button 
                  onClick={() => setShowDiagnostic(!showDiagnostic)} 
                  variant="outline" 
                  size="sm"
                >
                  {showDiagnostic ? "Hide" : "Show"} Troubleshooting
                </Button>
                
                {showDiagnostic && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-yellow-800">Having trouble adding transactions?</h3>
                        <p className="text-sm text-yellow-700 mt-1">
                          If you're unable to add transactions, you may need to reset the transactions table.
                          This will delete all existing transactions but fix any database structure issues.
                        </p>
                        
                        <div className="flex gap-2 mt-3">
                          <Button onClick={runDiagnostics} variant="outline" size="sm" disabled={fixingTable}>
                            Run Diagnostics
                          </Button>
                          <Button onClick={resetTransactionsTable} variant="destructive" size="sm" disabled={fixingTable}>
                            {fixingTable ? "Resetting..." : "Reset Table"}
                          </Button>
                          <Button onClick={cleanupTestTransactions} variant="outline" size="sm">
                            Clean Test Transactions
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {diagnosticInfo && (
                      <div className="mt-3 p-3 bg-white border border-gray-200 rounded-md text-xs font-mono whitespace-pre-wrap">
                        {JSON.stringify(diagnosticInfo, null, 2)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
              <TransactionList 
                transactions={transactions} 
                onTransactionDeleted={fetchTransactions} 
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
