import { MachinesList } from "./MachinesList";

interface MachinesPageProps {
  onCreateNew?: () => void;
  onEditMachine?: (machineId: string) => void;
}

export function MachinesPage({
  onCreateNew,
  onEditMachine,
}: MachinesPageProps) {
  return (
    <MachinesList onCreateNew={onCreateNew} onEditMachine={onEditMachine} />
  );
}
