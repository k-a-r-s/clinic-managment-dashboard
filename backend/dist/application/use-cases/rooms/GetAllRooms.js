"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllRooms = void 0;
class GetAllRooms {
    constructor(roomRepository) {
        this.roomRepository = roomRepository;
    }
    async execute() {
        return await this.roomRepository.getAllRooms();
    }
}
exports.GetAllRooms = GetAllRooms;
