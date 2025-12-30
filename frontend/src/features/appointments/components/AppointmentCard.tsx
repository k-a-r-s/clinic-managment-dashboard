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
import type {
  AppointmentWithDetails,
  AppointmentFormData,
} from "../../../types";

interface AppointmentCardProps {
  appointment: AppointmentWithDetails;
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
  rooms?: Array<{ id: string; name: string }>;
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
    default:
      return <Badge variant="outline">Unknown</Badge>;
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
  rooms = []
}: AppointmentCardProps) {

  const getRoomNameById = (roomId?: string) => {
    return rooms.find((r) => r.id === roomId)?.name ?? "—";
  };

  return (
    <>
      <PageHeader
        title={`Appointment Details — #${appointment.id}`}
        actions={
          isEditMode ? (
            <>
              <Button variant="outline" onClick={onCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={onSave} className="bg-[#1C8CA8]">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={onDelete}
                className="text-red-600 border-red-200"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Button onClick={onEdit} className="bg-[#1C8CA8]">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </>
          )
        }
      />

      <FormCard title="Appointment Information">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* DATE */}
          <div className="space-y-2">
            <Label>Date</Label>
            {isEditMode ? (
              <Input
                type="date"
                value={formData.appointmentDate}
                onChange={(e) =>
                  onFormChange("appointmentDate", e.target.value)
                }
              />
            ) : (
              <div className="bg-gray-50 h-9 px-3 flex items-center rounded">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                {appointment.appointmentDate?.split("T")[0]}
              </div>
            )}
          </div>

          {/* DURATION */}
          <div className="space-y-2">
            <Label>Duration (minutes)</Label>
            {isEditMode ? (
              <Input
                type="number"
                value={formData.estimatedDurationInMinutes}
                onChange={(e) =>
                  onFormChange(
                    "estimatedDurationInMinutes",
                    Number(e.target.value)
                  )
                }
              />
            ) : (
              <div className="bg-gray-50 h-9 px-3 flex items-center rounded">
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                {appointment.estimatedDurationInMinutes} min
              </div>
            )}
          </div>

          {/* STATUS */}
          <div className="space-y-2">
            <Label>Status</Label>
            {isEditMode ? (
              <Select
                value={formData.status}
                onValueChange={(v) => onFormChange("status", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELED">Canceled</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="bg-gray-50 h-9 px-3 flex items-center rounded">
                {getStatusBadge(appointment.status)}
              </div>
            )}
          </div>

          {/* DOCTOR */}
          <div className="space-y-2">
            <Label>Doctor</Label>
            {isEditMode ? (
              <Select
                value={formData.doctorId}
                onValueChange={(v) => onFormChange("doctorId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="bg-gray-50 h-9 px-3 flex items-center rounded">
                <UserCheck className="w-4 h-4 mr-2 text-gray-400" />
                {appointment.doctor.firstName + " " + appointment.doctor.lastName}
              </div>
            )}
          </div>

          {/* PATIENT */}
          <div className="space-y-2">
            <Label>Patient</Label>
            {isEditMode ? (
              <Select
                value={formData.patientId}
                onValueChange={(v) => onFormChange("patientId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="bg-gray-50 h-9 px-3 flex items-center rounded">
                <User className="w-4 h-4 mr-2 text-gray-400" />
                {appointment.patient.firstName + " " + appointment.patient.lastName}
              </div>
            )}
          </div>

          {/* ROOM */}
          <div className="space-y-2">
            <Label>Room</Label>
            {isEditMode ? (
              <Select
                value={formData.roomId}
                onValueChange={(v) => onFormChange("roomId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="bg-gray-50 h-9 px-3 flex items-center rounded">
                <User className="w-4 h-4 mr-2 text-gray-400" />
                {getRoomNameById(appointment.roomId)}
              </div>
            )}
          </div>

          {/* REASON */}
          <div className="space-y-2 md:col-span-2 lg:col-span-3">
            <Label>Reason</Label>
            {isEditMode ? (
              <Textarea
                value={formData.reason}
                onChange={(e) => onFormChange("reason", e.target.value)}
                className="min-h-[100px]"
              />
            ) : (
              <div className="bg-gray-50 rounded p-3">
                {appointment.reason}
              </div>
            )}
          </div>
        </div>
      </FormCard>
    </>
  );
}
