import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { Loader } from "../../../components/ui/loader";
import { ProtocolView } from "../components/ProtocolView";
import { SessionsList } from "../components/SessionsList";
import { DialysisHistoryView } from "../components/DialysisHistoryView";
import type { DialysisProtocol } from "../../../types/dialysis.types";
import { getDialysisProtocol, getDialysisPatients } from "../api/dialysis.api";

interface PatientDialysisPageProps {
  dialysisPatientId: string;
  onBack?: () => void;
  onAddSession?: () => void;
}

export function PatientDialysisPage({
  dialysisPatientId,
  onBack,
  onAddSession,
}: PatientDialysisPageProps) {
  const [protocol, setProtocol] = useState<DialysisProtocol | null>(null);
  const [patientName, setPatientName] = useState<string>("Loading...");
  const [patientId, setPatientId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("protocol");

  useEffect(() => {
    loadData();
  }, [dialysisPatientId]);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Get patient details
      const patients = await getDialysisPatients();
      const patient = patients.find((p) => p.id === dialysisPatientId);
      if (patient) {
        setPatientName(patient.patientName);
        setPatientId(patient.patientId);
      }

      // Get protocol
      const protocolData = await getDialysisProtocol(dialysisPatientId);
      setProtocol(protocolData);
    } catch (error) {
      console.error("Failed to load dialysis data:", error);
    } finally {
      setIsLoading(false);
    }
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
          <button onClick={onBack} className="text-blue-600 mt-2">
            Go back
          </button>
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
            <BreadcrumbPage>{patientName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{patientName}</h1>
        <p className="text-gray-500 mt-1">
          {protocol.dialysisType.charAt(0).toUpperCase() +
            protocol.dialysisType.slice(1)}{" "}
          • {protocol.sessionsPerWeek} sessions/week
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="protocol">Current Protocol</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="protocol" className="space-y-4">
          <ProtocolView
            protocol={protocol}
            patientName={patientName}
            onProtocolUpdated={loadData}
          />
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <SessionsList
            dialysisPatientId={dialysisPatientId}
            patientName={patientName}
            onAddSession={onAddSession}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <DialysisHistoryView
            patientId={patientId}
            patientName={patientName}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
