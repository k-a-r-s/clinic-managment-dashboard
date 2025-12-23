import { useState } from "react";
import MachinesHeader from "./MachinesHeader";
import MachinesStats from "./MachinesStats";
import MachinesFilters from "./MachinesFilters";
import MachinesTable from "./MachinesTable";

export default function MachinesLayout() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);

  // Add this function to handle new machine additions
  const handleAddMachine = (data: any) => {
    console.log("New machine added:", data);
    // trigger a refresh of the machines table
    setRefreshKey((k) => k + 1);
    // You can add additional logic here like API calls, notifications, etc.
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Page Header */}
      <MachinesHeader onAddMachine={handleAddMachine} />

      {/* Stats Cards */}
      <MachinesStats />

      {/* Filters */}
      <MachinesFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {/* Table */}
      <MachinesTable
        searchTerm={searchTerm}
        selectedRoom={selectedRoom}
        selectedStatus={selectedStatus}
        onAddMachine={handleAddMachine}
        refreshKey={refreshKey}
      />
    </div>
  );
}
