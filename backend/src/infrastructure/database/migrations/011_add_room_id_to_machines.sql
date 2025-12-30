-- 011_add_room_id_to_machines.sql
-- Add room_id uuid column to machines, populate from rooms.room_number where possible,
-- and add foreign key + index. Idempotent.
BEGIN;

-- Add column if not exists
ALTER TABLE public.machines ADD COLUMN IF NOT EXISTS room_id uuid;

-- Populate room_id from rooms table where machines.room (string) matches rooms.room_number
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='rooms') THEN
    UPDATE public.machines m
    SET room_id = r.id
    FROM public.rooms r
    WHERE m.room IS NOT NULL
      AND r.room_number IS NOT NULL
      AND m.room = r.room_number
      AND (m.room_id IS NULL OR m.room_id = '');
  END IF;
END$$;

-- Add foreign key constraint if rooms table exists and constraint not exists
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'rooms') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'machines_room_id_fkey') THEN
      ALTER TABLE public.machines
        ADD CONSTRAINT machines_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE SET NULL;
    END IF;
  END IF;
END$$;

-- Create index for faster lookup
CREATE INDEX IF NOT EXISTS idx_machines_room_id ON public.machines (room_id);

-- Null out legacy room string for rows where we successfully set room_id to avoid confusion
UPDATE public.machines m
SET room = NULL
FROM public.rooms r
WHERE m.room IS NOT NULL
  AND r.room_number IS NOT NULL
  AND m.room = r.room_number
  AND m.room_id = r.id;

COMMIT;
