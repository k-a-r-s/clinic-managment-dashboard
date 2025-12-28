import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { toast } from "react-hot-toast";
import {
  getDialysisProtocol,
  updateDialysisProtocol,
} from "../api/medical.api";

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type DialysisProtocol = {
  dialysisDays?: string[];
  sessionsPerWeek?: number | null;
  generator?: string;
  sessionDuration?: string;
  dialyser?: string;
  needle?: string;
  bloodFlow?: string;
  anticoagulation?: string;
  dryWeight?: string;
  interDialyticWeightGain?: string;
  incidents?: string[];
};

interface Props {
  patientId: string;
  editable?: boolean;
}

export function DialysisProtocolSection({
  patientId,
  editable = false,
}: Props) {
  const [data, setData] = useState<DialysisProtocol | null>(null);
  const [formData, setFormData] = useState<DialysisProtocol>({
    dialysisDays: [],
    incidents: [],
  });

  useEffect(() => {
    loadData();
  }, [patientId]);

  const loadData = async () => {
    try {
      const res = await getDialysisProtocol(patientId);
      setData(res);
      setFormData(
        res ?? { dialysisDays: [], incidents: [] }
      );
    } catch {
      toast.error("Failed to load dialysis protocol");
    }
  };

  useEffect(() => {
    if (!editable && data) setFormData(data);
  }, [editable]);

  const toggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      dialysisDays: prev.dialysisDays?.includes(day)
        ? prev.dialysisDays.filter((d) => d !== day)
        : [...(prev.dialysisDays ?? []), day],
    }));
  };

  const handleChange = (field: keyof DialysisProtocol, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleIncidentChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      incidents: (prev.incidents ?? []).map((i, idx) =>
        idx === index ? value : i
      ),
    }));
  };

  const addIncident = () => {
    setFormData((prev) => ({
      ...prev,
      incidents: [...(prev.incidents ?? []), ""],
    }));
  };

  const removeIncident = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      incidents: prev.incidents?.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      await updateDialysisProtocol(patientId, formData);
      setData(formData);
      toast.success("Dialysis protocol updated");
    } catch {
      toast.error("Failed to update protocol");
    }
  };

  const view = editable ? formData : data;

  if (!view)
    return (
      <p className="text-sm text-gray-500 italic">
        No dialysis protocol recorded
      </p>
    );

  return (
    <div className="space-y-6">
      {/* Dialysis Days */}
      <div>
        <label className="text-sm font-medium text-gray-600 mb-2 block">
          Dialysis Days
        </label>
        <div className="flex flex-wrap gap-2">
          {weekDays.map((day) => {
            const active = view.dialysisDays?.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => editable && toggleDay(day)}
                className={`px-3 py-2 rounded-lg text-sm ${
                  active
                    ? "bg-[#1C8CA8] text-white"
                    : "bg-gray-100 text-gray-400"
                } ${editable ? "cursor-pointer" : "cursor-default"}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Protocol Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          ["sessionsPerWeek", "Sessions per Week"],
          ["generator", "Generator"],
          ["sessionDuration", "Session Duration"],
          ["dialyser", "Dialyser"],
          ["needle", "Needle"],
          ["bloodFlow", "Blood Flow (mL/min)"],
          ["anticoagulation", "Anticoagulation"],
          ["dryWeight", "Dry Weight (kg)"],
          ["interDialyticWeightGain", "Interdialytic Weight Gain (kg)"],
        ].map(([field, label]) => (
          <div key={field} className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">
              {label}
            </label>
            {editable ? (
              <Input
                value={(view as any)[field] ?? ""}
                onChange={(e) =>
                  handleChange(field as any, e.target.value)
                }
              />
            ) : (
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                <p className="text-sm text-gray-900">
                  {(view as any)[field] || "—"}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Incidents */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-600">
          Incidents
        </label>

        {(view.incidents ?? []).map((incident, index) => (
          <div key={index} className="flex gap-2">
            {editable ? (
              <Input
                value={incident}
                onChange={(e) =>
                  handleIncidentChange(index, e.target.value)
                }
              />
            ) : (
              <p className="text-sm text-gray-900">{incident}</p>
            )}

            {editable && (
              <Button
                variant="ghost"
                onClick={() => removeIncident(index)}
              >
                ✕
              </Button>
            )}
          </div>
        ))}

        {editable && (
          <Button variant="outline" onClick={addIncident}>
            Add Incident
          </Button>
        )}
      </div>

      {editable && (
        <Button onClick={handleSave}>Save Protocol</Button>
      )}
    </div>
  );
}
