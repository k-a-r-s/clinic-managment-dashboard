import { UserAuthService } from "../application/services/UserAuthService";
import { AuthRepository } from "../infrastructure/repositories/AuthRepository";
import { DoctorRepository } from "../infrastructure/repositories/DoctorRepository";
import { ReceptionistRepository } from "../infrastructure/repositories/ReceptionistRepository";
import { MedicalFileRepository } from "../infrastructure/repositories/MedicalFileRepository";
import { PatientRepository } from "../infrastructure/repositories/PatientRepository";
import { UserRepository } from "../infrastructure/repositories/UserRepository";
import { AppointementRepository } from "../infrastructure/repositories/AppointementRepository";
import { RoomRepository } from "../infrastructure/repositories/RoomRepository";
import { AppointmentHistoryRepository } from "../infrastructure/repositories/AppointmentHistoryRepository";
import { PrescriptionRepository } from "../infrastructure/repositories/PrescriptionRepository";

// Controllers
import { AuthController } from "../interface/controllers/authController";
import { DoctorController } from "../interface/controllers/doctorController";
import { PatientController } from "../interface/controllers/patientController";
import { UserController } from "../interface/controllers/userController";
import { AppointementController } from "../interface/controllers/appointmentController";
import { MedicalFileController } from "../interface/controllers/medicalFileController";
import { RoomController } from "../interface/controllers/roomController";
import { MachineRepository } from "../infrastructure/repositories/MachineRepository";
import { CreateMachineUseCase } from "../application/use-cases/machines/CreateMachineUseCase";
import { GetAllMachinesUseCase } from "../application/use-cases/machines/GetAllMachinesUseCase";
import { GetMachineByIdUseCase } from "../application/use-cases/machines/GetMachineByIdUseCase";
import { UpdateMachineUseCase } from "../application/use-cases/machines/UpdateMachineUseCase";
import { DeactivateMachineUseCase } from "../application/use-cases/machines/DeactivateMachineUseCase";
import { DeleteMachine } from "../application/use-cases/machines/DeleteMachine";
import { GetMachineStatsUseCase } from "../application/use-cases/machines/GetMachineStatsUseCase";
import { GetMachineStatsFormattedUseCase } from "../application/use-cases/machines/GetMachineStatsFormattedUseCase";
import { MachineController } from "../interface/controllers/machineController";
import { GetDashboardStatsUseCase } from "../application/use-cases/stats/GetDashboardStatsUseCase";
import { StatsController } from "../interface/controllers/statsController";
import { GetPatientsPerDayUseCase } from "../application/use-cases/stats/GetPatientsPerDayUseCase";
import { GetAppointmentsPerDayUseCase } from "../application/use-cases/stats/GetAppointmentsPerDayUseCase";
import { PrescriptionController } from "../interface/controllers/prescriptionController";

// Use Cases - Users
import { GetAllUsersUseCase } from "../application/use-cases/users/GetAllUsersUseCase";
import { GetUserByIdUseCase } from "../application/use-cases/users/GetUserByIdUseCase";
import { UpdateUserUseCase } from "../application/use-cases/users/UpdateUserUseCase";
import { DeleteUserUseCase } from "../application/use-cases/users/DeleteUserUseCase";
import { ChangePasswordUseCase } from "../application/use-cases/users/ChangePasswordUseCase";
import { UpdateCurrentUserUseCase } from "../application/use-cases/users/UpdateCurrentUserUseCase";

// Use Cases - Doctor
import { GetDoctorsListUseCase } from "../application/use-cases/doctors/GetAllDoctorsUseCase";
import { GetDoctorUseCase } from "../application/use-cases/doctors/getDoctorUseCase";
import { DeleteDoctorByIdUseCase } from "../application/use-cases/doctors/DeleteDoctorByIdUseCase";
import { UpdateDoctorByIdUseCase } from "../application/use-cases/doctors/updateDoctorByIdUseCase";
// Use Cases - Receptionists
import { GetReceptionistsListUseCase } from "../application/use-cases/receptionists/GetAllReceptionistsUseCase";
import { GetReceptionistUseCase } from "../application/use-cases/receptionists/getReceptionistUseCase";
import { DeleteReceptionistByIdUseCase } from "../application/use-cases/receptionists/DeleteReceptionistByIdUseCase";
import { UpdateReceptionistByIdUseCase } from "../application/use-cases/receptionists/updateReceptionistByIdUseCase";
import { ReceptionistController } from "../interface/controllers/receptionistController";

