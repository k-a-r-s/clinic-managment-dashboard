-- 009_create_machines.sql
-- Create machines table and machine_status enum
BEGIN;

-- Create enum for machine status
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'machine_status') THEN
        CREATE TYPE machine_status AS ENUM ('available', 'in-use', 'maintenance', 'out-of-service');
    END IF;
END$$;

-- Create machines table
CREATE TABLE IF NOT EXISTS public.machines (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  machine_id varchar NOT NULL UNIQUE,
  serial_number varchar NOT NULL UNIQUE,
  manufacturer varchar,
  model varchar,
  status machine_status NOT NULL DEFAULT 'available',
  last_maintenance_date date NOT NULL,
  next_maintenance_date date NOT NULL,
  notes text,
  is_active boolean DEFAULT true,
  room varchar,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT machines_pkey PRIMARY KEY (id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_machines_machine_id ON public.machines (machine_id);
CREATE INDEX IF NOT EXISTS idx_machines_serial_number ON public.machines (serial_number);
CREATE INDEX IF NOT EXISTS idx_machines_status ON public.machines (status);

COMMIT;
