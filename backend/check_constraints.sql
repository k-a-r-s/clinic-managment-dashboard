-- Run this in Supabase SQL Editor to see all constraints on appointments table
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
WHERE conrelid = 'public.appointments'::regclass
AND contype = 'c'  -- 'c' = CHECK constraint
ORDER BY conname;
