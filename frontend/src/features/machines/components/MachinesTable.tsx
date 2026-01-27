import { Monitor, MapPin, Calendar, Edit } from "lucide-react"
import { AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { getMachines, updateMachine } from "../api/machines.api"
import AddMachineModal from "./AddMachineModal"

interface Machine {
  id: string
  machineId?: string
  room: string
  roomDisplay?: string
  status: "in-use" | "available" | "maintenance" | "out-of-service"
  lastMaintenance: string
  nextMaintenance: string
  dueStatus?: "due-soon"
  manufacturer?: string
  model?: string
}

// Initial machines data
const initialMachines: Machine[] = [
  {
    id: "HD-MAC-101",
    room: "Room 3A",
    status: "in-use",
    lastMaintenance: "Oct 15, 2025",
    nextMaintenance: "Jan 15, 2026",
  },
  {
    id: "HD-MAC-102",
    room: "Room 3B",
    status: "available",
    lastMaintenance: "Oct 20, 2025",
    nextMaintenance: "Jan 20, 2026",
  },
  {
    id: "HD-MAC-103",
    room: "Room 2A",
    status: "maintenance",
    lastMaintenance: "Sep 10, 2025",
    nextMaintenance: "Dec 10, 2025",
    dueStatus: "due-soon",
  },
  {
    id: "HD-MAC-104",
    room: "Room 2B",
    status: "available",
    lastMaintenance: "Nov 1, 2025",
    nextMaintenance: "Feb 1, 2026",
  },
  {
    id: "HD-MAC-105",
    room: "Room 1C",
    status: "in-use",
    lastMaintenance: "Oct 25, 2025",
    nextMaintenance: "Jan 25, 2026",
  },
  {
    id: "HD-MAC-106",
    room: "Room 1A",
    status: "out-of-service",
    lastMaintenance: "Aug 15, 2025",
    nextMaintenance: "Nov 15, 2025",
    dueStatus: "due-soon",
  },
  {
    id: "HD-MAC-107",
    room: "Room 1B",
    status: "available",
    lastMaintenance: "Nov 5, 2025",
    nextMaintenance: "Feb 5, 2026",
  },
  {
    id: "HD-MAC-108",
    room: "Room 1A",
    status: "in-use",
    lastMaintenance: "Oct 10, 2025",
    nextMaintenance: "Jan 10, 2026",
  },
]

const statusConfig = {
  "in-use": {
    label: "In Use",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    dotColor: "bg-blue-600",
  },
  available: {
    label: "Available",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    dotColor: "bg-green-600",
  },
  maintenance: {
    label: "Maintenance",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
    dotColor: "bg-yellow-600",
  },
  "out-of-service": {
    label: "Out of Service",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
    dotColor: "bg-red-600",
  },
}

interface MachinesTableProps {
  searchTerm: string
  selectedRoom: string
  selectedStatus: string
  refreshKey?: number
  onAddMachine?: (data: any) => void
  onRefresh?: () => void
}

export default function MachinesTable({
  searchTerm,
  selectedRoom,
  selectedStatus,
  refreshKey,
  onAddMachine,
  onRefresh,
}: MachinesTableProps) {
  const [machines, setMachines] = useState<Machine[]>(initialMachines)
  // Deactivate flow removed from table UI. Use Edit -> set status to 'out-of-service' to deactivate.
  const [editModal, setEditModal] = useState<{ isOpen: boolean; machineData: Machine | null }>({
    isOpen: false,
    machineData: null
  })

  const filteredMachines = machines.filter((machine) => {
    const matchesSearch =
      (machine.machineId ?? machine.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (machine.roomDisplay ?? machine.room ?? "").toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRoom =
      selectedRoom === "all" ||
      machine.room === selectedRoom ||
      (machine.roomDisplay ?? "").includes(selectedRoom)
    const matchesStatus = selectedStatus === "all" || machine.status === selectedStatus

    return matchesSearch && matchesRoom && matchesStatus
  })

  // Deactivate handler removed; table no longer exposes a deactivate button.

  useEffect(() => {
    loadMachines();
    // Poll in background to reflect changes made elsewhere in near real-time
    const interval = setInterval(() => {
      loadMachines()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // reload when parent signals a refresh (e.g., new machine added)
    if (typeof refreshKey !== 'undefined') {
      loadMachines();
    }
  }, [refreshKey])

  const loadMachines = async () => {
    try {
      // loading flag removed; keep minimal UI updates
      // Fetch machines and rooms in parallel
      const [data, rooms] = await Promise.all([
        getMachines(),
        import("../../rooms/api/rooms.api").then((m) => m.getRooms()),
      ])

      // map rooms by id for display
      const roomLookup = new Map(rooms.map((r: any) => [r.id, r.roomNumber]))

      // map API fields to UI shape
      const mapped = data.map((m) => ({
        // Keep the true DB UUID as `id` (used for updates/deletes) and expose
        // the human-friendly `machineId` separately for display (e.g. "HD-MAC-101").
        id: m.id,
        machineId: m.machineId ?? (m as any).machine_id ?? m.id,
        // m.room is stored as room id (UUID) — keep it as `room` and add `roomDisplay`
        room: m.room ?? "",
        roomDisplay: roomLookup.get(m.room) ?? m.room ?? "",
        status: m.status as Machine['status'],
        lastMaintenance: new Date(m.lastMaintenanceDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        nextMaintenance: new Date(m.nextMaintenanceDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        dueStatus: isDueSoon(m.nextMaintenanceDate) ? ('due-soon' as const) : undefined,
        manufacturer: m.manufacturer ?? undefined,
        model: m.model ?? undefined,
      }))

      setMachines(mapped)
    } catch (error) {
      console.error('Failed to load machines:', error)
      toast.error('Failed to load machines')
    } finally {
      // no-op
    }
  }

  const isDueSoon = (dateStr?: string) => {
    if (!dateStr) return false
    const today = new Date()
    const next = new Date(dateStr)
    const diffDays = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays <= 30
  }

  // Deactivate modal/flow removed

  const handleEdit = (machine: Machine) => {
    setEditModal({ isOpen: true, machineData: machine })
  }

  const handleSubmitEdit = (data: any) => {
    const doUpdate = async () => {
      try {
        await updateMachine(data.id, {
          roomId: data.room,
          status: data.status,
          lastMaintenanceDate: new Date(data.lastMaintenance).toISOString(),
          nextMaintenanceDate: new Date(data.nextMaintenance).toISOString(),
          manufacturer: data.manufacturer,
          model: data.model,
        })
        toast.success('Machine updated')
        loadMachines()
        onRefresh && onRefresh()
      } catch (error) {
        console.error('Failed to update machine:', error)
        toast.error('Failed to update machine')
      } finally {
        setEditModal({ isOpen: false, machineData: null })
      }
    }

    doUpdate()
  }

  // Note: creation is handled via API when needed; handler removed to avoid unused variable

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <Monitor className="w-5 h-5 text-teal-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Machines List ({filteredMachines.length})
          </h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>

                {/* Serial Number column removed per requirement */}
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <MapPin className="w-4 h-4" />
                    Room
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Calendar className="w-4 h-4" />
                    Last Maintenance
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Calendar className="w-4 h-4" />
                    Next Maintenance
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMachines.map((machine) => {
                const status = statusConfig[machine.status]
                return (
                  <tr key={machine.id} className="hover:bg-gray-50 transition-colors">


                    <td className="px-6 py-4 text-gray-900 text-sm">{machine.roomDisplay ?? machine.room}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 ${status.bgColor} ${status.textColor} text-xs font-medium px-2.5 py-1 rounded-full`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`}></div>
                          {status.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {machine.lastMaintenance}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 text-sm">{machine.nextMaintenance}</span>
                        {machine.dueStatus === "due-soon" && (
                          <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded-full">
                            <AlertCircle className="w-3 h-3" />
                            Due Soon
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(machine)}
                          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 text-sm font-medium"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        {/* Deactivate button removed; change status via Edit (set to 'out-of-service') */}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deactivate modal removed from UI */}

      {/* Edit Modal */}
      <AddMachineModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, machineData: null })}
        editData={editModal.machineData ? {
          id: editModal.machineData.id,
          room: editModal.machineData.room,
          status: editModal.machineData.status,
          manufacturer: editModal.machineData.manufacturer,
          model: editModal.machineData.model,
          lastMaintenance: editModal.machineData.lastMaintenance,
          nextMaintenance: editModal.machineData.nextMaintenance,
        } : null}
        onSubmit={handleSubmitEdit}
      />
    </>
  )
}