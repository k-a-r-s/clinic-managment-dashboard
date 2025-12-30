import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { PageHeader } from "../../../components/shared/PageHeader";
import { PatientForm } from "../components/PatientForm";
import { MedicalFileForm } from "../components/MedicalFileForm";
import { createPatient } from "../api/patients.api";
import { toast } from "react-hot-toast";
import type { PatientFormData, MedicalFile } from "../../../types";

export function RegisterPatient({
  onCancel,
  onSuccess,
}: {
  onCancel?: () => void;
  onSuccess?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [includeMedicalFile, setIncludeMedicalFile] = useState(false);

  const [medicalFile, setMedicalFile] = useState<MedicalFile>({
    nephropathyInfo: {
      initialNephropathy: "",
      diagnosisDate: "",
      firstDialysisDate: "",
      careStartDate: "",
    },
    vascularAccess: [],
    dialysisProtocol: {
      dialysisDays: [],
      sessionsPerWeek: 3,
      generator: "",
      sessionDuration: "",
      dialyser: "",
      needle: "",
      bloodFlow: "",
      anticoagulation: "",
      dryWeight: "",
      interDialyticWeightGain: "",
      incidents: [],
    },
    medications: [],
    vaccinations: [],
    labResults: [],
    clinicalSummary: "",
  });

  const handleSubmit = async (data: PatientFormData) => {
    try {
      setIsLoading(true);
      // TODO: When backend supports it, send medical file along with patient data
      await createPatient(data);
      // await createPatient({ ...data, medicalFile: includeMedicalFile ? medicalFile : undefined });
      toast.success("Patient registered successfully");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to register patient:", error);
      toast.error("Failed to register patient");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
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
            <BreadcrumbLink onClick={handleCancel}>Patients</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Register New Patient</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        title="Register New Patient"
        subtitle="Add a new patient to the system with complete medical information"
      />

      <PatientForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        submitLabel="Register Patient"
      />

      {/* Optional Medical File Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-b from-[#1c8ca8] to-[#157a93] h-12 flex items-center justify-between px-6">
          <h2 className="text-base text-white font-normal">
            Medical File (Optional)
          </h2>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeMedicalFile}
              onChange={(e) => setIncludeMedicalFile(e.target.checked)}
              className="rounded border-white text-white focus:ring-white"
            />
            <span className="text-sm text-white">Add medical file now</span>
          </label>
        </div>
        {includeMedicalFile && (
          <div className="p-6">
            <MedicalFileForm
              medicalFile={medicalFile}
              onChange={setMedicalFile}
              readOnly={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
