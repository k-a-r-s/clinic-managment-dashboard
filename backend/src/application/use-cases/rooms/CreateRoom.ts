import { Room } from "../../../domain/entities/Room";
import { IRoomRepository } from "../../../domain/repositories/IRoomRepository";
import { CreateRoomDto } from "../../dto/requests/rooms/createRoomDto";

export class CreateRoom {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(roomData: CreateRoomDto): Promise<Room> {
    return await this.roomRepository.createRoom(roomData);
  }
}
