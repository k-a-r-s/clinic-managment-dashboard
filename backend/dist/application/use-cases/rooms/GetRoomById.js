"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRoomById = void 0;
const AppError_1 = require("../../../infrastructure/errors/AppError");
class GetRoomById {
    constructor(roomRepository) {
        this.roomRepository = roomRepository;
    }
    async execute(id) {
        const room = await this.roomRepository.getRoomById(id);
        if (!room) {
            throw new AppError_1.AppError("Room not found", 404);
        }
        return room;
    }
}
exports.GetRoomById = GetRoomById;
