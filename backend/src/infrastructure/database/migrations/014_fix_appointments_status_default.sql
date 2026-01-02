-- Fix the appointments status default value to match the CHECK constraint
-- The CHECK constraint requires uppercase values: SCHEDULED, COMPLETED, CANCELED, NO_SHOW
-- But the default was lowercase 'scheduled'

ALTER TABLE appointments 
  ALTER COLUMN status SET DEFAULT 'SCHEDULED'::character varying;

-- Update any existing rows that might have lowercase status values
UPDATE appointments 
SET status = UPPER(status)
WHERE status IN ('scheduled', 'completed', 'canceled', 'no_show');
