import { IDialysisRepository } from "../../domain/repositories/IDialysisRepository";
import { DialysisPatient } from "../../domain/entities/DialysisPatient";
import { DialysisProtocol } from "../../domain/entities/DialysisProtocol";
import { DialysisSession } from "../../domain/entities/DialysisSession";
import { supabaseAdmin } from "../database/supabase";
import { DatabaseError } from "../errors/DatabaseError";

export class DialysisRepository implements IDialysisRepository {
  // ========== Dialysis Patients ==========
  async createDialysisPatient(
    patient: DialysisPatient
  ): Promise<DialysisPatient> {
    const { data, error } = await supabaseAdmin
      .from("dialysis_patients")
      .insert({
        id: patient.getId(),
        patient_id: patient.getPatientId(),
        start_date: patient.getStartDate(),
        status: patient.getStatus(),
        notes: patient.getNotes(),
      })
      .select()
      .single();

    if (error) throw new DatabaseError(error);
    if (!data) throw new DatabaseError("Failed to create dialysis patient");

    return new DialysisPatient({
      id: data.id,
      patientId: data.patient_id,
      startDate: new Date(data.start_date),
      status: data.status,
      notes: data.notes,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    });
  }

  async getDialysisPatientById(id: string): Promise<DialysisPatient | null> {
    const { data, error } = await supabaseAdmin
      .from("dialysis_patients")
      .select()
      .eq("id", id)
      .single();

    if (error) throw new DatabaseError(error);
    if (!data) return null;

    return new DialysisPatient({
      id: data.id,
      patientId: data.patient_id,
      startDate: new Date(data.start_date),
      status: data.status,
      notes: data.notes,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    });
  }

  async getAllDialysisPatients(filters?: {
    status?: string;
  }): Promise<DialysisPatient[]> {
    let query = supabaseAdmin.from("dialysis_patients").select(`
        *,
        patients!inner(first_name, last_name),
        dialysis_protocols(dialysis_type, sessions_per_week),
        dialysis_sessions(id, session_date, completed)
      `);

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    const { data, error } = await query;

    if (error) throw new DatabaseError(error);
    if (!data) return [];

    return data.map((d: any) => {
      // dialysis_protocols is an array, get the first one
      const protocols = Array.isArray(d.dialysis_protocols)
        ? d.dialysis_protocols
        : d.dialysis_protocols
        ? [d.dialysis_protocols]
        : [];
      const protocol = protocols[0];

      const sessions = d.dialysis_sessions || [];
      const completedSessions = sessions.filter((s: any) => s.completed);
      const sessionDates = completedSessions
        .map((s: any) => new Date(s.session_date))
        .sort((a: Date, b: Date) => b.getTime() - a.getTime());

      return new DialysisPatient({
        id: d.id,
        patientId: d.patient_id,
        startDate: new Date(d.start_date),
        status: d.status,
        notes: d.notes,
        createdAt: new Date(d.created_at),
        updatedAt: new Date(d.updated_at),
        // Extended fields for list display
        patientName: d.patients
          ? `${d.patients.first_name} ${d.patients.last_name}`
          : "Unknown",
        dialysisType: protocol?.dialysis_type || "hemodialysis",
        sessionsPerWeek: protocol?.sessions_per_week
          ? Number(protocol.sessions_per_week)
          : 0,
        lastSessionDate: sessionDates[0] || null,
        totalSessions: completedSessions.length,
      });
    });
  }

  async updateDialysisPatient(id: string, data: any): Promise<DialysisPatient> {
    const updateData: any = {};
    if (data.startDate !== undefined) updateData.start_date = data.startDate;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const { data: updated, error } = await supabaseAdmin
      .from("dialysis_patients")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError(error);
    if (!updated) throw new DatabaseError("Dialysis patient not found");

    return new DialysisPatient({
      id: updated.id,
      patientId: updated.patient_id,
      startDate: new Date(updated.start_date),
      status: updated.status,
      notes: updated.notes,
      createdAt: new Date(updated.created_at),
      updatedAt: new Date(updated.updated_at),
    });
  }

  async deleteDialysisPatient(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from("dialysis_patients")
      .delete()
      .eq("id", id);

    if (error) throw new DatabaseError(error);
  }

  // ========== Dialysis Protocols ==========
  async createProtocol(protocol: DialysisProtocol): Promise<DialysisProtocol> {
    const { data, error } = await supabaseAdmin
      .from("dialysis_protocols")
      .insert({
        id: protocol.getId(),
        dialysis_patient_id: protocol.getDialysisPatientId(),
        dialysis_type: protocol.getDialysisType(),
        sessions_per_week: protocol.getSessionsPerWeek(),
        session_duration_minutes: protocol.getSessionDurationMinutes(),
        access_type: protocol.getAccessType(),
        target_weight_kg: protocol.getTargetWeightKg(),
        notes: protocol.getNotes(),
      })
      .select()
      .single();

    if (error) throw new DatabaseError(error);
    if (!data) throw new DatabaseError("Failed to create protocol");

    return new DialysisProtocol({
      id: data.id,
      dialysisPatientId: data.dialysis_patient_id,
      dialysisType: data.dialysis_type,
      sessionsPerWeek: data.sessions_per_week,
      sessionDurationMinutes: data.session_duration_minutes,
      accessType: data.access_type,
      targetWeightKg: data.target_weight_kg,
      notes: data.notes,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    });
  }

