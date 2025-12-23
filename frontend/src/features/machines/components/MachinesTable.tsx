import { Monitor, Hash, MapPin, Calendar, Edit, Power } from "lucide-react"
import { AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { getMachines, deactivateMachine, updateMachine, createMachine } from "../api/machines.api"
import DeactivateModal from "./DeactivateModal" 
import AddMachineModal from "./AddMachineModal" 

interface Machine { 
  id: string
  room: string
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
  onAddMachine: (data: any) => void
}

export default function MachinesTable({
  searchTerm,
  selectedRoom,
  selectedStatus,
  onAddMachine,
}: MachinesTableProps) {
  const [machines, setMachines] = useState<Machine[]>(initialMachines)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [deactivateModal, setDeactivateModal] = useState<{isOpen: boolean; machineId: string}>({
    isOpen: false,
    machineId: ""
  })
  const [editModal, setEditModal] = useState<{isOpen: boolean; machineData: Machine | null}>({
    isOpen: false,
    machineData: null
  })

  const filteredMachines = machines.filter((machine) => {
    const matchesSearch =
      machine.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.room.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRoom = selectedRoom === "all" || machine.room.includes(selectedRoom)
    const matchesStatus = selectedStatus === "all" || machine.status === selectedStatus

    return matchesSearch && matchesRoom && matchesStatus
  })

  const handleDeactivate = (machineId: string) => {
    setDeactivateModal({ isOpen: true, machineId })
  }

  useEffect(() => {
    loadMachines();
  }, [])

  const loadMachines = async () => {
    try {
      setIsLoading(true)
      const data = await getMachines()
      // map API fields to UI shape
      const mapped = data.map((m) => ({
        id: m.machineId ?? m.id,
        room: m.room ?? "",
        status: m.status as Machine['status'],
        lastMaintenance: new Date(m.lastMaintenanceDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        nextMaintenance: new Date(m.nextMaintenanceDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        dueStatus: isDueSoon(m.nextMaintenanceDate) ? 'due-soon' : undefined,
        manufacturer: m.manufacturer ?? undefined,
        model: m.model ?? undefined,
      
      }))
      setMachines(mapped)
    } catch (error) {
      console.error('Failed to load machines:', error)
      toast.error('Failed to load machines')
    } finally {
      setIsLoading(false)
    }
  }

  const isDueSoon = (dateStr?: string) => {
    if (!dateStr) return false
    const today = new Date()
    const next = new Date(dateStr)
    const diffDays = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays <= 30
  }

  const handleConfirmDeactivate = () => {
    const doDeactivate = async () => {
      try {
        await deactivateMachine(deactivateModal.machineId)
        toast.success('Machine deactivated')
        // refresh
        loadMachines()
      } catch (error) {
        console.error('Failed to deactivate machine:', error)
        toast.error('Failed to deactivate machine')
      } finally {
        setDeactivateModal({ isOpen: false, machineId: '' })
      }
    }

    doDeactivate()
  }

  const handleEdit = (machine: Machine) => {
    setEditModal({ isOpen: true, machineData: machine })
  }

  const handleSubmitEdit = (data: any) => {
    const doUpdate = async () => {
      try {
        await updateMachine(data.id, {
              room: data.room,
              status: data.status,
              lastMaintenanceDate: new Date(data.lastMaintenance).toISOString(),
              nextMaintenanceDate: new Date(data.nextMaintenance).toISOString(),
              manufacturer: data.manufacturer,
              model: data.model,
            })
        toast.success('Machine updated')
        loadMachines()
      } catch (error) {
        console.error('Failed to update machine:', error)
        toast.error('Failed to update machine')
      } finally {
        setEditModal({ isOpen: false, machineData: null })
      }
    }

    doUpdate()
  }

  const handleAddMachine = (data: any) => {
    // Generate a new machine ID based on the highest existing ID
    const highestId = Math.max(...machines.map(m => parseInt(m.id.split('-').pop() || '0')))
    const newId = `HD-MAC-${(highestId + 1).toString().padStart(3, '0')}`
    
    const newMachine: Machine = {
      id: data.machineId as string || newId,
      room: data.room as string,
      status: data.status as "in-use" | "available" | "maintenance" | "out-of-service",
      lastMaintenance: data.lastMaintenance as string,
      nextMaintenance: data.nextMaintenance as string,
      manufacturer: data.manufacturer as string,
      model: data.model as string,
    }

    // Create via API instead of local-only update
    const doCreate = async () => {
      try {
        const created = await createMachine({
          machineId: newMachine.id,
          room: newMachine.room,
          status: newMachine.status,
          lastMaintenanceDate: new Date(newMachine.lastMaintenance).toISOString(),
          nextMaintenanceDate: new Date(newMachine.nextMaintenance).toISOString(),
          manufacturer: newMachine.manufacturer,
          model: newMachine.model,
        })
        toast.success('Machine added')
        loadMachines()
        onAddMachine(created)
      } catch (error) {
        console.error('Failed to add machine:', error)
        toast.error('Failed to add machine')
      }
    }

    doCreate()
  }

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
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Monitor className="w-4 h-4" />
                    Machine ID
                  </div>
                </th>
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
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${status.dotColor}`}></div>
                        <span className="font-semibold text-gray-900">{machine.id}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-gray-900 text-sm">{machine.room}</td>
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
                        <button 
                          onClick={() => handleDeactivate(machine.id)}
                          className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          <Power className="w-4 h-4" />
                          Deactivate
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deactivate Modal */}
      <DeactivateModal
        isOpen={deactivateModal.isOpen}
        onClose={() => setDeactivateModal({ isOpen: false, machineId: "" })}
        machineId={deactivateModal.machineId}
        onConfirm={handleConfirmDeactivate}
      />

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