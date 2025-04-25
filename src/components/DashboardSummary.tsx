
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, DollarSign } from "lucide-react";
import { Transaction } from "@/lib/supabase";

interface DashboardSummaryProps {
  transactions: Transaction[];
}

export default function DashboardSummary({ transactions }: DashboardSummaryProps) {
  const totalIncome = transactions
    .filter(transaction => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpenses = transactions
    .filter(transaction => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            Total Income
            <ArrowUp className="h-4 w-4 ml-1 text-green-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            Total Expenses
            <ArrowDown className="h-4 w-4 ml-1 text-red-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card className={`border-l-4 ${balance >= 0 ? 'border-l-purple-500' : 'border-l-orange-500'}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            Balance
            <DollarSign className={`h-4 w-4 ml-1 ${balance >= 0 ? 'text-purple-500' : 'text-orange-500'}`} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${balance >= 0 ? 'text-purple-700' : 'text-orange-700'}`}>
            ${balance.toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
