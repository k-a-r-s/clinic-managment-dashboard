interface singleReceptionist {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string | null;
}

export interface GetReceptionistsList {
  total: number;
  receptionists: singleReceptionist[];
}
