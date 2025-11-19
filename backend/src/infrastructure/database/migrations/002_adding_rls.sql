-- =========================
-- Add UUID column to users table (Supabase Auth)
-- =========================
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_uuid UUID UNIQUE;

-- =========================
-- Enable RLS on all tables
-- =========================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE receptionists ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_medical_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_results ENABLE ROW LEVEL SECURITY;

-- =========================
-- Helper Function: Get User Role from UUID
-- =========================
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    role_name TEXT;
BEGIN
    SELECT r.name INTO role_name
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.auth_uuid = user_uuid;
    RETURN COALESCE(role_name, 'patient');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================
-- Helper Function: Get User ID from UUID
-- =========================
CREATE OR REPLACE FUNCTION get_user_id(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    user_id INTEGER;
BEGIN
    SELECT u.id INTO user_id
    FROM users u
    WHERE u.auth_uuid = user_uuid;
    RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================
-- USERS TABLE RLS
-- =========================
-- Only admin can CRUD users
CREATE POLICY users_admin_crud ON users
    FOR ALL
    USING (get_user_role(auth.uid()) = 'admin')
    WITH CHECK (get_user_role(auth.uid()) = 'admin');

-- =========================
-- DOCTORS TABLE RLS
-- =========================
-- Only admin can CRUD doctors
CREATE POLICY doctors_admin_crud ON doctors
    FOR ALL
    USING (get_user_role(auth.uid()) = 'admin')
    WITH CHECK (get_user_role(auth.uid()) = 'admin');

-- =========================
-- ADMINS TABLE RLS
-- =========================
-- Only admin can CRUD admins
CREATE POLICY admins_admin_crud ON admins
    FOR ALL
    USING (get_user_role(auth.uid()) = 'admin')
    WITH CHECK (get_user_role(auth.uid()) = 'admin');

-- =========================
-- RECEPTIONISTS TABLE RLS
-- =========================
-- Only admin can CRUD receptionists
CREATE POLICY receptionists_admin_crud ON receptionists
    FOR ALL
    USING (get_user_role(auth.uid()) = 'admin')
    WITH CHECK (get_user_role(auth.uid()) = 'admin');

-- =========================
-- PATIENTS TABLE RLS
-- =========================
-- First, add doctor_id column to patients table
ALTER TABLE patients ADD COLUMN IF NOT EXISTS doctor_id INTEGER REFERENCES doctors(id) ON DELETE SET NULL;

-- Admin can CRUD all patients
CREATE POLICY patients_admin_crud ON patients
    FOR ALL
    USING (get_user_role(auth.uid()) = 'admin')
    WITH CHECK (get_user_role(auth.uid()) = 'admin');

-- Doctors can CRUD patients assigned to them
CREATE POLICY patients_doctor_own ON patients
    FOR ALL
    USING (
        get_user_role(auth.uid()) = 'doctor' 
        AND doctor_id = get_user_id(auth.uid())
    )
    WITH CHECK (
        get_user_role(auth.uid()) = 'doctor' 
        AND doctor_id = get_user_id(auth.uid())
    );

-- =========================
-- ROOMS TABLE RLS
-- =========================
-- Admin can CRUD rooms
CREATE POLICY rooms_admin_crud ON rooms
    FOR ALL
    USING (get_user_role(auth.uid()) = 'admin')
    WITH CHECK (get_user_role(auth.uid()) = 'admin');

-- Receptionists can CRUD rooms
CREATE POLICY rooms_receptionist_crud ON rooms
    FOR ALL
    USING (get_user_role(auth.uid()) = 'receptionist')
    WITH CHECK (get_user_role(auth.uid()) = 'receptionist');

-- =========================
-- APPOINTMENTS TABLE RLS
-- =========================
-- Admin can CRUD all appointments
CREATE POLICY appointments_admin_crud ON appointments
    FOR ALL
    USING (get_user_role(auth.uid()) = 'admin')
    WITH CHECK (get_user_role(auth.uid()) = 'admin');

-- Receptionists can CRUD all appointments
CREATE POLICY appointments_receptionist_crud ON appointments
    FOR ALL
    USING (get_user_role(auth.uid()) = 'receptionist')
    WITH CHECK (get_user_role(auth.uid()) = 'receptionist');

-- Doctors can INSERT appointments
CREATE POLICY appointments_doctor_insert ON appointments
    FOR INSERT
    WITH CHECK (get_user_role(auth.uid()) = 'doctor');

-- Doctors can SELECT only their appointments
CREATE POLICY appointments_doctor_select ON appointments
    FOR SELECT
    USING (
        get_user_role(auth.uid()) = 'doctor' 
        AND doctor_id = get_user_id(auth.uid())
    );

-- Doctors can DELETE only their own appointments
CREATE POLICY appointments_doctor_delete ON appointments
    FOR DELETE
    USING (
        get_user_role(auth.uid()) = 'doctor' 
        AND doctor_id = get_user_id(auth.uid())
    );

-- =========================
-- PATIENT_MEDICAL_FILES TABLE RLS
-- =========================
-- Admin can CRUD all medical files
CREATE POLICY medical_files_admin_crud ON patient_medical_files
    FOR ALL
    USING (get_user_role(auth.uid()) = 'admin')
    WITH CHECK (get_user_role(auth.uid()) = 'admin');

-- Doctors can SELECT only their own patients' medical files
CREATE POLICY medical_files_doctor_select ON patient_medical_files
    FOR SELECT
    USING (
        get_user_role(auth.uid()) = 'doctor' 
        AND doctor_id = get_user_id(auth.uid())
    );

-- =========================
-- APPOINTMENT_RESULTS TABLE RLS
-- =========================
-- Admin can CRUD all appointment results
CREATE POLICY appointment_results_admin_crud ON appointment_results
    FOR ALL
    USING (get_user_role(auth.uid()) = 'admin')
    WITH CHECK (get_user_role(auth.uid()) = 'admin');

-- Doctors can SELECT results only for their patients' appointments
CREATE POLICY appointment_results_doctor_select ON appointment_results
    FOR SELECT
    USING (
        get_user_role(auth.uid()) = 'doctor'
        AND EXISTS (
            SELECT 1 FROM appointments a
            WHERE a.id = appointment_results.appointment_id
            AND a.doctor_id = get_user_id(auth.uid())
        )
    );