// Use Cases - Patient
import { GetPatientByIdUseCase } from "../application/use-cases/patients/getPatientByIdUseCase";
import { AddPatientUseCase } from "../application/use-cases/patients/addPatientUseCase";
import { DeletePatientByIdUseCase } from "../application/use-cases/patients/deletePatientByIdUseCase";
import { GetAllPatientsUseCase } from "../application/use-cases/patients/getAllPatientsUseCase";
import { UpdatePatientUseCase } from "../application/use-cases/patients/UpdatePatientUseCase";

// Use Cases - Medical File
import { createMedicalFileUseCase } from "../application/use-cases/medicalFile/createMedicalFIleUseCase";
import { GetMedicalFileUseCase } from "../application/use-cases/medicalFile/GetMedicalFileUseCase";
import { UpdateMedicalFileUseCase } from "../application/use-cases/medicalFile/UpdateMedicalFileUseCase";
import { DeleteMedicalFileUseCase } from "../application/use-cases/medicalFile/DeleteMedicalFileUseCase";

// Use Cases - Appointment
import { AddAppointementUseCase } from "../application/use-cases/appointement/AddAppointementUseCase";
import { GetAppointementsUseCase } from "../application/use-cases/appointement/GetAppointementsUseCase";
import { GetAppointmentsByDoctorUseCase } from "../application/use-cases/appointement/GetAppointmentsByDoctorUseCase";
import { GetAppointementsByPatientUseCase } from "../application/use-cases/appointement/GetAppointementsByPatientUseCase";
import { deleteAppointementUseCase } from "../application/use-cases/appointement/DeleteAppointmentUseCase";
import { GetAppointmentByIdUseCase } from "../application/use-cases/appointement/GetAppointmentByIdUseCase";
import { UpdateAppointmentUseCase } from "../application/use-cases/appointement/UpdateAppointmentUseCase";

// Use Cases - Room
import { CreateRoom } from "../application/use-cases/rooms/CreateRoom";
import { GetRoomById } from "../application/use-cases/rooms/GetRoomById";
import { GetAllRooms } from "../application/use-cases/rooms/GetAllRooms";
import { GetAvailableRooms } from "../application/use-cases/rooms/GetAvailableRooms";
import { UpdateRoom } from "../application/use-cases/rooms/UpdateRoom";
import { DeleteRoom } from "../application/use-cases/rooms/DeleteRoom";
import { UpdateRoomAvailability } from "../application/use-cases/rooms/UpdateRoomAvailability";

// Use Cases - Appointment History
import { GetAppointmentHistoryforPatientUseCase } from "../application/use-cases/AppointmentHistory/GetAppointmentHistoryforPatientUseCase";
import { GetHistoriesByPatientUseCase } from "../application/use-cases/AppointmentHistory/GetHistoriesByPatientUseCase";
import { UpdateAppointmentHistoryUseCase } from "../application/use-cases/AppointmentHistory/UpdateAppointmentHistoryUseCase";
import { DeleteAppointmentHistoryUseCase } from "../application/use-cases/AppointmentHistory/DeleteAppointmentHistoryUseCase";
import { AppointmentCompletedUseCase } from "../application/use-cases/AppointmentHistory/AppointmentCompletedUseCase";

// Use Cases - Prescription
import { CreatePrescriptionUseCase } from "../application/use-cases/prescription/CreatePrescriptionUseCase";
import { GetPrescriptionsUseCase } from "../application/use-cases/prescription/GetPrescriptionsUseCase";
import { GetPrescriptionByIdUseCase } from "../application/use-cases/prescription/GetPrescriptionByIdUseCase";
import { GetPrescriptionsByPatientIdUseCase } from "../application/use-cases/prescription/GetPrescriptionsByPatientIdUseCase";
import { UpdatePrescriptionUseCase } from "../application/use-cases/prescription/UpdatePrescriptionUseCase";
import { DeletePrescriptionUseCase } from "../application/use-cases/prescription/DeletePrescriptionUseCase";

