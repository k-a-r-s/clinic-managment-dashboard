import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  getVascularAccess,
  updateVascularAccess,
} from "../api/medical.api";
import type { VascularAccess } from "../../../types";

interface Props {
  patientId: string;
  medicalFileId: string;
  editable?: boolean;
}

/**
 * errors[index][field] = "error message"
 */
type AccessErrors = Array<
  Partial<Record<keyof VascularAccess, string>>
>;

export function VascularAccessSection({
  patientId,
  medicalFileId,
  editable = true,
}: Props) {
  const [data, setData] = useState<VascularAccess[]>([]);
  const [formData, setFormData] = useState<VascularAccess[]>([]);
  const [errors, setErrors] = useState<AccessErrors>([]);

  useEffect(() => {
    loadData();
  }, [patientId]);

  const loadData = async () => {
    try {
      const res = await getVascularAccess(patientId);
      setData(res);
      setFormData(res);
      setErrors([]);
    } catch {
      toast.error("Failed to load vascular access");
    }
  };

  const clearError = (
    index: number,
    field: keyof VascularAccess
  ) => {
    setErrors((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], [field]: undefined };
      }
      return copy;
    });
  };

  const handleChange = (
    index: number,
    field: keyof VascularAccess,
    value: any
  ) => {
    setFormData((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
    clearError(index, field);
  };

  const handleAdd = () => {
    setFormData((prev) => [
      ...prev,
      {
        type: "",
        site: "",
        operator: "",
        firstUseDate: "",
        creationDate: "",
      } as VascularAccess,
    ]);
    setErrors((prev) => [...prev, {}]);
  };

  const handleRemove = (index: number) => {
    setFormData((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: AccessErrors = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    formData.forEach((access, index) => {
      const rowErrors: Partial<Record<keyof VascularAccess, string>> =
        {};

      if (!access.type?.trim()) {
        rowErrors.type = "Type is required";
      }

      if (!access.site?.trim()) {
        rowErrors.site = "Site is required";
      }

      if (!access.operator?.trim()) {
        rowErrors.operator = "Operator is required";
      }

      if (!access.firstUseDate) {
        rowErrors.firstUseDate = "First use date is required";
      }

      if (!access.creationDate) {
        rowErrors.creationDate = "Creation date is required";
      } else {
        const creation = new Date(access.creationDate);
        creation.setHours(0, 0, 0, 0);

        if (creation >= today) {
          rowErrors.creationDate =
            "Creation date must be in the past";
        }
      }

      newErrors[index] = rowErrors;
    });

    setErrors(newErrors);
    return newErrors.every(
      (row) => !row || Object.keys(row).length === 0
    );
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await updateVascularAccess(medicalFileId, formData);
      setData(formData);
      toast.success("Vascular access updated");
    } catch {
      toast.error("Failed to update vascular access");
    }
  };

  useEffect(() => {
    if (!editable) {
      setFormData(data);
      setErrors([]);
    }
  }, [editable, data]);

  const list = editable ? formData : data;

  return (
    <div className="space-y-4">
      {list.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          No vascular access recorded
        </p>
      )}

      {list.map((access, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-4 space-y-3"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Type */}
            <div className="space-y-1">
              <Label>Type *</Label>
              <Input
                value={access.type ?? ""}
                onChange={(e) =>
                  handleChange(index, "type", e.target.value)
                }
                className={errors[index]?.type ? "border-red-500" : ""}
              />
              {errors[index]?.type && (
                <p className="text-sm text-red-500">
                  {errors[index]?.type}
                </p>
              )}
            </div>

            {/* Site */}
            <div className="space-y-1">
              <Label>Site *</Label>
              <Input
                value={access.site ?? ""}
                onChange={(e) =>
                  handleChange(index, "site", e.target.value)
                }
                className={errors[index]?.site ? "border-red-500" : ""}
              />
              {errors[index]?.site && (
                <p className="text-sm text-red-500">
                  {errors[index]?.site}
                </p>
              )}
            </div>

            {/* Operator */}
            <div className="space-y-1">
              <Label>Operator *</Label>
              <Input
                value={access.operator ?? ""}
                onChange={(e) =>
                  handleChange(index, "operator", e.target.value)
                }
                className={
                  errors[index]?.operator ? "border-red-500" : ""
                }
              />
              {errors[index]?.operator && (
                <p className="text-sm text-red-500">
                  {errors[index]?.operator}
                </p>
              )}
            </div>

            {/* First Use Date */}
            <div className="space-y-1">
              <Label>First Use Date *</Label>
              <Input
                type="date"
                value={access.firstUseDate ?? ""}
                onChange={(e) =>
                  handleChange(index, "firstUseDate", e.target.value)
                }
                className={
                  errors[index]?.firstUseDate ? "border-red-500" : ""
                }
              />
              {errors[index]?.firstUseDate && (
                <p className="text-sm text-red-500">
                  {errors[index]?.firstUseDate}
                </p>
              )}
            </div>

            {/* Creation Date */}
            <div className="space-y-1">
              <Label>Creation Date *</Label>
              <Input
                type="date"
                value={access.creationDate ?? ""}
                onChange={(e) =>
                  handleChange(index, "creationDate", e.target.value)
                }
                className={
                  errors[index]?.creationDate ? "border-red-500" : ""
                }
              />
              {errors[index]?.creationDate && (
                <p className="text-sm text-red-500">
                  {errors[index]?.creationDate}
                </p>
              )}
            </div>
          </div>

          {editable && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRemove(index)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          )}
        </div>
      ))}

      {editable && (
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-1" />
            Add Access
          </Button>
          <Button onClick={handleSave}>
            Save Vascular Access
          </Button>
        </div>
      )}
    </div>
  );
}
