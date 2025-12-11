-- Drop the foreign key constraint on created_by_doctor_id
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_created_by_doctor_id_fkey;
