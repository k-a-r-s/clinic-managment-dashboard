-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.appointment_results (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL,
  patient_medical_file_id uuid NOT NULL,
  description text,
  treatment_plan text,
  prescription jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT appointment_results_pkey PRIMARY KEY (id),
  CONSTRAINT appointment_results_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id),
  CONSTRAINT appointment_results_patient_medical_file_id_fkey FOREIGN KEY (patient_medical_file_id) REFERENCES public.patient_medical_files(id)
);
CREATE TABLE public.appointments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  doctor_id uuid NOT NULL,
  room_id integer,
  created_by_receptionist_id uuid,
  created_by_doctor_id uuid,
  appointment_date timestamp with time zone NOT NULL,
  estimated_duration integer DEFAULT 30,
  actual_duration integer,
  status character varying NOT NULL DEFAULT 'scheduled'::character varying CHECK (status::text = ANY (ARRAY['scheduled'::character varying, 'in-progress'::character varying, 'completed'::character varying, 'cancelled'::character varying, 'no-show'::character varying]::text[])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT appointments_pkey PRIMARY KEY (id),
  CONSTRAINT appointments_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id),
  CONSTRAINT appointments_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id),
  CONSTRAINT appointments_created_by_receptionist_id_fkey FOREIGN KEY (created_by_receptionist_id) REFERENCES public.receptionists(id),
  CONSTRAINT appointments_created_by_doctor_id_fkey FOREIGN KEY (created_by_doctor_id) REFERENCES public.doctors(id)
);
CREATE TABLE public.doctors (
  id uuid NOT NULL,
  salary numeric,
  is_medical_director boolean DEFAULT false,
  specialization character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT doctors_pkey PRIMARY KEY (id),
  CONSTRAINT doctors_id_fkey FOREIGN KEY (id) REFERENCES public.profiles(id)
);
CREATE TABLE public.machines (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  machine_id character varying NOT NULL UNIQUE,
  serial_number character varying NOT NULL,
  room_id integer,
  status character varying NOT NULL DEFAULT 'available'::character varying CHECK (status::text = ANY (ARRAY['available'::character varying, 'in-use'::character varying, 'maintenance'::character varying, 'out-of-service'::character varying]::text[])),
  last_maintenance_date date NOT NULL,
  next_maintenance_date date NOT NULL,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true,
  CONSTRAINT machines_pkey PRIMARY KEY (id),
  CONSTRAINT machines_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id),
  CONSTRAINT machines_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.patient_medical_files (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL,
  last_updated timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  data jsonb NOT NULL,
  CONSTRAINT patient_medical_files_pkey PRIMARY KEY (id),
  CONSTRAINT patient_medical_files_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id)
);
CREATE TABLE public.patients (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone_number character varying,
  birth_date date,
  gender character varying,
  address text,
  profession text,
  children_number integer DEFAULT 0,
  family_situation text,
  insurance_number character varying,
  emergency_contact_name character varying,
  emergency_contact_phone character varying,
  allergies ARRAY,
  current_medications ARRAY,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  medical_file_id uuid UNIQUE,
  CONSTRAINT patients_pkey PRIMARY KEY (id)
);
CREATE TABLE public.prescription_medications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  prescription_id uuid NOT NULL,
  medication_name character varying NOT NULL,
  dosage character varying NOT NULL,
  frequency character varying NOT NULL,
  duration character varying NOT NULL,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT prescription_medications_pkey PRIMARY KEY (id),
  CONSTRAINT prescription_medications_prescription_id_fkey FOREIGN KEY (prescription_id) REFERENCES public.prescriptions(id)
);
CREATE TABLE public.prescriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  doctor_id uuid NOT NULL,
  appointment_id uuid,
  prescription_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT prescriptions_pkey PRIMARY KEY (id),
  CONSTRAINT prescriptions_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id),
  CONSTRAINT prescriptions_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id),
  CONSTRAINT prescriptions_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email character varying NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role USER-DEFINED NOT NULL DEFAULT 'doctor'::role_enum,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.receptionists (
  id uuid NOT NULL,
  phone_number character varying,
  department character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT receptionists_pkey PRIMARY KEY (id),
  CONSTRAINT receptionists_id_fkey FOREIGN KEY (id) REFERENCES public.profiles(id)
);
CREATE TABLE public.rooms (
  id integer NOT NULL DEFAULT nextval('rooms_id_seq'::regclass),
  room_number character varying NOT NULL UNIQUE,
  capacity integer DEFAULT 1,
  type character varying DEFAULT 'consultation'::character varying,
  is_available boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT rooms_pkey PRIMARY KEY (id)
);