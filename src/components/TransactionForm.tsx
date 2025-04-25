import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { TransactionInput, transactionCategories } from "@/lib/supabase";
import { Calendar } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { addTransaction } from "@/services/transactionService";
import { toast } from "sonner";

interface TransactionFormProps {
  onTransactionAdded: () => void;
}

// Create a schema for form validation
const formSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Please select a category"),
  description: z.string().optional(),
  date: z.string().min(1, "Please select a date"),
});

export default function TransactionForm({ onTransactionAdded }: TransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionType, setTransactionType] = useState<"income" | "expense">("expense");
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  const form = useForm<TransactionInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      type: "expense",
      category: "",
      description: "",
      date: new Date().toISOString().slice(0, 10),
    },
  });
  
  const onSubmit = async (data: TransactionInput) => {
    try {
      setIsSubmitting(true);
      setErrorDetails(null);
      
      // Validate required fields
      if (!data.category) {
        toast.error("Please select a category");
        return;
      }
      
      if (!data.date) {
        toast.error("Please select a date");
        return;
      }
      
      if (data.amount <= 0) {
        toast.error("Amount must be greater than 0");
        return;
      }
      
      if (data.type === "expense") {
        // Make amount negative for expenses
        data.amount = Math.abs(data.amount) * -1;
      } else {
        // Ensure amount is positive for income
        data.amount = Math.abs(data.amount);
      }
      
      await addTransaction(data);
      toast.success("Transaction added successfully!");
      onTransactionAdded();
      form.reset({
        amount: 0,
        type: "expense",
        category: "",
        description: "",
        date: new Date().toISOString().slice(0, 10),
      });
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to add transaction";
      toast.error(errorMessage);
      setErrorDetails(JSON.stringify(error, null, 2));
      console.error("Transaction error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg border shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Add New Transaction</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={(value: "income" | "expense") => {
                      field.onChange(value);
                      setTransactionType(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">$</span>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        className="pl-6"
                        {...field}
                        value={field.value === 0 ? '' : Math.abs(field.value)}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {transactionCategories[transactionType].map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        type="date"
                        className="pl-9"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add details about this transaction..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Transaction"}
          </Button>
          
          {errorDetails && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700 font-mono whitespace-pre-wrap">
              <div className="font-semibold mb-1">Error Details:</div>
              {errorDetails}
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
