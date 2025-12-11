import { Patient } from "../../domain/entities/Patient";
import { IPatientRepository } from "../../domain/repositories/IPatientRepository";
import { supabaseAdmin } from "../database/supabase";
import { DatabaseError } from "../errors/DatabaseError";
export class PatientRepository implements IPatientRepository {
  async addPatient(patient: Patient): Promise<null> {
    const { data, error } = await supabaseAdmin
      .from("patients")
      .insert({
        id: patient.getId(),
        first_name: patient.getFirstName(),
        last_name: patient.getLastName(),
        email: patient.getEmail(),
        phone_number: patient.getPhoneNumber(),
        birth_date: patient.getBirthDate(),
        gender: patient.getGender(),
        address: patient.getAddress(),
        profession: patient.getProfession(),
        children_number: patient.getChildrenNumber(),
        family_situation: patient.getFamilySituation(),
        insurance_number: patient.getInsuranceNumber(),
        emergency_contact_name: patient.getEmergencyContactName(),
        emergency_contact_phone: patient.getEmergencyContactPhone(),
      })
      .select()
      .single();

    if (error) {
      throw new DatabaseError(error);
    }
    if (!data) {
      throw new DatabaseError("Failed to create patient");
    }
    return null;
  }
  async getPatientByid(id: string): Promise<Patient> {
    const { data, error } = await supabaseAdmin
      .from("patients")
      .select()
      .eq("id", id)
      .single();
    if (error) {
      throw new DatabaseError(error);
    }
    if (!data) {
      throw new DatabaseError("Failed to get patient");
    }
    return new Patient({
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      phoneNumber: data.phone_number,
      birthDate: data.birth_date,
      gender: data.gender,
      address: data.address,
      profession: data.profession,
      childrenNumber: data.children_number,
      familySituation: data.family_situation,
      insuranceNumber: data.insurance_number,
      emergencyContactName: data.emergency_contact_name,
      emergencyContactPhone: data.emergency_contact_phone,
      medicalFileId: data.medical_file_id,
    });
  }
  async deletePatientByid(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from("patients")
      .delete()
      .eq("id", id);
    if (error) {
      throw new DatabaseError(error);
    }
  }
  async getAllPatients(): Promise<Patient[]> {
    const { data, error } = await supabaseAdmin.from("patients").select();
    if (error) {
      throw new DatabaseError(error);
    }
    if (!data) {
      throw new DatabaseError("Failed to get patients");
    }
    return data.map((patient) => {
      return new Patient({
        id: patient.id,
        firstName: patient.first_name,
        lastName: patient.last_name,
        email: patient.email,
        phoneNumber: patient.phone_number,
        birthDate: patient.birth_date,
        gender: patient.gender,
        address: patient.address,
        profession: patient.profession,
        childrenNumber: patient.children_number,
        familySituation: patient.family_situation,
        insuranceNumber: patient.insurance_number,
        emergencyContactName: patient.emergency_contact_name,
        emergencyContactPhone: patient.emergency_contact_phone,
        medicalFileId: patient.medical_file_id,
      });
    });
  }
}
