
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/lib/supabase";
import { deleteTransaction } from "@/services/transactionService";
import { format } from "date-fns";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionDeleted: () => void;
}

export default function TransactionList({ transactions, onTransactionDeleted }: TransactionListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteTransaction(id);
      toast.success("Transaction deleted successfully");
      onTransactionDeleted();
    } catch (error) {
      toast.error("Failed to delete transaction");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No transactions found. Add your first transaction above!</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">
                {format(new Date(transaction.date), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <span className="flex items-center">
                  {transaction.type === "income" ? (
                    <ArrowUp className="mr-1 h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDown className="mr-1 h-4 w-4 text-red-600" />
                  )}
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </span>
              </TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell className="max-w-[200px] truncate">{transaction.description}</TableCell>
              <TableCell 
                className={`text-right font-medium ${
                  transaction.amount >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ${Math.abs(transaction.amount).toFixed(2)}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(transaction.id)}
                  disabled={deletingId === transaction.id}
                >
                  <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
