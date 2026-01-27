"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceptionistRepository = void 0;
const Receptionist_1 = require("../../domain/entities/Receptionist");
const supabase_1 = require("../database/supabase");
const logger_1 = require("../../shared/utils/logger");
const DatabaseError_1 = require("../errors/DatabaseError");
class ReceptionistRepository {
    async getReceptionistById(id) {
        const { data, error } = await supabase_1.supabaseAdmin
            .from("receptionists")
            .select(`
        id,
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
            logger_1.Logger.error("Receptionist not fetched", { error });
            throw new DatabaseError_1.DatabaseError(error.message);
        }
        if (!data)
            return null;
        const profile = data.profiles;
        const r = new Receptionist_1.Receptionist(data.id, profile.email, profile.first_name, profile.last_name);
        if (data.phone_number)
            r.setPhoneNumber(data.phone_number);
        return r;
    }
    async getReceptionists(offset, limit) {
        const { count, error: countError } = await supabase_1.supabaseAdmin
            .from("receptionists")
            .select("*", { count: "exact", head: true });
        if (countError) {
            logger_1.Logger.error("Failed to get receptionists count", { countError });
            throw new DatabaseError_1.DatabaseError(countError.message);
        }
        const { data, error } = await supabase_1.supabaseAdmin
            .from("receptionists")
            .select(`
        id,
        phone_number,
        profiles!inner (
          first_name,
          last_name,
          email
        )
      `)
            .range(offset, offset + limit - 1);
        if (error) {
            logger_1.Logger.error("Receptionists not fetched", { error });
            throw new DatabaseError_1.DatabaseError(error.message);
        }
        const receptionists = (data || []).map((rec) => {
            const profile = rec.profiles;
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
    async updateReceptionistById(id, receptionistData) {
        const payload = receptionistData;
        const profileUpdate = {};
        const receptionistUpdate = {};
        if (payload.firstName ?? payload["first_name"]) {
            profileUpdate.first_name = payload.firstName || payload["first_name"];
        }
        if (payload.lastName ?? payload["last_name"]) {
            profileUpdate.last_name = payload.lastName || payload["last_name"];
        }
        if (payload.email)
            profileUpdate.email = payload.email;
        if (payload.phoneNumber !== undefined || payload.phone_number !== undefined) {
            receptionistUpdate.phone_number = payload.phoneNumber || payload.phone_number;
        }
        if (Object.keys(profileUpdate).length > 0) {
            const { error: profileError } = await supabase_1.supabaseAdmin.from("profiles").update(profileUpdate).eq("id", id);
            if (profileError) {
                logger_1.Logger.error("Profile not updated", { profileError });
                throw new DatabaseError_1.DatabaseError(profileError.message);
            }
        }
        if (Object.keys(receptionistUpdate).length > 0) {
            const { error: recError } = await supabase_1.supabaseAdmin.from("receptionists").update(receptionistUpdate).eq("id", id);
            if (recError) {
                logger_1.Logger.error("Receptionist not updated", { recError });
                throw new DatabaseError_1.DatabaseError(recError.message);
            }
        }
        const updated = await this.getReceptionistById(id);
        if (!updated) {
            logger_1.Logger.error("Receptionist not found after update", { id });
            throw new DatabaseError_1.DatabaseError("Receptionist not found after update");
        }
        return updated;
    }
    async deleteReceptionistById(id) {
        const { error } = await supabase_1.supabaseAdmin.from("receptionists").delete().eq("id", id);
        if (error) {
            logger_1.Logger.error("Receptionist not deleted", { error });
            throw new DatabaseError_1.DatabaseError(error.message);
        }
    }
}
exports.ReceptionistRepository = ReceptionistRepository;
