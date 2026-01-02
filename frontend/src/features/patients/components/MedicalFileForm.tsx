import { useState } from "react";
import { Plus, Trash2, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Badge } from "../../../components/ui/badge";
import type {
  MedicalFile,
  VascularAccess,
  Medication,
  Vaccination,
} from "../../../types";

interface CollapsibleSubsectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSubsection({
  title,
  children,
  defaultOpen = true,
}: CollapsibleSubsectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 text-base font-semibold text-gray-900 hover:text-[#1c8ca8] transition-colors bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-3"
      >
        {isOpen ? (
          <ChevronDown className="w-5 h-5" />
        ) : (
          <ChevronUp className="w-5 h-5 rotate-180" />
        )}
        <h3>{title}</h3>
      </button>
      {isOpen && <div className="px-1">{children}</div>}
    </div>
  );
}

interface MedicalFileFormProps {
  medicalFile: MedicalFile;
  onChange: (medicalFile: MedicalFile) => void;
  readOnly?: boolean;
}

export function MedicalFileForm({
  medicalFile,
  onChange,
  readOnly = false,
}: MedicalFileFormProps) {
  const updateNephropathyInfo = (field: string, value: string) => {
    onChange({
      ...medicalFile,
      nephropathyInfo: {
        ...medicalFile.nephropathyInfo,
        [field]: value,
      },
    });
  };

  const updateDialysisProtocol = (field: string, value: any) => {
    onChange({
      ...medicalFile,
      dialysisProtocol: {
        ...medicalFile.dialysisProtocol,
        [field]: value,
      },
    });
  };

  const addVascularAccess = () => {
    onChange({
      ...medicalFile,
      vascularAccess: [
        ...medicalFile.vascularAccess,
        {
          type: "",
          site: "",
          operator: "",
          creationDate: "",
          firstUseDate: "",
          status: "active",
        },
      ],
    });
  };

  const updateVascularAccess = (
    index: number,
    field: keyof VascularAccess,
    value: any
  ) => {
    const updated = [...medicalFile.vascularAccess];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...medicalFile, vascularAccess: updated });
  };

  const removeVascularAccess = (index: number) => {
    onChange({
      ...medicalFile,
      vascularAccess: medicalFile.vascularAccess.filter((_, i) => i !== index),
    });
  };

  const addMedication = () => {
    onChange({
      ...medicalFile,
      medications: [
        ...medicalFile.medications,
        {
          name: "",
          category: "",
          currentTreatment: {
            dosage: "",
            frequency: "",
            startDate: "",
            status: "active" as const,
          },
          history: [],
        },
      ],
    });
  };

  const updateMedication = (
    index: number,
    field: keyof Medication,
    value: any
  ) => {
    const updated = [...medicalFile.medications];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...medicalFile, medications: updated });
  };

  const updateCurrentTreatment = (
    medIndex: number,
    field: keyof Medication["currentTreatment"],
    value: any
  ) => {
    const updated = [...medicalFile.medications];
    updated[medIndex].currentTreatment = {
      ...updated[medIndex].currentTreatment,
      [field]: value,
    };
    onChange({ ...medicalFile, medications: updated });
  };

  const discontinueCurrentTreatment = (medIndex: number) => {
    const updated = [...medicalFile.medications];
    const medication = updated[medIndex];
    const today = new Date().toISOString().split("T")[0];

    // Update the history entry to mark it as discontinued
    const currentHistoryEntry = medication.history.find(
      (h) => h.prescriptionId === medication.currentTreatment.prescriptionId
    );
    if (currentHistoryEntry) {
      currentHistoryEntry.endDate = today;
      currentHistoryEntry.status = "discontinued";
    }

    // Update current treatment status
    medication.currentTreatment.status = "discontinued";

    onChange({ ...medicalFile, medications: updated });
  };

  const addMedicationHistory = (medIndex: number) => {
    const updated = [...medicalFile.medications];
    const today = new Date().toISOString().split("T")[0];

    // Discontinue previous treatment if active
    if (updated[medIndex].currentTreatment.status === "active") {
      const previousHistoryEntry = updated[medIndex].history.find(
        (h) =>
          h.prescriptionId === updated[medIndex].currentTreatment.prescriptionId
      );
      if (previousHistoryEntry) {
        previousHistoryEntry.endDate = today;
        previousHistoryEntry.status = "discontinued";
      }
    }

    // Add new history entry
    const newHistoryEntry = {
      prescriptionMedicationId: undefined,
      prescriptionId: undefined,
      startDate: today,
      endDate: null,
      dosage: "",
      frequency: "",
      status: "active" as const,
      notes: null,
    };
    updated[medIndex].history.push(newHistoryEntry);

    // Update current treatment
    updated[medIndex].currentTreatment = {
      dosage: "",
      frequency: "",
      startDate: today,
      status: "active",
      prescriptionId: undefined,
    };

    onChange({ ...medicalFile, medications: updated });
  };

  const updateMedicationHistory = (
    medIndex: number,
    histIndex: number,
    field: keyof Medication["history"][0],
    value: any
  ) => {
    const updated = [...medicalFile.medications];
    updated[medIndex].history[histIndex] = {
      ...updated[medIndex].history[histIndex],
      [field]: value,
    };
    onChange({ ...medicalFile, medications: updated });
  };

  const removeMedication = (index: number) => {
    // Medical safety: Confirm before removing medication records
    if (!confirm("Archive this medication? The history will be preserved.")) {
      return;
    }
    onChange({
      ...medicalFile,
      medications: medicalFile.medications.filter((_, i) => i !== index),
    });
  };

  const addVaccination = () => {
    onChange({
      ...medicalFile,
      vaccinations: [
        ...medicalFile.vaccinations,
        {
          vaccineName: "",
          doses: [{ doseNumber: 1, date: "", reminderDate: "" }],
        },
      ],
    });
  };

  const updateVaccination = (
    index: number,
    field: keyof Vaccination,
    value: any
  ) => {
    const updated = [...medicalFile.vaccinations];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...medicalFile, vaccinations: updated });
  };

  const addVaccinationDose = (vaccIndex: number) => {
    const updated = [...medicalFile.vaccinations];
    const nextDoseNumber = updated[vaccIndex].doses.length + 1;
    updated[vaccIndex].doses.push({
      doseNumber: nextDoseNumber,
      date: "",
      reminderDate: "",
    });
    onChange({ ...medicalFile, vaccinations: updated });
  };

  const updateVaccinationDose = (
    vaccIndex: number,
    doseIndex: number,
    field: "date" | "reminderDate",
    value: string
  ) => {
    const updated = [...medicalFile.vaccinations];
    updated[vaccIndex].doses[doseIndex][field] = value;
    onChange({ ...medicalFile, vaccinations: updated });
  };

  const removeVaccination = (index: number) => {
    // Medical safety: Vaccinations should not be deleted
    if (
      !confirm(
        "Remove this vaccination record? This should only be done if entered in error."
      )
    ) {
      return;
    }
    onChange({
      ...medicalFile,
      vaccinations: medicalFile.vaccinations.filter((_, i) => i !== index),
    });
  };

  const addLabResult = () => {
    onChange({
      ...medicalFile,
      labResults: [
        ...medicalFile.labResults,
        {
          date: "",
          parameters: {},
        },
      ],
    });
  };

  const updateLabResult = (
    index: number,
    field: "date" | "parameters",
    value: any
  ) => {
    const updated = [...medicalFile.labResults];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...medicalFile, labResults: updated });
  };

  const removeLabResult = (index: number) => {
    // Medical safety: Lab results should never be deleted once validated
    if (
      !confirm(
        "⚠️ WARNING: Lab results should not be deleted. Only remove if this was entered in error. Continue?"
      )
    ) {
      return;
    }
    onChange({
      ...medicalFile,
      labResults: medicalFile.labResults.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Nephropathy Info Section */}
      <CollapsibleSubsection title="Nephropathy Info" defaultOpen={true}>
        <div className="space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Medical Safety:</strong> Nephropathy information is
                  the original diagnosis. Changes should be rare and require
                  medical justification.
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="initialNephropathy" className="mb-2 block">
                Initial Nephropathy
              </Label>
              <Input
                id="initialNephropathy"
                value={medicalFile.nephropathyInfo.initialNephropathy}
                onChange={(e) =>
                  updateNephropathyInfo("initialNephropathy", e.target.value)
                }
                disabled={readOnly}
                placeholder="e.g., Diabetic Nephropathy"
              />
            </div>
            <div>
              <Label htmlFor="diagnosisDate" className="mb-2 block">
                Diagnosis Date
              </Label>
              <Input
                id="diagnosisDate"
                type="date"
                value={medicalFile.nephropathyInfo.diagnosisDate}
                onChange={(e) =>
                  updateNephropathyInfo("diagnosisDate", e.target.value)
                }
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="firstDialysisDate" className="mb-2 block">
                First Dialysis Date
              </Label>
              <Input
                id="firstDialysisDate"
                type="date"
                value={medicalFile.nephropathyInfo.firstDialysisDate}
                onChange={(e) =>
                  updateNephropathyInfo("firstDialysisDate", e.target.value)
                }
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="careStartDate" className="mb-2 block">
                Care Start Date
              </Label>
              <Input
                id="careStartDate"
                type="date"
                value={medicalFile.nephropathyInfo.careStartDate}
                onChange={(e) =>
                  updateNephropathyInfo("careStartDate", e.target.value)
                }
                disabled={readOnly}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="clinicalSummary" className="mb-2 block">
              Clinical Summary
            </Label>
            <Textarea
              id="clinicalSummary"
              value={medicalFile.clinicalSummary}
              onChange={(e) =>
                onChange({ ...medicalFile, clinicalSummary: e.target.value })
              }
              disabled={readOnly}
              rows={4}
              placeholder="Enter clinical summary and notes..."
            />
          </div>
        </div>
      </CollapsibleSubsection>

      {/* Vascular Access Section */}
      <CollapsibleSubsection title="Vascular Access" defaultOpen={true}>
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Timeline View:</strong> Vascular access records are
                  never deleted. Mark old accesses as inactive or abandoned.
                  Only one can be active.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Vascular Access Timeline
            </h3>
            {!readOnly && (
              <Button onClick={addVascularAccess} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Access
              </Button>
            )}
          </div>
          {medicalFile.vascularAccess.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No vascular access recorded
            </p>
          ) : (
            <div className="space-y-4">
              {medicalFile.vascularAccess
                .sort(
                  (a, b) =>
                    new Date(b.creationDate).getTime() -
                    new Date(a.creationDate).getTime()
                )
                .map((access, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 space-y-3 ${
                      access.status === "active"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">
                          Access #{medicalFile.vascularAccess.length - index}
                        </h4>
                        {access.status === "active" && (
                          <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                            ACTIVE
                          </span>
                        )}
                        {access.status === "abandoned" && (
                          <span className="px-2 py-1 bg-gray-400 text-white text-xs rounded-full">
                            ABANDONED
                          </span>
                        )}
                      </div>
                      {!readOnly && access.status !== "abandoned" && (
                        <Button
                          onClick={() => removeVascularAccess(index)}
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                        >
                          Mark as Abandoned
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="mb-2 block">Type</Label>
                        <Input
                          value={access.type}
                          onChange={(e) =>
                            updateVascularAccess(index, "type", e.target.value)
                          }
                          disabled={readOnly}
                          placeholder="e.g., AVF, AVG, Catheter"
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block">Site</Label>
                        <Input
                          value={access.site}
                          onChange={(e) =>
                            updateVascularAccess(index, "site", e.target.value)
                          }
                          disabled={readOnly}
                          placeholder="e.g., Left Radiocephalic"
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block">Operator</Label>
                        <Input
                          value={access.operator}
                          onChange={(e) =>
                            updateVascularAccess(
                              index,
                              "operator",
                              e.target.value
                            )
                          }
                          disabled={readOnly}
                          placeholder="Doctor name"
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block">Creation Date</Label>
                        <Input
                          type="date"
                          value={access.creationDate}
                          onChange={(e) =>
                            updateVascularAccess(
                              index,
                              "creationDate",
                              e.target.value
                            )
                          }
                          disabled={readOnly}
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block">First Use Date</Label>
                        <Input
                          type="date"
                          value={access.firstUseDate}
                          onChange={(e) =>
                            updateVascularAccess(
                              index,
                              "firstUseDate",
                              e.target.value
                            )
                          }
                          disabled={readOnly}
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block">Status</Label>
                        <select
                          value={access.status}
                          onChange={(e) =>
                            updateVascularAccess(
                              index,
                              "status",
                              e.target.value
                            )
                          }
                          disabled={readOnly || access.status === "abandoned"}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100"
                        >
                          <option value="active">Active (Current)</option>
                          <option value="inactive">Inactive (Standby)</option>
                          <option value="abandoned">
                            Abandoned (Do Not Use)
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </CollapsibleSubsection>

      {/* Dialysis Protocol Section */}
      <CollapsibleSubsection title="Dialysis Protocol" defaultOpen={true}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Dialysis Days</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <label key={day} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={medicalFile.dialysisProtocol.dialysisDays.includes(
                        day
                      )}
                      onChange={(e) => {
                        const days = e.target.checked
                          ? [...medicalFile.dialysisProtocol.dialysisDays, day]
                          : medicalFile.dialysisProtocol.dialysisDays.filter(
                              (d) => d !== day
                            );
                        updateDialysisProtocol("dialysisDays", days);
                      }}
                      disabled={readOnly}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{day.slice(0, 3)}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="sessionsPerWeek" className="mb-2 block">
                Sessions Per Week
              </Label>
              <Input
                id="sessionsPerWeek"
                type="number"
                value={medicalFile.dialysisProtocol.sessionsPerWeek}
                onChange={(e) =>
                  updateDialysisProtocol(
                    "sessionsPerWeek",
                    parseInt(e.target.value) || 0
                  )
                }
                disabled={readOnly}
                min="1"
                max="7"
              />
            </div>
            <div>
              <Label htmlFor="generator" className="mb-2 block">
                Generator
              </Label>
              <Input
                id="generator"
                value={medicalFile.dialysisProtocol.generator}
                onChange={(e) =>
                  updateDialysisProtocol("generator", e.target.value)
                }
                disabled={readOnly}
                placeholder="e.g., Fresenius 5008S"
              />
            </div>
            <div>
              <Label htmlFor="sessionDuration" className="mb-2 block">
                Session Duration (minutes)
              </Label>
              <Input
                id="sessionDuration"
                value={medicalFile.dialysisProtocol.sessionDuration}
                onChange={(e) =>
                  updateDialysisProtocol("sessionDuration", e.target.value)
                }
                disabled={readOnly}
                placeholder="e.g., 240"
              />
            </div>
            <div>
              <Label htmlFor="dialyser" className="mb-2 block">
                Dialyser
              </Label>
              <Input
                id="dialyser"
                value={medicalFile.dialysisProtocol.dialyser}
                onChange={(e) =>
                  updateDialysisProtocol("dialyser", e.target.value)
                }
                disabled={readOnly}
                placeholder="e.g., FX80"
              />
            </div>
            <div>
              <Label htmlFor="needle" className="mb-2 block">
                Needle
              </Label>
              <Input
                id="needle"
                value={medicalFile.dialysisProtocol.needle}
                onChange={(e) =>
                  updateDialysisProtocol("needle", e.target.value)
                }
                disabled={readOnly}
                placeholder="e.g., 15G"
              />
            </div>
            <div>
              <Label htmlFor="bloodFlow" className="mb-2 block">
                Blood Flow
              </Label>
              <Input
                id="bloodFlow"
                value={medicalFile.dialysisProtocol.bloodFlow}
                onChange={(e) =>
                  updateDialysisProtocol("bloodFlow", e.target.value)
                }
                disabled={readOnly}
                placeholder="e.g., 300 mL/min"
              />
            </div>
            <div>
              <Label htmlFor="anticoagulation" className="mb-2 block">
                Anticoagulation
              </Label>
              <Input
                id="anticoagulation"
                value={medicalFile.dialysisProtocol.anticoagulation}
                onChange={(e) =>
                  updateDialysisProtocol("anticoagulation", e.target.value)
                }
                disabled={readOnly}
                placeholder="e.g., Heparin 2000 IU"
              />
            </div>
            <div>
              <Label htmlFor="dryWeight" className="mb-2 block">
                Dry Weight
              </Label>
              <Input
                id="dryWeight"
                value={medicalFile.dialysisProtocol.dryWeight}
                onChange={(e) =>
                  updateDialysisProtocol("dryWeight", e.target.value)
                }
                disabled={readOnly}
                placeholder="e.g., 75.0 kg"
              />
            </div>
            <div>
              <Label htmlFor="interDialyticWeightGain">
                Interdialytic Weight Gain
              </Label>
              <Input
                id="interDialyticWeightGain"
                value={medicalFile.dialysisProtocol.interDialyticWeightGain}
                onChange={(e) =>
                  updateDialysisProtocol(
                    "interDialyticWeightGain",
                    e.target.value
                  )
                }
                disabled={readOnly}
                placeholder="e.g., 2.5 kg"
              />
            </div>
          </div>
        </div>
      </CollapsibleSubsection>

      {/* Medications Section */}
      <CollapsibleSubsection title="Medications" defaultOpen={true}>
        <div className="space-y-4">
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-purple-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-purple-700">
                  <strong>Dose History:</strong> When changing doses, add a new
                  history entry instead of editing. This preserves the
                  medication timeline.
                </p>
              </div>
            </div>
          </div>{" "}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Medications</h3>
            {!readOnly && (
              <Button onClick={addMedication} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Medication
              </Button>
            )}
          </div>
          {medicalFile.medications.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No medications recorded
            </p>
          ) : (
            <div className="space-y-4">
              {medicalFile.medications.map((med, medIndex) => (
                <div
                  key={medIndex}
                  className="border border-gray-200 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">
                      Medication #{medIndex + 1}
                    </h4>
                    {!readOnly && (
                      <Button
                        onClick={() => removeMedication(medIndex)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="mb-2 block">Medication Name</Label>
                      <Input
                        value={med.name}
                        onChange={(e) =>
                          updateMedication(medIndex, "name", e.target.value)
                        }
                        disabled={readOnly}
                        placeholder="e.g., Erythropoietin (EPO)"
                      />
                    </div>
                    <div>
                      <Label className="mb-2 block">Category</Label>
                      <Input
                        value={med.category}
                        onChange={(e) =>
                          updateMedication(medIndex, "category", e.target.value)
                        }
                        disabled={readOnly}
                        placeholder="e.g., Anemia Management"
                      />
                    </div>
                  </div>

                  {/* Current Treatment Section */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-green-900 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Current Treatment
                      </h5>
                      <Badge
                        variant={
                          med.currentTreatment.status === "active"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          med.currentTreatment.status === "active"
                            ? "bg-green-600"
                            : ""
                        }
                      >
                        {med.currentTreatment.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs mb-1 block">Dosage</Label>
                        <Input
                          value={med.currentTreatment.dosage}
                          onChange={(e) =>
                            updateCurrentTreatment(
                              medIndex,
                              "dosage",
                              e.target.value
                            )
                          }
                          disabled={
                            readOnly || med.currentTreatment.status !== "active"
                          }
                          placeholder="e.g., 4000 IU"
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label className="text-xs mb-1 block">Frequency</Label>
                        <Input
                          value={med.currentTreatment.frequency}
                          onChange={(e) =>
                            updateCurrentTreatment(
                              medIndex,
                              "frequency",
                              e.target.value
                            )
                          }
                          disabled={
                            readOnly || med.currentTreatment.status !== "active"
                          }
                          placeholder="e.g., 3x/week"
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label className="text-xs mb-1 block">Start Date</Label>
                        <Input
                          type="date"
                          value={med.currentTreatment.startDate}
                          onChange={(e) =>
                            updateCurrentTreatment(
                              medIndex,
                              "startDate",
                              e.target.value
                            )
                          }
                          disabled={
                            readOnly || med.currentTreatment.status !== "active"
                          }
                          className="h-9"
                        />
                      </div>
                    </div>

                    {med.currentTreatment.prescriptionId && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          From Prescription #
                          {med.currentTreatment.prescriptionId}
                        </Badge>
                      </div>
                    )}

                    {!readOnly && med.currentTreatment.status === "active" && (
                      <Button
                        onClick={() => discontinueCurrentTreatment(medIndex)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Discontinue Treatment
                      </Button>
                    )}
                  </div>

                  {/* History Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="mb-0">Treatment History</Label>
                      {!readOnly && (
                        <Button
                          onClick={() => addMedicationHistory(medIndex)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-600"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add History Entry
                        </Button>
                      )}
                    </div>

                    {med.history.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No history recorded
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {[...med.history]
                          .sort(
                            (a, b) =>
                              new Date(b.startDate).getTime() -
                              new Date(a.startDate).getTime()
                          )
                          .map((hist, histIndex) => {
                            const actualIndex = med.history.findIndex(
                              (h) => h === hist
                            );
                            const isActive = hist.status === "active";
                            return (
                              <div
                                key={actualIndex}
                                className={`space-y-2 pl-4 border-l-2 ${
                                  isActive
                                    ? "border-green-500 bg-green-50/50"
                                    : "border-gray-200"
                                } p-3 rounded`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <Badge
                                    variant={isActive ? "default" : "secondary"}
                                    className={
                                      isActive ? "bg-green-600" : "bg-gray-500"
                                    }
                                  >
                                    {hist.status}
                                  </Badge>
                                  {hist.prescriptionId && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      Prescription #{hist.prescriptionId}
                                    </Badge>
                                  )}
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <Label className="text-xs mb-1 block">
                                      Start Date
                                    </Label>
                                    <Input
                                      type="date"
                                      value={hist.startDate}
                                      onChange={(e) =>
                                        updateMedicationHistory(
                                          medIndex,
                                          actualIndex,
                                          "startDate",
                                          e.target.value
                                        )
                                      }
                                      disabled={
                                        readOnly || !!hist.prescriptionId
                                      }
                                      className="h-8"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs mb-1 block">
                                      End Date
                                    </Label>
                                    <Input
                                      type="date"
                                      value={hist.endDate || ""}
                                      onChange={(e) =>
                                        updateMedicationHistory(
                                          medIndex,
                                          actualIndex,
                                          "endDate",
                                          e.target.value || null
                                        )
                                      }
                                      disabled={readOnly || isActive}
                                      className="h-8"
                                      placeholder="Ongoing"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <Label className="text-xs mb-1 block">
                                      Dosage
                                    </Label>
                                    <Input
                                      value={hist.dosage}
                                      onChange={(e) =>
                                        updateMedicationHistory(
                                          medIndex,
                                          actualIndex,
                                          "dosage",
                                          e.target.value
                                        )
                                      }
                                      disabled={
                                        readOnly || !!hist.prescriptionId
                                      }
                                      placeholder="e.g., 4000 IU"
                                      className="h-8"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs mb-1 block">
                                      Frequency
                                    </Label>
                                    <Input
                                      value={hist.frequency}
                                      onChange={(e) =>
                                        updateMedicationHistory(
                                          medIndex,
                                          actualIndex,
                                          "frequency",
                                          e.target.value
                                        )
                                      }
                                      disabled={
                                        readOnly || !!hist.prescriptionId
                                      }
                                      placeholder="e.g., 3x/week"
                                      className="h-8"
                                    />
                                  </div>
                                </div>

                                {hist.notes && (
                                  <div>
                                    <Label className="text-xs mb-1 block">
                                      Notes
                                    </Label>
                                    <Textarea
                                      value={hist.notes}
                                      onChange={(e) =>
                                        updateMedicationHistory(
                                          medIndex,
                                          actualIndex,
                                          "notes",
                                          e.target.value
                                        )
                                      }
                                      disabled={
                                        readOnly || !!hist.prescriptionId
                                      }
                                      className="h-16 text-xs"
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CollapsibleSubsection>

      {/* Vaccinations Section */}
      <CollapsibleSubsection title="Vaccinations" defaultOpen={true}>
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Vaccinations
            </h3>
            {!readOnly && (
              <Button onClick={addVaccination} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Vaccination
              </Button>
            )}
          </div>
          {medicalFile.vaccinations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No vaccinations recorded
            </p>
          ) : (
            <div className="space-y-4">
              {medicalFile.vaccinations.map((vacc, vaccIndex) => (
                <div
                  key={vaccIndex}
                  className="border border-gray-200 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">
                      Vaccination #{vaccIndex + 1}
                    </h4>
                    {!readOnly && (
                      <Button
                        onClick={() => removeVaccination(vaccIndex)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div>
                    <Label className="mb-2 block">Vaccine Name</Label>
                    <Input
                      value={vacc.vaccineName}
                      onChange={(e) =>
                        updateVaccination(
                          vaccIndex,
                          "vaccineName",
                          e.target.value
                        )
                      }
                      disabled={readOnly}
                      placeholder="e.g., Hepatitis B"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="mb-2 block">Doses</Label>
                      {!readOnly && (
                        <Button
                          onClick={() => addVaccinationDose(vaccIndex)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-600"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Dose
                        </Button>
                      )}
                    </div>
                    {vacc.doses.map((dose, doseIndex) => (
                      <div
                        key={doseIndex}
                        className="grid grid-cols-3 gap-2 pl-4 border-l-2 border-gray-200"
                      >
                        <div>
                          <Label className="text-xs">
                            Dose #{dose.doseNumber}
                          </Label>
                          <div className="text-xs text-gray-500 mt-1">
                            Dose {dose.doseNumber}
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs mb-1 block">Date</Label>
                          <Input
                            type="date"
                            className="h-8"
                            value={dose.date}
                            onChange={(e) =>
                              updateVaccinationDose(
                                vaccIndex,
                                doseIndex,
                                "date",
                                e.target.value
                              )
                            }
                            disabled={readOnly}
                          />
                        </div>
                        <div>
                          <Label className="text-xs mb-1 block">
                            Reminder Date
                          </Label>
                          <Input
                            type="date"
                            className="h-8"
                            value={dose.reminderDate || ""}
                            onChange={(e) =>
                              updateVaccinationDose(
                                vaccIndex,
                                doseIndex,
                                "reminderDate",
                                e.target.value
                              )
                            }
                            disabled={readOnly}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CollapsibleSubsection>

      {/* Lab Results Section */}
      <CollapsibleSubsection title="Lab Results" defaultOpen={true}>
        <div className="space-y-4">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <strong>Immutable Data:</strong> Lab results should never be
                  deleted once validated. Only remove if entered in error.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Laboratory Results
            </h3>
            {!readOnly && (
              <Button onClick={addLabResult} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Lab Result
              </Button>
            )}
          </div>
          {medicalFile.labResults.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No lab results recorded
            </p>
          ) : (
            <div className="space-y-4">
              {medicalFile.labResults
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((lab, labIndex) => (
                  <div
                    key={labIndex}
                    className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <Label className="text-sm font-medium text-gray-700">
                          Test Date:
                        </Label>
                        <Input
                          type="date"
                          value={lab.date}
                          onChange={(e) =>
                            updateLabResult(labIndex, "date", e.target.value)
                          }
                          disabled={readOnly}
                          className="w-auto h-8"
                        />
                      </div>
                      {!readOnly && (
                        <Button
                          onClick={() => removeLabResult(labIndex)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <Label className="font-semibold text-gray-900 mb-3 block">
                        Laboratory Parameters
                      </Label>

                      {/* Kidney Function */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">
                          Kidney Function
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">
                              Creatinine
                            </Label>
                            <div className="flex gap-2 items-center">
                              <Input
                                value={lab.parameters?.creatinine || ""}
                                onChange={(e) => {
                                  const params = {
                                    ...lab.parameters,
                                    creatinine: e.target.value,
                                  };
                                  updateLabResult(
                                    labIndex,
                                    "parameters",
                                    params
                                  );
                                }}
                                disabled={readOnly}
                                placeholder="8.5"
                                className="h-8"
                              />
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                mg/dL
                              </span>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">
                              Urea (BUN)
                            </Label>
                            <div className="flex gap-2 items-center">
                              <Input
                                value={lab.parameters?.urea || ""}
                                onChange={(e) => {
                                  const params = {
                                    ...lab.parameters,
                                    urea: e.target.value,
                                  };
                                  updateLabResult(
                                    labIndex,
                                    "parameters",
                                    params
                                  );
                                }}
                                disabled={readOnly}
                                placeholder="65"
                                className="h-8"
                              />
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                mg/dL
                              </span>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">
                              Kt/V (Dialysis Adequacy)
                            </Label>
                            <div className="flex gap-2 items-center">
                              <Input
                                value={lab.parameters?.ktv || ""}
                                onChange={(e) => {
                                  const params = {
                                    ...lab.parameters,
                                    ktv: e.target.value,
                                  };
                                  updateLabResult(
                                    labIndex,
                                    "parameters",
                                    params
                                  );
                                }}
                                disabled={readOnly}
                                placeholder="1.4"
                                className="h-8"
                              />
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                ratio
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Anemia */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">
                          Anemia Monitoring
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">
                              Hemoglobin
                            </Label>
                            <div className="flex gap-2 items-center">
                              <Input
                                value={lab.parameters?.hemoglobin || ""}
                                onChange={(e) => {
                                  const params = {
                                    ...lab.parameters,
                                    hemoglobin: e.target.value,
                                  };
                                  updateLabResult(
                                    labIndex,
                                    "parameters",
                                    params
                                  );
                                }}
                                disabled={readOnly}
                                placeholder="11.2"
                                className="h-8"
                              />
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                g/dL
                              </span>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">
                              Ferritin
                            </Label>
                            <div className="flex gap-2 items-center">
                              <Input
                                value={lab.parameters?.ferritin || ""}
                                onChange={(e) => {
                                  const params = {
                                    ...lab.parameters,
                                    ferritin: e.target.value,
                                  };
                                  updateLabResult(
                                    labIndex,
                                    "parameters",
                                    params
                                  );
                                }}
                                disabled={readOnly}
                                placeholder="250"
                                className="h-8"
                              />
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                ng/mL
                              </span>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">
                              TSAT (Iron Saturation)
                            </Label>
                            <div className="flex gap-2 items-center">
                              <Input
                                value={lab.parameters?.tsat || ""}
                                onChange={(e) => {
                                  const params = {
                                    ...lab.parameters,
                                    tsat: e.target.value,
                                  };
                                  updateLabResult(
                                    labIndex,
                                    "parameters",
                                    params
                                  );
                                }}
                                disabled={readOnly}
                                placeholder="30"
                                className="h-8"
                              />
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                %
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Electrolytes */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">
                          Electrolytes
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">
                              Potassium
                            </Label>
                            <div className="flex gap-2 items-center">
                              <Input
                                value={lab.parameters?.potassium || ""}
                                onChange={(e) => {
                                  const params = {
                                    ...lab.parameters,
                                    potassium: e.target.value,
                                  };
                                  updateLabResult(
                                    labIndex,
                                    "parameters",
                                    params
                                  );
                                }}
                                disabled={readOnly}
                                placeholder="5.1"
                                className="h-8"
                              />
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                mmol/L
                              </span>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">
                              Sodium
                            </Label>
                            <div className="flex gap-2 items-center">
                              <Input
                                value={lab.parameters?.sodium || ""}
                                onChange={(e) => {
                                  const params = {
                                    ...lab.parameters,
                                    sodium: e.target.value,
                                  };
                                  updateLabResult(
                                    labIndex,
                                    "parameters",
                                    params
                                  );
                                }}
                                disabled={readOnly}
                                placeholder="138"
                                className="h-8"
                              />
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                mmol/L
                              </span>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">
                              Calcium
                            </Label>
                            <div className="flex gap-2 items-center">
                              <Input
                                value={lab.parameters?.calcium || ""}
                                onChange={(e) => {
                                  const params = {
                                    ...lab.parameters,
                                    calcium: e.target.value,
                                  };
                                  updateLabResult(
                                    labIndex,
                                    "parameters",
                                    params
                                  );
                                }}
                                disabled={readOnly}
                                placeholder="9.2"
                                className="h-8"
                              />
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                mg/dL
                              </span>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">
                              Phosphorus
                            </Label>
                            <div className="flex gap-2 items-center">
                              <Input
                                value={lab.parameters?.phosphorus || ""}
                                onChange={(e) => {
                                  const params = {
                                    ...lab.parameters,
                                    phosphorus: e.target.value,
                                  };
                                  updateLabResult(
                                    labIndex,
                                    "parameters",
                                    params
                                  );
                                }}
                                disabled={readOnly}
                                placeholder="5.5"
                                className="h-8"
                              />
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                mg/dL
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bone & Nutrition */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">
                          Bone & Nutrition
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">
                              PTH (Parathyroid)
                            </Label>
                            <div className="flex gap-2 items-center">
                              <Input
                                value={lab.parameters?.pth || ""}
                                onChange={(e) => {
                                  const params = {
                                    ...lab.parameters,
                                    pth: e.target.value,
                                  };
                                  updateLabResult(
                                    labIndex,
                                    "parameters",
                                    params
                                  );
                                }}
                                disabled={readOnly}
                                placeholder="250"
                                className="h-8"
                              />
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                pg/mL
                              </span>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">
                              Albumin
                            </Label>
                            <div className="flex gap-2 items-center">
                              <Input
                                value={lab.parameters?.albumin || ""}
                                onChange={(e) => {
                                  const params = {
                                    ...lab.parameters,
                                    albumin: e.target.value,
                                  };
                                  updateLabResult(
                                    labIndex,
                                    "parameters",
                                    params
                                  );
                                }}
                                disabled={readOnly}
                                placeholder="4.0"
                                className="h-8"
                              />
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                g/dL
                              </span>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">
                              Bicarbonate
                            </Label>
                            <div className="flex gap-2 items-center">
                              <Input
                                value={lab.parameters?.bicarbonate || ""}
                                onChange={(e) => {
                                  const params = {
                                    ...lab.parameters,
                                    bicarbonate: e.target.value,
                                  };
                                  updateLabResult(
                                    labIndex,
                                    "parameters",
                                    params
                                  );
                                }}
                                disabled={readOnly}
                                placeholder="22"
                                className="h-8"
                              />
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                mmol/L
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </CollapsibleSubsection>
    </div>
  );
}