// Dialysis
import { DialysisRepository } from "../infrastructure/repositories/DialysisRepository";
import { CreateDialysisPatient } from "../application/use-cases/dialysis/CreateDialysisPatient";
import { GetAllDialysisPatients } from "../application/use-cases/dialysis/GetAllDialysisPatients";
import { CreateProtocol } from "../application/use-cases/dialysis/CreateProtocol";
import { GetProtocolByPatientId } from "../application/use-cases/dialysis/GetProtocolByPatientId";
import { CreateSession } from "../application/use-cases/dialysis/CreateSession";
import { GetSessionsByPatientId } from "../application/use-cases/dialysis/GetSessionsByPatientId";
import { UpdateDialysisPatient } from "../application/use-cases/dialysis/UpdateDialysisPatient";
import { UpdateProtocol } from "../application/use-cases/dialysis/UpdateProtocol";
import { UpdateSession } from "../application/use-cases/dialysis/UpdateSession";
import { GetSessionById } from "../application/use-cases/dialysis/GetSessionById";
import { DeleteSession } from "../application/use-cases/dialysis/DeleteSession";
import { DialysisController } from "../interface/controllers/dialysisController";

// Repositories
const authRepository = new AuthRepository();
const doctorRepository = new DoctorRepository();
const medicalFileRepository = new MedicalFileRepository();
const patientRepository = new PatientRepository();
const userRepository = new UserRepository();
const appointementRepository = new AppointementRepository();
const roomRepository = new RoomRepository();
const machineRepository = new MachineRepository();
const appointmentHistoryRepository = new AppointmentHistoryRepository();
const prescriptionRepository = new PrescriptionRepository();
const dialysisRepository = new DialysisRepository();

// Services
const userAuthService = new UserAuthService(userRepository, authRepository);
// Use Cases - Doctor
const getDoctorsListUseCase = new GetDoctorsListUseCase(doctorRepository);
const getDoctorUseCase = new GetDoctorUseCase(doctorRepository);
const deleteDoctorByIdUseCase = new DeleteDoctorByIdUseCase(doctorRepository);
const updateDoctorByIdUseCase = new UpdateDoctorByIdUseCase(doctorRepository);

// Receptionsits
const receptionistRepository = new ReceptionistRepository();
const getReceptionistsListUseCase = new GetReceptionistsListUseCase(
  receptionistRepository
);
const getReceptionistUseCase = new GetReceptionistUseCase(
  receptionistRepository
);
const deleteReceptionistByIdUseCase = new DeleteReceptionistByIdUseCase(
  receptionistRepository
);
const updateReceptionistByIdUseCase = new UpdateReceptionistByIdUseCase(
  receptionistRepository
);

// Use Cases - Medical File (without createMedicalFile for now)
const getMedicalFileUseCase = new GetMedicalFileUseCase(medicalFileRepository);
const updateMedicalFileUseCaseInstance = new UpdateMedicalFileUseCase(
  medicalFileRepository
);
const deleteMedicalFileUseCase = new DeleteMedicalFileUseCase(
  medicalFileRepository
);

// Use Cases - Patient
const getPatientByIdUseCase = new GetPatientByIdUseCase(patientRepository);
const deletePatientByIdUseCase = new DeletePatientByIdUseCase(
  patientRepository
);
const getAllPatientsUseCase = new GetAllPatientsUseCase(patientRepository);
const updatePatientUseCase = new UpdatePatientUseCase(patientRepository);

// Create medical file use case (depends on patient use cases)
const createMedicalFileUseCaseInstance = new createMedicalFileUseCase(
  medicalFileRepository,
  updatePatientUseCase,
  patientRepository
);

// Add patient use case (depends on createMedicalFileUseCase)
const addPatientUseCase = new AddPatientUseCase(
  patientRepository,
  createMedicalFileUseCaseInstance
);

// Use Cases - Appointment
const addAppointementUseCase = new AddAppointementUseCase(
  appointementRepository,
  roomRepository
);
const getAppointementsUseCase = new GetAppointementsUseCase(
  appointementRepository
);
const getAppointmentsByDoctorUseCase = new GetAppointmentsByDoctorUseCase(
  appointementRepository
);
const getAppointementsByPatientUseCase = new GetAppointementsByPatientUseCase(
  appointementRepository
);
const deleteAppointementUseCaseInstance = new deleteAppointementUseCase(
  appointementRepository
);
const getAppointmentByIdUseCase = new GetAppointmentByIdUseCase(
  appointementRepository
);
const updateAppointmentUseCaseInstance = new UpdateAppointmentUseCase(
  appointementRepository
);

