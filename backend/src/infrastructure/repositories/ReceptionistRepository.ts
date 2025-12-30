import { Receptionist } from "../../domain/entities/Receptionist";
import { IReceptionistRepository } from "../../domain/repositories/IReceptionistRepository";
import { supabaseAdmin } from "../database/supabase";
import { Logger } from "../../shared/utils/logger";
import { DatabaseError } from "../errors/DatabaseError";
import { GetReceptionistsList } from "../../application/dto/responses/getReceptionistsList";

export class ReceptionistRepository implements IReceptionistRepository {
  async getReceptionistById(id: string): Promise<Receptionist | null> {
    const { data, error } = await supabaseAdmin
      .from("receptionists")
      .select(
        `
        id,
        phone_number,
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
      Logger.error("Receptionist not fetched", { error });
      throw new DatabaseError(error.message);
    }

    if (!data) return null;

    const profile = data.profiles as unknown as {
      first_name: string;
      last_name: string;
      email: string;
    };

    const r = new Receptionist(data.id, profile.email, profile.first_name, profile.last_name);
    if (data.phone_number) r.setPhoneNumber(data.phone_number);
    return r;
  }

  async getReceptionists(offset: number, limit: number): Promise<GetReceptionistsList> {
    const { count, error: countError } = await supabaseAdmin
      .from("receptionists")
      .select("*", { count: "exact", head: true });

    if (countError) {
      Logger.error("Failed to get receptionists count", { countError });
      throw new DatabaseError(countError.message);
    }

    const { data, error } = await supabaseAdmin
      .from("receptionists")
      .select(
        `
        id,
        phone_number,
        profiles!inner (
          first_name,
          last_name,
          email
        )
      `
      )
      .range(offset, offset + limit - 1);

    if (error) {
      Logger.error("Receptionists not fetched", { error });
      throw new DatabaseError(error.message);
    }

    const receptionists = (data || []).map((rec: any) => {
      const profile = rec.profiles as unknown as { first_name: string; last_name: string; email: string };
      return {
        id: rec.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        phone_number: rec.phone_number,
      };
    });

    return {
      total: count || 0,
      receptionists,
    };
  }

  async updateReceptionistById(id: string, receptionistData: Partial<Receptionist>): Promise<Receptionist> {
    const payload: any = receptionistData as any;
    const profileUpdate: any = {};
    const receptionistUpdate: any = {};

    if (payload.firstName ?? payload["first_name"]) {
      profileUpdate.first_name = payload.firstName || payload["first_name"];
    }
    if (payload.lastName ?? payload["last_name"]) {
      profileUpdate.last_name = payload.lastName || payload["last_name"];
    }
    if (payload.email) profileUpdate.email = payload.email;

    if (payload.phoneNumber !== undefined || payload.phone_number !== undefined) {
      receptionistUpdate.phone_number = payload.phoneNumber || payload.phone_number;
    }

    if (Object.keys(profileUpdate).length > 0) {
      const { error: profileError } = await supabaseAdmin.from("profiles").update(profileUpdate).eq("id", id);
      if (profileError) {
        Logger.error("Profile not updated", { profileError });
        throw new DatabaseError(profileError.message);
      }
    }

    if (Object.keys(receptionistUpdate).length > 0) {
      const { error: recError } = await supabaseAdmin.from("receptionists").update(receptionistUpdate).eq("id", id);
      if (recError) {
        Logger.error("Receptionist not updated", { recError });
        throw new DatabaseError(recError.message);
      }
    }

    const updated = await this.getReceptionistById(id);
    if (!updated) {
      Logger.error("Receptionist not found after update", { id });
      throw new DatabaseError("Receptionist not found after update");
    }
    return updated;
  }

  async deleteReceptionistById(id: string): Promise<void> {
    const { error } = await supabaseAdmin.from("receptionists").delete().eq("id", id);
    if (error) {
      Logger.error("Receptionist not deleted", { error });
      throw new DatabaseError(error.message);
    }
  }
}
