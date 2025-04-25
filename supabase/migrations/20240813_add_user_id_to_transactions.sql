-- Add user_id column to transactions table
ALTER TABLE transactions
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to select only their own transactions
CREATE POLICY select_own_transactions ON transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert only their own transactions
CREATE POLICY insert_own_transactions ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update only their own transactions
CREATE POLICY update_own_transactions ON transactions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete only their own transactions
CREATE POLICY delete_own_transactions ON transactions
  FOR DELETE USING (auth.uid() = user_id); 