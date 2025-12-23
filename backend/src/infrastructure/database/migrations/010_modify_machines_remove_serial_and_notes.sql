-- 010_modify_machines_remove_serial_and_notes.sql
BEGIN;

-- Drop serial_number and notes columns if they exist
ALTER TABLE public.machines DROP COLUMN IF EXISTS serial_number;
ALTER TABLE public.machines DROP COLUMN IF EXISTS notes;

-- Create sequence for machine id generation and set default if not already set
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'machines_machine_seq') THEN
    CREATE SEQUENCE machines_machine_seq;
  END IF;
END$$;

ALTER TABLE public.machines ALTER COLUMN machine_id SET DEFAULT ('HD-MAC-' || lpad(nextval('machines_machine_seq')::text, 3, '0'));

COMMIT;