// Use Cases - Room
const createRoomUseCase = new CreateRoom(roomRepository);
const getRoomByIdUseCase = new GetRoomById(roomRepository);
const getAllRoomsUseCase = new GetAllRooms(roomRepository);
const getAvailableRoomsUseCase = new GetAvailableRooms(roomRepository);
const updateRoomUseCase = new UpdateRoom(roomRepository);
const deleteRoomUseCase = new DeleteRoom(roomRepository);
const updateRoomAvailabilityUseCase = new UpdateRoomAvailability(
  roomRepository
);
// Use Cases - Machines
const createMachineUseCase = new CreateMachineUseCase(machineRepository);
const getAllMachinesUseCase = new GetAllMachinesUseCase(machineRepository);
const getMachineByIdUseCase = new GetMachineByIdUseCase(machineRepository);
const updateMachineUseCase = new UpdateMachineUseCase(machineRepository);
const deactivateMachineUseCase = new DeactivateMachineUseCase(
  machineRepository
);
const deleteMachineUseCase = new DeleteMachine(machineRepository);
const getMachineStatsUseCase = new GetMachineStatsUseCase(machineRepository);
const getMachineStatsFormattedUseCase = new GetMachineStatsFormattedUseCase(
  machineRepository
);
const getDashboardStatsUseCase = new GetDashboardStatsUseCase(
  patientRepository,
  appointementRepository,
  machineRepository,
  userRepository
);

const getPatientsPerDayUseCase = new GetPatientsPerDayUseCase(
  patientRepository
);
const getAppointmentsPerDayUseCase = new GetAppointmentsPerDayUseCase(
  appointementRepository
);

// Use Cases - Users
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
const getUserByIdUseCaseInstance = new GetUserByIdUseCase(userRepository);
const updateUserUseCaseInstance = new UpdateUserUseCase(userRepository);
const deleteUserUseCaseInstance = new DeleteUserUseCase(userRepository);
const changePasswordUseCase = new ChangePasswordUseCase(userRepository);
const updateCurrentUserUseCase = new UpdateCurrentUserUseCase(userRepository);

// Use Cases - Appointment History
const getAppointmentHistoryUseCase = new GetAppointmentHistoryforPatientUseCase(
  appointmentHistoryRepository,
  appointementRepository
);
const getHistoriesByPatientUseCase = new GetHistoriesByPatientUseCase(
  appointmentHistoryRepository
);
const updateAppointmentHistoryUseCase = new UpdateAppointmentHistoryUseCase(
  appointmentHistoryRepository
);
const deleteAppointmentHistoryUseCase = new DeleteAppointmentHistoryUseCase(
  appointmentHistoryRepository
);
const appointmentCompletedUseCase = new AppointmentCompletedUseCase(
  appointmentHistoryRepository,
  medicalFileRepository,
  getMedicalFileUseCase,
  createMedicalFileUseCaseInstance
);

// Use Cases - Prescription
const createPrescriptionUseCase = new CreatePrescriptionUseCase(
  prescriptionRepository,
  medicalFileRepository
);
const getPrescriptionsUseCase = new GetPrescriptionsUseCase(
  prescriptionRepository
);
const getPrescriptionByIdUseCase = new GetPrescriptionByIdUseCase(
  prescriptionRepository
);
const getPrescriptionsByPatientIdUseCase =
  new GetPrescriptionsByPatientIdUseCase(prescriptionRepository);
const updatePrescriptionUseCase = new UpdatePrescriptionUseCase(
  prescriptionRepository
);
const deletePrescriptionUseCase = new DeletePrescriptionUseCase(
  prescriptionRepository
);

// Use Cases - Dialysis
const createDialysisPatientUseCase = new CreateDialysisPatient(
  dialysisRepository
);
const getAllDialysisPatientsUseCase = new GetAllDialysisPatients(
  dialysisRepository
);
const updateDialysisPatientUseCase = new UpdateDialysisPatient(
  dialysisRepository
);
const createProtocolUseCase = new CreateProtocol(dialysisRepository);
const getProtocolByPatientIdUseCase = new GetProtocolByPatientId(
  dialysisRepository
);
const updateProtocolUseCase = new UpdateProtocol(dialysisRepository);
const createSessionUseCase = new CreateSession(
  dialysisRepository,
  medicalFileRepository
);
const getSessionsByPatientIdUseCase = new GetSessionsByPatientId(
  dialysisRepository
);
const getSessionByIdUseCase = new GetSessionById(dialysisRepository);
const updateSessionUseCase = new UpdateSession(dialysisRepository);
const deleteSessionUseCase = new DeleteSession(dialysisRepository);

