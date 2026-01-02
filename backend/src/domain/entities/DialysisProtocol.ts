export interface DialysisProtocolProps {
  id: string;
  dialysisPatientId: string;
  dialysisType: "hemodialysis" | "peritoneal";
  sessionsPerWeek: number;
  sessionDurationMinutes: number;
  accessType: "fistula" | "catheter" | "graft";
  targetWeightKg?: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class DialysisProtocol {
  constructor(private props: DialysisProtocolProps) {}

  public getId(): string {
    return this.props.id;
  }

  public getDialysisPatientId(): string {
    return this.props.dialysisPatientId;
  }

  public getDialysisType(): string {
    return this.props.dialysisType;
  }

  public getSessionsPerWeek(): number {
    return this.props.sessionsPerWeek;
  }

  public getSessionDurationMinutes(): number {
    return this.props.sessionDurationMinutes;
  }

  public getAccessType(): string {
    return this.props.accessType;
  }

  public getTargetWeightKg(): number | undefined {
    return this.props.targetWeightKg;
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
      dialysisPatientId: this.props.dialysisPatientId,
      dialysisType: this.props.dialysisType,
      sessionsPerWeek: this.props.sessionsPerWeek,
      sessionDurationMinutes: this.props.sessionDurationMinutes,
      accessType: this.props.accessType,
      targetWeightKg: this.props.targetWeightKg,
      notes: this.props.notes,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
