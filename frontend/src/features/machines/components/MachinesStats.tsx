import { Monitor, CheckCircle, Clock, Wrench, XCircle } from "lucide-react"
import { useEffect, useState } from "react"

interface StatCardProps {
  label: string
  value: number | string
  icon: React.ElementType
  iconBgColor: string
  iconColor: string
  active?: boolean
  onClick?: () => void
}

function StatCard({ label, value, icon: Icon, iconBgColor, iconColor, active, onClick }: StatCardProps) {
  return (
    <button onClick={onClick} className={`rounded-lg border p-6 text-left ${active ? 'ring-2 ring-teal-600' : 'bg-white'} border-gray-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${iconBgColor} p-3 rounded-lg`}>
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
      </div>
    </button>
  )
}

type Stats = {
  total: number
  available: number
  inUse: number
  maintenance: number
  outOfService: number
}

export default function MachinesStats({ refreshKey, selectedStatus, onSelectStatus }: { refreshKey?: number; selectedStatus?: string; onSelectStatus?: (s: string) => void }) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)

  const loadStats = async () => {
    try {
      setLoading(true)
      const res = await import('../api/machines.api').then((m) => m.getMachineStats())
      setStats(res as Stats)
    } catch (err) {
      console.error('Failed to load machine stats', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadStats() }, [])
  useEffect(() => { if (typeof refreshKey !== 'undefined') loadStats() }, [refreshKey])

  const total = stats?.total ?? 0
  const available = stats?.available ?? 0
  const inUse = stats?.inUse ?? 0
  const maintenance = stats?.maintenance ?? 0
  const outOfService = stats?.outOfService ?? 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <StatCard label="Total Machines" value={loading ? '…' : total} icon={Monitor} iconBgColor="bg-gray-100" iconColor="text-gray-600" active={selectedStatus === 'all'} onClick={() => onSelectStatus?.('all')} />
      <StatCard label="Available" value={loading ? '…' : available} icon={CheckCircle} iconBgColor="bg-green-50" iconColor="text-green-600" active={selectedStatus === 'available'} onClick={() => onSelectStatus?.('available')} />
      <StatCard label="In Use" value={loading ? '…' : inUse} icon={Clock} iconBgColor="bg-blue-50" iconColor="text-blue-600" active={selectedStatus === 'in-use'} onClick={() => onSelectStatus?.('in-use')} />
      <StatCard label="Maintenance" value={loading ? '…' : maintenance} icon={Wrench} iconBgColor="bg-yellow-50" iconColor="text-yellow-600" active={selectedStatus === 'maintenance'} onClick={() => onSelectStatus?.('maintenance')} />
      <StatCard label="Out of Service" value={loading ? '…' : outOfService} icon={XCircle} iconBgColor="bg-red-50" iconColor="text-red-600" active={selectedStatus === 'out-of-service'} onClick={() => onSelectStatus?.('out-of-service')} />
    </div>
  )
}