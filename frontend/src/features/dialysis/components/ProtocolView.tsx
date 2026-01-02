import { useState } from "react";
import { Activity, Settings2, Edit, Save, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { toast } from "react-hot-toast";
import type {
  DialysisProtocol,
  ProtocolFormData,
} from "../../../types/dialysis.types";
import { updateDialysisProtocol } from "../api/dialysis.api";

interface ProtocolViewProps {
  protocol: DialysisProtocol;
  patientName: string;
  onProtocolUpdated?: () => void;
}

export function ProtocolView({
  protocol,
  patientName,
  onProtocolUpdated,
}: ProtocolViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProtocolFormData>({
    dialysisType: protocol.dialysisType,
    sessionsPerWeek: protocol.sessionsPerWeek,
    sessionDurationMinutes: protocol.sessionDurationMinutes,
    accessType: protocol.accessType,
    targetWeightKg: protocol.targetWeightKg,
    notes: protocol.notes || "",
  });

  const handleSave = async () => {
    if (!protocol.id) {
      toast.error("Protocol ID is missing");
      return;
    }

    if (formData.sessionsPerWeek < 1 || formData.sessionsPerWeek > 7) {
      toast.error("Sessions per week must be between 1 and 7");
      return;
    }

    if (formData.sessionDurationMinutes < 1) {
      toast.error("Session duration must be positive");
      return;
    }

    try {
      setIsLoading(true);
      await updateDialysisProtocol(protocol.id, formData);
      toast.success("Protocol updated successfully");
      setIsEditing(false);
      onProtocolUpdated?.();
    } catch (error) {
      console.error("Failed to update protocol:", error);
      toast.error("Failed to update protocol");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      dialysisType: protocol.dialysisType,
      sessionsPerWeek: protocol.sessionsPerWeek,
      sessionDurationMinutes: protocol.sessionDurationMinutes,
      accessType: protocol.accessType,
      targetWeightKg: protocol.targetWeightKg,
      notes: protocol.notes || "",
    });
    setIsEditing(false);
  };

  const getAccessTypeBadge = (accessType: string) => {
    const colors = {
      fistula: "bg-green-100 text-green-800",
      catheter: "bg-yellow-100 text-yellow-800",
      graft: "bg-blue-100 text-blue-800",
    };
    return (
      <Badge className={colors[accessType as keyof typeof colors] || ""}>
        {accessType.charAt(0).toUpperCase() + accessType.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Current Dialysis Protocol
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Active protocol for {patientName}
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Protocol
            </Button>
          )}
        </div>
      </div>

      {/* Protocol Details */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm text-gray-500">Dialysis Type</Label>
              {isEditing ? (
                <Select
                  value={formData.dialysisType}
                  onValueChange={(value: "hemodialysis" | "peritoneal") =>
                    setFormData({ ...formData, dialysisType: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hemodialysis">Hemodialysis</SelectItem>
                    <SelectItem value="peritoneal">
                      Peritoneal Dialysis
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="font-semibold capitalize mt-1">
                  {protocol.dialysisType}
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm text-gray-500">Sessions Per Week</Label>
              {isEditing ? (
                <Input
                  type="number"
                  min="1"
                  max="7"
                  value={formData.sessionsPerWeek}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sessionsPerWeek: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-1"
                />
              ) : (
                <p className="font-semibold mt-1">{protocol.sessionsPerWeek}</p>
              )}
            </div>
            <div>
              <Label className="text-sm text-gray-500">
                Session Duration (minutes)
              </Label>
              {isEditing ? (
                <Input
                  type="number"
                  min="1"
                  value={formData.sessionDurationMinutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sessionDurationMinutes: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-1"
                />
              ) : (
                <p className="font-semibold mt-1">
                  {protocol.sessionDurationMinutes} minutes
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Clinical Parameters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Clinical Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm text-gray-500">Access Type</Label>
              {isEditing ? (
                <Select
                  value={formData.accessType}
                  onValueChange={(value: "fistula" | "catheter" | "graft") =>
                    setFormData({ ...formData, accessType: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fistula">Fistula</SelectItem>
                    <SelectItem value="catheter">Catheter</SelectItem>
                    <SelectItem value="graft">Graft</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-1">
                  {getAccessTypeBadge(protocol.accessType)}
                </div>
              )}
            </div>
            <div>
              <Label className="text-sm text-gray-500">
                Target Weight (kg)
              </Label>
              {isEditing ? (
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.targetWeightKg || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetWeightKg: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                  className="mt-1"
                />
              ) : (
                <p className="font-semibold mt-1">
                  {protocol.targetWeightKg || "—"} kg
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {(isEditing || protocol.notes) && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={formData.notes || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notes: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="Any additional notes or observations..."
                />
              ) : (
                <p className="text-gray-700">{protocol.notes || "No notes"}</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
