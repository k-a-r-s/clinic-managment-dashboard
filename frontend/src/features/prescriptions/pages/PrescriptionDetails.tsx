import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Printer,
  Calendar,
  User,
  Stethoscope,
  Pill,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Loader } from "../../../components/shared/Loader";
import {
  getPrescriptionById,
  deletePrescription,
} from "../api/prescriptions.api";
import { removePrescriptionFromMedicalFile } from "../utils/medicalFileSync";
import { getPatientById, updatePatient } from "../../patients/api/patients.api";
import type { Prescription } from "../../../types";

interface PrescriptionDetailsProps {
  prescriptionId: string;
  onBack?: () => void;
  onEdit?: (prescriptionId: string) => void;
  onDeleted?: () => void;
}

export function PrescriptionDetails({
  prescriptionId,
  onBack,
  onEdit,
  onDeleted,
}: PrescriptionDetailsProps) {
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadPrescription();
  }, [prescriptionId]);

  const loadPrescription = async () => {
    setIsLoading(true);
    try {
      const data = await getPrescriptionById(prescriptionId);
      setPrescription(data);
    } catch (error) {
      console.error("Failed to load prescription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this prescription? This action cannot be undone."
      )
    ) {
      return;
    }

    if (!prescription) return;

    setIsDeleting(true);
    try {
      // First, rollback the medications from the patient's medical file
      const patient = await getPatientById(prescription.patientId);
      const updatedMedicalFile = removePrescriptionFromMedicalFile(
        prescriptionId,
        patient.medicalFile
      );

      // Update the patient's medical file
      await updatePatient(prescription.patientId, {
        medicalFile: updatedMedicalFile,
      });

      // Then delete the prescription
      await deletePrescription(prescriptionId);
      onDeleted?.();
    } catch (error) {
      console.error("Failed to delete prescription:", error);
      alert("Failed to delete prescription. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader size="lg" />
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">Prescription not found</p>
              <Button onClick={onBack} variant="outline" className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Prescriptions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Prescriptions
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="print:hidden"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(prescriptionId)}
              className="print:hidden"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 print:hidden"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>

        {/* Prescription Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">
                Prescription #{prescription.id}
              </CardTitle>
              <Badge variant="outline" className="text-sm">
                {new Date(prescription.prescriptionDate).toLocaleDateString()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Patient & Doctor Info */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="w-4 h-4" />
                  Patient
                </div>
                <p className="text-lg font-semibold">
                  {prescription.patientName ||
                    `Patient #${prescription.patientId}`}
                </p>
                <p className="text-sm text-gray-500 font-mono">
                  ID: {prescription.patientId}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Stethoscope className="w-4 h-4" />
                  Prescribed By
                </div>
                <p className="text-lg font-semibold">
                  {prescription.doctorName ||
                    `Doctor #${prescription.doctorId}`}
                </p>
                <p className="text-sm text-gray-500 font-mono">
                  ID: {prescription.doctorId}
                </p>
              </div>
            </div>

            {/* Date & Appointment */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  Prescription Date
                </div>
                <p className="text-base">
                  {new Date(prescription.prescriptionDate).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>

              {prescription.appointmentId && (
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">
                    Related Appointment
                  </div>
                  <p className="text-base font-mono">
                    #{prescription.appointmentId}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Medications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5" />
                Prescribed Medications
              </CardTitle>
              <Badge variant="secondary">
                {prescription.medications.length} item
                {prescription.medications.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prescription.medications.map((medication, index) => (
                <Card key={medication.id || index} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {medication.medicationName}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Dosage:</span>
                          <p className="font-medium mt-1">
                            {medication.dosage}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Frequency:</span>
                          <p className="font-medium mt-1">
                            {medication.frequency}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <p className="font-medium mt-1">
                            {medication.duration}
                          </p>
                        </div>
                      </div>

                      {medication.notes && (
                        <div className="text-sm pt-2 border-t border-gray-100">
                          <span className="text-gray-500">Notes:</span>
                          <p className="mt-1 text-gray-700">
                            {medication.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Timestamps */}
        <Card className="print:hidden">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium">Created:</span>{" "}
                {prescription.createdAt &&
                  new Date(prescription.createdAt).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span>{" "}
                {prescription.updatedAt &&
                  new Date(prescription.updatedAt).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
