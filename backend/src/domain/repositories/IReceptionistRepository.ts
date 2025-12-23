import { Receptionist } from "../entities/Receptionist";
import { GetReceptionistsList } from "../../application/dto/responses/getReceptionistsList";

export interface IReceptionistRepository {
  getReceptionistById(id: string): Promise<Receptionist | null>;
  getReceptionists(offset: number, limit: number): Promise<GetReceptionistsList>;
  updateReceptionistById(id: string, receptionistData: Partial<Receptionist>): Promise<Receptionist>;
  deleteReceptionistById(id: string): Promise<void>;
}
