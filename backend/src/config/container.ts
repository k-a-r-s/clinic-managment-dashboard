import { UserAuthService } from '../application/services/UserAuthService';
import { AuthRepository } from '../infrastructure/repositories/AuthRepository';
import { DoctorRepository } from '../infrastructure/repositories/DoctorRepository';
import { MedicalFileRepository } from '../infrastructure/repositories/MedicalFileRepository';
import { PatientRepository } from '../infrastructure/repositories/PatientRepository';
import { UserRepository } from '../infrastructure/repositories/UserRepository';
import { AppointementRepository } from '../infrastructure/repositories/AppointementRepository';

// Controllers
import { AuthController } from '../interface/controllers/authController';
import { DoctorController } from '../interface/controllers/doctorController';
import { PatientController } from '../interface/controllers/patientController';
import { UserController } from '../interface/controllers/userController';
import { AppointementController } from '../interface/controllers/appointmentController';

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

// Use Cases - Medical File
import { createMedicalFileUseCase } from '../application/use-cases/medicalFile/createMedicalFIleUseCase';

// Use Cases - Appointment
import { AddAppointementUseCase } from '../application/use-cases/appointement/AddAppointementUseCase';
import { GetAppointementsUseCase } from '../application/use-cases/appointement/GetAppointementsUseCase';
import { GetAppointmentsByDoctorUseCase } from '../application/use-cases/appointement/GetAppointmentsByDoctorUseCase';
import { GetAppointementsByPatientUseCase } from '../application/use-cases/appointement/GetAppointementsByPatientUseCase';
import { deleteAppointementUseCase } from '../application/use-cases/appointement/DeleteAppointmentUseCase';

// Repositories
const authRepository = new AuthRepository();
const doctorRepository = new DoctorRepository();
const medicalFileRepository = new MedicalFileRepository();
const patientRepository = new PatientRepository();
const userRepository = new UserRepository();
const appointementRepository = new AppointementRepository();

// Services
const userAuthService = new UserAuthService(userRepository, authRepository);

// Use Cases - Doctor
const getDoctorsListUseCase = new GetDoctorsListUseCase(doctorRepository);
const getDoctorUseCase = new GetDoctorUseCase(doctorRepository);
const deleteDoctorByIdUseCase = new DeleteDoctorByIdUseCase(doctorRepository);
const updateDoctorByIdUseCase = new UpdateDoctorByIdUseCase(doctorRepository);

// Use Cases - Medical File
const createMedicalFileUseCaseInstance = new createMedicalFileUseCase(medicalFileRepository);

// Use Cases - Patient
const getPatientByIdUseCase = new GetPatientByIdUseCase(patientRepository);
const addPatientUseCase = new AddPatientUseCase(patientRepository, createMedicalFileUseCaseInstance);
const deletePatientByIdUseCase = new DeletePatientByIdUseCase(patientRepository);
const getAllPatientsUseCase = new GetAllPatientsUseCase(patientRepository);

// Use Cases - Appointment
const addAppointementUseCase = new AddAppointementUseCase(appointementRepository);
const getAppointementsUseCase = new GetAppointementsUseCase(appointementRepository);
const getAppointmentsByDoctorUseCase = new GetAppointmentsByDoctorUseCase(appointementRepository);
const getAppointementsByPatientUseCase = new GetAppointementsByPatientUseCase(appointementRepository);
const deleteAppointementUseCaseInstance = new deleteAppointementUseCase(appointementRepository);

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
    getAllPatientsUseCase
);
export const userController = new UserController(userAuthService);
export const appointementController = new AppointementController(
    addAppointementUseCase,
    getAppointementsUseCase,
    getAppointmentsByDoctorUseCase,
    getAppointementsByPatientUseCase,
    deleteAppointementUseCaseInstance
);
