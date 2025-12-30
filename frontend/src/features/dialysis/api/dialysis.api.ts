import type {
  DialysisProtocol,
  DialysisSession,
  DialysisPatient,
  DialysisHistoryEntry,
  ProtocolFormData,
  SessionFormData,
} from "../../../types/dialysis.types";

// Mock Dialysis Patients (links patients to dialysis program)
const mockDialysisPatients: DialysisPatient[] = [
  {
    id: "dp-1",
    patientId: "patient-1",
    patientName: "Ahmed Benali",
    dialysisType: "hemodialysis",
    sessionsPerWeek: 3,
    status: "active",
    startDate: "2024-06-15",
    lastSessionDate: "2024-12-27",
    nextSessionDate: "2024-12-30",
    totalSessions: 156,
  },
  {
    id: "dp-2",
    patientId: "patient-2",
    patientName: "Sara Khalil",
    dialysisType: "hemodialysis",
    sessionsPerWeek: 3,
    status: "active",
    startDate: "2024-09-01",
    lastSessionDate: "2024-12-28",
    nextSessionDate: "2024-12-31",
    totalSessions: 89,
  },
  {
    id: "dp-3",
    patientId: "patient-3",
    patientName: "Mohamed Alami",
    dialysisType: "peritoneal",
    sessionsPerWeek: 4,
    status: "paused",
    startDate: "2024-03-20",
    lastSessionDate: "2024-12-15",
    totalSessions: 234,
  },
];

// Mock Protocols (one active protocol per dialysis patient)
const mockProtocols: DialysisProtocol[] = [
  {
    id: "prot-1",
    dialysisPatientId: "dp-1",
    dialysisType: "hemodialysis",
    sessionsPerWeek: 3,
    sessionDurationMinutes: 240,
    accessType: "fistula",
    targetWeightKg: 75,
    notes: "Patient responding well to treatment",
    createdAt: "2024-06-15T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
  },
  {
    id: "prot-2",
    dialysisPatientId: "dp-2",
    dialysisType: "hemodialysis",
    sessionsPerWeek: 3,
    sessionDurationMinutes: 210,
    accessType: "catheter",
    targetWeightKg: 68,
    notes: "Temporary catheter, planning fistula",
    createdAt: "2024-09-01T00:00:00Z",
    updatedAt: "2024-11-15T00:00:00Z",
  },
  {
    id: "prot-3",
    dialysisPatientId: "dp-3",
    dialysisType: "peritoneal",
    sessionsPerWeek: 4,
    sessionDurationMinutes: 30,
    accessType: "catheter",
    targetWeightKg: 72,
    createdAt: "2024-03-20T00:00:00Z",
    updatedAt: "2024-10-01T00:00:00Z",
  },
];

// Mock Sessions
const mockSessions: DialysisSession[] = [
  {
    id: "sess-1",
    dialysisPatientId: "dp-1",
    sessionDate: "2024-12-30",
    durationMinutes: 240,
    completed: true,
    notes: "Patient tolerated session well",
    createdAt: "2024-12-30T08:00:00Z",
  },
  {
    id: "sess-2",
    dialysisPatientId: "dp-1",
    sessionDate: "2024-12-27",
    durationMinutes: 225,
    completed: true,
    complications: "Minor hypotension at 3rd hour, resolved with saline",
    notes: "Reduced treatment rate in last hour",
    createdAt: "2024-12-27T08:00:00Z",
  },
  {
    id: "sess-3",
    dialysisPatientId: "dp-2",
    sessionDate: "2024-12-28",
    durationMinutes: 210,
    completed: true,
    notes: "Good session, no complications",
    createdAt: "2024-12-28T09:00:00Z",
  },
  {
    id: "sess-4",
    dialysisPatientId: "dp-1",
    sessionDate: "2024-12-25",
    durationMinutes: 240,
    completed: true,
    notes: "Routine session",
    createdAt: "2024-12-25T08:00:00Z",
  },
];

