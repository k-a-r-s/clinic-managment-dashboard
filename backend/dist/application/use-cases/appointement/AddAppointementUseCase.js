"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAppointementUseCase = void 0;
const Appointement_1 = require("../../../domain/entities/Appointement");
const AppError_1 = require("../../../infrastructure/errors/AppError");
const Appointement_2 = require("../../../domain/entities/Appointement");
class AddAppointementUseCase {
    constructor(appointementRepository, roomRepository) {
        this.appointementRepository = appointementRepository;
        this.roomRepository = roomRepository;
    }
    async execute(addAppointmentDto) {
        const appointement = new Appointement_1.Appointement(crypto.randomUUID(), addAppointmentDto.patientId, addAppointmentDto.doctorId, addAppointmentDto.roomId, addAppointmentDto.createdByReceptionId, addAppointmentDto.createdByDoctorId, addAppointmentDto.appointmentDate, addAppointmentDto.estimatedDurationInMinutes, Appointement_2.status[addAppointmentDto.status]);
        // If room repository provided, validate room exists and is available (by id only)
        if (this.roomRepository) {
            const room = await this.roomRepository.getRoomById(String(addAppointmentDto.roomId));
            if (!room) {
                throw new AppError_1.AppError('Room not found', 404);
            }
            const available = await this.roomRepository.isAvailable(String(addAppointmentDto.roomId));
            if (!available) {
                throw new AppError_1.AppError('Room is not available', 409);
            }
        }
        return this.appointementRepository.addAppointement(appointement);
    }
}
exports.AddAppointementUseCase = AddAppointementUseCase;
