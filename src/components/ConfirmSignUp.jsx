"use client"

import { useState } from "react"
import { Loader2, Mail, Shield } from "lucide-react"
import { CognitoUser } from "amazon-cognito-identity-js"
import userPool from "../cognito/userPool"

export default function ConfirmSignUp({ email }) {
  const [code, setCode] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    })

    user.confirmRegistration(code, true, (err, result) => {
      if (err) {
        setMessage(err.message || JSON.stringify(err))
        setIsLoading(false)
        return
      }
      setMessage("✅ Account confirmed! Subscription mail has been sent. After subscribing, you can sign in.")
      setIsLoading(false)
    })
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-900">Confirm Your Account</h2>
        <p className="text-center text-gray-600 mt-1">Enter the confirmation code sent to your email</p>
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
                value={email}
                readOnly
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>
          </div>
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmation Code
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                id="code"
                type="text"
                placeholder="Enter confirmation code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Account
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