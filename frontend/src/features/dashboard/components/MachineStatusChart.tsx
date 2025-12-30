"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { getMachinesStats } from "../api/dashboard.api"

type MachineStatus = {
  name: string
  value: number
  color: string
}

function MachineStatusSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-border p-6 animate-pulse">
      <div className="h-6 w-56 bg-gray-200 rounded mb-6" />

      <div className="h-64 flex items-center justify-center">
        <div className="h-40 w-40 rounded-full bg-gray-200" />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-200" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MachineStatusChart() {
  const [data, setData] = useState<MachineStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMachineStats() {
      try {
        const stats = await getMachinesStats()

        setData([
          { name: "In Use", value: stats.In_Use, color: "#2563eb" },
          { name: "Available", value: stats.Available, color: "#16a34a" },
          { name: "Out of Service", value: stats.Out_of_Service, color: "#ef4444" },
          { name: "Maintenance", value: stats.Maintenance, color: "#f59e0b" },
        ])
      } catch (error) {
        console.error("Failed to fetch machine stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMachineStats()
  }, [])

  if (loading) {
    return <MachineStatusSkeleton />
  }

  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Machine Status Overview
      </h3>

      <div className="h-64 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-foreground">
              {item.name}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
