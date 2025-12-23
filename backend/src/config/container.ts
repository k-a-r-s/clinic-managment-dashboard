import { UserAuthService } from '../application/services/UserAuthService';
import { AuthRepository } from '../infrastructure/repositories/AuthRepository';
import { DoctorRepository } from '../infrastructure/repositories/DoctorRepository';
import { MedicalFileRepository } from '../infrastructure/repositories/MedicalFileRepository';
import { PatientRepository } from '../infrastructure/repositories/PatientRepository';
import { UserRepository } from '../infrastructure/repositories/UserRepository';
import { AppointementRepository } from '../infrastructure/repositories/AppointementRepository';
import { RoomRepository } from '../infrastructure/repositories/RoomRepository';
import { AppointmentHistoryRepository } from '../infrastructure/repositories/AppointmentHistoryRepository';

// Controllers
import { AuthController } from '../interface/controllers/authController';
import { DoctorController } from '../interface/controllers/doctorController';
import { PatientController } from '../interface/controllers/patientController';
import { UserController } from '../interface/controllers/userController';
import { AppointementController } from '../interface/controllers/appointmentController';
import { MedicalFileController } from '../interface/controllers/medicalFileController';
import { RoomController } from '../interface/controllers/roomController';
import { MachineRepository } from '../infrastructure/repositories/MachineRepository';
import { CreateMachineUseCase } from '../application/use-cases/machines/CreateMachineUseCase';
import { GetAllMachinesUseCase } from '../application/use-cases/machines/GetAllMachinesUseCase';
import { GetMachineByIdUseCase } from '../application/use-cases/machines/GetMachineByIdUseCase';
import { UpdateMachineUseCase } from '../application/use-cases/machines/UpdateMachineUseCase';
import { DeactivateMachineUseCase } from '../application/use-cases/machines/DeactivateMachineUseCase';
import { GetMachineStatsUseCase } from '../application/use-cases/machines/GetMachineStatsUseCase';
import { MachineController } from '../interface/controllers/machineController';

// Use Cases - Doctor
import { GetDoctorsListUseCase } from '../application/use-cases/doctors/GetAllDoctorsUseCase';
import { GetDoctorUseCase } from '../application/use-cases/doctors/getDoctorUseCase';
import { DeleteDoctorByIdUseCase } from '../application/use-cases/doctors/DeleteDoctorByIdUseCase';
import { UpdateDoctorByIdUseCase } from '../application/use-cases/doctors/updateDoctorByIdUseCase';

// Use Cases - Patient
import { GetPatientByIdUseCase } from '../application/use-cases/patients/getPatientByIdUseCase';
import { AddPatientUseCase } from '../application/use-cases/patients/addPatientUseCase';
import { DeletePatientByIdUseCase } from '../application/use-cases/patients/deletePatientByIdUseCase';
import { GetAllPatientsUseCase } from '../application/use-cases/patients/getAllPatientsUseCase';
import { UpdatePatientUseCase } from '../application/use-cases/patients/UpdatePatientUseCase';

// Use Cases - Medical File
import { createMedicalFileUseCase } from '../application/use-cases/medicalFile/createMedicalFIleUseCase';
import { GetMedicalFileUseCase } from '../application/use-cases/medicalFile/GetMedicalFileUseCase';
import { UpdateMedicalFileUseCase } from '../application/use-cases/medicalFile/UpdateMedicalFileUseCase';
import { DeleteMedicalFileUseCase } from '../application/use-cases/medicalFile/DeleteMedicalFileUseCase';

// Use Cases - Appointment
import { AddAppointementUseCase } from '../application/use-cases/appointement/AddAppointementUseCase';
import { GetAppointementsUseCase } from '../application/use-cases/appointement/GetAppointementsUseCase';
import { GetAppointmentsByDoctorUseCase } from '../application/use-cases/appointement/GetAppointmentsByDoctorUseCase';
import { GetAppointementsByPatientUseCase } from '../application/use-cases/appointement/GetAppointementsByPatientUseCase';
import { deleteAppointementUseCase } from '../application/use-cases/appointement/DeleteAppointmentUseCase';

// Use Cases - Room
import { CreateRoom } from '../application/use-cases/rooms/CreateRoom';
import { GetRoomById } from '../application/use-cases/rooms/GetRoomById';
import { GetAllRooms } from '../application/use-cases/rooms/GetAllRooms';
import { GetAvailableRooms } from '../application/use-cases/rooms/GetAvailableRooms';
import { UpdateRoom } from '../application/use-cases/rooms/UpdateRoom';
import { DeleteRoom } from '../application/use-cases/rooms/DeleteRoom';
import { UpdateRoomAvailability } from '../application/use-cases/rooms/UpdateRoomAvailability';

// Use Cases - Appointment History
import { GetAppointmentHistoryforPatientUseCase } from '../application/use-cases/AppointmentHistory/GetAppointmentHistoryforPatientUseCase';
import { GetHistoriesByPatientUseCase } from '../application/use-cases/AppointmentHistory/GetHistoriesByPatientUseCase';
import { UpdateAppointmentHistoryUseCase } from '../application/use-cases/AppointmentHistory/UpdateAppointmentHistoryUseCase';
import { DeleteAppointmentHistoryUseCase } from '../application/use-cases/AppointmentHistory/DeleteAppointmentHistoryUseCase';
import { AppointmentCompletedUseCase } from '../application/use-cases/AppointmentHistory/AppointmentCompletedUseCase';

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

