"use client"

import { useEffect, useState } from "react"
import { DollarSign, TrendingUp, TrendingDown, Wallet, AlertTriangle } from "lucide-react"
import CategoryChart from "./CategoryChart"
import { fetchExpenses } from "../api/fetchExpenses"

export default function Dashboard({ refreshKey }) {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchExpenses()
      .then((data) => setSummary(data.summary))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [refreshKey])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="text-center py-12">
        <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
        <p className="text-gray-500">Start by adding your first expense or setting a budget.</p>
      </div>
    )
  }

  const budgetUsedPercentage = (summary.total_expenses / summary.budget) * 100
  const isOverBudget = summary.remaining < 0

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">${summary.total_expenses.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{budgetUsedPercentage.toFixed(1)}% of budget used</p>
            </div>
            <TrendingUp className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Budget</p>
              <p className="text-2xl font-bold text-gray-900">${summary.budget.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Set for this month</p>
            </div>
            <Wallet className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{isOverBudget ? "Over Budget" : "Remaining"}</p>
              <p className={`text-2xl font-bold ${isOverBudget ? "text-red-600" : "text-green-600"}`}>
                ${Math.abs(summary.remaining).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">{isOverBudget ? "Exceeded budget" : "Left to spend"}</p>
            </div>
            {isOverBudget ? (
              <AlertTriangle className="h-8 w-8 text-red-500" />
            ) : (
              <TrendingDown className="h-8 w-8 text-green-500" />
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(summary.category_totals).length}</p>
              <p className="text-xs text-gray-500">Active spending categories</p>
            </div>
            <DollarSign className="h-8 w-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Budget Overview</h3>
        <p className="text-sm text-gray-600 mb-4">Your spending progress for this month</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Budget Used</span>
            <span>{budgetUsedPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${isOverBudget ? "bg-red-500" : "bg-blue-500"}`}
              style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
        {isOverBudget && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg mt-4">
            <AlertTriangle className="h-4 w-4" />
            <span>You've exceeded your monthly budget by ${Math.abs(summary.remaining).toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Category Chart */}
      {summary.category_totals && <CategoryChart data={summary.category_totals} />}
    </div>
  )
}