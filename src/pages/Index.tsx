
import { useEffect, useState } from "react";
import DashboardSummary from "@/components/DashboardSummary";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import { Transaction } from "@/lib/supabase";
import { getTransactions } from "@/services/transactionService";
import { toast } from "sonner";

export default function Index() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      toast.error("Failed to fetch transactions");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Expense Tracker</h1>
      
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
