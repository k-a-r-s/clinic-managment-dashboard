import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { AuthModule } from "./features/auth";
import { Sidebar } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar";
import { PatientsList } from "./features/patients/pages/PatientsList";
import { RegisterPatient } from "./features/patients/pages/RegisterPatient";
import { PatientProfile } from "./features/patients/pages/PatientProfile";
import { UsersList } from "./features/users/pages/UsersList";
import { AddUser } from "./features/users/pages/AddUser";
import { UserProfile } from "./features/users/pages/UserProfile";
import { AppointmentsList } from "./features/appointments/pages/AppointmentsList";
import { CreateAppointment } from "./features/appointments/pages/CreateAppointment";
import { AppointmentDetails } from "./features/appointments/pages/AppointmentDetails";
import { CalendarView } from "./features/appointments/pages/CalendarView";
import { DoctorAvailability } from "./features/appointments/pages/DoctorAvailability";
import { DashboardPage } from "./features/dashboard/pages/DashboardPage";
import { PrescriptionsPage } from "./features/prescriptions/pages/PrescriptionsPage";
import { CreatePrescription } from "./features/prescriptions/pages/CreatePrescription";
import { PrescriptionDetails } from "./features/prescriptions/pages/PrescriptionDetails";
import { MachinesPage } from "./features/machines/pages/MachinesPage";
import { CreateMachine } from "./features/machines/pages/CreateMachine";
import { RoomsPage } from "./features/rooms/pages/RoomsPage";
import { CreateRoom } from "./features/rooms/pages/CreateRoom";
import { DialysisManagement } from "./features/dialysis/pages/DialysisManagement";
import { ViewProtocolPage } from "./features/dialysis/pages/ViewProtocolPage";
import { AddSessionPage } from "./features/dialysis/pages/AddSessionPage";
import { AddPatientToDialysis } from "./features/dialysis/pages/AddPatientToDialysis";
import { SessionsManagementPage } from "./features/dialysis/pages/SessionsManagementPage";
import { SettingsPage } from "./features/settings/pages/SettingsPage";

type PageType =
  | "dashboard"
  | "prescription"
  | "create-prescription"
  | "prescription-details"
  | "machines-management"
  | "settings"
  | "add-user"
  | "patients-list"
  | "register-patient"
  | "patient-details"
  | "users-list"
  | "add-user-page"
  | "user-details"
  | "appointments-list"
  | "create-appointment"
  | "appointment-details"
  | "calendar-view"
  | "doctor-availability"
  | "rooms"
  | "create-room"
  | "create-machine"
  | "dialysis-management"
  | "view-protocol"
  | "sessions-management"
  | "add-session"
  | "add-patient-dialysis";

