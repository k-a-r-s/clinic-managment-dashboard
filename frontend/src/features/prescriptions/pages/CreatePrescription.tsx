import { useState, useEffect } from "react";
import { Plus, Trash2, Calendar, User, Stethoscope } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Combobox } from "../../../components/ui/combobox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { PageHeader } from "../../../components/shared/PageHeader";
import {
  createPrescription,
  getPrescriptionById,
  updatePrescription,
} from "../api/prescriptions.api";
import {
  syncPrescriptionToMedicalFile,
  updatePrescriptionInMedicalFile,
} from "../utils/medicalFileSync";
import { getPatientById, updatePatient } from "../../patients/api/patients.api";
import { getAppointments } from "../../appointments/api/appointments.api";
import type {
  PrescriptionFormData,
  PrescriptionMedication,
  Appointment,
} from "../../../types";
import { getPatients } from "../../patients/api/patients.api";
import { getUsers } from "../../users/api/users.api";

interface CreatePrescriptionProps {
  prescriptionId?: string; // If provided, edit mode
  patientId?: string; // Optional, can be pre-selected from patient page
  onCancel?: () => void;
  onSuccess?: (prescriptionId: string) => void;
}

export function CreatePrescription({
  prescriptionId,
  patientId: initialPatientId,
  onCancel,
  onSuccess,
}: CreatePrescriptionProps) {
  const [formData, setFormData] = useState<PrescriptionFormData>({
    patientId: initialPatientId || "",
    doctorId: "",
    appointmentId: "",
    prescriptionDate: new Date().toISOString().split("T")[0],
    medications: [],
  });

  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPatientsAndDoctors();
    loadAppointments();
    if (prescriptionId) {
      loadPrescriptionForEdit();
    }
  }, []);

  const loadPrescriptionForEdit = async () => {
    if (!prescriptionId) return;
    try {
      setIsLoading(true);
      const prescription = await getPrescriptionById(prescriptionId);
      setFormData({
        patientId: prescription.patientId,
        doctorId: prescription.doctorId,
        appointmentId: prescription.appointmentId || "",
        prescriptionDate: prescription.prescriptionDate,
        medications: prescription.medications.map((med) => ({
          medicationName: med.medicationName,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          notes: med.notes || "",
        })),
      });
    } catch (error) {
      console.error("Failed to load prescription:", error);
      setError("Failed to load prescription for editing");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Auto-select appointment when patient and doctor are selected
    if (formData.patientId && formData.doctorId && formData.prescriptionDate) {
      const todayAppointments = appointments.filter((apt) => {
        const aptDate = new Date(apt.appointmentDate || apt.date)
          .toISOString()
          .split("T")[0];
        return (
          apt.patientId?.toString() === formData.patientId &&
          apt.doctorId === formData.doctorId &&
          aptDate === formData.prescriptionDate
        );
      });

      setFilteredAppointments(todayAppointments);

      // Auto-select if there's only one matching appointment
      if (todayAppointments.length === 1) {
        setFormData((prev) => ({
          ...prev,
          appointmentId: todayAppointments[0].id.toString(),
        }));
      } else if (todayAppointments.length === 0) {
        // Clear appointment if no match
        setFormData((prev) => ({
          ...prev,
          appointmentId: "",
        }));
      }
    } else {
      setFilteredAppointments([]);
    }
  }, [
    formData.patientId,
    formData.doctorId,
    formData.prescriptionDate,
    appointments,
  ]);

  const loadPatientsAndDoctors = async () => {
    try {
      const [patientsData, usersData] = await Promise.all([
        getPatients(),
        getUsers(),
      ]);
      setPatients(patientsData);
      setDoctors(usersData.filter((user) => user.role === "doctor"));
    } catch (error) {
      console.error("Failed to load patients and doctors:", error);
    }
  };

  const loadAppointments = async () => {
    try {
      const appointmentsData = await getAppointments();
      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Failed to load appointments:", error);
    }
  };

  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [
        ...formData.medications,
        {
          medicationName: "",
          dosage: "",
          frequency: "",
          duration: "",
          notes: "",
        },
      ],
    });
  };

  const updateMedication = (
    index: number,
    field: keyof PrescriptionMedication,
    value: string
  ) => {
    const updated = [...formData.medications];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, medications: updated });
  };

  const removeMedication = (index: number) => {
    setFormData({
      ...formData,
      medications: formData.medications.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.patientId) {
      setError("Please select a patient");
      return;
    }
    if (!formData.doctorId) {
      setError("Please select a doctor");
      return;
    }
    if (formData.medications.length === 0) {
      setError("Please add at least one medication");
      return;
    }

    // Validate medications
    for (const med of formData.medications) {
      if (
        !med.medicationName ||
        !med.dosage ||
        !med.frequency ||
        !med.duration
      ) {
        setError("Please fill in all required medication fields");
        return;
      }
    }

    setIsLoading(true);
    try {
      // Create or update the prescription
      const prescription = prescriptionId
        ? await updatePrescription(prescriptionId, formData)
        : await createPrescription(formData);

      // Sync medications to patient's medical file
      try {
        const patient = await getPatientById(parseInt(formData.patientId));
        if (patient.medicalFile) {
          const updatedMedicalFile = prescriptionId
            ? updatePrescriptionInMedicalFile(prescription, patient.medicalFile)
            : syncPrescriptionToMedicalFile(prescription, patient.medicalFile);
          // Update the patient with the new medical file
          patient.medicalFile = updatedMedicalFile;
          await updatePatient(patient.id, patient);
        }
      } catch (syncError) {
        console.warn("Failed to sync medications to medical file:", syncError);
        // Don't fail the entire operation if sync fails
      }

      onSuccess?.(prescription.id);
    } catch (error) {
      console.error("Failed to save prescription:", error);
      setError("Failed to save prescription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={onCancel}>Prescriptions</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {prescriptionId ? "Edit Prescription" : "Create New Prescription"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        title={prescriptionId ? "Edit Prescription" : "Create New Prescription"}
        subtitle={
          prescriptionId
            ? "Update prescription medications for the patient"
            : "Add a new prescription with medications for the patient"
        }
      />

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Patient Selection */}
              <div className="space-y-2">
                <Label htmlFor="patient" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Patient *
                </Label>
                <Combobox
                  options={patients.map((patient) => ({
                    value: patient.id.toString(),
                    label: `${patient.firstName} ${patient.lastName} - ID: ${patient.id}`,
                  }))}
                  value={formData.patientId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, patientId: value })
                  }
                  placeholder="Select a patient"
                  searchPlaceholder="Search patients..."
                  emptyMessage="No patients found."
                />
              </div>

              {/* Doctor Selection */}
              <div className="space-y-2">
                <Label htmlFor="doctor" className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Prescribing Doctor *
                </Label>
                <Combobox
                  options={doctors.map((doctor) => ({
                    value: doctor.id,
                    label: `Dr. ${doctor.firstName} ${doctor.lastName}${
                      doctor.specialization ? ` - ${doctor.specialization}` : ""
                    }`,
                  }))}
                  value={formData.doctorId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, doctorId: value })
                  }
                  placeholder="Select a doctor"
                  searchPlaceholder="Search doctors..."
                  emptyMessage="No doctors found."
                />
              </div>

              {/* Prescription Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Prescription Date *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.prescriptionDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      prescriptionDate: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* Appointment Reference */}
              <div className="space-y-2">
                <Label
                  htmlFor="appointment"
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Related Appointment{" "}
                  {filteredAppointments.length > 0 && "(Auto-selected)"}
                </Label>
                {filteredAppointments.length > 0 ? (
                  <>
                    <select
                      id="appointment"
                      value={formData.appointmentId || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          appointmentId: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-green-50"
                    >
                      <option value="">No appointment</option>
                      {filteredAppointments.map((apt) => (
                        <option key={apt.id} value={apt.id.toString()}>
                          #{apt.id} -{" "}
                          {apt.patient
                            ? `${apt.patient.firstName} ${apt.patient.lastName}`
                            : "Unknown"}{" "}
                          with Dr.{" "}
                          {apt.doctor
                            ? `${apt.doctor.firstName} ${apt.doctor.lastName}`
                            : "Unknown"}{" "}
                          at{" "}
                          {new Date(apt.appointmentDate).toLocaleDateString()}
                        </option>
                      ))}
                    </select>
                    {filteredAppointments.length === 1 && (
                      <p className="text-sm text-green-600">
                        ✓ Appointment automatically selected for this patient
                        and doctor on the selected date
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <Input
                      id="appointment"
                      type="text"
                      value={formData.appointmentId || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          appointmentId: e.target.value,
                        })
                      }
                      placeholder="No appointments found for selected patient/doctor/date"
                      disabled
                      className="bg-gray-50"
                    />
                    {formData.patientId &&
                      formData.doctorId &&
                      formData.prescriptionDate && (
                        <p className="text-sm text-gray-500">
                          No appointments found between selected patient and
                          doctor on {formData.prescriptionDate}
                        </p>
                      )}
                  </>
                )}
              </div>

              {/* Medications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">Medications *</Label>
                  <Button
                    type="button"
                    onClick={addMedication}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Medication
                  </Button>
                </div>

                {formData.medications.length === 0 && (
                  <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">
                      No medications added yet. Click "Add Medication" to begin.
                    </p>
                  </div>
                )}

                {formData.medications.map((medication, index) => (
                  <Card key={index} className="border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          Medication #{index + 1}
                        </CardTitle>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMedication(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-2">
                          <Label>Medication Name *</Label>
                          <Input
                            value={medication.medicationName}
                            onChange={(e) =>
                              updateMedication(
                                index,
                                "medicationName",
                                e.target.value
                              )
                            }
                            placeholder="e.g., EPO, Iron Sucrose"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Dosage *</Label>
                          <Input
                            value={medication.dosage}
                            onChange={(e) =>
                              updateMedication(index, "dosage", e.target.value)
                            }
                            placeholder="e.g., 4000 IU"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Frequency *</Label>
                          <Input
                            value={medication.frequency}
                            onChange={(e) =>
                              updateMedication(
                                index,
                                "frequency",
                                e.target.value
                              )
                            }
                            placeholder="e.g., 3 times/week"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Duration *</Label>
                          <Input
                            value={medication.duration}
                            onChange={(e) =>
                              updateMedication(
                                index,
                                "duration",
                                e.target.value
                              )
                            }
                            placeholder="e.g., Ongoing, 2 weeks"
                            required
                          />
                        </div>

                        <div className="col-span-2 space-y-2">
                          <Label>Notes (Optional)</Label>
                          <Textarea
                            value={medication.notes || ""}
                            onChange={(e) =>
                              updateMedication(index, "notes", e.target.value)
                            }
                            placeholder="Additional instructions or notes"
                            rows={2}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? prescriptionId
                      ? "Updating..."
                      : "Creating..."
                    : prescriptionId
                    ? "Update Prescription"
                    : "Create Prescription"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
