import type {
  DialysisProtocol,
  DialysisSession,
  DialysisIncident,
  DialysisPatient,
  ProtocolFormData,
  SessionFormData,
  IncidentFormData,
} from "../../../types/dialysis.types";

// Mock data - Multiple patients with their own protocols
const mockProtocols: DialysisProtocol[] = [
  {
    id: "protocol-1",
    patientId: "patient-1",
    dialysisDays: ["Monday", "Wednesday", "Friday"],
    sessionsPerWeek: 3,
    sessionDuration: 240,
    generator: "Fresenius 5008S",
    dialyser: "FX80",
    needle: "16G",
    bloodFlow: 300,
    anticoagulation: "Heparin 2000 IU",
    dryWeight: 75,
    isActive: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "protocol-2",
    patientId: "patient-2",
    dialysisDays: ["Tuesday", "Thursday", "Saturday"],
    sessionsPerWeek: 3,
    sessionDuration: 210,
    generator: "Fresenius 4008S",
    dialyser: "FX60",
    needle: "15G",
    bloodFlow: 280,
    anticoagulation: "Heparin 1500 IU",
    dryWeight: 68,
    isActive: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
];

const mockPatients: DialysisPatient[] = [
  {
    patientId: "patient-1",
    patientName: "Ahmed B.",
    dialysisDays: ["M", "W", "F"],
    lastSessionDate: "2024-12-27",
    nextSessionDate: "2024-12-30",
    status: "active",
    totalSessions: 156,
    recentIncidents: 0,
  },
  {
    patientId: "patient-2",
    patientName: "Sara K.",
    dialysisDays: ["T", "Th", "S"],
    lastSessionDate: "2024-12-28",
    nextSessionDate: "2024-12-31",
    status: "active",
    totalSessions: 89,
    recentIncidents: 1,
  },
];

const mockSessions: DialysisSession[] = [
  {
    id: "session-1",
    patientId: "patient-1",
    protocolId: "protocol-1",
    date: "2025-12-29",
    startTime: "08:00",
    endTime: "12:00",
    duration: 240,
    preWeight: 77.5,
    postWeight: 75.0,
    ultrafiltrationVolume: 2.5,
    preSystolic: 140,
    preDiastolic: 85,
    postSystolic: 125,
    postDiastolic: 78,
    status: "completed",
    notes: "Patient tolerated session well",
    incidents: [],
    createdAt: "2025-12-29T08:00:00Z",
  },
  {
    id: "session-2",
    patientId: "patient-1",
    protocolId: "protocol-1",
    date: "2025-12-27",
    startTime: "08:00",
    endTime: "11:45",
    duration: 225,
    preWeight: 78.2,
    postWeight: 75.5,
    ultrafiltrationVolume: 2.7,
    preSystolic: 145,
    preDiastolic: 88,
    postSystolic: 118,
    postDiastolic: 75,
    status: "interrupted",
    notes: "Session interrupted due to hypotension",
    incidents: [
      {
        id: "incident-1",
        sessionId: "session-2",
        patientId: "patient-1",
        type: "hypotension",
        severity: "moderate",
        timeOccurred: "11:30",
        description: "Patient experienced dizziness and BP dropped to 95/60",
        resolution: "Session paused, fluids given, BP recovered to 110/70",
        createdAt: "2025-12-27T11:30:00Z",
      },
    ],
    createdAt: "2025-12-27T08:00:00Z",
  },
  {
    id: "session-3",
    patientId: "patient-2",
    protocolId: "protocol-2",
    date: "2025-12-28",
    startTime: "14:00",
    endTime: "17:30",
    duration: 210,
    preWeight: 70.5,
    postWeight: 68.2,
    ultrafiltrationVolume: 2.3,
    preSystolic: 135,
    preDiastolic: 80,
    postSystolic: 120,
    postDiastolic: 75,
    status: "completed",
    notes: "Normal session, patient comfortable",
    incidents: [],
    createdAt: "2025-12-28T14:00:00Z",
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Patient List APIs
export const getDialysisPatients = async (): Promise<DialysisPatient[]> => {
  await delay(300);
  return mockPatients;
};

// Protocol APIs (patient-scoped)
export const getPatientProtocol = async (
  patientId: string
): Promise<DialysisProtocol | null> => {
  await delay(300);
  const protocol = mockProtocols.find(
    (p) => p.patientId === patientId && p.isActive
  );
  return protocol || null;
};

export const updatePatientProtocol = async (
  patientId: string,
  data: ProtocolFormData
): Promise<DialysisProtocol> => {
  await delay(500);
  const existingIndex = mockProtocols.findIndex(
    (p) => p.patientId === patientId && p.isActive
  );

  const updated: DialysisProtocol = {
    id:
      existingIndex >= 0
        ? mockProtocols[existingIndex].id
        : `protocol-${Date.now()}`,
    ...data,
    isActive: true,
    updatedAt: new Date().toISOString(),
    createdAt:
      existingIndex >= 0
        ? mockProtocols[existingIndex].createdAt
        : new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    mockProtocols[existingIndex] = updated;
  } else {
    mockProtocols.push(updated);
  }

  return updated;
};

// Session APIs (patient-scoped)
export const getPatientSessions = async (
  patientId: string
): Promise<DialysisSession[]> => {
  await delay(300);
  return mockSessions
    .filter((s) => s.patientId === patientId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getDialysisSessionById = async (
  id: string
): Promise<DialysisSession> => {
  await delay(300);
  const session = mockSessions.find((s) => s.id === id);
  if (!session) {
    throw new Error("Session not found");
  }
  return session;
};

export const createDialysisSession = async (
  data: SessionFormData
): Promise<DialysisSession> => {
  await delay(500);

  // Calculate duration
  const start = new Date(`2000-01-01T${data.startTime}`);
  const end = new Date(`2000-01-01T${data.endTime}`);
  const duration = Math.round((end.getTime() - start.getTime()) / 1000 / 60);

  // Calculate ultrafiltration volume
  const ultrafiltrationVolume = Number(
    (data.preWeight - data.postWeight).toFixed(1)
  );

  const newSession: DialysisSession = {
    id: `session-${Date.now()}`,
    patientId: data.patientId,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    duration,
    preWeight: data.preWeight,
    postWeight: data.postWeight,
    ultrafiltrationVolume,
    preSystolic: data.preSystolic,
    preDiastolic: data.preDiastolic,
    postSystolic: data.postSystolic,
    postDiastolic: data.postDiastolic,
    status: "completed",
    notes: data.notes,
    incidents: [],
    createdAt: new Date().toISOString(),
  };

  mockSessions.unshift(newSession);
  return newSession;
};

export const updateDialysisSession = async (
  id: string,
  data: Partial<SessionFormData>
): Promise<DialysisSession> => {
  await delay(500);
  const sessionIndex = mockSessions.findIndex((s) => s.id === id);
  if (sessionIndex === -1) {
    throw new Error("Session not found");
  }

  const session = mockSessions[sessionIndex];
  const updated = { ...session, ...data };

  // Recalculate if weights changed
  if (data.preWeight || data.postWeight) {
    updated.ultrafiltrationVolume = Number(
      (updated.preWeight - updated.postWeight).toFixed(1)
    );
  }

  // Recalculate duration if times changed
  if (data.startTime || data.endTime) {
    const start = new Date(`2000-01-01T${updated.startTime}`);
    const end = new Date(`2000-01-01T${updated.endTime}`);
    updated.duration = Math.round(
      (end.getTime() - start.getTime()) / 1000 / 60
    );
  }

  mockSessions[sessionIndex] = updated;
  return updated;
};

// Incident APIs
export const addIncidentToSession = async (
  sessionId: string,
  data: IncidentFormData
): Promise<DialysisIncident> => {
  await delay(500);
  const session = mockSessions.find((s) => s.id === sessionId);
  if (!session) {
    throw new Error("Session not found");
  }

  const newIncident: DialysisIncident = {
    id: `incident-${Date.now()}`,
    sessionId,
    patientId: data.patientId,
    type: data.type,
    severity: data.severity,
    timeOccurred: data.timeOccurred,
    description: data.description,
    resolution: data.resolution,
    createdAt: new Date().toISOString(),
  };

  session.incidents.push(newIncident);
  return newIncident;
};

export const getSessionIncidents = async (
  sessionId: string
): Promise<DialysisIncident[]> => {
  await delay(300);
  const session = mockSessions.find((s) => s.id === sessionId);
  if (!session) {
    throw new Error("Session not found");
  }
  return session.incidents;
};
