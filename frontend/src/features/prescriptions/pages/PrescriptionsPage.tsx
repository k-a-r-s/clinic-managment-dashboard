import { PrescriptionsList } from "./PrescriptionsList";

interface PrescriptionsPageProps {
  onViewPrescription?: (prescriptionId: string) => void;
  onEditPrescription?: (prescriptionId: string) => void;
  onCreateNew?: () => void;
}

export function PrescriptionsPage({
  onViewPrescription,
  onEditPrescription,
  onCreateNew,
}: PrescriptionsPageProps) {
  return (
    <PrescriptionsList
      onViewPrescription={onViewPrescription}
      onEditPrescription={onEditPrescription}
      onCreateNew={onCreateNew}
    />
  );
}
