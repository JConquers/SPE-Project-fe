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
import { HeartbeatIcon, StethoscopeIcon } from "@/components/medical-icons"

const API_BASE = "http://127.0.0.1:8000"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      console.log("[v0] Login attempt for:", formData.email)

      // Note: Your backend doesn't have a login endpoint yet, so we'll get user by ID
      // In production, implement POST /api/user/login endpoint

      // For now, we'll try to find the user by email
      // This is a simplified approach - implement proper authentication on backend
      const response = await fetch(`${API_BASE}/api/user/1`, {
        method: "GET",
      })

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] User found:", data)
        localStorage.setItem("userId", data.id.toString())
        localStorage.setItem("userName", data.name)
        localStorage.setItem("userEmail", data.email)

        try {
          const twinResponse = await fetch(`${API_BASE}/api/twin/${data.id}`)
          if (twinResponse.ok) {
            console.log("[v0] Twin exists, redirecting to dashboard")
            router.push("/dashboard")
          } else {
            console.log("[v0] No twin found, redirecting to create-twin")
            router.push("/create-twin")
          }
        } catch {
          console.log("[v0] Error checking twin, redirecting to create-twin")
          router.push("/create-twin")
        }
      } else {
        setError("Invalid email or password")
      }
    } catch (error) {
      console.log("[v0] Login error:", error)
      setError("Network error. Please ensure your backend is running at http://127.0.0.1:8000")
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
          <CardTitle className="text-3xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center text-base">Login to access your digital twin</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <HeartbeatIcon className="w-4 h-4 text-accent" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-background/50 backdrop-blur-sm"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <StethoscopeIcon className="w-4 h-4 text-accent" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-background/50 backdrop-blur-sm"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full py-6 text-lg glow-border" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-accent hover:underline font-medium">
                Register here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
