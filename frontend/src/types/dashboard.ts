export interface Stats {
  totalPatients: number;
  activeSessions: number;
  activemachines: number;
  staffCount: number;
  staffSublabel: string;
}

export interface MachineStats{
  In_Use: number;
  Available: number;
  Out_of_Service: number;
  Maintenance: number;
}

export interface DyalisisStats{
  In_Use: number;
  Available: number;
  Out_of_Service: number;
  Maintenance: number;
}

export interface DialysisSession{
  date: string // ISO date string
  count: number
}

export interface patientsperDay{
  date: string // ISO date string
  count: number
}