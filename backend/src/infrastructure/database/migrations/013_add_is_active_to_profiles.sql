-- Add is_active column to profiles table for soft delete functionality
-- This allows users to be deactivated without losing their data and relationships

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Create index for better query performance when filtering active users
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON public.profiles(is_active);

-- Update existing records to be active by default
UPDATE public.profiles SET is_active = true WHERE is_active IS NULL;

-- Add comment to document the column
COMMENT ON COLUMN public.profiles.is_active IS 'Soft delete flag - false means user is deactivated';
