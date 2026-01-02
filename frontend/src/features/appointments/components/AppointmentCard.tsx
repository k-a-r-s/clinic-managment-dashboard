import {
  Edit,
  Save,
  X,
  Trash2,
  Calendar,
  Clock,
  User,
  UserCheck,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { Badge } from "../../../components/ui/badge";
import { FormCard } from "../../../components/shared/FormCard";
import { PageHeader } from "../../../components/shared/PageHeader";
import type { Appointment, AppointmentFormData } from "../../../types";

interface AppointmentCardProps {
  appointment: Appointment;
  isEditMode: boolean;
  formData: AppointmentFormData;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onFormChange: (
    field: keyof AppointmentFormData,
    value: string | number
  ) => void;
  doctors?: Array<{ id: string; name: string }>;
  patients?: Array<{ id: string; name: string }>;
  rooms?: Array<{ id: string; roomNumber: string }>;
}

const getStatusBadge = (status?: string) => {
  switch (status) {
    case "SCHEDULED":
      return (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200">
          Scheduled
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge className="bg-green-50 text-green-700 border-green-200">
          Completed
        </Badge>
      );
    case "CANCELED":
      return (
        <Badge className="bg-red-50 text-red-700 border-red-200">
          Canceled
        </Badge>
      );
    case "NO_SHOW":
      return (
        <Badge className="bg-orange-50 text-orange-700 border-orange-200">
          No Show
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-600">
          Unknown
        </Badge>
      );
  }
};

export function AppointmentCard({
  appointment,
  isEditMode,
  formData,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onFormChange,
  doctors = [],
  patients = [],
  rooms = [],
}: AppointmentCardProps) {
  return (
    <>
      <PageHeader
        title={`Appointment Details — #${appointment.id}`}
        actions={
          isEditMode ? (
            <>
              <Button
                variant="outline"
                onClick={onCancel}
                className="gap-2 bg-white border-gray-200"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                onClick={onSave}
                className="gap-2 bg-[#1C8CA8] hover:bg-[#157A93]"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={onDelete}
                className="gap-2 bg-white border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4" />
                Delete Appointment
              </Button>
              <Button
                onClick={onEdit}
                className="gap-2 bg-[#1C8CA8] hover:bg-[#157A93]"
              >
                <Edit className="w-4 h-4" />
                Edit Appointment
              </Button>
            </>
          )
        }
      />

      <FormCard title="Appointment Information">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            {isEditMode ? (
              <Input
                id="date"
                type="date"
                value={formData.appointmentDate}
                onChange={(e) =>
                  onFormChange("appointmentDate", e.target.value)
                }
              />
            ) : (
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <p className="text-sm text-gray-900">
                  {new Date(appointment.appointmentDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            {isEditMode ? (
              <Input
                id="duration"
                type="number"
                value={formData.estimatedDurationInMinutes}
                onChange={(e) =>
                  onFormChange(
                    "estimatedDurationInMinutes",
                    parseInt(e.target.value) || 30
                  )
                }
              />
            ) : (
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                <p className="text-sm text-gray-900">
                  {appointment.estimatedDurationInMinutes} min
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            {isEditMode ? (
              <Select
                value={formData.status}
                onValueChange={(value) => onFormChange("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELED">Canceled</SelectItem>
                  <SelectItem value="NO_SHOW">No Show</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                {getStatusBadge(appointment.status)}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctor">Doctor</Label>
            {isEditMode ? (
              <Select
                value={formData.doctorId}
                onValueChange={(value) => onFormChange("doctorId", value)}
              >
                <SelectTrigger id="doctor">
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                <UserCheck className="w-4 h-4 mr-2 text-gray-400" />
                <p className="text-sm text-gray-900">
                  {appointment.doctor
                    ? `${appointment.doctor.firstName} ${appointment.doctor.lastName}`
                    : "N/A"}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="patient">Patient</Label>
            {isEditMode ? (
              <Select
                value={formData.patientId}
                onValueChange={(value) => onFormChange("patientId", value)}
              >
                <SelectTrigger id="patient">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-400" />
                <p className="text-sm text-gray-900">
                  {appointment.patient
                    ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
                    : "N/A"}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="room">Room Number</Label>
            {isEditMode ? (
              <Select
                value={formData.roomId}
                onValueChange={(value) => onFormChange("roomId", value)}
              >
                <SelectTrigger id="room">
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.roomNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                <p className="text-sm text-gray-900">
                  {appointment.room ? appointment.room.roomNumber : "N/A"}
                </p>
              </div>
            )}
          </div>
        </div>
      </FormCard>
    </>
  );
}
