export interface PrescriptionProps {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  prescriptionDate: string;
  createdAt: string;
  updatedAt: string;
  medications?: PrescriptionMedicationProps[]; // Change this line
}

export interface PrescriptionMedicationProps {
  id: string;
  prescriptionId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export class Prescription {
  constructor(private props: PrescriptionProps) {}

  public getId(): string {
    return this.props.id;
  }

  public getPatientId(): string {
    return this.props.patientId;
  }

  public getDoctorId(): string {
    return this.props.doctorId;
  }

  public getAppointmentId(): string | undefined {
    return this.props.appointmentId;
  }

  public getPrescriptionDate(): string {
    return this.props.prescriptionDate;
  }

  public getCreatedAt(): string {
    return this.props.createdAt;
  }

  public getUpdatedAt(): string {
    return this.props.updatedAt;
  }

  public getMedications(): PrescriptionMedication[] | undefined {
    return this.props.medications?.map(med => new PrescriptionMedication(med));
  }

  public toJson() {
    return {
      id: this.props.id,
      patientId: this.props.patientId,
      doctorId: this.props.doctorId,
      appointmentId: this.props.appointmentId,
      prescriptionDate: this.props.prescriptionDate,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
      medications: this.props.medications?.map(med => ({
        id: med.id,
        prescriptionId: med.prescriptionId,
        medicationName: med.medicationName,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
        notes: med.notes,
        createdAt: med.createdAt,
        updatedAt: med.updatedAt
      }))
    };
  }
}

export class PrescriptionMedication {
  constructor(private props: PrescriptionMedicationProps) {}

  public getId(): string {
    return this.props.id;
  }

  public getPrescriptionId(): string {
    return this.props.prescriptionId;
  }

  public getMedicationName(): string {
    return this.props.medicationName;
  }

  public getDosage(): string {
    return this.props.dosage;
  }

  public getFrequency(): string {
    return this.props.frequency;
  }

  public getDuration(): string {
    return this.props.duration;
  }

  public getNotes(): string | undefined {
    return this.props.notes;
  }

  public getCreatedAt(): string {
    return this.props.createdAt;
  }

  public getUpdatedAt(): string {
    return this.props.updatedAt;
  }

  public toJson() {
    return {
      id: this.props.id,
      prescriptionId: this.props.prescriptionId,
      medicationName: this.props.medicationName,
      dosage: this.props.dosage,
      frequency: this.props.frequency,
      duration: this.props.duration,
      notes: this.props.notes,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt
    };
  }
}