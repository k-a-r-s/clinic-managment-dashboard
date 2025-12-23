import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import PrescriptionsHeader from "./PrescriptionsHeader";
import PatientInfoSection from "./PatientInfoSection";
import PharmacyMedicationsInfo from "./PharmacyMedicationsInfo";
import PrescriptionDetailsTable from "./PrescriptionDetailsTable";
import PrescriptionPrintPreview from "./PrescriptionPrintPreview";

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
}

interface PrescriptionState {
  medications: Medication[];
  savedAt?: string;
}

const PrescriptionsLayout: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: "1",
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
      notes: "",
    },
  ]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [patientName, setPatientName] = useState<string>("John Michael Doe");
  const [patientAge, setPatientAge] = useState<string>("58");
  const [patientGender, setPatientGender] = useState<string>("Male");
  const [requestingDoctor, setRequestingDoctor] = useState<string>("Dr. Sarah Johnson");

  // Track whether there is any medication content
  useEffect(() => {
    const hasContent = medications.some(
      (med) => med.name || med.dosage || med.frequency || med.duration || med.notes
    );
    setHasUnsavedChanges(hasContent);
  }, [medications]);

  const handleAddMedication = () => {
    const newMedication: Medication = {
      id: Date.now().toString(),
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
      notes: "",
    };
    setMedications([...medications, newMedication]);
  };

  const handleRemoveMedication = (id: string) => {
    if (medications.length > 1) {
      setMedications(medications.filter((med) => med.id !== id));
    }
  };

  const handleUpdateMedication = (
    id: string,
    field: keyof Medication,
    value: string
  ) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, [field]: value } : med
      )
    );
  };

  const handleClearAll = () => {
    if (hasUnsavedChanges) {
      if (
        window.confirm(
          "Are you sure you want to clear all? All unsaved changes will be lost."
        )
      ) {
        setMedications([
          {
            id: Date.now().toString(),
            name: "",
            dosage: "",
            frequency: "",
            duration: "",
            notes: "",
          },
        ]);
        // Clear local draft if present
        localStorage.removeItem("prescription_draft");
        setHasUnsavedChanges(false);
      }
    }
  };
  const handlePrintRequestForm = () => {
    const filledMedications = medications.filter(
      (med) => med.name.trim() !== ""
    );

    if (filledMedications.length === 0) {
      toast.error("Please add at least one medication before printing.");
      return;
    }

    if (!patientName || patientName.trim() === "") {
      toast.error("Please enter the patient name before printing.");
      return;
    }

    // Print only the preview area
    const printEl = document.getElementById('prescription-print-area');
    if (!printEl) {
      toast.error('Print area not available');
      return;
    }

    const printContents = printEl.outerHTML;
    const win = window.open('', '_blank');
    if (!win) {
      toast.error('Unable to open print window.');
      return;
    }
    win.document.write(`
      <html>
        <head>
          <title>Prescription Request Form</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; padding: 24px; }
            .text-teal-600 { color: #0d9488; }
            .font-semibold { font-weight: 600; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const handlePrintPrescription = () => {
    handlePrintRequestForm();
  };

  const handleReuseLastPrescription = () => {
    const lastPrescription = localStorage.getItem("prescription_draft");
    if (lastPrescription) {
      try {
        const parsed: PrescriptionState = JSON.parse(lastPrescription);
        if (parsed.medications && parsed.medications.length > 0) {
          const shouldLoad = window.confirm(
            "Load the last saved prescription?"
          );
          if (shouldLoad) {
            setMedications(parsed.medications);
          }
        } else {
          toast.error("No previous prescription found.");
        }
      } catch (error) {
        console.error("Failed to load prescription:", error);
        toast.error("Failed to load previous prescription.");
      }
    } else {
      toast.error("No previous prescription found.");
    }
  };
  // No automatic draft loading - save button removed by request

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <PrescriptionsHeader
        medications={medications}
        onClearAll={handleClearAll}
        onPrintRequestForm={handlePrintRequestForm}
        onPrintPrescription={handlePrintPrescription}
        patientName={patientName}
      />

      {/* Save button removed; manual save UX was removed per requirements */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {" "}
        {/* Left Section - Form */}
        <div className="lg:col-span-2 space-y-6">
          <PatientInfoSection
            name={patientName}
            onNameChange={setPatientName}
            age={patientAge}
            onAgeChange={setPatientAge}
            gender={patientGender}
            onGenderChange={setPatientGender}
          />
          <PharmacyMedicationsInfo />
          <PrescriptionDetailsTable
            medications={medications}
            onAddMedication={handleAddMedication}
            onRemoveMedication={handleRemoveMedication}
            onUpdateMedication={handleUpdateMedication}
            onReuseLastPrescription={handleReuseLastPrescription}
          />
        </div>
        {/* Right Section - Print Preview */}
        <div className="lg:col-span-1">
          <PrescriptionPrintPreview
            medications={medications}
            patientName={patientName}
            age={patientAge}
            gender={patientGender}
            requestDate={new Date().toLocaleDateString()}
            requestDoctor={requestingDoctor}
          />
        </div>
      </div>
    </div>
  );
};

export default PrescriptionsLayout;
