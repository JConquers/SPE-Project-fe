"use client"

import { useEffect, useState } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { HeartbeatIcon } from "@/components/medical-icons"

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserData({
        name: localStorage.getItem("userName") || "",
        email: localStorage.getItem("userEmail") || "",
      })
    }
  }, [])

  return (
    <div className="min-h-screen">
      <DashboardNav />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="border-2 bg-card/80 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <HeartbeatIcon className="w-6 h-6 text-accent" />
              User Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={userData.name} disabled className="bg-background/50 backdrop-blur-sm" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={userData.email} disabled className="bg-background/50 backdrop-blur-sm" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value="••••••••" disabled className="bg-background/50 backdrop-blur-sm" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
