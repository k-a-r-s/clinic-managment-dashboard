import { useState, useEffect } from "react";
import { Edit, ArrowLeft, Save, X } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { PageHeader } from "../../../components/shared/PageHeader";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Loader } from "../../../components/ui/loader";
import { toast } from "react-hot-toast";
import type {
  DialysisProtocol,
  ProtocolFormData,
} from "../../../types/dialysis.types";
import {
  getDialysisProtocol,
  updateDialysisProtocol,
} from "../api/dialysis.api";

interface ViewProtocolPageProps {
  dialysisPatientId: string;
  patientName: string;
  onBack: () => void;
}

export function ViewProtocolPage({
  dialysisPatientId,
  patientName,
  onBack,
}: ViewProtocolPageProps) {
  const [protocol, setProtocol] = useState<DialysisProtocol | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ProtocolFormData>({
    dialysisType: "hemodialysis",
    sessionsPerWeek: 3,
    sessionDurationMinutes: 240,
    accessType: "fistula",
    targetWeightKg: undefined,
    notes: "",
  });

  useEffect(() => {
    loadProtocol();
  }, [dialysisPatientId]);

  const loadProtocol = async () => {
    try {
      setIsLoading(true);
      const data = await getDialysisProtocol(dialysisPatientId);
      setProtocol(data);
      if (data) {
        setFormData({
          dialysisType: data.dialysisType,
          sessionsPerWeek: data.sessionsPerWeek,
          sessionDurationMinutes: data.sessionDurationMinutes,
          accessType: data.accessType,
          targetWeightKg: data.targetWeightKg,
          notes: data.notes || "",
        });
      }
    } catch (error) {
      console.error("Failed to load protocol:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!protocol?.id) {
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
      setIsSaving(true);
      await updateDialysisProtocol(protocol.id, formData);
      toast.success("Protocol updated successfully");
      setIsEditing(false);
      await loadProtocol();
    } catch (error) {
      console.error("Failed to update protocol:", error);
      toast.error("Failed to update protocol");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (protocol) {
      setFormData({
        dialysisType: protocol.dialysisType,
        sessionsPerWeek: protocol.sessionsPerWeek,
        sessionDurationMinutes: protocol.sessionDurationMinutes,
        accessType: protocol.accessType,
        targetWeightKg: protocol.targetWeightKg,
        notes: protocol.notes || "",
      });
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!protocol) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">No protocol found for this patient</p>
          <Button onClick={onBack} className="mt-4">
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={onBack}>
              Dialysis Management
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{patientName} - Protocol</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <PageHeader
        title={`${patientName} - Dialysis Protocol`}
        subtitle={`${
          protocol.dialysisType.charAt(0).toUpperCase() +
          protocol.dialysisType.slice(1)
        } • ${protocol.sessionsPerWeek} sessions/week`}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Protocol
              </Button>
            )}
          </div>
        }
      />

      {/* Protocol Details */}
      <div className="grid gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Protocol Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                  Sessions Per Week
                </Label>
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
                  <p className="font-semibold mt-1">
                    {protocol.sessionsPerWeek}
                  </p>
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
            </div>

            {(isEditing || protocol.notes) && (
              <div>
                <Label className="text-sm text-gray-500 mb-2">Notes</Label>
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
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm mt-1">{protocol.notes}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