// Mock Medical File History (read-only)
const mockDialysisHistory: Record<string, DialysisHistoryEntry[]> = {
  "patient-1": [
    {
      date: "2024-12-01",
      dialysisType: "hemodialysis",
      sessionsPerWeek: 3,
      sessionDurationMinutes: 240,
      accessType: "fistula",
      note: "Increased blood flow from 280 to 300 mL/min",
    },
    {
      date: "2024-06-15",
      dialysisType: "hemodialysis",
      sessionsPerWeek: 3,
      sessionDurationMinutes: 240,
      accessType: "fistula",
      note: "Initial dialysis protocol established",
    },
  ],
  "patient-2": [
    {
      date: "2024-11-15",
      dialysisType: "hemodialysis",
      sessionsPerWeek: 3,
      sessionDurationMinutes: 210,
      accessType: "catheter",
      note: "Temporary catheter placed, planning for fistula",
    },
    {
      date: "2024-09-01",
      dialysisType: "hemodialysis",
      sessionsPerWeek: 3,
      sessionDurationMinutes: 180,
      accessType: "catheter",
      note: "Started dialysis program",
    },
  ],
};

// API Functions

// Get all dialysis patients
export const getDialysisPatients = async (): Promise<DialysisPatient[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockDialysisPatients), 300);
  });
};

// Get protocol for a specific dialysis patient
export const getDialysisProtocol = async (
  dialysisPatientId: string
): Promise<DialysisProtocol | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const protocol = mockProtocols.find(
        (p) => p.dialysisPatientId === dialysisPatientId
      );
      resolve(protocol || null);
    }, 300);
  });
};

// Update dialysis protocol
export const updateDialysisProtocol = async (
  dialysisPatientId: string,
  data: ProtocolFormData
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockProtocols.findIndex(
        (p) => p.dialysisPatientId === dialysisPatientId
      );
      if (index !== -1) {
        mockProtocols[index] = {
          ...mockProtocols[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };
      }
      resolve();
    }, 500);
  });
};

// Get sessions for a specific dialysis patient
export const getDialysisSessions = async (
  dialysisPatientId: string
): Promise<DialysisSession[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sessions = mockSessions.filter(
        (s) => s.dialysisPatientId === dialysisPatientId
      );
      resolve(sessions);
    }, 300);
  });
};

// Create a new session
export const createDialysisSession = async (
  dialysisPatientId: string,
  data: SessionFormData
): Promise<DialysisSession> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newSession: DialysisSession = {
        id: `sess-${Date.now()}`,
        dialysisPatientId,
        ...data,
        createdAt: new Date().toISOString(),
      };
      mockSessions.push(newSession);
      resolve(newSession);
    }, 500);
  });
};

// Get session by ID
export const getDialysisSessionById = async (
  sessionId: string
): Promise<DialysisSession | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const session = mockSessions.find((s) => s.id === sessionId);
      resolve(session || null);
    }, 300);
  });
};

// Update a dialysis session
export const updateDialysisSession = async (
  sessionId: string,
  data: SessionFormData
): Promise<DialysisSession> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const sessionIndex = mockSessions.findIndex((s) => s.id === sessionId);
      if (sessionIndex === -1) {
        reject(new Error("Session not found"));
        return;
      }

      const updatedSession: DialysisSession = {
        ...mockSessions[sessionIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      mockSessions[sessionIndex] = updatedSession;
      resolve(updatedSession);
    }, 500);
  });
};

// Delete a dialysis session
export const deleteDialysisSession = async (
  sessionId: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const sessionIndex = mockSessions.findIndex((s) => s.id === sessionId);
      if (sessionIndex === -1) {
        reject(new Error("Session not found"));
        return;
      }

      mockSessions.splice(sessionIndex, 1);
      resolve();
    }, 500);
  });
};

// Get dialysis history from medical file (read-only)
export const getDialysisHistory = async (
  patientId: string
): Promise<DialysisHistoryEntry[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDialysisHistory[patientId] || []);
    }, 300);
  });
};

// Update dialysis patient status (pause/resume/stop)
export const updateDialysisPatientStatus = async (
  dialysisPatientId: string,
  status: "active" | "paused" | "stopped",
  notes?: string
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const patient = mockDialysisPatients.find(
        (p) => p.id === dialysisPatientId
      );
      if (patient) {
        patient.status = status;
      }
      resolve();
    }, 500);
  });
};
