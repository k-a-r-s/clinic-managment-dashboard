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
import type { Medication , MedicationHistory } from "../../../types";

interface Props {
  patientId: string;
  medicalFileId: string;
  editable?: boolean;
}

export function MedicationsSection({
  patientId,
  medicalFileId,
  editable = true,
}: Props) {
  const [data, setData] = useState<Medication[]>([]);
  const [formData, setFormData] = useState<Medication[]>([]);

  useEffect(() => {
    loadData();
  }, [patientId]);

  const loadData = async () => {
    try {
      const res = await getMedications(patientId);
      setData(res);
      setFormData(res);
    } catch {
      toast.error("Failed to load medications");
    }
  };

  useEffect(() => {
    if (!editable) setFormData(data);
  }, [editable]);

  const handleMedicationChange = (
    index: number,
    field: keyof Medication,
    value: any
  ) => {
    setFormData((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
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
  };

  const addMedication = () => {
    setFormData((prev) => [
      ...prev,
      {
        name: "",
        history: [{ startDate: "", dosage: "" }],
      },
    ]);
  };

  const removeMedication = (index: number) => {
    setFormData((prev) => prev.filter((_, i) => i !== index));
  };

  const addHistory = (mIndex: number) => {
    setFormData((prev) =>
      prev.map((m, i) =>
        i === mIndex
          ? {
              ...m,
              history: [
                ...(m.history ?? []),
                { startDate: "", dosage: "" },
              ],
            }
          : m
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
  };

  const handleSave = async () => {
    try {
      await updateMedications(medicalFileId, formData);
      setData(formData);
      toast.success("Medications updated");
    } catch {
      toast.error("Failed to update medications");
    }
  };

  const list = editable ? formData : data;

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
                {hIndex === 0 && (
                  <td
                    rowSpan={(med.history ?? []).length}
                    className="px-4 py-3 align-top"
                  >
                    {editable ? (
                      <Input
                        value={med.name ?? ""}
                        onChange={(e) =>
                          handleMedicationChange(
                            mIndex,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      med.name || "—"
                    )}
                  </td>
                )}

                <td className="px-4 py-3">
                  {editable ? (
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
                    />
                  ) : (
                    hist.startDate || "—"
                  )}
                </td>

                <td className="px-4 py-3">
                  {editable ? (
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
                    />
                  ) : (
                    hist.dosage || "—"
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
