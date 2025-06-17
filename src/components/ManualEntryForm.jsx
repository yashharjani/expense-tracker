"use client"

import { useState } from "react"
import { PlusCircle, DollarSign, Wallet, Loader2, ChevronDown } from "lucide-react"
import { API_BASE_URL } from "../config"

const CATEGORIES = [
  "Food & Drink",
  "Groceries",
  "Transportation",
  "Entertainment",
  "Utilities",
  "Shopping",
  "Health",
  "Rent",
  "Wifi",
  "Other",
]

export default function ManualEntryForm({ onSubmitSuccess, type = "expense" }) {
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [customCategory, setCustomCategory] = useState("")
  const [budget, setBudget] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [budgetMessage, setBudgetMessage] = useState("")

  const isExpense = type === "expense"
  const isOtherSelected = category === "Other"

  const handleExpenseSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage("")

    const selectedCategory = isOtherSelected ? customCategory.trim() : category

    if (!selectedCategory) {
      setMessage("Please specify a valid category.")
      setIsSubmitting(false)
      return
    }

    const payload = {
      type: "expense",
      category: selectedCategory,
      amount: Number.parseFloat(amount),
    }

    try {
      const res = await fetch(`${API_BASE_URL}/manual-entry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("idToken")}`,
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      setMessage(data.message || "Expense submitted!")
      if (onSubmitSuccess) onSubmitSuccess()
      setAmount("")
      setCategory("")
      setCustomCategory("")
    } catch (err) {
      console.error(err)
      setMessage("Submission failed.")
    }

    setIsSubmitting(false)
  }

  const handleBudgetSubmit = async (e) => {
    e.preventDefault()
    setBudgetMessage("")

    if (!budget || Number.parseFloat(budget) <= 0) {
      setBudgetMessage("Please enter a valid budget.")
      return
    }

    const payload = {
      type: "budget",
      amount: Number.parseFloat(budget),
    }

    try {
      const res = await fetch(`${API_BASE_URL}/manual-entry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("idToken")}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      setBudgetMessage(data.message || "Budget saved!")
      if (onSubmitSuccess) onSubmitSuccess()
    } catch (err) {
      console.error(err)
      setBudgetMessage("Budget submission failed.")
    }
  }

  if (!isExpense) {
    // Budget form
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Set Monthly Budget
            </h2>
            <p className="text-gray-600 mt-1">Set your monthly spending budget to track your expenses</p>
          </div>
          <div className="px-6 py-6">
            <form onSubmit={handleBudgetSubmit} className="space-y-6">
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Budget
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    id="budget"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter your monthly budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Save Budget
              </button>
            </form>

            {budgetMessage && (
              <div className="mt-4 p-3 rounded-md bg-green-50 border border-green-200">
                <p className="text-sm text-green-800">{budgetMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Expense form
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Add Manual Expense
          </h2>
          <p className="text-gray-600 mt-1">Manually enter an expense with category and amount</p>
        </div>
        <div className="px-6 py-6">
          <form onSubmit={handleExpenseSubmit} className="space-y-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  required
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {isOtherSelected && (
              <div>
                <label htmlFor="customCategory" className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Category
                </label>
                <input
                  id="customCategory"
                  type="text"
                  placeholder="Enter custom category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Expense...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Expense
                </>
              )}
            </button>
          </form>

          {message && (
            <div className="mt-4 p-3 rounded-md bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-800">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}