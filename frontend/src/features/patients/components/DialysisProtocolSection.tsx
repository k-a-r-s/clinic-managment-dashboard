  import { useEffect, useState } from "react";
  import { Button } from "../../../components/ui/button";
  import { Input } from "../../../components/ui/input";
  import { toast } from "react-hot-toast";
  import {
    getDialysisProtocol,
    updateDialysisProtocol,
  } from "../api/medical.api";
  import type { DialysisProtocol } from "../../../types";

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  interface Props {
    patientId: string;
    medicalFileId: string;
    editable?: boolean;
  }

  export function DialysisProtocolSection({
    patientId,
    medicalFileId,
    editable = true,
  }: Props) {
    const [data, setData] = useState<DialysisProtocol | null>(null);

    const [formData, setFormData] = useState<DialysisProtocol>({
      dialysisDays: [],
      incidents: [],
      sessionsPerWeek: 0,
      generator: "",
      sessionDuration: "",
      dialyser: "",
      needle: "",
      bloodFlow: "",
      anticoagulation: "",
      dryWeight: "",
      interDialyticWeightGain: "",
    });

    const [errors, setErrors] = useState<
      Partial<Record<keyof DialysisProtocol | "dialysisDays" | "incidents" , string>>
    >({});

    useEffect(() => {
      loadData();
    }, [patientId]);

    const loadData = async () => {
      try {
        const res = await getDialysisProtocol(patientId);
        const protocol = res ?? null;
        setData(protocol);
        setFormData(protocol ?? formData);
      } catch {
        toast.error("Failed to load dialysis protocol");
      }
    };

    useEffect(() => {
      if (!editable && data) setFormData(data);
    }, [editable, data]);

    const clearError = (field: keyof typeof errors) => {
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

    const toggleDay = (day: string) => {
      setFormData((prev) => {
        const updated = prev.dialysisDays?.includes(day)
          ? prev.dialysisDays.filter((d) => d !== day)
          : [...(prev.dialysisDays ?? []), day];

        return { ...prev, dialysisDays: updated };
      });
      clearError("dialysisDays");
    };

    const handleChange = (field: keyof DialysisProtocol, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      clearError(field);
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

    const validateForm = () => {
      const newErrors: typeof errors = {};

      if (!formData.dialysisDays?.length) {
        newErrors.dialysisDays = "Select at least one dialysis day";
      }

      if (!formData.sessionsPerWeek || isNaN(Number(formData.sessionsPerWeek))) {
        newErrors.sessionsPerWeek = "Sessions per week must be a valid number";
      }
      else if (!formData.dialysisDays?.length || Number(formData.sessionsPerWeek) !=  formData.dialysisDays?.length) {
        newErrors.sessionsPerWeek = "Sessions per week must match number of dialysis days ";
      }

      if (!formData.generator.trim()) {
        newErrors.generator = "Generator is required";
      }

      if (!formData.sessionDuration.trim() || isNaN(Number(formData.sessionDuration)) ) {
        newErrors.sessionDuration = "Session duration must be a valid number";
      }

      if (!formData.bloodFlow || isNaN(Number(formData.bloodFlow))) {
        newErrors.bloodFlow = "Blood flow must be a number";
      }

      if (!formData.dryWeight || isNaN(Number(formData.dryWeight))) {
        newErrors.dryWeight = "Dry weight must be a number";
      }

      if (!formData.interDialyticWeightGain || isNaN(Number(formData.interDialyticWeightGain))) {
        newErrors.interDialyticWeightGain = "Interdialytic Weight Gain must be a number";
      }

      if (
        formData.incidents?.some(
          (incident) => !incident || !incident.trim()
        )
      ) {
        newErrors.incidents = "Incident description cannot be empty";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
      if (!validateForm()) return;

      try {
        await updateDialysisProtocol(medicalFileId, formData);
        setData(formData);
        toast.success("Dialysis protocol updated");
      } catch {
        toast.error("Failed to update protocol");
      }
    };

    const view = editable ? formData : data;

    if (!view) {
      return (
        <p className="text-sm text-gray-500 italic">
          No dialysis protocol recorded
        </p>
      );
    }

    return (
      <div className="space-y-6">
        {/* Dialysis Days */}
        <div>
          <label className="text-sm font-medium text-gray-600 mb-2 block">
            Dialysis Days <span className="text-red-500">*</span>
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
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
          {errors.dialysisDays && (
            <p className="text-sm text-red-500 mt-1">
              {errors.dialysisDays}
            </p>
          )}
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
          ].map(([field, label]) => {
            const key = field as keyof DialysisProtocol;

            return (
              <div key={field} className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">
                  {label}
                </label>

                {editable ? (
                  <Input
                    value={(view as any)[field] ?? ""}
                    onChange={(e) =>
                      handleChange(key, e.target.value)
                    }
                    className={errors[key] ? "border-red-500" : ""}
                  />
                ) : (
                  <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                    <p className="text-sm text-gray-900">
                      {(view as any)[field] || "—"}
                    </p>
                  </div>
                )}

                {errors[key] && (
                  <p className="text-sm text-red-500">
                    {errors[key]}
                  </p>
                )}
              </div>
            );
          })}
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
          {errors.incidents && (
            <p className="text-sm text-red-500">
              {errors.incidents}
            </p>
          )}

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
