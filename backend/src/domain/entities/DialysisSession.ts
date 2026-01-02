export interface DialysisSessionProps {
  id: string;
  dialysisPatientId: string;
  sessionDate: Date;
  durationMinutes?: number;
  completed: boolean;
  complications?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class DialysisSession {
  constructor(private props: DialysisSessionProps) {}

  public getId(): string {
    return this.props.id;
  }

  public getDialysisPatientId(): string {
    return this.props.dialysisPatientId;
  }

  public getSessionDate(): Date {
    return this.props.sessionDate;
  }

  public getDurationMinutes(): number | undefined {
    return this.props.durationMinutes;
  }

  public getCompleted(): boolean {
    return this.props.completed;
  }

  public getComplications(): string | undefined {
    return this.props.complications;
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
      sessionDate: this.props.sessionDate,
      durationMinutes: this.props.durationMinutes,
      completed: this.props.completed,
      complications: this.props.complications,
      notes: this.props.notes,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
