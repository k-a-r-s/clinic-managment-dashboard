"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = exports.statsController = exports.machineController = exports.roomController = exports.medicalFileController = exports.appointementController = exports.userController = exports.patientController = exports.receptionistController = exports.doctorController = exports.authController = void 0;
const UserAuthService_1 = require("../application/services/UserAuthService");
const AuthRepository_1 = require("../infrastructure/repositories/AuthRepository");
const DoctorRepository_1 = require("../infrastructure/repositories/DoctorRepository");
const ReceptionistRepository_1 = require("../infrastructure/repositories/ReceptionistRepository");
const MedicalFileRepository_1 = require("../infrastructure/repositories/MedicalFileRepository");
const PatientRepository_1 = require("../infrastructure/repositories/PatientRepository");
const UserRepository_1 = require("../infrastructure/repositories/UserRepository");
const AppointementRepository_1 = require("../infrastructure/repositories/AppointementRepository");
const RoomRepository_1 = require("../infrastructure/repositories/RoomRepository");
const AppointmentHistoryRepository_1 = require("../infrastructure/repositories/AppointmentHistoryRepository");
// Controllers
const authController_1 = require("../interface/controllers/authController");
const doctorController_1 = require("../interface/controllers/doctorController");
const patientController_1 = require("../interface/controllers/patientController");
const userController_1 = require("../interface/controllers/userController");
const appointmentController_1 = require("../interface/controllers/appointmentController");
const medicalFileController_1 = require("../interface/controllers/medicalFileController");
const roomController_1 = require("../interface/controllers/roomController");
const MachineRepository_1 = require("../infrastructure/repositories/MachineRepository");
const CreateMachineUseCase_1 = require("../application/use-cases/machines/CreateMachineUseCase");
const GetAllMachinesUseCase_1 = require("../application/use-cases/machines/GetAllMachinesUseCase");
const GetMachineByIdUseCase_1 = require("../application/use-cases/machines/GetMachineByIdUseCase");
const UpdateMachineUseCase_1 = require("../application/use-cases/machines/UpdateMachineUseCase");
const DeactivateMachineUseCase_1 = require("../application/use-cases/machines/DeactivateMachineUseCase");
const GetMachineStatsUseCase_1 = require("../application/use-cases/machines/GetMachineStatsUseCase");
const GetMachineStatsFormattedUseCase_1 = require("../application/use-cases/machines/GetMachineStatsFormattedUseCase");
const machineController_1 = require("../interface/controllers/machineController");
const GetDashboardStatsUseCase_1 = require("../application/use-cases/stats/GetDashboardStatsUseCase");
const statsController_1 = require("../interface/controllers/statsController");
const GetPatientsPerDayUseCase_1 = require("../application/use-cases/stats/GetPatientsPerDayUseCase");
const GetAppointmentsPerDayUseCase_1 = require("../application/use-cases/stats/GetAppointmentsPerDayUseCase");
// Use Cases - Doctor
const GetAllDoctorsUseCase_1 = require("../application/use-cases/doctors/GetAllDoctorsUseCase");
const getDoctorUseCase_1 = require("../application/use-cases/doctors/getDoctorUseCase");
const DeleteDoctorByIdUseCase_1 = require("../application/use-cases/doctors/DeleteDoctorByIdUseCase");
const updateDoctorByIdUseCase_1 = require("../application/use-cases/doctors/updateDoctorByIdUseCase");
// Use Cases - Receptionists
const GetAllReceptionistsUseCase_1 = require("../application/use-cases/receptionists/GetAllReceptionistsUseCase");
const getReceptionistUseCase_1 = require("../application/use-cases/receptionists/getReceptionistUseCase");
const DeleteReceptionistByIdUseCase_1 = require("../application/use-cases/receptionists/DeleteReceptionistByIdUseCase");
const updateReceptionistByIdUseCase_1 = require("../application/use-cases/receptionists/updateReceptionistByIdUseCase");
const receptionistController_1 = require("../interface/controllers/receptionistController");
// Use Cases - Patient
const getPatientByIdUseCase_1 = require("../application/use-cases/patients/getPatientByIdUseCase");
const addPatientUseCase_1 = require("../application/use-cases/patients/addPatientUseCase");
const deletePatientByIdUseCase_1 = require("../application/use-cases/patients/deletePatientByIdUseCase");
const getAllPatientsUseCase_1 = require("../application/use-cases/patients/getAllPatientsUseCase");
const UpdatePatientUseCase_1 = require("../application/use-cases/patients/UpdatePatientUseCase");
// Use Cases - Medical File
const createMedicalFIleUseCase_1 = require("../application/use-cases/medicalFile/createMedicalFIleUseCase");
const GetMedicalFileUseCase_1 = require("../application/use-cases/medicalFile/GetMedicalFileUseCase");
const UpdateMedicalFileUseCase_1 = require("../application/use-cases/medicalFile/UpdateMedicalFileUseCase");
const DeleteMedicalFileUseCase_1 = require("../application/use-cases/medicalFile/DeleteMedicalFileUseCase");
// Use Cases - Appointment
const AddAppointementUseCase_1 = require("../application/use-cases/appointement/AddAppointementUseCase");
const GetAppointementsUseCase_1 = require("../application/use-cases/appointement/GetAppointementsUseCase");
const GetAppointmentsByDoctorUseCase_1 = require("../application/use-cases/appointement/GetAppointmentsByDoctorUseCase");
const GetAppointementsByPatientUseCase_1 = require("../application/use-cases/appointement/GetAppointementsByPatientUseCase");
const DeleteAppointmentUseCase_1 = require("../application/use-cases/appointement/DeleteAppointmentUseCase");
const GetAppointmentByIdUseCase_1 = require("../application/use-cases/appointement/GetAppointmentByIdUseCase");
// Use Cases - Room
const CreateRoom_1 = require("../application/use-cases/rooms/CreateRoom");
const GetRoomById_1 = require("../application/use-cases/rooms/GetRoomById");
const GetAllRooms_1 = require("../application/use-cases/rooms/GetAllRooms");
const GetAvailableRooms_1 = require("../application/use-cases/rooms/GetAvailableRooms");
const UpdateRoom_1 = require("../application/use-cases/rooms/UpdateRoom");
const DeleteRoom_1 = require("../application/use-cases/rooms/DeleteRoom");
const UpdateRoomAvailability_1 = require("../application/use-cases/rooms/UpdateRoomAvailability");
// Use Cases - Appointment History
const GetAppointmentHistoryforPatientUseCase_1 = require("../application/use-cases/AppointmentHistory/GetAppointmentHistoryforPatientUseCase");
const GetHistoriesByPatientUseCase_1 = require("../application/use-cases/AppointmentHistory/GetHistoriesByPatientUseCase");
const UpdateAppointmentHistoryUseCase_1 = require("../application/use-cases/AppointmentHistory/UpdateAppointmentHistoryUseCase");
const DeleteAppointmentHistoryUseCase_1 = require("../application/use-cases/AppointmentHistory/DeleteAppointmentHistoryUseCase");
const AppointmentCompletedUseCase_1 = require("../application/use-cases/AppointmentHistory/AppointmentCompletedUseCase");
// Repositories
const authRepository = new AuthRepository_1.AuthRepository();
const doctorRepository = new DoctorRepository_1.DoctorRepository();
const medicalFileRepository = new MedicalFileRepository_1.MedicalFileRepository();
const patientRepository = new PatientRepository_1.PatientRepository();
const userRepository = new UserRepository_1.UserRepository();
const appointementRepository = new AppointementRepository_1.AppointementRepository();
const roomRepository = new RoomRepository_1.RoomRepository();
const machineRepository = new MachineRepository_1.MachineRepository();
const appointmentHistoryRepository = new AppointmentHistoryRepository_1.AppointmentHistoryRepository();
// Services
const userAuthService = new UserAuthService_1.UserAuthService(userRepository, authRepository);
// Use Cases - Doctor
const getDoctorsListUseCase = new GetAllDoctorsUseCase_1.GetDoctorsListUseCase(doctorRepository);
const getDoctorUseCase = new getDoctorUseCase_1.GetDoctorUseCase(doctorRepository);
const deleteDoctorByIdUseCase = new DeleteDoctorByIdUseCase_1.DeleteDoctorByIdUseCase(doctorRepository);
const updateDoctorByIdUseCase = new updateDoctorByIdUseCase_1.UpdateDoctorByIdUseCase(doctorRepository);
// Receptionsits
const receptionistRepository = new ReceptionistRepository_1.ReceptionistRepository();
const getReceptionistsListUseCase = new GetAllReceptionistsUseCase_1.GetReceptionistsListUseCase(receptionistRepository);
const getReceptionistUseCase = new getReceptionistUseCase_1.GetReceptionistUseCase(receptionistRepository);
const deleteReceptionistByIdUseCase = new DeleteReceptionistByIdUseCase_1.DeleteReceptionistByIdUseCase(receptionistRepository);
const updateReceptionistByIdUseCase = new updateReceptionistByIdUseCase_1.UpdateReceptionistByIdUseCase(receptionistRepository);
// Use Cases - Medical File (without createMedicalFile for now)
const getMedicalFileUseCase = new GetMedicalFileUseCase_1.GetMedicalFileUseCase(medicalFileRepository);
const updateMedicalFileUseCaseInstance = new UpdateMedicalFileUseCase_1.UpdateMedicalFileUseCase(medicalFileRepository);
const deleteMedicalFileUseCase = new DeleteMedicalFileUseCase_1.DeleteMedicalFileUseCase(medicalFileRepository);
// Use Cases - Patient
const getPatientByIdUseCase = new getPatientByIdUseCase_1.GetPatientByIdUseCase(patientRepository);
const deletePatientByIdUseCase = new deletePatientByIdUseCase_1.DeletePatientByIdUseCase(patientRepository);
const getAllPatientsUseCase = new getAllPatientsUseCase_1.GetAllPatientsUseCase(patientRepository);
const updatePatientUseCase = new UpdatePatientUseCase_1.UpdatePatientUseCase(patientRepository);
// Create medical file use case (depends on patient use cases)
const createMedicalFileUseCaseInstance = new createMedicalFIleUseCase_1.createMedicalFileUseCase(medicalFileRepository, updatePatientUseCase, patientRepository);
// Add patient use case (depends on createMedicalFileUseCase)
const addPatientUseCase = new addPatientUseCase_1.AddPatientUseCase(patientRepository, createMedicalFileUseCaseInstance);
// Use Cases - Appointment
const addAppointementUseCase = new AddAppointementUseCase_1.AddAppointementUseCase(appointementRepository, roomRepository);
const getAppointementsUseCase = new GetAppointementsUseCase_1.GetAppointementsUseCase(appointementRepository);
const getAppointmentsByDoctorUseCase = new GetAppointmentsByDoctorUseCase_1.GetAppointmentsByDoctorUseCase(appointementRepository);
const getAppointementsByPatientUseCase = new GetAppointementsByPatientUseCase_1.GetAppointementsByPatientUseCase(appointementRepository);
const deleteAppointementUseCaseInstance = new DeleteAppointmentUseCase_1.deleteAppointementUseCase(appointementRepository);
const getAppointmentByIdUseCase = new GetAppointmentByIdUseCase_1.GetAppointmentByIdUseCase(appointementRepository);
// Use Cases - Room
const createRoomUseCase = new CreateRoom_1.CreateRoom(roomRepository);
const getRoomByIdUseCase = new GetRoomById_1.GetRoomById(roomRepository);
const getAllRoomsUseCase = new GetAllRooms_1.GetAllRooms(roomRepository);
const getAvailableRoomsUseCase = new GetAvailableRooms_1.GetAvailableRooms(roomRepository);
const updateRoomUseCase = new UpdateRoom_1.UpdateRoom(roomRepository);
const deleteRoomUseCase = new DeleteRoom_1.DeleteRoom(roomRepository);
const updateRoomAvailabilityUseCase = new UpdateRoomAvailability_1.UpdateRoomAvailability(roomRepository);
// Use Cases - Machines
const createMachineUseCase = new CreateMachineUseCase_1.CreateMachineUseCase(machineRepository);
const getAllMachinesUseCase = new GetAllMachinesUseCase_1.GetAllMachinesUseCase(machineRepository);
const getMachineByIdUseCase = new GetMachineByIdUseCase_1.GetMachineByIdUseCase(machineRepository);
const updateMachineUseCase = new UpdateMachineUseCase_1.UpdateMachineUseCase(machineRepository);
const deactivateMachineUseCase = new DeactivateMachineUseCase_1.DeactivateMachineUseCase(machineRepository);
const getMachineStatsUseCase = new GetMachineStatsUseCase_1.GetMachineStatsUseCase(machineRepository);
const getMachineStatsFormattedUseCase = new GetMachineStatsFormattedUseCase_1.GetMachineStatsFormattedUseCase(machineRepository);
const getDashboardStatsUseCase = new GetDashboardStatsUseCase_1.GetDashboardStatsUseCase(patientRepository, appointementRepository, machineRepository, userRepository);
const getPatientsPerDayUseCase = new GetPatientsPerDayUseCase_1.GetPatientsPerDayUseCase(patientRepository);
const getAppointmentsPerDayUseCase = new GetAppointmentsPerDayUseCase_1.GetAppointmentsPerDayUseCase(appointementRepository);
// Use Cases - Appointment History
const getAppointmentHistoryUseCase = new GetAppointmentHistoryforPatientUseCase_1.GetAppointmentHistoryforPatientUseCase(appointmentHistoryRepository, appointementRepository);
const getHistoriesByPatientUseCase = new GetHistoriesByPatientUseCase_1.GetHistoriesByPatientUseCase(appointmentHistoryRepository);
const updateAppointmentHistoryUseCase = new UpdateAppointmentHistoryUseCase_1.UpdateAppointmentHistoryUseCase(appointmentHistoryRepository);
const deleteAppointmentHistoryUseCase = new DeleteAppointmentHistoryUseCase_1.DeleteAppointmentHistoryUseCase(appointmentHistoryRepository);
const appointmentCompletedUseCase = new AppointmentCompletedUseCase_1.AppointmentCompletedUseCase(appointmentHistoryRepository, medicalFileRepository, getMedicalFileUseCase, createMedicalFileUseCaseInstance);
// Controllers
exports.authController = new authController_1.AuthController(userAuthService);
exports.doctorController = new doctorController_1.DoctorController(getDoctorsListUseCase, deleteDoctorByIdUseCase, getDoctorUseCase, updateDoctorByIdUseCase);
exports.receptionistController = new receptionistController_1.ReceptionistController(getReceptionistsListUseCase, deleteReceptionistByIdUseCase, getReceptionistUseCase, updateReceptionistByIdUseCase);
exports.patientController = new patientController_1.PatientController(addPatientUseCase, getPatientByIdUseCase, deletePatientByIdUseCase, getAllPatientsUseCase, updatePatientUseCase);
exports.userController = new userController_1.UserController(userAuthService);
exports.appointementController = new appointmentController_1.AppointementController(addAppointementUseCase, getAppointementsUseCase, getAppointmentsByDoctorUseCase, getAppointementsByPatientUseCase, deleteAppointementUseCaseInstance, getAppointmentByIdUseCase, getAppointmentHistoryUseCase, getHistoriesByPatientUseCase, updateAppointmentHistoryUseCase, deleteAppointmentHistoryUseCase, appointmentCompletedUseCase);
exports.medicalFileController = new medicalFileController_1.MedicalFileController(createMedicalFileUseCaseInstance, getMedicalFileUseCase, updateMedicalFileUseCaseInstance, deleteMedicalFileUseCase);
exports.roomController = new roomController_1.RoomController(createRoomUseCase, getRoomByIdUseCase, getAllRoomsUseCase, getAvailableRoomsUseCase, updateRoomUseCase, deleteRoomUseCase, updateRoomAvailabilityUseCase);
exports.machineController = new machineController_1.MachineController(createMachineUseCase, getAllMachinesUseCase, getMachineByIdUseCase, updateMachineUseCase, deactivateMachineUseCase, getMachineStatsUseCase, getMachineStatsFormattedUseCase);
exports.statsController = new statsController_1.StatsController(getDashboardStatsUseCase, getPatientsPerDayUseCase, getAppointmentsPerDayUseCase);
// Dependency Injection Container
class Container {
    constructor() {
        this.dependencies = new Map();
    }
    register(name, dependency) {
        this.dependencies.set(name, dependency);
    }
    resolve(name) {
        if (!this.dependencies.has(name)) {
            throw new Error(`Dependency ${name} not found`);
        }
        return this.dependencies.get(name);
    }
    // convenience alias to match other container APIs
    get(name) {
        return this.resolve(name);
    }
    has(name) {
        return this.dependencies.has(name);
    }
}
exports.container = new Container();
// Register all controllers
exports.container.register('authController', exports.authController);
exports.container.register('doctorController', exports.doctorController);
exports.container.register('receptionistController', exports.receptionistController);
exports.container.register('patientController', exports.patientController);
exports.container.register('userController', exports.userController);
exports.container.register('appointementController', exports.appointementController);
exports.container.register('medicalFileController', exports.medicalFileController);
exports.container.register('roomController', exports.roomController);
exports.container.register('machineController', exports.machineController);
exports.container.register('statsController', exports.statsController);
exports.container.register('GetPatientsPerDayUseCase', getPatientsPerDayUseCase);
exports.container.register('GetAppointmentsPerDayUseCase', getAppointmentsPerDayUseCase);
// convenience helpers
// (get/has methods are implemented on the class above)
