interface singleDoctor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phoneumber?: string;
  salary?: number;
  specialization: string;
}

export interface GetDoctorsList {
  total: number;
  doctors: singleDoctor[];
}
