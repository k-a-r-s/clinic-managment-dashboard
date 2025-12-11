-- Drop the foreign key constraint on created_by_doctor_id
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_created_by_doctor_id_fkey;

-- Ensure patient_medical_files table has the correct structure
-- Add patient_id column if it doesn't exist
ALTER TABLE patient_medical_files ADD COLUMN IF NOT EXISTS patient_id UUID REFERENCES patients(id) ON DELETE CASCADE;

-- Add doctor_id column if it doesn't exist
ALTER TABLE patient_medical_files ADD COLUMN IF NOT EXISTS doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL;

-- Ensure data column exists (JSONB for storing medical data)
ALTER TABLE patient_medical_files ADD COLUMN IF NOT EXISTS data JSONB;
