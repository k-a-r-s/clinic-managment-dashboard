import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  getMedications,
  updateMedications,
} from "../api/medical.api";
import type { Medication, MedicationHistory } from "../../../types";

interface Props {
  patientId: string;
  medicalFileId: string;
  editable?: boolean;
}

type HistoryError = {
  startDate?: string;
  dosage?: string;
};

type MedicationError = {
  name?: string;
  history?: HistoryError[];
};

export function MedicationsSection({
  patientId,
  medicalFileId,
  editable = true,
}: Props) {
  const [data, setData] = useState<Medication[]>([]);
  const [formData, setFormData] = useState<Medication[]>([]);
  const [errors, setErrors] = useState<MedicationError[]>([]);

  useEffect(() => {
    loadData();
  }, [patientId]);

  const loadData = async () => {
    try {
      const res = await getMedications(patientId);
      setData(res);
      setFormData(res);
      setErrors([]);
    } catch {
      toast.error("Failed to load medications");
    }
  };

  useEffect(() => {
    if (!editable) setFormData(data);
  }, [editable, data]);

  /* ----------------- handlers ----------------- */

  const handleMedicationChange = (
    index: number,
    field: keyof Medication,
    value: any
  ) => {
    setFormData((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );

    setErrors((prev) =>
      prev.map((e, i) =>
        i === index ? { ...e, [field]: undefined } : e
      )
    );
  };

  const handleHistoryChange = (
    mIndex: number,
    hIndex: number,
    field: keyof MedicationHistory,
    value: any
  ) => {
    setFormData((prev) =>
      prev.map((m, i) =>
        i === mIndex
          ? {
              ...m,
              history: (m.history ?? []).map((h, j) =>
                j === hIndex ? { ...h, [field]: value } : h
              ),
            }
          : m
      )
    );

    setErrors((prev) =>
      prev.map((e, i) =>
        i === mIndex
          ? {
              ...e,
              history: e.history?.map((h, j) =>
                j === hIndex ? { ...h, [field]: undefined } : h
              ),
            }
          : e
      )
    );
  };

  const addMedication = () => {
    setFormData((prev) => [
      ...prev,
      {
        name: "",
        history: [{ startDate: "", dosage: "" }],
      },
    ]);
    setErrors((prev) => [...prev, {}]);
  };

  const removeMedication = (index: number) => {
    setFormData((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const addHistory = (mIndex: number) => {
    setFormData((prev) =>
      prev.map((m, i) =>
        i === mIndex
          ? {
              ...m,
              history: [...(m.history ?? []), { startDate: "", dosage: "" }],
            }
          : m
      )
    );

    setErrors((prev) =>
      prev.map((e, i) =>
        i === mIndex
          ? { ...e, history: [...(e.history ?? []), {}] }
          : e
      )
    );
  };

  const removeHistory = (mIndex: number, hIndex: number) => {
    setFormData((prev) =>
      prev.map((m, i) =>
        i === mIndex
          ? {
              ...m,
              history: m.history?.filter((_, j) => j !== hIndex),
            }
          : m
      )
    );

    setErrors((prev) =>
      prev.map((e, i) =>
        i === mIndex
          ? {
              ...e,
              history: e.history?.filter((_, j) => j !== hIndex),
            }
          : e
      )
    );
  };

  /* ----------------- validation ----------------- */

  const validateForm = () => {
    const newErrors: MedicationError[] = [];

    formData.forEach((med, mIndex) => {
      const medError: MedicationError = {};

      if (!med.name?.trim()) {
        medError.name = "Medication name is required";
      }

      medError.history = [];

      (med.history ?? []).forEach((h, hIndex) => {
        const histError: HistoryError = {};

        if (!h.startDate) {
          histError.startDate = "Start date is required";
        }

        if (!h.dosage || isNaN(Number(h.dosage))) {
          histError.dosage = "Dosage must be a valid number";
        }

        medError.history![hIndex] = histError;
      });

      newErrors[mIndex] = medError;
    });

    setErrors(newErrors);

    return newErrors.every(
      (e) =>
        !e.name &&
        (!e.history ||
          e.history.every((h) => !h.startDate && !h.dosage))
    );
  };

  /* ----------------- save ----------------- */

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await updateMedications(medicalFileId, formData);
      setData(formData);
      toast.success("Medications updated");
    } catch {
      toast.error("Failed to update medications");
    }
  };

  const list = editable ? formData : data;

  /* ----------------- UI ----------------- */

   return (
    <div className="overflow-x-auto space-y-4">
      {list.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          No medications recorded
        </p>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="px-4 py-3 text-left text-sm text-gray-600">
              Medication Name
            </th>
            <th className="px-4 py-3 text-left text-sm text-gray-600">
              Start Date
            </th>
            <th className="px-4 py-3 text-left text-sm text-gray-600">
              Dosage
            </th>
            {editable && <th className="px-4 py-3"></th>}
          </tr>
        </thead>

        <tbody>
          {list.map((med, mIndex) =>
            (med.history ?? []).map((hist, hIndex) => (
              <tr key={`${mIndex}-${hIndex}`} className="border-b">
                {/* Medication name */}
                {hIndex === 0 && (
                  <td
                    rowSpan={(med.history ?? []).length}
                    className="px-4 py-3 align-top"
                  >
                    {editable ? (
                      <div className="min-h-[60px]">
                        <Input
                          value={med.name ?? ""}
                          onChange={(e) =>
                            handleMedicationChange(
                              mIndex,
                              "name",
                              e.target.value
                            )
                          }
                          className={
                            errors[mIndex]?.name ? "border-red-500" : ""
                          }
                        />
                        <div className="h-5 mt-1">
                          {errors[mIndex]?.name && (
                            <p className="text-sm text-red-500">
                              {errors[mIndex].name}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      med.name || "—"
                    )}
                  </td>
                )}

                {/* Start date */}
                <td className="px-4 py-3">
                  {editable ? (
                    <div className="min-h-[60px]">
                      <Input
                        type="date"
                        value={hist.startDate ?? ""}
                        onChange={(e) =>
                          handleHistoryChange(
                            mIndex,
                            hIndex,
                            "startDate",
                            e.target.value
                          )
                        }
                        className={
                          errors[mIndex]?.history?.[hIndex]?.startDate
                            ? "border-red-500"
                            : ""
                        }
                      />
                      <div className="h-5 mt-1">
                        {errors[mIndex]?.history?.[hIndex]?.startDate && (
                          <p className="text-sm text-red-500">
                            {errors[mIndex].history![hIndex].startDate}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    hist.startDate || "—"
                  )}
                </td>

                {/* Dosage */}
                <td className="px-4 py-3">
                  {editable ? (
                    <div className="min-h-[60px]">
                      <div className="flex items-center gap-2">
                        <Input
                          value={hist.dosage ?? ""}
                          onChange={(e) =>
                            handleHistoryChange(
                              mIndex,
                              hIndex,
                              "dosage",
                              e.target.value
                            )
                          }
                          className={
                            errors[mIndex]?.history?.[hIndex]?.dosage
                              ? "border-red-500"
                              : ""
                          }
                        />
                        <span className="text-sm text-gray-500">mg</span>
                      </div>
                      <div className="h-5 mt-1">
                        {errors[mIndex]?.history?.[hIndex]?.dosage && (
                          <p className="text-sm text-red-500">
                            {errors[mIndex].history![hIndex].dosage}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    hist.dosage ? `${hist.dosage} mg` : "—"
                  )}
                </td>

                {editable && (
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        removeHistory(mIndex, hIndex)
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {editable && (
        <div className="flex gap-2">
          <Button variant="outline" onClick={addMedication}>
            <Plus className="w-4 h-4" /> Add Medication
          </Button>
          <Button onClick={handleSave}>Save Medications</Button>
        </div>
      )}
    </div>
  );
}