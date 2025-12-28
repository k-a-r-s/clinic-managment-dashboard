"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const ResponseFormatter_1 = require("../utils/ResponseFormatter");
class RoomController {
    constructor(createRoomUseCase, getRoomByIdUseCase, getAllRoomsUseCase, getAvailableRoomsUseCase, updateRoomUseCase, deleteRoomUseCase, updateRoomAvailabilityUseCase) {
        this.createRoomUseCase = createRoomUseCase;
        this.getRoomByIdUseCase = getRoomByIdUseCase;
        this.getAllRoomsUseCase = getAllRoomsUseCase;
        this.getAvailableRoomsUseCase = getAvailableRoomsUseCase;
        this.updateRoomUseCase = updateRoomUseCase;
        this.deleteRoomUseCase = deleteRoomUseCase;
        this.updateRoomAvailabilityUseCase = updateRoomAvailabilityUseCase;
    }
    async createRoom(req, res) {
        const room = await this.createRoomUseCase.execute(req.body);
        ResponseFormatter_1.ResponseFormatter.success(res, room.toJSON(), "Room created successfully", 201);
    }
    async getRoomById(req, res) {
        const id = req.params.id;
        const room = await this.getRoomByIdUseCase.execute(id);
        ResponseFormatter_1.ResponseFormatter.success(res, room.toJSON(), "Room retrieved successfully");
    }
    async getAllRooms(req, res) {
        const rooms = await this.getAllRoomsUseCase.execute();
        const roomsData = rooms.map(room => room.toJSON());
        ResponseFormatter_1.ResponseFormatter.success(res, roomsData, "Rooms retrieved successfully");
    }
    async getAvailableRooms(req, res) {
        const rooms = await this.getAvailableRoomsUseCase.execute();
        const roomsData = rooms.map(room => room.toJSON());
        ResponseFormatter_1.ResponseFormatter.success(res, roomsData, "Available rooms retrieved successfully");
    }
    async updateRoom(req, res) {
        const id = req.params.id;
        const room = await this.updateRoomUseCase.execute(id, req.body);
        ResponseFormatter_1.ResponseFormatter.success(res, room.toJSON(), "Room updated successfully");
    }
    async deleteRoom(req, res) {
        const id = req.params.id;
        await this.deleteRoomUseCase.execute(id);
        ResponseFormatter_1.ResponseFormatter.success(res, null, "Room deleted successfully");
    }
    async updateRoomAvailability(req, res) {
        const id = req.params.id;
        const { isAvailable } = req.body;
        await this.updateRoomAvailabilityUseCase.execute(id, isAvailable);
        ResponseFormatter_1.ResponseFormatter.success(res, null, "Room availability updated successfully");
    }
}
exports.RoomController = RoomController;
