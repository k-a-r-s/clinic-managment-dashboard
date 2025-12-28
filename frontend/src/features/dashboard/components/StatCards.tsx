"use client"

import { useEffect, useState } from "react"
import { Users, Activity, Zap, Users2 } from "lucide-react"
import { getStats } from "../api/dashboard.api"

type Stat = {
  icon: any
  label: string
  value: string | number
  sublabel?: string
  bgColor: string
  iconColor: string
}

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-border p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-8 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-40 bg-gray-200 rounded" />
        </div>
        <div className="h-12 w-12 bg-gray-200 rounded-lg" />
      </div>
    </div>
  )
}

export default function StatCards() {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getStats()

        setStats([
          {
            icon: Users,
            label: "Total Patients",
            value: data.totalPatients,
            bgColor: "bg-blue-50",
            iconColor: "text-blue-400",
          },
          {
            icon: Activity,
            label: "Active Sessions Today",
            value: data.activeSessions,
            bgColor: "bg-green-50",
            iconColor: "text-green-400",
          },
          {
            icon: Zap,
            label: "Available Machines",
            value: data.activemachines,
            bgColor: "bg-amber-50",
            iconColor: "text-amber-400",
          },
          {
            icon: Users2,
            label: "Staff on Duty",
            value: data.staffCount,
            sublabel: data.staffSublabel,
            bgColor: "bg-purple-50",
            iconColor: "text-purple-400",
          },
        ])
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {loading
        ? Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))
        : stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="bg-white rounded-lg border border-border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    {stat.sublabel && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.sublabel}
                      </p>
                    )}
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            )
          })}
    </div>
  )
}
