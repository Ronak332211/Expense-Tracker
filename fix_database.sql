-- Drop existing transactions table if it exists
DROP TABLE IF EXISTS public.transactions;

-- Create a new transactions table with all required fields
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to select only their own transactions
CREATE POLICY select_own_transactions ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert only their own transactions
CREATE POLICY insert_own_transactions ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update only their own transactions
CREATE POLICY update_own_transactions ON public.transactions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete only their own transactions
CREATE POLICY delete_own_transactions ON public.transactions
  FOR DELETE USING (auth.uid() = user_id); 