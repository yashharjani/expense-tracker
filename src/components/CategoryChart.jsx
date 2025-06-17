"use client"

import { useState } from "react"
import { BarChart3, PieChartIcon } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
} from "recharts"

const COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#F97316", // Orange
  "#6366F1", // Indigo
]

export default function CategoryChart({ data }) {
  const [chartType, setChartType] = useState("pie")

  const formattedData = Object.entries(data).map(([name, value]) => ({
    name,
    value: Number(value),
    formattedValue: `$${Number(value).toFixed(2)}`,
  }))

  // Calculate total for percentage
  const total = formattedData.reduce((sum, item) => sum + item.value, 0)

  // Enhanced tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const percentage = ((data.value / total) * 100).toFixed(1)
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].color }} />
            <p className="font-semibold text-gray-900">{data.name}</p>
          </div>
          <p className="text-lg font-bold text-blue-600">${data.value.toFixed(2)}</p>
          <p className="text-sm text-gray-600">{percentage}% of total</p>
        </div>
      )
    }
    return null
  }

  // Custom label for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null // Don't show labels for slices less than 5%

    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  // Custom legend
  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm text-gray-700">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Expense Breakdown</h3>
            <p className="text-sm text-gray-600">Your spending by category this month</p>
          </div>
          <button
            onClick={() => setChartType(chartType === "pie" ? "bar" : "pie")}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
          >
            {chartType === "pie" ? (
              <>
                <BarChart3 className="h-4 w-4" />
                Switch to Bar Chart
              </>
            ) : (
              <>
                <PieChartIcon className="h-4 w-4" />
                Switch to Pie Chart
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "pie" ? (
              <PieChart>
                <Pie
                  dataKey="value"
                  data={formattedData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={140}
                  innerRadius={60}
                  paddingAngle={2}
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {formattedData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
              </PieChart>
            ) : (
              <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={11}
                  tick={{ fill: "#6B7280" }}
                />
                <YAxis tickFormatter={(value) => `$${value}`} fontSize={11} tick={{ fill: "#6B7280" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <LabelList
                    dataKey="value"
                    position="top"
                    formatter={(value) => `$${value.toFixed(0)}`}
                    fontSize={10}
                    fill="#374151"
                  />
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Enhanced Category Summary */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Category Breakdown</h4>
            <div className="text-sm text-gray-600">
              Total: <span className="font-bold text-gray-900">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {formattedData
              .sort((a, b) => b.value - a.value) // Sort by value descending
              .map((item, index) => {
                const percentage = ((item.value / total) * 100).toFixed(1)
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                        <div className="text-xs text-gray-500">{percentage}% of total</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">${item.value.toFixed(2)}</div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}