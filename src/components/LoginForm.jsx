"use client"

import { useState } from "react"
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js"
import userPool from "../cognito/userPool"
import { API_BASE_URL } from "../config"

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    const user = new CognitoUser({ Username: email, Pool: userPool })
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    })

    user.authenticateUser(authDetails, {
      onSuccess: async (data) => {
        const idToken = data.getIdToken().getJwtToken()
        localStorage.setItem("idToken", idToken)

        // ✅ Trigger SNS subscription
        try {
          await fetch(`${API_BASE_URL}/subscribe-alerts`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
          })
          console.log("SNS subscription triggered")
        } catch (err) {
          console.error("SNS subscribe failed", err)
        }

        setMessage("✅ Login successful!")
        if (onLogin) onLogin(idToken)
      },
      onFailure: (err) => {
        let msg = err.message || JSON.stringify(err)
        if (msg === "User is not confirmed.") {
          msg = "Email not verified."
        }
        setMessage(msg)
        setIsLoading(false)
      },
    })
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-900">Sign In</h2>
        <p className="text-center text-gray-600 mt-1">Enter your email and password to access your account</p>
      </div>
      <div className="px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </button>
        </form>
        {message && (
          <div className="mt-4 p-3 rounded-md bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-800">{message}</p>
          </div>
        )}
      </div>
    </div>
  )
}