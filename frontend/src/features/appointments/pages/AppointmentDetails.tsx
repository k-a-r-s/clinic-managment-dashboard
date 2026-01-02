import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { Loader } from "../../../components/shared/Loader";
import { toast } from "react-hot-toast";
import { AppointmentCard } from "../components/AppointmentCard";
import {
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "../api/appointments.api";
import { getDoctors } from "../../doctors/api/doctors.api";
import { getPatients } from "../../patients/api/patients.api";
import { getRooms } from "../../rooms/api/rooms.api";
import type { Appointment, AppointmentFormData } from "../../../types";

interface AppointmentDetailsProps {
  appointmentId: string;
  initialEditMode?: boolean;
  onBack?: () => void;
  onDeleted?: () => void;
}

export function AppointmentDetails({
  appointmentId,
  initialEditMode = false,
  onBack,
  onDeleted,
}: AppointmentDetailsProps) {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isEditMode, setIsEditMode] = useState(initialEditMode);
  const [isLoading, setIsLoading] = useState(true);
  const [doctors, setDoctors] = useState<Array<{ id: string; name: string }>>(
    []
  );
  const [patients, setPatients] = useState<Array<{ id: string; name: string }>>(
    []
  );
  const [rooms, setRooms] = useState<Array<{ id: string; roomNumber: string }>>(
    []
  );
  const [formData, setFormData] = useState<AppointmentFormData>({
    patientId: "",
    doctorId: "",
    roomId: "",
    appointmentDate: "",
    estimatedDurationInMinutes: 30,
    status: "SCHEDULED",
  });

  useEffect(() => {
    loadData();
  }, [appointmentId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [appointmentData, doctorsData, patientsData, roomsData] =
        await Promise.all([
          getAppointmentById(appointmentId),
          getDoctors(),
          getPatients(),
          getRooms(),
        ]);

      setAppointment(appointmentData);
      setDoctors(
        doctorsData.map((d) => ({
          id: d.id,
          name: `${d.firstName} ${d.lastName}`,
        }))
      );
      setPatients(
        patientsData.map((p) => ({
          id: p.id,
          name: `${p.firstName} ${p.lastName}`,
        }))
      );
      setRooms(
        roomsData.map((r) => ({
          id: r.id,
          roomNumber: r.roomNumber,
        }))
      );

      // Format date for input (YYYY-MM-DD)
      const appointmentDate = new Date(appointmentData.appointmentDate);
      const formattedDate = appointmentDate.toISOString().split("T")[0];

      setFormData({
        patientId: appointmentData.patientId || "",
        doctorId: appointmentData.doctorId || "",
        roomId: appointmentData.roomId || "",
        appointmentDate: formattedDate,
        estimatedDurationInMinutes:
          appointmentData.estimatedDurationInMinutes || 30,
        status: appointmentData.status || "SCHEDULED",
      });
    } catch (error) {
      console.error("Failed to load appointment:", error);
      toast.error("Failed to load appointment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateAppointment(appointmentId, formData);
      toast.success("Appointment updated successfully");
      await loadData();
      setIsEditMode(false);
    } catch (error) {
      console.error("Failed to update appointment:", error);
      toast.error("Failed to update appointment");
    }
  };

  const handleCancel = () => {
    if (appointment) {
      // Format date for input (YYYY-MM-DD)
      const appointmentDate = new Date(appointment.appointmentDate);
      const formattedDate = appointmentDate.toISOString().split("T")[0];

      // Reset form data to original values
      setFormData({
        patientId: appointment.patientId || "",
        doctorId: appointment.doctorId || "",
        roomId: appointment.roomId || "",
        appointmentDate: formattedDate,
        estimatedDurationInMinutes:
          appointment.estimatedDurationInMinutes || 30,
        status: appointment.status || "SCHEDULED",
      });
    }
    setIsEditMode(false);
  };

  const handleDelete = async () => {
    if (!appointment) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete this appointment? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        await deleteAppointment(appointmentId);
        toast.success("Appointment deleted successfully");
        if (onDeleted) {
          onDeleted();
        }
      } catch (error) {
        console.error("Failed to delete appointment:", error);
        toast.error("Failed to delete appointment");
      }
    }
  };

  const handleFormChange = (
    field: keyof AppointmentFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading || !appointment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={onBack}>Appointments</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Appointment Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <AppointmentCard
        appointment={appointment}
        isEditMode={isEditMode}
        formData={formData}
        onEdit={() => setIsEditMode(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={handleDelete}
        onFormChange={handleFormChange}
        doctors={doctors}
        patients={patients}
        rooms={rooms}
      />
    </div>
  );
}
