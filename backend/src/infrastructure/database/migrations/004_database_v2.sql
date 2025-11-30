-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.appointment_results (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL,
  patient_medical_file_id uuid NOT NULL,
  description text,
  diagnosis text,
  treatment_plan text,
  prescription jsonb,
  updated_attributes jsonb,
  follow_up_required boolean DEFAULT false,
  follow_up_date timestamp with time zone,
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
  notes text,
  reason_for_visit character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT appointments_pkey PRIMARY KEY (id),
  CONSTRAINT appointments_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id),
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
CREATE TABLE public.patient_medical_files (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL,
  patient_id uuid NOT NULL,
  blood_type character varying,
  height numeric,
  weight numeric,
  chronic_conditions ARRAY,
  surgical_history ARRAY,
  family_medical_history text,
  current_medications jsonb,
  allergies ARRAY,
  attributes jsonb,
  current_treatment ARRAY,
  last_updated timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT patient_medical_files_pkey PRIMARY KEY (id),
  CONSTRAINT patient_medical_files_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id),
  CONSTRAINT patient_medical_files_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id)
);
CREATE TABLE public.patients (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email character varying NOT NULL,
  phone_number character varying,
  address text,
  profession text,
  children_number integer DEFAULT 0,
  family_situation text,
  birth_date date,
  gender character varying,
  insurance_number character varying,
  emergency_contact_name character varying,
  emergency_contact_phone character varying,
  allergies text[],
  current_medications text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT patients_pkey PRIMARY KEY (id)
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