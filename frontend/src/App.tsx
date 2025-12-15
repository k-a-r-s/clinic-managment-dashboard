import { useState, useEffect } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar";
import { PatientsList } from "./features/patients/pages/PatientsList";
import { RegisterPatient } from "./features/patients/pages/RegisterPatient";
import { PatientProfile } from "./features/patients/pages/PatientProfile";
import { DoctorsList } from "./features/doctors/pages/DoctorsList";
import { AddDoctor } from "./features/doctors/pages/AddDoctor";
import { DoctorProfile } from "./features/doctors/pages/DoctorProfile";
import { AppointmentsList } from "./features/appointments/pages/AppointmentsList";
import { CreateAppointment } from "./features/appointments/pages/CreateAppointment";
import { AppointmentDetails } from "./features/appointments/pages/AppointmentDetails";
import { CalendarView } from "./features/appointments/pages/CalendarView";
import { DoctorAvailability } from "./features/appointments/pages/DoctorAvailability";
import { useAuth } from "./context/AuthContext";
import { AuthModule } from "./features/auth";


type PageType =
  | "dialysis-management"
  | "lab-request"
  | "prescription"
  | "machines-management"
  | "billing"
  | "settings"
  | "add-user"
  | "roles-permissions"
  | "patients-list"
  | "register-patient"
  | "patient-details"
  | "doctors-list"
  | "add-doctor"
  | "doctor-details"
  | "appointments-list"
  | "create-appointment"
  | "appointment-details"
  | "calendar-view"
  | "doctor-availability";

function App() {  
  const { user, logout } = useAuth(); // use context instead of local isAuthenticated
  const [currentPage, setCurrentPage] = useState<PageType>("patients-list");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleViewPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setIsEditMode(false);
    setCurrentPage("patient-details");
  };

  const handleEditPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
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

  const handleViewDoctor = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setIsEditMode(false);
    setCurrentPage("doctor-details");
  };

  const handleEditDoctor = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setIsEditMode(true);
    setCurrentPage("doctor-details");
  };

  const handleAddDoctor = () => {
    setCurrentPage("add-doctor");
  };

  const handleBackToDoctorsList = () => {
    setCurrentPage("doctors-list");
    setSelectedDoctorId(null);
    setIsEditMode(false);
  };

  const handleSaveDoctor = () => {
    setCurrentPage("doctors-list");
  };

  const handleDeleteDoctor = () => {
    console.log("Deleting doctor:", selectedDoctorId);
    setCurrentPage("doctors-list");
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

  if (!user) {
    return <AuthModule />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage as any}
        onNavigate={setCurrentPage as any}
        collapsed={sidebarCollapsed}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <TopBar
          onLogout={logout}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
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

          {currentPage === "doctors-list" && (
            <DoctorsList
              onViewDoctor={handleViewDoctor}
              onEditDoctor={handleEditDoctor}
              onAddNew={handleAddDoctor}
            />
          )}

          {currentPage === "add-doctor" && (
            <AddDoctor
              onCancel={handleBackToDoctorsList}
              onSuccess={handleSaveDoctor}
            />
          )}

          {currentPage === "doctor-details" && selectedDoctorId && (
            <DoctorProfile
              doctorId={selectedDoctorId}
              initialEditMode={isEditMode}
              onBack={handleBackToDoctorsList}
              onDeleted={handleDeleteDoctor}
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

          {/* Placeholder for other pages */}
          {![
            "patients-list",
            "register-patient",
            "patient-details",
            "doctors-list",
            "add-doctor",
            "doctor-details",
            "appointments-list",
            "create-appointment",
            "appointment-details",
            "calendar-view",
            "doctor-availability",
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
