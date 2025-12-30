import { useState } from "react";
import { Calendar, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Checkbox } from "../../../components/ui/checkbox";
import { toast } from "react-hot-toast";
import type { SessionFormData } from "../../../types/dialysis.types";
import { createDialysisSession } from "../api/dialysis.api";

interface AddSessionFormProps {
  dialysisPatientId: string;
  patientName: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export function AddSessionForm({
  dialysisPatientId,
  patientName,
  onCancel,
  onSuccess,
}: AddSessionFormProps) {
  const [formData, setFormData] = useState<SessionFormData>({
    sessionDate: new Date().toISOString().split("T")[0],
    durationMinutes: 240,
    completed: true,
    complications: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.sessionDate) {
      toast.error("Session date is required");
      return;
    }

    if (formData.durationMinutes < 1) {
      toast.error("Duration must be positive");
      return;
    }

    try {
      setIsLoading(true);

      await createDialysisSession(dialysisPatientId, formData);
      toast.success("Session added successfully");
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create session:", error);
      toast.error("Failed to create session");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Add Dialysis Session
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Record a new dialysis session for {patientName}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Session Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Session Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sessionDate">Session Date *</Label>
                <Input
                  id="sessionDate"
                  type="date"
                  value={formData.sessionDate}
                  onChange={(e) =>
                    setFormData({ ...formData, sessionDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.durationMinutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      durationMinutes: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="completed"
                checked={formData.completed}
                onCheckedChange={(checked: boolean) =>
                  setFormData({ ...formData, completed: checked })
                }
              />
              <label
                htmlFor="completed"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Session completed successfully
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Weights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Weight className="h-5 w-5" />
              Weight Measurements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="preWeight">Pre-Weight (kg)</Label>
                <Input
                  id="preWeight"
                  type="number"
                  step="0.1"
                  value={formData.preWeight || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preWeight: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="0.0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postWeight">Post-Weight (kg)</Label>
                <Input
                  id="postWeight"
                  type="number"
                  step="0.1"
                  value={formData.postWeight || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      postWeight: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="0.0"
                />
              </div>

              <div className="space-y-2">
                <Label>Ultrafiltration (L)</Label>
                <div className="flex items-center h-10 px-3 rounded-md border border-gray-200 bg-gray-50">
                  <span className="text-sm font-semibold text-gray-700">
                    {calculateUltrafiltration()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blood Pressure */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Blood Pressure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="mb-2 block">Pre-Dialysis BP (mmHg)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Systolic"
                    value={formData.preSystolic || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preSystolic: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Diastolic"
                    value={formData.preDiastolic || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preDiastolic: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Post-Dialysis BP (mmHg)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Systolic"
                    value={formData.postSystolic || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        postSystolic: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Diastolic"
                    value={formData.postDiastolic || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        postDiastolic: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complications & Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="complications">Complications</Label>
              <Textarea
                id="complications"
                value={formData.complications}
                onChange={(e) =>
                  setFormData({ ...formData, complications: e.target.value })
                }
                placeholder="Describe any complications that occurred during the session..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Session Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Additional notes about the session..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Session"}
          </Button>
        </div>
      </form>
    </div>
  );
}
