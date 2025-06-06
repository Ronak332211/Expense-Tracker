import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts";
import { format } from "date-fns";
import { Transaction } from "@/lib/supabase";

interface MonthlyChartsProps {
  transactions: Transaction[];
}

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export default function MonthlyCharts({ transactions }: MonthlyChartsProps) {
  const monthlyData = useMemo(() => {
    const data = new Map<string, MonthlyData>();
    
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthKey = format(date, "MMM yyyy");
      
      if (!data.has(monthKey)) {
        data.set(monthKey, {
          month: monthKey,
          income: 0,
          expenses: 0,
          balance: 0
        });
      }
      
      const monthData = data.get(monthKey)!;
      if (transaction.type === "income") {
        monthData.income += Number(transaction.amount);
      } else {
        monthData.expenses += Number(transaction.amount);
      }
      monthData.balance = monthData.income + monthData.expenses;
    });

    return Array.from(data.values())
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6); // Show last 6 months
  }, [transactions]);

  const chartConfig = {
    income: {
      label: "Income",
      color: "#22c55e"
    },
    expenses: {
      label: "Expenses",
      color: "#ef4444"
    },
    balance: {
      label: "Balance",
      color: "#8b5cf6"
    }
  };

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Monthly Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="aspect-[4/3]"
            config={chartConfig}
          >
            <BarChart data={monthlyData}>
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Bar
                dataKey="income"
                fill="var(--color-income)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expenses"
                fill="var(--color-expenses)"
                radius={[4, 4, 0, 0]}
              />
              <ChartTooltip>
                <ChartTooltipContent />
              </ChartTooltip>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Balance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="aspect-[4/3]"
            config={chartConfig}
          >
            <LineChart data={monthlyData}>
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="var(--color-balance)"
                strokeWidth={2}
                dot={{ fill: "var(--color-balance)" }}
              />
              <ChartTooltip>
                <ChartTooltipContent />
              </ChartTooltip>
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
