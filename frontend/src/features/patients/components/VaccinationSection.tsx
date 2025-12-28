import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  getVaccinations,
  updateVaccinations,
} from "../api/medical.api";

type Dose = {
  doseNumber?: number;
  date?: string;
  reminderDate?: string;
};

type Vaccination = {
  vaccineName?: string;
  doses?: Dose[];
};

interface Props {
  patientId: string;
  editable?: boolean;
}

export function VaccinationSection({
  patientId,
  editable = false,
}: Props) {
  const [data, setData] = useState<Vaccination[]>([]);
  const [formData, setFormData] = useState<Vaccination[]>([]);

  useEffect(() => {
    loadData();
  }, [patientId]);

  const loadData = async () => {
    try {
      const res = await getVaccinations(patientId);
      setData(res);
      setFormData(res);
    } catch {
      toast.error("Failed to load vaccinations");
    }
  };

  useEffect(() => {
    if (!editable) setFormData(data);
  }, [editable]);

  const handleVaccineChange = (
    index: number,
    field: keyof Vaccination,
    value: any
  ) => {
    setFormData((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const handleDoseChange = (
    vIndex: number,
    dIndex: number,
    field: keyof Dose,
    value: any
  ) => {
    setFormData((prev) =>
      prev.map((v, i) =>
        i === vIndex
          ? {
              ...v,
              doses: (v.doses ?? []).map((d, j) =>
                j === dIndex ? { ...d, [field]: value } : d
              ),
            }
          : v
      )
    );
  };

  const addVaccine = () => {
    setFormData((prev) => [
      ...prev,
      { vaccineName: "", doses: [] },
    ]);
  };

  const removeVaccine = (index: number) => {
    setFormData((prev) => prev.filter((_, i) => i !== index));
  };

  const addDose = (vIndex: number) => {
    setFormData((prev) =>
      prev.map((v, i) =>
        i === vIndex
          ? {
              ...v,
              doses: [
                ...(v.doses ?? []),
                {
                  doseNumber: (v.doses?.length ?? 0) + 1,
                  date: "",
                  reminderDate: "",
                },
              ],
            }
          : v
      )
    );
  };

  const removeDose = (vIndex: number, dIndex: number) => {
    setFormData((prev) =>
      prev.map((v, i) =>
        i === vIndex
          ? {
              ...v,
              doses: v.doses?.filter((_, j) => j !== dIndex),
            }
          : v
      )
    );
  };

  const handleSave = async () => {
    try {
      await updateVaccinations(patientId, formData);
      setData(formData);
      toast.success("Vaccinations updated");
    } catch {
      toast.error("Failed to update vaccinations");
    }
  };

  const list = editable ? formData : data;

  return (
    <div className="space-y-6">
      {list.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          No vaccinations recorded
        </p>
      )}

      {list.map((vaccination, vIndex) => (
        <div key={vIndex} className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            {editable ? (
              <Input
                placeholder="Vaccine name"
                value={vaccination.vaccineName ?? ""}
                onChange={(e) =>
                  handleVaccineChange(
                    vIndex,
                    "vaccineName",
                    e.target.value
                  )
                }
              />
            ) : (
              <h4 className="text-sm font-semibold">
                {vaccination.vaccineName || "—"}
              </h4>
            )}

            {editable && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeVaccine(vIndex)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(vaccination.doses ?? []).map((dose, dIndex) => (
              <div key={dIndex} className="space-y-1">
                <Label>Dose {dose.doseNumber}</Label>

                {editable ? (
                  <>
                    <Input
                      type="date"
                      value={dose.date ?? ""}
                      onChange={(e) =>
                        handleDoseChange(
                          vIndex,
                          dIndex,
                          "date",
                          e.target.value
                        )
                      }
                    />
                    <Input
                      type="date"
                      placeholder="Reminder"
                      value={dose.reminderDate ?? ""}
                      onChange={(e) =>
                        handleDoseChange(
                          vIndex,
                          dIndex,
                          "reminderDate",
                          e.target.value
                        )
                      }
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDose(vIndex, dIndex)}
                    >
                      Remove dose
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="bg-gray-50 h-9 px-3 flex items-center rounded-lg">
                      {dose.date || "—"}
                    </p>
                    {dose.reminderDate && (
                      <p className="text-xs text-gray-500">
                        Reminder: {dose.reminderDate}
                      </p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {editable && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => addDose(vIndex)}
            >
              <Plus className="w-4 h-4" /> Add Dose
            </Button>
          )}
        </div>
      ))}

      {editable && (
        <div className="flex gap-2">
          <Button variant="outline" onClick={addVaccine}>
            <Plus className="w-4 h-4" /> Add Vaccine
          </Button>
          <Button onClick={handleSave}>Save Vaccinations</Button>
        </div>
      )}
    </div>
  );
}
