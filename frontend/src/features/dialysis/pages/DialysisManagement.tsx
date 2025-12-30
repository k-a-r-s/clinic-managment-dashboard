import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { DialysisPatientsDashboard } from "../components/DialysisPatientsDashboard";

interface DialysisManagementProps {
  onViewProtocol: (dialysisPatientId: string, patientName: string) => void;
  onAddSession: (dialysisPatientId: string, patientName: string) => void;
  onAddPatient: () => void;
}

export function DialysisManagement({
  onViewProtocol,
  onAddSession,
  onAddPatient,
}: DialysisManagementProps) {
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
            <BreadcrumbPage>Dialysis Management</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Dashboard */}
      <DialysisPatientsDashboard
        onViewProtocol={onViewProtocol}
        onAddSession={onAddSession}
        onAddPatient={onAddPatient}
      />
    </div>
  );
}
