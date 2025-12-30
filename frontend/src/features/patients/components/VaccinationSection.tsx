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
import type { Vaccination, Dose } from "../../../types";

interface Props {
  patientId: string;
  medicalFileId: string;
  editable?: boolean;
}

export  function VaccinationSection({
  patientId,
  medicalFileId,
  editable = true,
}: Props) {
  const [data, setData] = useState<Vaccination[]>([]);
  const [formData, setFormData] = useState<Vaccination[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, [patientId]);

  const loadData = async () => {
    try {
      const res = await getVaccinations(patientId);
      setData(res);
      setFormData(res);
    } catch {
      console.error("Failed to load vaccinations");
    }
  };

  useEffect(() => {
    if (!editable) setFormData(data);
  }, [editable, data]);

  const handleVaccineChange = (
    index: number,
    field: keyof Vaccination,
    value: any
  ) => {
    setFormData((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
    
    // Clear error for this field
    const errorKey = `vaccine-${index}-${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
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

    // Clear error for this field
    const errorKey = `dose-${vIndex}-${dIndex}-${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const addVaccine = () => {
    setFormData((prev) => [
      ...prev,
      {
        vaccineName: "",
        doses: [
          {
            doseNumber: 1,
            date: "",
          },
        ],
      },
    ]);
  };

  const removeVaccine = (index: number) => {
    setFormData((prev) => prev.filter((_, i) => i !== index));
    
    // Clear errors for this vaccine
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`vaccine-${index}-`) || key.startsWith(`dose-${index}-`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
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

    // Clear errors for this dose
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`dose-${vIndex}-${dIndex}-`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    formData.forEach((vaccination, vIndex) => {
      // Validate vaccine name
      if (!vaccination.vaccineName?.trim()) {
        newErrors[`vaccine-${vIndex}-vaccineName`] = "Vaccine name is required";
      }

      // Validate doses
      (vaccination.doses ?? []).forEach((dose, dIndex) => {
        if (!dose.date) {
          newErrors[`dose-${vIndex}-${dIndex}-date`] = "Date is required";
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      console.error("Validation failed");
      return;
    }

    try {
      await updateVaccinations(medicalFileId, formData);
      setData(formData);
      console.log("Vaccinations updated successfully");
    } catch {
      console.error("Failed to update vaccinations");
    }
  };

  const list = editable ? formData : data;

  return (
    <div className="space-y-4">
      {list.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          No vaccinations recorded
        </p>
      )}

      {list.map((vaccination, vIndex) => (
        <div key={vIndex} className="border rounded-lg p-4 space-y-4">
          {/* Vaccine header */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              {editable ? (
                <div className="flex-1 space-y-1">
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
                    className={errors[`vaccine-${vIndex}-vaccineName`] ? "border-red-500" : ""}
                  />
                  {errors[`vaccine-${vIndex}-vaccineName`] && (
                    <p className="text-sm text-red-500">
                      {errors[`vaccine-${vIndex}-vaccineName`]}
                    </p>
                  )}
                </div>
              ) : (
                <h4 className="text-sm font-semibold flex-1">
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
          </div>

          {/* Doses */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(vaccination.doses ?? []).map((dose, dIndex) => (
              <div key={dIndex} className="space-y-2">
                <Label>Dose {dose.doseNumber}</Label>

                {editable ? (
                  <>
                    <div className="space-y-1">
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
                        className={errors[`dose-${vIndex}-${dIndex}-date`] ? "border-red-500" : ""}
                      />
                      {errors[`dose-${vIndex}-${dIndex}-date`] && (
                        <p className="text-sm text-red-500">
                          {errors[`dose-${vIndex}-${dIndex}-date`]}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDose(vIndex, dIndex)}
                    >
                      Remove dose
                    </Button>
                  </>
                ) : (
                  <p className="bg-gray-50 h-9 px-3 flex items-center rounded-lg">
                    {dose.date || "—"}
                  </p>
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