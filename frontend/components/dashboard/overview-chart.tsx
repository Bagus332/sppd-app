"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"

interface OverviewChartProps {
  data: {
    totalPerjalanan: number;
    totalSPD: number;
    totalPegawai: number;
    suratSelesai: number;
  }
}

export function OverviewChart({ data }: OverviewChartProps) {
  const chartData = [
    {
      name: "Perjalanan",
      total: data.totalPerjalanan,
      color: "#16a34a", // green-600
    },
    {
      name: "SPD",
      total: data.totalSPD,
      color: "#2563eb", // blue-600
    },
    {
      name: "Pegawai",
      total: data.totalPegawai,
      color: "#9333ea", // purple-600
    },
    {
      name: "Selesai",
      total: data.suratSelesai,
      color: "#ea580c", // orange-600
    },
  ]

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip 
            cursor={{fill: 'transparent'}}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
        />
        <Bar
          dataKey="total"
          radius={[4, 4, 0, 0]}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
