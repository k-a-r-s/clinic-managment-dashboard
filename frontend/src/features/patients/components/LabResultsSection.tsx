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
  const [editingParamName, setEditingParamName] = useState<Record<string, string>>({});

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

  const handleResultChange = (index: number, field: keyof LabResult, value: any) => {
    setFormData((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  };

  const handleParameterChange = (index: number, paramName: string, value: string) => {
    setFormData((prev) =>
      prev.map((r, i) =>
        i === index
          ? { ...r, parameters: { ...r.parameters, [paramName]: value } }
          : r
      )
    );
  };

  const addLabResult = () => {
    setFormData((prev) => [...prev, { date: "", parameters: {} }]);
  };

  const removeLabResult = (index: number) => {
    setFormData((prev) => prev.filter((_, i) => i !== index));
  };

  const addParameter = (index: number) => {
    const existingNumbers = Object.keys(formData[index].parameters)
      .filter((p) => p.match(/^Parameter \d+$/))
      .map((p) => parseInt(p.replace("Parameter ", "")))
      .filter((n) => !isNaN(n));
    const nextNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    const tempKey = `Parameter ${nextNum}`;
    setFormData((prev) =>
      prev.map((r, i) =>
        i === index
          ? { ...r, parameters: { ...r.parameters, [tempKey]: "" } }
          : r
      )
    );
  };

  const removeParameter = (index: number, paramName: string) => {
    setFormData((prev) =>
      prev.map((r, i) => {
        if (i === index) {
          const newParams = { ...r.parameters };
          delete newParams[paramName];
          return { ...r, parameters: newParams };
        }
        return r;
      })
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
        const newParams = { ...r.parameters };
        if (oldName in newParams) {
          newParams[newName] = newParams[oldName];
          delete newParams[oldName];
        }
        return { ...r, parameters: newParams };
      })
    );

    setEditingParamName((prev) => {
      const copy = { ...prev };
      delete copy[oldName];
      return copy;
    });
  };

  const handleSave = async () => {
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
    new Set(list.flatMap((result) => Object.keys(result.parameters || {})))
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
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  {allParameters.map((param) => (
                    <th
                      key={param}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {editable ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editingParamName[param] ?? param}
                            onChange={(e) =>
                              setEditingParamName((prev) => ({ ...prev, [param]: e.target.value }))
                            }
                            onBlur={() => applyRename(param)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                applyRename(param);
                                e.currentTarget.blur();
                              }
                            }}
                            className="min-w-[120px] bg-white"
                          />
                        </div>
                      ) : (
                        param
                      )}
                    </th>
                  ))}
                  {editable && (
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {list.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editable ? (
                        <Input
                          type="date"
                          value={result.date ?? ""}
                          onChange={(e) => handleResultChange(index, "date", e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-900">{result.date || "—"}</span>
                      )}
                    </td>
                    {allParameters.map((param) => (
                      <td key={param} className="px-6 py-4 whitespace-nowrap">
                        {editable ? (
                          <Input
                            value={result.parameters?.[param] ?? ""}
                            onChange={(e) => handleParameterChange(index, param, e.target.value)}
                            placeholder="Value"
                            className="w-full"
                          />
                        ) : (
                          <span className="text-sm text-gray-900">{result.parameters?.[param] ?? "—"}</span>
                        )}
                      </td>
                    ))}
                    {editable && (
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addParameter(index)}
                            title="Add parameter"
                            className="hover:bg-gray-100 hover:text-gray-700"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLabResult(index)}
                            title="Remove result"
                            className="hover:bg-gray-100 hover:text-gray-700"
                          >
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
          <Button
            variant="outline"
            onClick={addLabResult}
            className="flex items-center gap-2 hover:bg-gray-100 hover:text-gray-700 hover:border-gray-400"
          >
            <Plus className="w-4 h-4" /> Add Lab Result
          </Button>
          <Button
            onClick={handleSave}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white"
          >
            Save Lab Results
          </Button>
        </div>
      )}
    </div>
  );
}
