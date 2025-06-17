"use client"

import { useState, useCallback } from "react"
import { Upload, FileImage, Loader2, CheckCircle, Receipt } from "lucide-react"
import { API_BASE_URL } from "../config"

export default function ReceiptUploader({ onUploadSuccess }) {
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileChange = (selectedFile) => {
    if (
      selectedFile &&
      (selectedFile.type === "image/png" || selectedFile.type === "image/jpeg" || selectedFile.type === "image/jpg")
    ) {
      setFile(selectedFile)
      setMessage("")
    } else {
      setMessage("Please select a valid image file (PNG, JPEG, JPG)")
    }
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    handleFileChange(droppedFile)
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.")
      return
    }

    const filename = file.name
    const contentType = file.type

    try {
      setIsUploading(true)
      setMessage("Requesting upload URL...")

      // Step 1: Get pre-signed URL
      const res = await fetch(`${API_BASE_URL}/get-upload-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("idToken")}`,
        },
        body: JSON.stringify({ filename, contentType }),
      })

      const { upload_url } = await res.json()

      // Step 2: Upload file to S3
      setMessage("Uploading...")
      const uploadRes = await fetch(upload_url, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: file,
      })

      if (!uploadRes.ok) {
        throw new Error("S3 upload failed")
      }

      setMessage("✅ Receipt uploaded successfully!")
      if (onUploadSuccess) onUploadSuccess()
      setFile(null)
    } catch (err) {
      console.error(err)
      setMessage("❌ Upload failed.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Upload Receipt
          </h2>
          <p className="text-gray-600 mt-1">Upload your receipt images for automatic expense processing</p>
        </div>
        <div className="px-6 py-6 space-y-6">
          {/* Drag & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="flex flex-col items-center space-y-4">
              {file ? (
                <>
                  <CheckCircle className="h-12 w-12 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Drop your receipt here, or click to browse</p>
                    <p className="text-xs text-gray-500">PNG, JPEG, JPG</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* File Input */}
          <div className="flex justify-center">
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <FileImage className="h-4 w-4" />
                Choose File
              </div>
              <input
                id="file-upload"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={(e) => handleFileChange(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Receipt...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload & Process Receipt
              </>
            )}
          </button>

          {/* Message */}
          {message && (
            <div className="p-3 rounded-md bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-800">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}