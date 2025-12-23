import { Room } from "../../../domain/entities/Room";
import { IRoomRepository } from "../../../domain/repositories/IRoomRepository";

export class GetAllRooms {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(): Promise<Room[]> {
    return await this.roomRepository.getAllRooms();
  }
}