// Controllers
export const authController = new AuthController(
  userAuthService,
  changePasswordUseCase,
  updateCurrentUserUseCase
);
export const doctorController = new DoctorController(
  getDoctorsListUseCase,
  deleteDoctorByIdUseCase,
  getDoctorUseCase,
  updateDoctorByIdUseCase
);
export const receptionistController = new ReceptionistController(
  getReceptionistsListUseCase,
  deleteReceptionistByIdUseCase,
  getReceptionistUseCase,
  updateReceptionistByIdUseCase
);
export const patientController = new PatientController(
  addPatientUseCase,
  getPatientByIdUseCase,
  deletePatientByIdUseCase,
  getAllPatientsUseCase,
  updatePatientUseCase
);
export const userController = new UserController(
  userAuthService,
  getAllUsersUseCase,
  getUserByIdUseCaseInstance,
  updateUserUseCaseInstance,
  deleteUserUseCaseInstance
);
export const appointementController = new AppointementController(
  addAppointementUseCase,
  getAppointementsUseCase,
  getAppointmentsByDoctorUseCase,
  getAppointementsByPatientUseCase,
  deleteAppointementUseCaseInstance,
  getAppointmentByIdUseCase,
  updateAppointmentUseCaseInstance,
  getAppointmentHistoryUseCase,
  getHistoriesByPatientUseCase,
  updateAppointmentHistoryUseCase,
  deleteAppointmentHistoryUseCase,
  appointmentCompletedUseCase
);
export const medicalFileController = new MedicalFileController(
  createMedicalFileUseCaseInstance,
  getMedicalFileUseCase,
  updateMedicalFileUseCaseInstance,
  deleteMedicalFileUseCase
);
export const roomController = new RoomController(
  createRoomUseCase,
  getRoomByIdUseCase,
  getAllRoomsUseCase,
  getAvailableRoomsUseCase,
  updateRoomUseCase,
  deleteRoomUseCase,
  updateRoomAvailabilityUseCase
);
export const machineController = new MachineController(
  createMachineUseCase,
  getAllMachinesUseCase,
  getMachineByIdUseCase,
  updateMachineUseCase,
  deactivateMachineUseCase,
  deleteMachineUseCase,
  getMachineStatsUseCase,
  getMachineStatsFormattedUseCase
);
export const statsController = new StatsController(
  getDashboardStatsUseCase,
  getPatientsPerDayUseCase,
  getAppointmentsPerDayUseCase
);
export const prescriptionController = new PrescriptionController(
  createPrescriptionUseCase,
  getPrescriptionsUseCase,
  getPrescriptionByIdUseCase,
  getPrescriptionsByPatientIdUseCase,
  updatePrescriptionUseCase,
  deletePrescriptionUseCase
);

export const dialysisController = new DialysisController(
  createDialysisPatientUseCase,
  getAllDialysisPatientsUseCase,
  updateDialysisPatientUseCase,
  createProtocolUseCase,
  getProtocolByPatientIdUseCase,
  updateProtocolUseCase,
  createSessionUseCase,
  getSessionsByPatientIdUseCase,
  getSessionByIdUseCase,
  updateSessionUseCase,
  deleteSessionUseCase
);

// Dependency Injection Container
class Container {
  private dependencies: Map<string, any> = new Map();

  register<T>(name: string, dependency: T): void {
    this.dependencies.set(name, dependency);
  }

  resolve<T>(name: string): T {
    if (!this.dependencies.has(name)) {
      throw new Error(`Dependency ${name} not found`);
    }
    return this.dependencies.get(name) as T;
  }

  // convenience alias to match other container APIs
  get<T>(name: string): T {
    return this.resolve<T>(name);
  }

  has(name: string): boolean {
    return this.dependencies.has(name);
  }
}

export const container = new Container();

// Register all controllers
container.register("authController", authController);
container.register("doctorController", doctorController);
container.register("receptionistController", receptionistController);
container.register("patientController", patientController);
container.register("userController", userController);
container.register("appointementController", appointementController);
container.register("medicalFileController", medicalFileController);
container.register("roomController", roomController);
container.register("machineController", machineController);
container.register("statsController", statsController);
container.register("prescriptionController", prescriptionController);
container.register("dialysisController", dialysisController);
container.register("GetPatientsPerDayUseCase", getPatientsPerDayUseCase);
container.register(
  "GetAppointmentsPerDayUseCase",
  getAppointmentsPerDayUseCase
);

// convenience helpers
// (get/has methods are implemented on the class above)