  async getProtocolByPatientId(
    dialysisPatientId: string
  ): Promise<DialysisProtocol | null> {
    const { data, error } = await supabaseAdmin
      .from("dialysis_protocols")
      .select()
      .eq("dialysis_patient_id", dialysisPatientId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // No rows returned
      throw new DatabaseError(error);
    }
    if (!data) return null;

    return new DialysisProtocol({
      id: data.id,
      dialysisPatientId: data.dialysis_patient_id,
      dialysisType: data.dialysis_type,
      sessionsPerWeek: data.sessions_per_week,
      sessionDurationMinutes: data.session_duration_minutes,
      accessType: data.access_type,
      targetWeightKg: data.target_weight_kg,
      notes: data.notes,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    });
  }

  async updateProtocol(id: string, data: any): Promise<DialysisProtocol> {
    const updateData: any = {};
    if (data.dialysisType !== undefined)
      updateData.dialysis_type = data.dialysisType;
    if (data.sessionsPerWeek !== undefined)
      updateData.sessions_per_week = data.sessionsPerWeek;
    if (data.sessionDurationMinutes !== undefined)
      updateData.session_duration_minutes = data.sessionDurationMinutes;
    if (data.accessType !== undefined) updateData.access_type = data.accessType;
    if (data.targetWeightKg !== undefined)
      updateData.target_weight_kg = data.targetWeightKg;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const { data: updated, error } = await supabaseAdmin
      .from("dialysis_protocols")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError(error);
    if (!updated) throw new DatabaseError("Protocol not found");

    return new DialysisProtocol({
      id: updated.id,
      dialysisPatientId: updated.dialysis_patient_id,
      dialysisType: updated.dialysis_type,
      sessionsPerWeek: updated.sessions_per_week,
      sessionDurationMinutes: updated.session_duration_minutes,
      accessType: updated.access_type,
      targetWeightKg: updated.target_weight_kg,
      notes: updated.notes,
      createdAt: new Date(updated.created_at),
      updatedAt: new Date(updated.updated_at),
    });
  }

  async deleteProtocol(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from("dialysis_protocols")
      .delete()
      .eq("id", id);

    if (error) throw new DatabaseError(error);
  }

  // ========== Dialysis Sessions ==========
  async createSession(session: DialysisSession): Promise<DialysisSession> {
    const { data, error } = await supabaseAdmin
      .from("dialysis_sessions")
      .insert({
        id: session.getId(),
        dialysis_patient_id: session.getDialysisPatientId(),
        session_date: session.getSessionDate(),
        duration_minutes: session.getDurationMinutes(),
        completed: session.getCompleted(),
        complications: session.getComplications(),
        notes: session.getNotes(),
      })
      .select()
      .single();

    if (error) throw new DatabaseError(error);
    if (!data) throw new DatabaseError("Failed to create session");

    return new DialysisSession({
      id: data.id,
      dialysisPatientId: data.dialysis_patient_id,
      sessionDate: new Date(data.session_date),
      durationMinutes: data.duration_minutes,
      completed: data.completed,
      complications: data.complications,
      notes: data.notes,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    });
  }

  async getSessionById(id: string): Promise<DialysisSession | null> {
    const { data, error } = await supabaseAdmin
      .from("dialysis_sessions")
      .select()
      .eq("id", id)
      .single();

    if (error) throw new DatabaseError(error);
    if (!data) return null;

    return new DialysisSession({
      id: data.id,
      dialysisPatientId: data.dialysis_patient_id,
      sessionDate: new Date(data.session_date),
      durationMinutes: data.duration_minutes,
      completed: data.completed,
      complications: data.complications,
      notes: data.notes,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    });
  }

  async getSessionsByPatientId(
    dialysisPatientId: string
  ): Promise<DialysisSession[]> {
    const { data, error } = await supabaseAdmin
      .from("dialysis_sessions")
      .select()
      .eq("dialysis_patient_id", dialysisPatientId)
      .order("session_date", { ascending: false });

    if (error) throw new DatabaseError(error);
    if (!data) return [];

    return data.map(
      (d: any) =>
        new DialysisSession({
          id: d.id,
          dialysisPatientId: d.dialysis_patient_id,
          sessionDate: new Date(d.session_date),
          durationMinutes: d.duration_minutes,
          completed: d.completed,
          complications: d.complications,
          notes: d.notes,
          createdAt: new Date(d.created_at),
          updatedAt: new Date(d.updated_at),
        })
    );
  }

  async updateSession(id: string, data: any): Promise<DialysisSession> {
    const updateData: any = {};
    if (data.sessionDate !== undefined)
      updateData.session_date = data.sessionDate;
    if (data.durationMinutes !== undefined)
      updateData.duration_minutes = data.durationMinutes;
    if (data.completed !== undefined) updateData.completed = data.completed;
    if (data.complications !== undefined)
      updateData.complications = data.complications;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const { data: updated, error } = await supabaseAdmin
      .from("dialysis_sessions")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError(error);
    if (!updated) throw new DatabaseError("Session not found");

    return new DialysisSession({
      id: updated.id,
      dialysisPatientId: updated.dialysis_patient_id,
      sessionDate: new Date(updated.session_date),
      durationMinutes: updated.duration_minutes,
      completed: updated.completed,
      complications: updated.complications,
      notes: updated.notes,
      createdAt: new Date(updated.created_at),
      updatedAt: new Date(updated.updated_at),
    });
  }

  async deleteSession(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from("dialysis_sessions")
      .delete()
      .eq("id", id);

    if (error) throw new DatabaseError(error);
  }
}
