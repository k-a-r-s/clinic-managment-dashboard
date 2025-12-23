import { Doctor } from "../../domain/entities/Doctor";
import { IDoctorRepository } from "../../domain/repositories/IDoctorRepository";
import { supabaseAdmin } from "../../infrastructure/database/supabase";
import { Logger } from "../../shared/utils/logger";
import { DatabaseError } from "../errors/DatabaseError";
import { GetDoctorsList } from "../../application/dto/responses/getDoctorsList";
export class DoctorRepository implements IDoctorRepository {
  async getDoctorById(id: string): Promise<Doctor | null> {
    // Fetch doctor with profile information using join
    const { data, error } = await supabaseAdmin
      .from("doctors")
      .select(
        `
        id,
        specialization,
        salary,
        is_medical_director,
        profiles!inner (
          first_name,
          last_name,
          email,
          role
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      Logger.error("Doctor not fetched", { error });
      throw new DatabaseError(error.message);
    }

    if (!data) {
      return null;
    }

    // Type assertion for profiles since Supabase returns it as an object, not array
    const profile = data.profiles as unknown as {
      first_name: string;
      last_name: string;
      email: string;
      role: string;
    };

    // Create Doctor entity from the fetched data
    const doctor = new Doctor(
      data.id,
      profile.email,
      profile.first_name,
      profile.last_name,
      data.specialization
    );

    // Set additional properties
    doctor.setSpecialisation(data.specialization);
    doctor.setSalary(data.salary);
    doctor.setIsMedicalSupervisor(data.is_medical_director);

    return doctor;
  }
  async getDoctors(offset: number, limit: number): Promise<GetDoctorsList> {
    // Get total count of doctors
    const { count, error: countError } = await supabaseAdmin
      .from("doctors")
      .select("*", { count: "exact", head: true });

    if (countError) {
      Logger.error("Failed to get doctors count", { countError });
      throw new DatabaseError(countError.message);
    }

    // Fetch doctors with profile information using join
    const { data, error } = await supabaseAdmin
      .from("doctors")
      .select(
        `
        id,
        specialization,
        profiles!inner (
          first_name,
          last_name,
          email
        )
      `
      )
      .range(offset, offset + limit - 1);

    if (error) {
      Logger.error("Doctors not fetched", { error });
      throw new DatabaseError(error.message);
    }

    // Transform the data to match GetDoctorsList interface
    const doctors = (data || []).map((doctor: any) => {
      // profiles is a single object due to !inner join, not an array
      const profile = doctor.profiles as unknown as {
        first_name: string;
        last_name: string;
        email: string;
      };
      return {
        id: doctor.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        specialization: doctor.specialization,
      };
    });

    return {
      total: count || 0,
      doctors,
    };
  }
  async updateDoctorById(
    id: string,
    doctorData: Partial<Doctor>
  ): Promise<Doctor> {
    // Split incoming payload into profile fields and doctor-specific fields
    const payload: any = doctorData as any;
    const profileUpdate: any = {};
    const doctorUpdate: any = {};

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
    if (payload.isMedicalDirector !== undefined) {
      doctorUpdate.is_medical_director = payload.isMedicalDirector;
    }
    if (payload.is_medical_director !== undefined) {
      doctorUpdate.is_medical_director = payload.is_medical_director;
    }

    // Update profile first (profiles.id == doctors.id FK)
    if (Object.keys(profileUpdate).length > 0) {
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update(profileUpdate)
        .eq("id", id);

      if (profileError) {
        Logger.error("Profile not updated", { profileError });
        throw new DatabaseError(profileError.message);
      }
    }

    // Update doctors table
    if (Object.keys(doctorUpdate).length > 0) {
      const { error: doctorError } = await supabaseAdmin
        .from("doctors")
        .update(doctorUpdate)
        .eq("id", id);

      if (doctorError) {
        Logger.error("Doctor not updated", { doctorError });
        throw new DatabaseError(doctorError.message);
      }
    }

    // Fetch the updated doctor with profile information
    const updatedDoctor = await this.getDoctorById(id);

    if (!updatedDoctor) {
      Logger.error("Doctor not found after update", { id });
      throw new DatabaseError("Doctor not found after update");
    }

    return new Doctor(
      updatedDoctor.getId(),
      updatedDoctor.getEmail(),
      updatedDoctor.getFirstName(),
      updatedDoctor.getLastName(),
      updatedDoctor.getSpecialisation()
    );
  }
  async deleteDoctorById(id: string): Promise<void> {
    const { error } = await supabaseAdmin.from("doctors").delete().eq("id", id);
    if (error) {
      Logger.error("Doctor not deleted", { error });
      throw new DatabaseError(error);
    }
  }
}
