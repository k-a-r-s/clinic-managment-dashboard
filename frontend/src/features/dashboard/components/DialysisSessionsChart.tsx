"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import { getDialysisSessionsStats } from "../api/dashboard.api"
import type { DialysisSession } from "../../../types"

type ChartData = {
  name: string
  sessions: number
}

export default function DialysisSessionsChart() {
  const [data, setData] = useState<ChartData[]>([])

  function formatDay(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short", // Mon, Tue, Wed
  })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: DialysisSession[] = await getDialysisSessionsStats()

        // 🔹 MAP API DATA → CHART DATA
        const mappedData: ChartData[] = res.map((item) => ({
          name: formatDay(item.date), // or item.day
          sessions: item.count,
        }))

        setData(mappedData)
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Dialysis Sessions by Day
      </h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            {/* ✅ USE name */}
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              style={{ fontSize: "12px" }}
            />

            <YAxis
              stroke="#9ca3af"
              style={{ fontSize: "12px" }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />

            {/* ✅ USE sessions */}
            <Bar
              dataKey="sessions"
              fill="#16a34a"
              radius={[8, 8, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
