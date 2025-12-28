export type ISODateString = string; // e.g. "2024-11-25"

export type weekDays =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type DialysisProtocol = {
  dialysisDays?: string[];
  sessionsPerWeek?: number | null;
  generator?: string;
  sessionDuration?: string;
  dialyser?: string;
  needle?: string;
  bloodFlow?: string;
  anticoagulation?: string;
  dryWeight?: string;
  interDialyticWeightGain?: string;
  incidents?: string[];
};

export interface LabResultEntry {
  date: ISODateString;
  parameters: Record<string, string>;
}

export type LabResults = LabResultEntry[];

export interface MedicationHistory {
  startDate: ISODateString;
  dosage: string;
}

export interface Medication {
  name: string;
  history: MedicationHistory[];
}

export type Medications = Medication[];

export type Dose = {
  doseNumber?: number;
  date?: string;
  reminderDate?: string;
};

export type Vaccination = {
  vaccineName?: string;
  doses?: Dose[];
};

export type Vaccinations = Vaccination[];

export interface VascularAccess {
  type: string;
  site: string;
  operator: string;
  firstUseDate: ISODateString;
  creationDates: ISODateString[];
}

export type VascularAccessList = VascularAccess[];

export interface MedicalDataPayload {
  protocol?: DialysisProtocol;
  labResults?: LabResults;
  medications?: Medications;
  vaccinations?: Vaccinations;
  vascularAccess?: VascularAccessList;
}

export interface MedicalField {
  id: string;
  patientId: string;
  data: MedicalDataPayload;
}

export interface LabResult {
  date: string;
  parameters: Record<string, string>;
}
