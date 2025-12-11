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
    const { error } = await supabaseAdmin
      .from("doctors")
      .update(doctorData)
      .eq("id", id);

    if (error) {
      Logger.error("Doctor not updated", { error });
      throw new DatabaseError(error.message);
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
