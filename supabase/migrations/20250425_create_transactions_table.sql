
-- Create the transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    amount NUMERIC NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    category TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL
);

-- Enable row level security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations for now (you can restrict this later)
CREATE POLICY "Allow all operations for all users" ON public.transactions
    FOR ALL
    USING (true)
    WITH CHECK (true);
