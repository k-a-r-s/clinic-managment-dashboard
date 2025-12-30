import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { getLabResults, updateLabResults } from "../api/medical.api";
import type { LabResult } from "../../../types";

interface Props {
  patientId: string;
  medicalFileId: string;
  editable?: boolean;
}

export function LabResultsSection({
  patientId,
  medicalFileId,
  editable = true,
}: Props) {
  const [data, setData] = useState<LabResult[]>([]);
  const [formData, setFormData] = useState<LabResult[]>([]);
  const [editingParamName, setEditingParamName] = useState<Record<string, string>>(
    {}
  );

  /**
   * errors[resultIndex] = {
   *   _date?: string,
   *   [parameterName]: string
   * }
   */
  const [errors, setErrors] = useState<
    Record<number, { _date?: string } & Record<string, string>>
  >({});

  useEffect(() => {
    loadData();
  }, [patientId]);

  const loadData = async () => {
    try {
      const res = await getLabResults(patientId);
      setData(res);
      setFormData(res);
    } catch {
      toast.error("Failed to load lab results");
    }
  };

  useEffect(() => {
    if (!editable) setFormData(data);
  }, [editable, data]);

  const handleResultChange = (
    index: number,
    field: keyof LabResult,
    value: any
  ) => {
    setFormData((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );

    // clear date error while editing
    if (field === "date" && errors[index]?._date) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[index]._date;
        if (Object.keys(copy[index]).length === 0) delete copy[index];
        return copy;
      });
    }
  };

  const handleParameterChange = (
    index: number,
    paramName: string,
    value: string
  ) => {
    setFormData((prev) =>
      prev.map((r, i) =>
        i === index
          ? { ...r, parameters: { ...r.parameters, [paramName]: value } }
          : r
      )
    );

    // clear parameter error while typing
    if (errors[index]?.[paramName]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[index][paramName];
        if (Object.keys(copy[index]).length === 0) delete copy[index];
        return copy;
      });
    }
  };

  const addLabResult = () => {
    setFormData((prev) => [...prev, { date: "", parameters: {} }]);
  };

  const removeLabResult = (index: number) => {
    setFormData((prev) => prev.filter((_, i) => i !== index));
  };

  const addParameter = (index: number) => {
    const existingNumbers = Object.keys(formData[index].parameters || {})
      .filter((p) => /^Parameter \d+$/.test(p))
      .map((p) => parseInt(p.replace("Parameter ", "")))
      .filter((n) => !isNaN(n));

    const nextNum =
      existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;

    const key = `Parameter ${nextNum}`;

    setFormData((prev) =>
      prev.map((r, i) =>
        i === index
          ? { ...r, parameters: { ...r.parameters, [key]: "" } }
          : r
      )
    );
  };

  const applyRename = (oldName: string) => {
    const newName = (editingParamName[oldName] ?? oldName).trim();

    if (!newName || newName === oldName) {
      setEditingParamName((prev) => {
        const copy = { ...prev };
        delete copy[oldName];
        return copy;
      });
      return;
    }

    setFormData((prev) =>
      prev.map((r) => {
        const params = { ...r.parameters };
        if (oldName in params) {
          params[newName] = params[oldName];
          delete params[oldName];
        }
        return { ...r, parameters: params };
      })
    );

    setEditingParamName((prev) => {
      const copy = { ...prev };
      delete copy[oldName];
      return copy;
    });
  };

  // ✅ VALIDATION: date + numeric parameters
  const validateForm = () => {
    const newErrors: typeof errors = {};

    formData.forEach((result, index) => {
      // date required
      if (!result.date) {
        newErrors[index] = { ...(newErrors[index] || {}), _date: "Date is required" };
      }

      // parameters must be numbers
      Object.entries(result.parameters || {}).forEach(([param, value]) => {
        if (value === "" || value === null || value === undefined) return;

        if (isNaN(Number(value))) {
          if (!newErrors[index]) newErrors[index] = {};
          newErrors[index][param] = "Value must be a number";
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix validation errors");
      return;
    }

    try {
      await updateLabResults(medicalFileId, formData);
      setData(formData);
      toast.success("Lab results updated");
    } catch {
      toast.error("Failed to update lab results");
    }
  };

  const list = editable ? formData : data;
  const allParameters = Array.from(
    new Set(list.flatMap((r) => Object.keys(r.parameters || {})))
  );

  return (
    <div className="space-y-6">
      {list.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-sm text-gray-500">No lab results recorded yet</p>
        </div>
      )}

      {list.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                    Date
                  </th>
                  {allParameters.map((param) => (
                    <th key={param} className="px-6 py-4 text-left text-xs font-semibold uppercase">
                      {editable ? (
                        <Input
                          value={editingParamName[param] ?? param}
                          onChange={(e) =>
                            setEditingParamName((prev) => ({
                              ...prev,
                              [param]: e.target.value,
                            }))
                          }
                          onBlur={() => applyRename(param)}
                        />
                      ) : (
                        param
                      )}
                    </th>
                  ))}
                  {editable && <th className="px-6 py-4 text-right">Actions</th>}
                </tr>
              </thead>

              <tbody className="divide-y">
                {list.map((result, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4">
                      {editable ? (
                        <>
                          <Input
                            type="date"
                            value={result.date ?? ""}
                            onChange={(e) =>
                              handleResultChange(index, "date", e.target.value)
                            }
                            className={errors[index]?._date ? "border-red-500" : ""}
                          />
                          {errors[index]?._date && (
                            <p className="text-xs text-red-500 mt-1">
                              {errors[index]._date}
                            </p>
                          )}
                        </>
                      ) : (
                        result.date || "—"
                      )}
                    </td>

                    {allParameters.map((param) => (
                      <td key={param} className="px-6 py-4">
                        {editable ? (
                          <>
                            <Input
                              value={result.parameters?.[param] ?? ""}
                              onChange={(e) =>
                                handleParameterChange(index, param, e.target.value)
                              }
                              className={
                                errors[index]?.[param] ? "border-red-500" : ""
                              }
                              placeholder="Value"
                            />
                            {errors[index]?.[param] && (
                              <p className="text-xs text-red-500 mt-1">
                                {errors[index][param]}
                              </p>
                            )}
                          </>
                        ) : (
                          result.parameters?.[param] ?? "—"
                        )}
                      </td>
                    ))}

                    {editable && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => addParameter(index)}>
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => removeLabResult(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editable && (
        <div className="flex gap-3">
          <Button variant="outline" onClick={addLabResult}>
            <Plus className="w-4 h-4 mr-2" /> Add Lab Result
          </Button>
          <Button onClick={handleSave} className="bg-gray-700 text-white">
            Save Lab Results
          </Button>
        </div>
      )}
    </div>
  );
}
