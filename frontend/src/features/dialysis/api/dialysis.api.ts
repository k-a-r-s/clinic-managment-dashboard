import axiosInstance from "../../../lib/axios";
import type {
  DialysisProtocol,
  DialysisSession,
  DialysisPatient,
  ProtocolFormData,
  SessionFormData,
} from "../../../types/dialysis.types";

// ========== Dialysis Patients API ==========

export const getDialysisPatients = async (filters?: {
  status?: string;
}): Promise<DialysisPatient[]> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append("status", filters.status);

  const response = await axiosInstance.get(
    `/dialysis/patients?${params.toString()}`
  );
  const body = response.data;
  const raw = Array.isArray(body) ? body : body?.data ?? [];

  return (raw || []).map((d: any) => ({
    id: d.id,
    patientId: d.patientId,
    patientName: d.patientName || "Unknown",
    dialysisType: d.dialysisType || "hemodialysis",
    sessionsPerWeek: d.sessionsPerWeek || 0,
    status: d.status,
    startDate: d.startDate,
    lastSessionDate: d.lastSessionDate,
    nextSessionDate: d.nextSessionDate,
    totalSessions: d.totalSessions || 0,
  }));
};

export const createDialysisPatient = async (data: {
  patientId: string;
  startDate: string;
  status?: string;
  notes?: string;
}): Promise<any> => {
  const response = await axiosInstance.post("/dialysis/patients", {
    patientId: data.patientId,
    startDate: data.startDate,
    status: data.status || "active",
    notes: data.notes,
  });
  return response.data?.data ?? response.data;
};

export const updateDialysisPatientStatus = async (
  dialysisPatientId: string,
  status: "active" | "paused" | "stopped",
  notes?: string
): Promise<void> => {
  await axiosInstance.put(`/dialysis/patients/${dialysisPatientId}`, {
    status,
    notes,
  });
};

// ========== Protocols API ==========

export const getDialysisProtocol = async (
  dialysisPatientId: string
): Promise<DialysisProtocol | null> => {
  try {
    const response = await axiosInstance.get(
      `/dialysis/protocols/patient/${dialysisPatientId}`
    );
    const body = response.data;
    const p = body?.data ?? body;

    if (!p) return null;

    return {
      id: p.id,
      dialysisPatientId: p.dialysisPatientId,
      dialysisType: p.dialysisType,
      sessionsPerWeek: p.sessionsPerWeek,
      sessionDurationMinutes: p.sessionDurationMinutes,
      accessType: p.accessType,
      targetWeightKg: p.targetWeightKg,
      notes: p.notes,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  } catch (error: any) {
    if (error?.response?.status === 404) return null;
    throw error;
  }
};

export const createDialysisProtocol = async (
  data: ProtocolFormData & { dialysisPatientId: string }
): Promise<DialysisProtocol> => {
  const response = await axiosInstance.post("/dialysis/protocols", {
    dialysisPatientId: data.dialysisPatientId,
    dialysisType: data.dialysisType,
    sessionsPerWeek: data.sessionsPerWeek,
    sessionDurationMinutes: data.sessionDurationMinutes,
    accessType: data.accessType,
    targetWeightKg: data.targetWeightKg,
    notes: data.notes,
  });
  const p = response.data?.data ?? response.data;
  return {
    id: p.id,
    dialysisPatientId: p.dialysisPatientId,
    dialysisType: p.dialysisType,
    sessionsPerWeek: p.sessionsPerWeek,
    sessionDurationMinutes: p.sessionDurationMinutes,
    accessType: p.accessType,
    targetWeightKg: p.targetWeightKg,
    notes: p.notes,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
};

export const updateDialysisProtocol = async (
  protocolId: string,
  data: ProtocolFormData
): Promise<void> => {
  await axiosInstance.put(`/dialysis/protocols/${protocolId}`, {
    dialysisType: data.dialysisType,
    sessionsPerWeek: data.sessionsPerWeek,
    sessionDurationMinutes: data.sessionDurationMinutes,
    accessType: data.accessType,
    targetWeightKg: data.targetWeightKg,
    notes: data.notes,
  });
};

// ========== Sessions API ==========

export const getDialysisSessions = async (
  dialysisPatientId: string
): Promise<DialysisSession[]> => {
  const response = await axiosInstance.get(
    `/dialysis/sessions/patient/${dialysisPatientId}`
  );
  const body = response.data;
  const raw = Array.isArray(body) ? body : body?.data ?? [];

  return (raw || []).map((s: any) => ({
    id: s.id,
    dialysisPatientId: s.dialysisPatientId,
    sessionDate: s.sessionDate,
    durationMinutes: s.durationMinutes,
    completed: s.completed,
    complications: s.complications,
    notes: s.notes,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  }));
};

export const createDialysisSession = async (
  dialysisPatientId: string,
  data: SessionFormData
): Promise<DialysisSession> => {
  const response = await axiosInstance.post("/dialysis/sessions", {
    dialysisPatientId,
    sessionDate: data.sessionDate,
    durationMinutes: data.durationMinutes,
    completed: data.completed || false,
    complications: data.complications,
    notes: data.notes,
  });
  const s = response.data?.data ?? response.data;
  return {
    id: s.id,
    dialysisPatientId: s.dialysisPatientId,
    sessionDate: s.sessionDate,
    durationMinutes: s.durationMinutes,
    completed: s.completed,
    complications: s.complications,
    notes: s.notes,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
};

export const getDialysisSessionById = async (
  sessionId: string
): Promise<DialysisSession | null> => {
  try {
    const response = await axiosInstance.get(`/dialysis/sessions/${sessionId}`);
    const body = response.data;
    const s = body?.data ?? body;

    if (!s) return null;

    return {
      id: s.id,
      dialysisPatientId: s.dialysisPatientId,
      sessionDate: s.sessionDate,
      durationMinutes: s.durationMinutes,
      completed: s.completed,
      complications: s.complications,
      notes: s.notes,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    };
  } catch (error: any) {
    if (error?.response?.status === 404) return null;
    throw error;
  }
};

export const updateDialysisSession = async (
  sessionId: string,
  data: SessionFormData
): Promise<DialysisSession> => {
  const response = await axiosInstance.put(`/dialysis/sessions/${sessionId}`, {
    sessionDate: data.sessionDate,
    durationMinutes: data.durationMinutes,
    completed: data.completed,
    complications: data.complications,
    notes: data.notes,
  });
  const s = response.data?.data ?? response.data;
  return {
    id: s.id,
    dialysisPatientId: s.dialysisPatientId,
    sessionDate: s.sessionDate,
    durationMinutes: s.durationMinutes,
    completed: s.completed,
    complications: s.complications,
    notes: s.notes,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
};

export const deleteDialysisSession = async (
  sessionId: string
): Promise<void> => {
  await axiosInstance.delete(`/dialysis/sessions/${sessionId}`);
};