// Services
const userAuthService = new UserAuthService(userRepository, authRepository);

// Use Cases - Doctor
const getDoctorsListUseCase = new GetDoctorsListUseCase(doctorRepository);
const getDoctorUseCase = new GetDoctorUseCase(doctorRepository);
const deleteDoctorByIdUseCase = new DeleteDoctorByIdUseCase(doctorRepository);
const updateDoctorByIdUseCase = new UpdateDoctorByIdUseCase(doctorRepository);

// Use Cases - Medical File (without createMedicalFile for now)
const getMedicalFileUseCase = new GetMedicalFileUseCase(medicalFileRepository);
const updateMedicalFileUseCaseInstance = new UpdateMedicalFileUseCase(medicalFileRepository);
const deleteMedicalFileUseCase = new DeleteMedicalFileUseCase(medicalFileRepository);

// Use Cases - Patient
const getPatientByIdUseCase = new GetPatientByIdUseCase(patientRepository);
const deletePatientByIdUseCase = new DeletePatientByIdUseCase(patientRepository);
const getAllPatientsUseCase = new GetAllPatientsUseCase(patientRepository);
const updatePatientUseCase = new UpdatePatientUseCase(patientRepository);

// Create medical file use case (depends on patient use cases)
const createMedicalFileUseCaseInstance = new createMedicalFileUseCase(
    medicalFileRepository,
    updatePatientUseCase,
    patientRepository
);

// Add patient use case (depends on createMedicalFileUseCase)
const addPatientUseCase = new AddPatientUseCase(patientRepository, createMedicalFileUseCaseInstance);

// Use Cases - Appointment
const addAppointementUseCase = new AddAppointementUseCase(appointementRepository);
const getAppointementsUseCase = new GetAppointementsUseCase(appointementRepository);
const getAppointmentsByDoctorUseCase = new GetAppointmentsByDoctorUseCase(appointementRepository);
const getAppointementsByPatientUseCase = new GetAppointementsByPatientUseCase(appointementRepository);
const deleteAppointementUseCaseInstance = new deleteAppointementUseCase(appointementRepository);

// Use Cases - Room
const createRoomUseCase = new CreateRoom(roomRepository);
const getRoomByIdUseCase = new GetRoomById(roomRepository);
const getAllRoomsUseCase = new GetAllRooms(roomRepository);
const getAvailableRoomsUseCase = new GetAvailableRooms(roomRepository);
const updateRoomUseCase = new UpdateRoom(roomRepository);
const deleteRoomUseCase = new DeleteRoom(roomRepository);
const updateRoomAvailabilityUseCase = new UpdateRoomAvailability(roomRepository);
// Use Cases - Machines
const createMachineUseCase = new CreateMachineUseCase(machineRepository);
const getAllMachinesUseCase = new GetAllMachinesUseCase(machineRepository);
const getMachineByIdUseCase = new GetMachineByIdUseCase(machineRepository);
const updateMachineUseCase = new UpdateMachineUseCase(machineRepository);
const deactivateMachineUseCase = new DeactivateMachineUseCase(machineRepository);
const getMachineStatsUseCase = new GetMachineStatsUseCase(machineRepository);

// Use Cases - Appointment History
const getAppointmentHistoryUseCase = new GetAppointmentHistoryforPatientUseCase(appointmentHistoryRepository, appointementRepository);
const getHistoriesByPatientUseCase = new GetHistoriesByPatientUseCase(appointmentHistoryRepository);
const updateAppointmentHistoryUseCase = new UpdateAppointmentHistoryUseCase(appointmentHistoryRepository);
const deleteAppointmentHistoryUseCase = new DeleteAppointmentHistoryUseCase(appointmentHistoryRepository);
const appointmentCompletedUseCase = new AppointmentCompletedUseCase(
    appointmentHistoryRepository,
    medicalFileRepository,
    getMedicalFileUseCase,
    createMedicalFileUseCaseInstance
);

// Controllers
export const authController = new AuthController(userAuthService);
export const doctorController = new DoctorController(
    getDoctorsListUseCase,
    deleteDoctorByIdUseCase,
    getDoctorUseCase,
    updateDoctorByIdUseCase
);
export const patientController = new PatientController(
    addPatientUseCase,
    getPatientByIdUseCase,
    deletePatientByIdUseCase,
    getAllPatientsUseCase,
    updatePatientUseCase
);
export const userController = new UserController(userAuthService);
export const appointementController = new AppointementController(
    addAppointementUseCase,
    getAppointementsUseCase,
    getAppointmentsByDoctorUseCase,
    getAppointementsByPatientUseCase,
    deleteAppointementUseCaseInstance,
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
    deactivateMachineUseCase
    , getMachineStatsUseCase
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
}

export const container = new Container();

// Register all controllers
container.register('authController', authController);
container.register('doctorController', doctorController);
container.register('patientController', patientController);
container.register('userController', userController);
container.register('appointementController', appointementController);
container.register('medicalFileController', medicalFileController);
container.register('roomController', roomController);
container.register('machineController', machineController);
