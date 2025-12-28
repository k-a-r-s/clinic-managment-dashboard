"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorRepository = void 0;
const Doctor_1 = require("../../domain/entities/Doctor");
const supabase_1 = require("../../infrastructure/database/supabase");
const logger_1 = require("../../shared/utils/logger");
const DatabaseError_1 = require("../errors/DatabaseError");
class DoctorRepository {
    async getDoctorById(id) {
        // Fetch doctor with profile information using join
        const { data, error } = await supabase_1.supabaseAdmin
            .from("doctors")
            .select(`
        id,
        specialization,
        is_medical_director,
        salary,
        phone_number,
        profiles!inner (
          first_name,
          last_name,
          email,
          role
        )
      `)
            .eq("id", id)
            .single();
        if (error) {
            logger_1.Logger.error("Doctor not fetched", { error });
            throw new DatabaseError_1.DatabaseError(error.message);
        }
        if (!data) {
            return null;
        }
        // Type assertion for profiles since Supabase returns it as an object, not array
        const profile = data.profiles;
        // Create Doctor entity from the fetched data
        const doctor = new Doctor_1.Doctor(data.id, profile.email, profile.first_name, profile.last_name, data.specialization);
        // Set additional properties
        doctor.setSpecialisation(data.specialization);
        doctor.setSalary(data.salary);
        doctor.setIsMedicalSupervisor(data.is_medical_director);
        if (data.phone_number) {
            doctor.setPhoneNumber(data.phone_number);
        }
        return doctor;
    }
    async getDoctors(offset, limit) {
        // Get total count of doctors
        const { count, error: countError } = await supabase_1.supabaseAdmin
            .from("doctors")
            .select("*", { count: "exact", head: true });
        if (countError) {
            logger_1.Logger.error("Failed to get doctors count", { countError });
            throw new DatabaseError_1.DatabaseError(countError.message);
        }
        // Fetch doctors with profile information using join
        const { data, error } = await supabase_1.supabaseAdmin
            .from("doctors")
            .select(`
        id,
        specialization,
        is_medical_director,
        phone_number,
        salary,
        profiles!inner (
          first_name,
          last_name,
          email
        )
      `)
            .range(offset, offset + limit - 1);
        if (error) {
            logger_1.Logger.error("Doctors not fetched", { error });
            throw new DatabaseError_1.DatabaseError(error.message);
        }
        // Transform the data to match GetDoctorsList interface
        const doctors = (data || []).map((doctor) => {
            // profiles is a single object due to !inner join, not an array
            const profile = doctor.profiles;
            return {
                id: doctor.id,
                first_name: profile.first_name,
                last_name: profile.last_name,
                email: profile.email,
                specialization: doctor.specialization,
                salary: doctor.salary,
                phone_number: doctor.phone_number,
                is_medical_director: doctor.is_medical_director,
            };
        });
        return {
            total: count || 0,
            doctors,
        };
    }
    async updateDoctorById(id, doctorData) {
        // Split incoming payload into profile fields and doctor-specific fields
        const payload = doctorData;
        const profileUpdate = {};
        const doctorUpdate = {};
        if (payload.firstName ?? payload["first_name"]) {
            profileUpdate.first_name = payload.firstName || payload["first_name"];
        }
        if (payload.lastName ?? payload["last_name"]) {
            profileUpdate.last_name = payload.lastName || payload["last_name"];
        }
        if (payload.email) {
            profileUpdate.email = payload.email;
        }
        if (payload.role) {
            // Normalize role to lowercase string as stored in profiles.role
            profileUpdate.role = String(payload.role).toLowerCase();
        }
        if (payload.salary !== undefined) {
            doctorUpdate.salary = payload.salary;
        }
        if (payload.specialization !== undefined) {
            doctorUpdate.specialization = payload.specialization;
        }
        if (payload.phoneNumber !== undefined || payload.phone_number !== undefined) {
            doctorUpdate.phone_number = payload.phoneNumber || payload.phone_number;
        }
        if (payload.isMedicalDirector !== undefined) {
            doctorUpdate.is_medical_director = payload.isMedicalDirector;
        }
        if (payload.is_medical_director !== undefined) {
            doctorUpdate.is_medical_director = payload.is_medical_director;
        }
        // Update profile first (profiles.id == doctors.id FK)
        if (Object.keys(profileUpdate).length > 0) {
            const { error: profileError } = await supabase_1.supabaseAdmin
                .from("profiles")
                .update(profileUpdate)
                .eq("id", id);
            if (profileError) {
                logger_1.Logger.error("Profile not updated", { profileError });
                throw new DatabaseError_1.DatabaseError(profileError.message);
            }
        }
        // Update doctors table
        if (Object.keys(doctorUpdate).length > 0) {
            const { error: doctorError } = await supabase_1.supabaseAdmin
                .from("doctors")
                .update(doctorUpdate)
                .eq("id", id);
            if (doctorError) {
                logger_1.Logger.error("Doctor not updated", { doctorError });
                throw new DatabaseError_1.DatabaseError(doctorError.message);
            }
        }
        // Fetch the updated doctor with profile information
        const updatedDoctor = await this.getDoctorById(id);
        if (!updatedDoctor) {
            logger_1.Logger.error("Doctor not found after update", { id });
            throw new DatabaseError_1.DatabaseError("Doctor not found after update");
        }
        // Return the fetched/updated Doctor instance (preserves phone number, salary, flags)
        return updatedDoctor;
    }
    async deleteDoctorById(id) {
        const { error } = await supabase_1.supabaseAdmin.from("doctors").delete().eq("id", id);
        if (error) {
            logger_1.Logger.error("Doctor not deleted", { error });
            throw new DatabaseError_1.DatabaseError(error);
        }
    }
}
exports.DoctorRepository = DoctorRepository;
