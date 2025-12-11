import { Request, Response } from "express";
import { ResponseFormatter } from "../utils/ResponseFormatter";
import { CreateRoom } from "../../application/use-cases/rooms/CreateRoom";
import { GetRoomById } from "../../application/use-cases/rooms/GetRoomById";
import { GetAllRooms } from "../../application/use-cases/rooms/GetAllRooms";
import { GetAvailableRooms } from "../../application/use-cases/rooms/GetAvailableRooms";
import { UpdateRoom } from "../../application/use-cases/rooms/UpdateRoom";
import { DeleteRoom } from "../../application/use-cases/rooms/DeleteRoom";
import { UpdateRoomAvailability } from "../../application/use-cases/rooms/UpdateRoomAvailability";

export class RoomController {
  constructor(
    private createRoomUseCase: CreateRoom,
    private getRoomByIdUseCase: GetRoomById,
    private getAllRoomsUseCase: GetAllRooms,
    private getAvailableRoomsUseCase: GetAvailableRooms,
    private updateRoomUseCase: UpdateRoom,
    private deleteRoomUseCase: DeleteRoom,
    private updateRoomAvailabilityUseCase: UpdateRoomAvailability
  ) { }

  async createRoom(req: Request, res: Response): Promise<void> {
    const room = await this.createRoomUseCase.execute(req.body);
    ResponseFormatter.success(res, room.toJSON(), "Room created successfully", 201);
  }

  async getRoomById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const room = await this.getRoomByIdUseCase.execute(id);
    ResponseFormatter.success(res, room.toJSON(), "Room retrieved successfully");
  }

  async getAllRooms(req: Request, res: Response): Promise<void> {
    const rooms = await this.getAllRoomsUseCase.execute();
    const roomsData = rooms.map(room => room.toJSON());
    ResponseFormatter.success(res, roomsData, "Rooms retrieved successfully");
  }

  async getAvailableRooms(req: Request, res: Response): Promise<void> {
    const rooms = await this.getAvailableRoomsUseCase.execute();
    const roomsData = rooms.map(room => room.toJSON());
    ResponseFormatter.success(res, roomsData, "Available rooms retrieved successfully");
  }

  async updateRoom(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const room = await this.updateRoomUseCase.execute(id, req.body);
    ResponseFormatter.success(res, room.toJSON(), "Room updated successfully");
  }

  async deleteRoom(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    await this.deleteRoomUseCase.execute(id);
    ResponseFormatter.success(res, null, "Room deleted successfully");
  }

  async updateRoomAvailability(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const { isAvailable } = req.body;
    await this.updateRoomAvailabilityUseCase.execute(id, isAvailable);
    ResponseFormatter.success(res, null, "Room availability updated successfully");
  }
}
