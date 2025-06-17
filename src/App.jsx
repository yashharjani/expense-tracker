"use client"

import { useState, useEffect } from "react"
import { LogOut, Receipt, PlusCircle, BarChart3, Wallet } from "lucide-react"
import ManualEntryForm from "./components/ManualEntryForm"
import ReceiptUploader from "./components/ReceiptUploader"
import Dashboard from "./components/Dashboard"
import LoginForm from "./components/LoginForm"
import SignUpForm from "./components/SignUpForm"
import ConfirmSignUp from "./components/ConfirmSignUp"

function App() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [token, setToken] = useState(null)
  const [authStep, setAuthStep] = useState("login")
  const [pendingEmail, setPendingEmail] = useState("")
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    const savedToken = localStorage.getItem("idToken")
    if (savedToken) setToken(savedToken)
  }, [])

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleLogout = () => {
    localStorage.clear()
    setToken(null)
    setAuthStep("login")
  }

  // Authentication screens
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Wallet className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">ExpenseTracker</h1>
            <p className="text-gray-600 mt-2">Manage your expenses with ease</p>
          </div>

          {authStep === "signup" && (
            <>
              <SignUpForm
                onSignUp={(email) => {
                  setPendingEmail(email)
                  setAuthStep("confirm")
                }}
              />
              <p className="text-center mt-6 text-sm text-gray-600">
                Already have an account?{" "}
                <button className="text-blue-600 hover:text-blue-800 font-medium" onClick={() => setAuthStep("login")}>
                  Sign In
                </button>
              </p>
            </>
          )}

          {authStep === "login" && (
            <>
              <LoginForm onLogin={(jwt) => setToken(jwt)} />
              <p className="text-center mt-6 text-sm text-gray-600">
                Don't have an account?{" "}
                <button className="text-blue-600 hover:text-blue-800 font-medium" onClick={() => setAuthStep("signup")}>
                  Sign Up
                </button>
              </p>
            </>
          )}

          {authStep === "confirm" && (
            <>
              <ConfirmSignUp email={pendingEmail} />
              <p className="text-center mt-6 text-sm text-gray-600">
                Back to{" "}
                <button className="text-blue-600 hover:text-blue-800 font-medium" onClick={() => setAuthStep("login")}>
                  Sign In
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    )
  }

  // Main application
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">ExpenseTracker</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "dashboard"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("upload")}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "upload"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Receipt className="h-4 w-4" />
                Upload
              </button>
              <button
                onClick={() => setActiveTab("manual")}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "manual"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <PlusCircle className="h-4 w-4" />
                Add Expense
              </button>
              <button
                onClick={() => setActiveTab("budget")}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "budget"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Wallet className="h-4 w-4" />
                Budget
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "dashboard" && <Dashboard refreshKey={refreshKey} />}
          {activeTab === "upload" && <ReceiptUploader onUploadSuccess={triggerRefresh} />}
          {activeTab === "manual" && <ManualEntryForm onSubmitSuccess={triggerRefresh} type="expense" />}
          {activeTab === "budget" && <ManualEntryForm onSubmitSuccess={triggerRefresh} type="budget" />}
        </div>
      </main>
    </div>
  )
}

export default App