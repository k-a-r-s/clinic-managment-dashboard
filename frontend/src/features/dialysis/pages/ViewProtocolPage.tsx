import { useState, useEffect } from "react";
import { Edit, ArrowLeft } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Loader } from "../../../components/ui/loader";
import type { DialysisProtocol } from "../../../types/dialysis.types";
import { getDialysisProtocol } from "../api/dialysis.api";
import { EditProtocolModal } from "../components/EditProtocolModal";

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    loadProtocol();
  }, [dialysisPatientId]);

  const loadProtocol = async () => {
    try {
      setIsLoading(true);
      const data = await getDialysisProtocol(dialysisPatientId);
      setProtocol(data);
    } catch (error) {
      console.error("Failed to load protocol:", error);
    } finally {
      setIsLoading(false);
    }
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
            <Button onClick={() => setIsEditModalOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Protocol
            </Button>
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
                <p className="text-sm text-gray-500">Dialysis Type</p>
                <p className="font-semibold capitalize">
                  {protocol.dialysisType}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Access Type</p>
                {getAccessTypeBadge(protocol.accessType)}
              </div>
              <div>
                <p className="text-sm text-gray-500">Sessions Per Week</p>
                <p className="font-semibold">{protocol.sessionsPerWeek}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Session Duration</p>
                <p className="font-semibold">
                  {protocol.sessionDurationMinutes} minutes
                </p>
              </div>
              {protocol.targetWeightKg && (
                <div>
                  <p className="text-sm text-gray-500">Target Weight</p>
                  <p className="font-semibold">{protocol.targetWeightKg} kg</p>
                </div>
              )}
            </div>

            {protocol.notes && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Notes</p>
                <p className="text-sm">{protocol.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Protocol Modal */}
      <EditProtocolModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        protocol={protocol}
        patientName={patientName}
        onSuccess={() => {
          setIsEditModalOpen(false);
          loadProtocol();
        }}
      />
    </div>
  );
}
