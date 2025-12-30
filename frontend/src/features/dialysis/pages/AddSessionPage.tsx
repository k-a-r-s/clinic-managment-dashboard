import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { AddSessionForm } from "../components/AddSessionForm";

interface AddSessionPageProps {
  dialysisPatientId: string;
  patientName: string;
  onBack?: () => void;
  onSuccess?: () => void;
}

export function AddSessionPage({
  dialysisPatientId,
  patientName,
  onBack,
  onSuccess,
}: AddSessionPageProps) {
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
            <BreadcrumbPage>Add Session - {patientName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Form */}
      <AddSessionForm
        dialysisPatientId={dialysisPatientId}
        patientName={patientName}
        onCancel={onBack}
        onSuccess={onSuccess}
      />
    </div>
  );
}
