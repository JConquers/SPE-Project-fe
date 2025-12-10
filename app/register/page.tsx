"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { StethoscopeIcon, HeartbeatIcon, ActivityIcon } from "@/components/medical-icons"

const API_BASE = "http://127.0.0.1:8000"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [validationStatus, setValidationStatus] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  })

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    const status = { name: false, email: false, password: false, confirmPassword: false }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else {
      status.name = true
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    } else {
      status.email = true
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    } else {
      status.password = true
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    } else if (formData.confirmPassword) {
      status.confirmPassword = true
    }

    setValidationStatus(status)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    setTimeout(() => {
      const newErrors: { [key: string]: string } = {}
      const status = { ...validationStatus }

      if (field === "name") {
        status.name = value.trim().length > 0
        if (!value.trim()) newErrors.name = "Name is required"
      }

      if (field === "email") {
        status.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        if (!value.trim()) newErrors.email = "Email is required"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) newErrors.email = "Invalid email format"
      }

      if (field === "password") {
        status.password = value.length >= 6
        if (!value) newErrors.password = "Password is required"
        else if (value.length < 6) newErrors.password = "Password must be at least 6 characters"
      }

      if (field === "confirmPassword" || field === "password") {
        status.confirmPassword =
          formData.password === value || (field === "password" && formData.confirmPassword === value)
        if (field === "confirmPassword" && formData.password !== value) {
          newErrors.confirmPassword = "Passwords do not match"
        }
      }

      setValidationStatus(status)
      setErrors({ ...errors, ...newErrors })
    }, 100)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Submit attempt with data:", { name: formData.name, email: formData.email })

    if (!validateForm()) {
      console.log("[v0] Validation failed:", errors)
      return
    }

    setIsLoading(true)
    try {
      console.log("[v0] Sending request to:", `${API_BASE}/api/user/register`)
      const response = await fetch(`${API_BASE}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      console.log("[v0] Response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Registration successful:", data)
        localStorage.setItem("userId", data.id.toString())
        localStorage.setItem("userName", data.name)
        localStorage.setItem("userEmail", data.email)
        router.push("/create-twin")
      } else {
        const error = await response.json()
        console.log("[v0] Registration failed:", error)
        setErrors({ submit: error.detail || "Registration failed" })
      }
    } catch (error) {
      console.log("[v0] Network error:", error)
      setErrors({ submit: "Network error. Please ensure your backend is running at http://127.0.0.1:8000" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-2 bg-card/80 backdrop-blur-lg shadow-2xl fade-in-up">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <Image src="/images/logo.png" alt="Logo" width={60} height={60} className="object-contain" />
          </div>
          <CardTitle className="text-3xl font-bold text-center">Create Your Account</CardTitle>
          <CardDescription className="text-center text-base">Join the future of personalized health</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <ActivityIcon className="w-4 h-4 text-accent" />
                Name
                {validationStatus.name && <span className="text-green-500 ml-auto">✓</span>}
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`bg-background/50 backdrop-blur-sm ${errors.name ? "border-destructive" : ""}`}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <HeartbeatIcon className="w-4 h-4 text-accent" />
                Email
                {validationStatus.email && <span className="text-green-500 ml-auto">✓</span>}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`bg-background/50 backdrop-blur-sm ${errors.email ? "border-destructive" : ""}`}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <StethoscopeIcon className="w-4 h-4 text-accent" />
                Password
                {validationStatus.password && <span className="text-green-500 ml-auto">✓</span>}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password (min 6 characters)"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`bg-background/50 backdrop-blur-sm ${errors.password ? "border-destructive" : ""}`}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                <StethoscopeIcon className="w-4 h-4 text-accent" />
                Confirm Password
                {validationStatus.confirmPassword && <span className="text-green-500 ml-auto">✓</span>}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className={`bg-background/50 backdrop-blur-sm ${errors.confirmPassword ? "border-destructive" : ""}`}
              />
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
            </div>

            {errors.submit && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
                <p className="text-sm text-destructive">{errors.submit}</p>
              </div>
            )}

            <Button type="submit" className="w-full py-6 text-lg glow-border" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:underline font-medium">
                Login here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
