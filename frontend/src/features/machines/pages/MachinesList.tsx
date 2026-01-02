import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Wrench,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { PageHeader } from "../../../components/shared/PageHeader";
import { SearchBar } from "../../../components/shared/SearchBar";
import { Loader } from "../../../components/shared/Loader";
import { DataTable } from "../../../components/shared/DataTable";
import type { Column } from "../../../components/shared/DataTable";
import { getMachines, deactivateMachine } from "../api/machines.api";
import { toast } from "react-hot-toast";
import type { Machine } from "../../../types";

interface MachinesListProps {
  onCreateNew?: () => void;
  onEditMachine?: (machineId: string) => void;
}

export function MachinesList({
  onCreateNew,
  onEditMachine,
}: MachinesListProps) {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(
    null
  );

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async () => {
    try {
      setIsLoading(true);
      const data = await getMachines();
      setMachines(data);
    } catch (error) {
      console.error("Failed to load machines:", error);
      toast.error("Failed to load machines");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter machines
  const filteredMachines = machines.filter((machine) => {
    const machineId = machine.machineId?.toLowerCase() || "";
    const manufacturer = machine.manufacturer?.toLowerCase() || "";
    const model = machine.model?.toLowerCase() || "";
    const status = machine.status?.toLowerCase() || "";
    const id = machine.id.toString().toLowerCase();

    const matchesSearch =
      machineId.includes(searchTerm.toLowerCase()) ||
      manufacturer.includes(searchTerm.toLowerCase()) ||
      model.includes(searchTerm.toLowerCase()) ||
      status.includes(searchTerm.toLowerCase()) ||
      id.includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleEditMachine = (machineId: string) => {
    if (onEditMachine) {
      onEditMachine(machineId);
    }
  };

  const handleDeactivateMachine = async (machineId: string) => {
    if (!confirm("Are you sure you want to deactivate this machine?")) {
      return;
    }
    try {
      await deactivateMachine(machineId);
      toast.success("Machine deactivated successfully");
      loadMachines();
    } catch (error) {
      console.error("Failed to deactivate machine:", error);
      toast.error("Failed to deactivate machine");
    }
  };

  const handleCreateNew = () => {
    if (onCreateNew) {
      onCreateNew();
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: {
        label: "Available",
        className: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
      },
      "in-use": {
        label: "In Use",
        className: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Wrench,
      },
      maintenance: {
        label: "Maintenance",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: AlertTriangle,
      },
      "out-of-service": {
        label: "Out of Service",
        className: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.available;
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getActiveBadge = (isActive: boolean | undefined) => {
    return isActive === false ? (
      <Badge
        variant="outline"
        className="bg-gray-100 text-gray-800 border-gray-200"
      >
        Inactive
      </Badge>
    ) : null;
  };

  const machineColumns: Column<Machine>[] = [
    {
      key: "id",
      header: "ID",
      render: (machine) => (
        <span className="font-mono text-xs text-gray-600">
          #{machine.id.slice(0, 8)}
        </span>
      ),
    },
    {
      key: "machineId",
      header: "Machine ID",
      render: (machine) => (
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-gray-900">
            {machine.machineId || "—"}
          </span>
        </div>
      ),
    },
    {
      key: "manufacturer",
      header: "Manufacturer",
      render: (machine) => (
        <span className="text-sm text-gray-700">
          {machine.manufacturer || "—"}
        </span>
      ),
    },
    {
      key: "model",
      header: "Model",
      render: (machine) => (
        <span className="text-sm text-gray-700">{machine.model || "—"}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (machine) => (
        <div className="flex items-center gap-2">
          {getStatusBadge(machine.status)}
          {getActiveBadge(machine.isActive)}
        </div>
      ),
    },
    {
      key: "maintenance",
      header: "Next Maintenance",
      render: (machine) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700">
            {machine.nextMaintenanceDate
              ? new Date(machine.nextMaintenanceDate).toLocaleDateString()
              : "—"}
          </span>
        </div>
      ),
    },
    {
      key: "room",
      header: "Room",
      render: (machine) =>
        machine.room ? (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700">{machine.room}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-500">—</span>
        ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (machine) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEditMachine(machine.id)}
            className="h-8"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          {machine.isActive !== false && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDeactivateMachine(machine.id)}
              className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Deactivate
            </Button>
          )}
        </div>
      ),
    },
  ];

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
            <BreadcrumbPage>Machines</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <PageHeader
        title="Machines"
        subtitle="Manage dialysis machines, maintenance schedules, and status"
      />

      {/* Main Content Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Search and Actions Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <SearchBar
              placeholder="Search by machine ID, manufacturer, model, or status..."
              value={searchTerm}
              onChange={setSearchTerm}
            />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleCreateNew}
                className="gap-2 bg-[#1C8CA8] hover:bg-[#157A93]"
              >
                <Plus className="w-4 h-4" />
                Add Machine
              </Button>
            </div>
          </div>
        </div>

        {/* Machines Table */}
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader size="lg" />
            </div>
          ) : (
            <DataTable
              data={filteredMachines}
              columns={machineColumns}
              getRowKey={(machine) => machine.id}
              selectedKey={selectedMachineId}
              onRowClick={(machine) => setSelectedMachineId(machine.id)}
              emptyMessage="No machines found matching your criteria"
            />
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredMachines.length} of {machines.length} machines
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-gray-200">
              Previous
            </Button>
            <Button size="sm" className="bg-[#1C8CA8] hover:bg-[#157A93]">
              1
            </Button>
            <Button variant="outline" size="sm" className="border-gray-200">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
