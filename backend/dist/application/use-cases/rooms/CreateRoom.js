"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoom = void 0;
class CreateRoom {
    constructor(roomRepository) {
        this.roomRepository = roomRepository;
    }
    async execute(roomData) {
        return await this.roomRepository.createRoom(roomData);
    }
}
exports.CreateRoom = CreateRoom;