function App() {
  const { user, logout } = useAuth(); // use context instead of local isAuthenticated
  const [currentPage, setCurrentPage] = useState<PageType>("patients-list");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<
    string | null
  >(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(
    null
  );
  const [selectedDialysisPatientId, setSelectedDialysisPatientId] = useState<
    string | null
  >(null);
  const [selectedDialysisPatientName, setSelectedDialysisPatientName] =
    useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleViewPatient = (patientId: number) => {
    setSelectedPatientId(patientId.toString());
    setIsEditMode(false);
    setCurrentPage("patient-details");
  };

  const handleEditPatient = (patientId: number) => {
    setSelectedPatientId(patientId.toString());
    setIsEditMode(true);
    setCurrentPage("patient-details");
  };

  const handleRegisterNew = () => {
    setCurrentPage("register-patient");
  };

  const handleBackToList = () => {
    setCurrentPage("patients-list");
    setSelectedPatientId(null);
    setIsEditMode(false);
  };

  const handleSavePatient = () => {
    setCurrentPage("patients-list");
  };

  const handleDeletePatient = () => {
    console.log("Deleting patient:", selectedPatientId);
    setCurrentPage("patients-list");
    setSelectedPatientId(null);
    setIsEditMode(false);
  };

  // User handlers
  const handleViewUser = (userId: string) => {
    setSelectedDoctorId(userId);
    setIsEditMode(false);
    setCurrentPage("user-details");
  };

  const handleEditUser = (userId: string) => {
    setSelectedDoctorId(userId);
    setIsEditMode(true);
    setCurrentPage("user-details");
  };

  const handleAddUser = () => {
    setCurrentPage("add-user-page");
  };

  const handleBackToUsersList = () => {
    setCurrentPage("users-list");
    setSelectedDoctorId(null);
    setIsEditMode(false);
  };

  const handleSaveUser = () => {
    setCurrentPage("users-list");
  };

  const handleDeleteUser = () => {
    console.log("Deleting user:", selectedDoctorId);
    setCurrentPage("users-list");
    setSelectedDoctorId(null);
    setIsEditMode(false);
  };

  const handleViewAppointment = (appointmentId: number) => {
    setSelectedAppointmentId(appointmentId);
    setIsEditMode(false);
    setCurrentPage("appointment-details");
  };

  const handleEditAppointment = (appointmentId: number) => {
    setSelectedAppointmentId(appointmentId);
    setIsEditMode(true);
    setCurrentPage("appointment-details");
  };

  const handleCreateAppointment = () => {
    setCurrentPage("create-appointment");
  };

  const handleViewCalendar = () => {
    setCurrentPage("calendar-view");
  };

  const handleBackToAppointmentsList = () => {
    setCurrentPage("appointments-list");
    setSelectedAppointmentId(null);
    setIsEditMode(false);
  };

  const handleSaveAppointment = () => {
    setCurrentPage("appointments-list");
  };

  const handleDeleteAppointment = () => {
    console.log("Deleting appointment:", selectedAppointmentId);
    setCurrentPage("appointments-list");
    setSelectedAppointmentId(null);
    setIsEditMode(false);
  };

  // Prescription handlers
  const handleViewPrescription = (prescriptionId: string) => {
    setSelectedPrescriptionId(prescriptionId);
    setCurrentPage("prescription-details");
  };

  const handleEditPrescription = (prescriptionId: string) => {
    setSelectedPrescriptionId(prescriptionId);
    setCurrentPage("create-prescription");
  };

  const handleCreatePrescription = () => {
    setCurrentPage("create-prescription");
  };

  const handleBackToPrescriptionsList = () => {
    setCurrentPage("prescription");
    setSelectedPrescriptionId(null);
  };

  const handleSavePrescription = (prescriptionId: string) => {
    // Navigate to prescription details after creation
    setSelectedPrescriptionId(prescriptionId);
    setCurrentPage("prescription-details");
  };

  const handleDeletePrescription = () => {
    console.log("Deleting prescription:", selectedPrescriptionId);
    setCurrentPage("prescription");
    setSelectedPrescriptionId(null);
  };

  if (!user) {
    return <AuthModule />;
  }

  // Room handlers
  const handleCreateRoom = () => {
    setSelectedRoomId(null);
    setCurrentPage("create-room");
  };

  const handleEditRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setCurrentPage("create-room");
  };

  const handleBackToRooms = () => {
    setSelectedRoomId(null);
    setCurrentPage("rooms");
  };

  const handleSaveRoom = () => {
    setSelectedRoomId(null);
    setCurrentPage("rooms");
  };

  // Machine handlers
  const handleCreateMachine = () => {
    setSelectedMachineId(null);
    setCurrentPage("create-machine");
  };

  const handleEditMachine = (machineId: string) => {
    setSelectedMachineId(machineId);
    setCurrentPage("create-machine");
  };

  const handleBackToMachines = () => {
    setSelectedMachineId(null);
    setCurrentPage("machines-management");
  };

  const handleSaveMachine = () => {
    setSelectedMachineId(null);
    setCurrentPage("machines-management");
  };

  // Dialysis handlers
  const handleViewProtocol = (
    dialysisPatientId: string,
    patientName: string
  ) => {
    setSelectedDialysisPatientId(dialysisPatientId);
    setSelectedDialysisPatientName(patientName);
    setCurrentPage("view-protocol");
  };

  const handleViewSessions = (
    dialysisPatientId: string,
    patientName: string
  ) => {
    setSelectedDialysisPatientId(dialysisPatientId);
    setSelectedDialysisPatientName(patientName);
    setCurrentPage("sessions-management");
  };

  const handleAddSessionFromSessions = () => {
    setCurrentPage("add-session");
  };

  const handleAddPatientToDialysis = () => {
    setCurrentPage("add-patient-dialysis");
  };

  const handleBackToDialysis = () => {
    setSelectedDialysisPatientId(null);
    setSelectedDialysisPatientName("");
    setCurrentPage("dialysis-management");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage as any}
        onNavigate={setCurrentPage as any}
        collapsed={sidebarCollapsed}
        onLogout={() => logout()}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <TopBar
          onLogout={() => logout()}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onNavigate={setCurrentPage}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {currentPage === "patients-list" && (
            <PatientsList
              onViewPatient={handleViewPatient}
              onEditPatient={handleEditPatient}
              onRegisterNew={handleRegisterNew}
            />
          )}

          {currentPage === "register-patient" && (
            <RegisterPatient
              onCancel={handleBackToList}
              onSuccess={handleSavePatient}
            />
          )}

          {currentPage === "patient-details" && selectedPatientId && (
            <PatientProfile
              patientId={selectedPatientId}
              initialEditMode={isEditMode}
              onBack={handleBackToList}
              onDeleted={handleDeletePatient}
            />
          )}

          {currentPage === "users-list" && (
            <UsersList
              onViewUser={handleViewUser}
              onEditUser={handleEditUser}
              onAddNew={handleAddUser}
            />
          )}

          {currentPage === "add-user-page" && (
            <AddUser
              onCancel={handleBackToUsersList}
              onSuccess={handleSaveUser}
            />
          )}

          {currentPage === "user-details" && selectedDoctorId && (
            <UserProfile
              userId={selectedDoctorId}
              initialEditMode={isEditMode}
              onBack={handleBackToUsersList}
              onDeleted={handleDeleteUser}
            />
          )}

          {currentPage === "appointments-list" && (
            <AppointmentsList
              onViewAppointment={handleViewAppointment}
              onEditAppointment={handleEditAppointment}
              onCreate={handleCreateAppointment}
              onViewCalendar={handleViewCalendar}
            />
          )}

          {currentPage === "create-appointment" && (
            <CreateAppointment
              onCancel={handleBackToAppointmentsList}
              onSuccess={handleSaveAppointment}
            />
          )}

          {currentPage === "appointment-details" && selectedAppointmentId && (
            <AppointmentDetails
              appointmentId={selectedAppointmentId}
              initialEditMode={isEditMode}
              onBack={handleBackToAppointmentsList}
              onDeleted={handleDeleteAppointment}
            />
          )}

          {currentPage === "calendar-view" && (
            <CalendarView
              onViewAppointment={handleViewAppointment}
              onCreate={handleCreateAppointment}
              onBackToList={handleBackToAppointmentsList}
            />
          )}

          {currentPage === "doctor-availability" && <DoctorAvailability />}

          {/* Dashboard */}
          {currentPage === "dashboard" && <DashboardPage />}

          {/* Prescriptions */}
          {currentPage === "prescription" && (
            <PrescriptionsPage
              onViewPrescription={handleViewPrescription}
              onEditPrescription={handleEditPrescription}
              onCreateNew={handleCreatePrescription}
            />
          )}

          {currentPage === "create-prescription" && (
            <CreatePrescription
              prescriptionId={selectedPrescriptionId || undefined}
              onCancel={handleBackToPrescriptionsList}
              onSuccess={handleSavePrescription}
            />
          )}

          {currentPage === "prescription-details" && selectedPrescriptionId && (
            <PrescriptionDetails
              prescriptionId={selectedPrescriptionId}
              onBack={handleBackToPrescriptionsList}
              onEdit={handleEditPrescription}
              onDeleted={handleDeletePrescription}
            />
          )}

          {/* Machines Management */}
          {currentPage === "machines-management" && (
            <MachinesPage
              onCreateNew={handleCreateMachine}
              onEditMachine={handleEditMachine}
            />
          )}

          {/* Create/Edit Machine */}
          {currentPage === "create-machine" && (
            <CreateMachine
              machineId={selectedMachineId || undefined}
              onCancel={handleBackToMachines}
              onSuccess={handleSaveMachine}
            />
          )}

          {/* Dialysis Management */}
          {currentPage === "dialysis-management" && (
            <DialysisManagement
              onViewProtocol={handleViewProtocol}
              onAddSession={handleViewSessions}
              onAddPatient={handleAddPatientToDialysis}
            />
          )}

          {/* View Protocol */}
          {currentPage === "view-protocol" && selectedDialysisPatientId && (
            <ViewProtocolPage
              dialysisPatientId={selectedDialysisPatientId}
              patientName={selectedDialysisPatientName}
              onBack={handleBackToDialysis}
            />
          )}

          {/* Add Patient to Dialysis */}
          {currentPage === "add-patient-dialysis" && (
            <AddPatientToDialysis
              onBack={handleBackToDialysis}
              onSuccess={handleBackToDialysis}
            />
          )}

          {/* Sessions Management */}
          {currentPage === "sessions-management" &&
            selectedDialysisPatientId && (
              <SessionsManagementPage
                dialysisPatientId={selectedDialysisPatientId}
                patientName={selectedDialysisPatientName}
                onBack={handleBackToDialysis}
                onAddSession={handleAddSessionFromSessions}
              />
            )}

          {/* Add Session */}
          {currentPage === "add-session" && selectedDialysisPatientId && (
            <AddSessionPage
              dialysisPatientId={selectedDialysisPatientId}
              patientName={selectedDialysisPatientName}
              onBack={() => setCurrentPage("sessions-management")}
              onSuccess={() => setCurrentPage("sessions-management")}
            />
          )}

          {/* Rooms Management */}
          {currentPage === "rooms" && (
            <RoomsPage
              onCreateNew={handleCreateRoom}
              onEditRoom={handleEditRoom}
            />
          )}

          {currentPage === "create-room" && (
            <CreateRoom
              roomId={selectedRoomId || undefined}
              onCancel={handleBackToRooms}
              onSuccess={handleSaveRoom}
            />
          )}

          {/* Add User */}
          {currentPage === "add-user" && <AddUser />}

          {/* Settings */}
          {currentPage === "settings" && <SettingsPage />}

          {/* Placeholder for other pages */}
          {![
            "dashboard",
            "prescription",
            "create-prescription",
            "prescription-details",
            "machines-management",
            "dialysis-management",
            "view-protocol",
            "add-patient-dialysis",
            "sessions-management",
            "add-session",
            "patients-list",
            "register-patient",
            "patient-details",
            "users-list",
            "add-user-page",
            "user-details",
            "appointments-list",
            "create-appointment",
            "appointment-details",
            "calendar-view",
            "doctor-availability",
            "add-user",
            "rooms",
            "create-room",
            "create-machine",
            "settings",
          ].includes(currentPage) && (
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {currentPage
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </h1>
              <p className="text-gray-600">This page is coming soon.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
