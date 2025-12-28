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

type VascularAccess = {
  type?: string;
  site?: string;
  operator?: string;
  firstUseDate?: string;
  creationDates?: string[];
};

interface Props {
  patientId: string;
  editable?: boolean;
}

export function VascularAccessSection({
  patientId,
  editable = true,
}: Props) {
  const [data, setData] = useState<VascularAccess[]>([]);
  const [formData, setFormData] = useState<VascularAccess[]>([]);

  useEffect(() => {
    loadData();
  }, [patientId]);

  const loadData = async () => {
    try {
      const res = await getVascularAccess(patientId);
      setData(res);
      setFormData(res);
    } catch {
      toast.error("Failed to load vascular access");
    }
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
  };

  const handleAdd = () => {
    setFormData((prev) => [
      ...prev,
      {
        type: "",
        site: "",
        operator: "",
        firstUseDate: "",
        creationDates: [],
      },
    ]);
  };

  const handleRemove = (index: number) => {
    setFormData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      await updateVascularAccess(patientId, formData);
      setData(formData);
      toast.success("Vascular access updated");
    } catch {
      toast.error("Failed to update vascular access");
    }
  };

  useEffect(() => {
    if (!editable) {
      setFormData(data);
    }
  }, [editable]);

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
              <Label>Type</Label>
              {editable ? (
                <Input
                  value={access.type ?? ""}
                  onChange={(e) =>
                    handleChange(index, "type", e.target.value)
                  }
                />
              ) : (
                <p className="bg-gray-50 h-9 px-3 flex items-center rounded-lg">
                  {access.type || "—"}
                </p>
              )}
            </div>

            {/* Site */}
            <div className="space-y-1">
              <Label>Site</Label>
              {editable ? (
                <Input
                  value={access.site ?? ""}
                  onChange={(e) =>
                    handleChange(index, "site", e.target.value)
                  }
                />
              ) : (
                <p className="bg-gray-50 h-9 px-3 flex items-center rounded-lg">
                  {access.site || "—"}
                </p>
              )}
            </div>

            {/* Operator */}
            <div className="space-y-1">
              <Label>Operator</Label>
              {editable ? (
                <Input
                  value={access.operator ?? ""}
                  onChange={(e) =>
                    handleChange(index, "operator", e.target.value)
                  }
                />
              ) : (
                <p className="bg-gray-50 h-9 px-3 flex items-center rounded-lg">
                  {access.operator || "—"}
                </p>
              )}
            </div>

            {/* First Use */}
            <div className="space-y-1">
              <Label>First Use Date</Label>
              {editable ? (
                <Input
                  type="date"
                  value={access.firstUseDate ?? ""}
                  onChange={(e) =>
                    handleChange(index, "firstUseDate", e.target.value)
                  }
                />
              ) : (
                <p className="bg-gray-50 h-9 px-3 flex items-center rounded-lg">
                  {access.firstUseDate || "—"}
                </p>
              )}
            </div>

            {/* Creation Dates */}
            <div className="space-y-1 col-span-full">
              <Label>Creation Dates</Label>
              {editable ? (
                <Input
                  placeholder="YYYY-MM-DD, YYYY-MM-DD"
                  value={(access.creationDates ?? []).join(", ")}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "creationDates",
                      e.target.value
                        .split(",")
                        .map((d) => d.trim())
                        .filter(Boolean)
                    )
                  }
                />
              ) : (
                <p className="bg-gray-50 px-3 py-2 rounded-lg">
                  {(access.creationDates ?? []).join(", ") || "—"}
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
                <Trash2 className="w-4 h-4" /> Remove
              </Button>
            </div>
          )}
        </div>
      ))}

      {editable && (
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAdd}>
            <Plus className="w-4 h-4" /> Add Access
          </Button>
          <Button onClick={handleSave}>Save Vascular Access</Button>
        </div>
      )}
    </div>
  );
}
