export interface DialysisPatientProps {
  id: string;
  patientId: string;
  startDate: Date;
  status: "active" | "paused" | "stopped";
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  // Extended fields for list display
  patientName?: string;
  dialysisType?: string;
  sessionsPerWeek?: number;
  lastSessionDate?: Date | null;
  nextSessionDate?: Date | null;
  totalSessions?: number;
}

export class DialysisPatient {
  constructor(private props: DialysisPatientProps) {}

  public getId(): string {
    return this.props.id;
  }

  public getPatientId(): string {
    return this.props.patientId;
  }

  public getStartDate(): Date {
    return this.props.startDate;
  }

  public getStatus(): string {
    return this.props.status;
  }

  public getNotes(): string | undefined {
    return this.props.notes;
  }

  public getCreatedAt(): Date | undefined {
    return this.props.createdAt;
  }

  public getUpdatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  public toJson() {
    return {
      id: this.props.id,
      patientId: this.props.patientId,
      startDate: this.props.startDate,
      status: this.props.status,
      notes: this.props.notes,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
      // Extended fields
      patientName: this.props.patientName,
      dialysisType: this.props.dialysisType,
      sessionsPerWeek: this.props.sessionsPerWeek,
      lastSessionDate: this.props.lastSessionDate,
      nextSessionDate: this.props.nextSessionDate,
      totalSessions: this.props.totalSessions,
    };
  }
}
