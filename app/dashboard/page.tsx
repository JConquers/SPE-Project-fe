"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"
import { HealthCard } from "@/components/health-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HeartbeatIcon, ActivityIcon, HospitalIcon } from "@/components/medical-icons"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const API_BASE = "http://127.0.0.1:8000"

export default function DashboardPage() {
  const router = useRouter()
  const [twin, setTwin] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [chartsLoading, setChartsLoading] = useState(true)

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      router.push("/login")
      return
    }

    const fetchTwin = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/twin/${userId}`)
        if (response.ok) {
          const data = await response.json()
          setTwin(data)
          setTimeout(() => setChartsLoading(false), 1500)
        } else {
          router.push("/create-twin")
        }
      } catch (error) {
        console.error("Failed to fetch twin", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTwin()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ActivityIcon className="w-16 h-16 text-accent heartbeat-animation" />
      </div>
    )
  }

  if (!twin) {
    return null
  }

  const getHeartRisk = () => {
    if (twin.heart_score >= 80) return "safe"
    if (twin.heart_score >= 60) return "warning"
    return "risk"
  }

  const getMetabolicRisk = () => {
    if (twin.metabolic_score >= 80) return "safe"
    if (twin.metabolic_score >= 60) return "warning"
    return "risk"
  }

  const getStressRisk = () => {
    if (twin.mental_stress_score >= 80) return "safe"
    if (twin.mental_stress_score >= 60) return "warning"
    return "risk"
  }

  const getOrganRisk = () => {
    if (twin.organ_load_score <= 30) return "safe"
    if (twin.organ_load_score <= 60) return "warning"
    return "risk"
  }

  const heartRisk = getHeartRisk()
  const metabolicRisk = getMetabolicRisk()
  const stressRisk = getStressRisk()
  const organRisk = getOrganRisk()

  const riskCount = {
    risk: [heartRisk, metabolicRisk, stressRisk, organRisk].filter((r) => r === "risk").length,
    warning: [heartRisk, metabolicRisk, stressRisk, organRisk].filter((r) => r === "warning").length,
  }

  const coreHealthRiskLevel = riskCount.risk >= 2 ? "risk" : riskCount.warning >= 2 ? "warning" : "safe"

  const weeklyActivity = [
    { day: "Mon", steps: 8200, calories: 2100 },
    { day: "Tue", steps: 7500, calories: 1980 },
    { day: "Wed", steps: 9100, calories: 2250 },
    { day: "Thu", steps: 6800, calories: 1850 },
    { day: "Fri", steps: 10200, calories: 2400 },
    { day: "Sat", steps: 12000, calories: 2600 },
    { day: "Sun", steps: 9500, calories: 2200 },
  ]

  const healthDistribution = [
    {
      name: "Heart",
      value: twin.heart_score,
      color: heartRisk === "safe" ? "#22c55e" : heartRisk === "warning" ? "#eab308" : "#ef4444",
    },
    {
      name: "Metabolic",
      value: twin.metabolic_score,
      color: metabolicRisk === "safe" ? "#22c55e" : metabolicRisk === "warning" ? "#eab308" : "#ef4444",
    },
    {
      name: "Mental",
      value: twin.mental_stress_score,
      color: stressRisk === "safe" ? "#22c55e" : stressRisk === "warning" ? "#eab308" : "#ef4444",
    },
    {
      name: "Organ",
      value: 100 - twin.organ_load_score,
      color: organRisk === "safe" ? "#22c55e" : organRisk === "warning" ? "#eab308" : "#ef4444",
    },
  ]

  const monthlyTrends = [
    { month: "Jan", health: 75 },
    { month: "Feb", health: 78 },
    { month: "Mar", health: 74 },
    { month: "Apr", health: 80 },
    { month: "May", health: 82 },
    { month: "Jun", health: 85 },
  ]

  return (
    <div className="min-h-screen">
      <DashboardNav />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 fade-in-up">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {localStorage.getItem("userName")}</h1>
          <p className="text-muted-foreground text-lg">Here's your health overview</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <HealthCard
            title="Core Health"
            icon={<HeartbeatIcon className="w-8 h-8" />}
            metrics={[
              { label: "Heart Score", value: twin.heart_score, risk: heartRisk },
              { label: "Metabolic Score", value: twin.metabolic_score, risk: metabolicRisk },
              { label: "Mental Stress Score", value: twin.mental_stress_score, risk: stressRisk },
              { label: "Organ Load Score", value: twin.organ_load_score, risk: organRisk },
            ]}
            riskLevel={coreHealthRiskLevel}
          />

          <Card
            className="border-2 hover:border-accent transition-all duration-300 glow-border bg-card/80 backdrop-blur-sm fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <HospitalIcon className="w-8 h-8 text-accent" />
                Environment Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">City</span>
                <span className="font-bold">{twin.city || "Delhi"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">AQI</span>
                <span className="font-bold text-warning">{twin.aqi || 156}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Lung Risk</span>
                <span className="font-bold text-warning">Moderate</span>
              </div>
            </CardContent>
          </Card>

          <Card
            className="border-2 hover:border-accent transition-all duration-300 glow-border bg-card/80 backdrop-blur-sm fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <ActivityIcon className="w-8 h-8 text-accent" />
                Lifestyle Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Steps Today</span>
                <span className="font-bold">{twin.daily_steps || 8542}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Sleep Hours</span>
                <span className="font-bold">{twin.sleep_hours}h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Screen Time</span>
                <span className="font-bold">{twin.screen_time_hours}h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Diet Type</span>
                <span className="font-bold capitalize">{twin.diet_type || "Vegetarian"}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 bg-card/80 backdrop-blur-sm fade-in-up">
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {chartsLoading ? (
                <div className="h-[250px] flex items-center justify-center">
                  <ActivityIcon className="w-12 h-12 text-accent heartbeat-animation" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="steps" fill="oklch(0.6 0.2 25)" name="Steps" animationDuration={1000} />
                    <Bar dataKey="calories" fill="oklch(0.6 0.15 240)" name="Calories" animationDuration={1000} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 bg-card/80 backdrop-blur-sm fade-in-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle>Health Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {chartsLoading ? (
                <div className="h-[250px] flex items-center justify-center">
                  <ActivityIcon className="w-12 h-12 text-accent heartbeat-animation" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={healthDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => entry.name}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      animationDuration={1000}
                    >
                      {healthDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card
            className="border-2 bg-card/80 backdrop-blur-sm fade-in-up md:col-span-2"
            style={{ animationDelay: "0.2s" }}
          >
            <CardHeader>
              <CardTitle>6-Month Health Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {chartsLoading ? (
                <div className="h-[250px] flex items-center justify-center">
                  <ActivityIcon className="w-12 h-12 text-accent heartbeat-animation" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="health"
                      stroke="oklch(0.6 0.2 25)"
                      strokeWidth={3}
                      name="Overall Health Score"
                      animationDuration={2000}
                      dot={{ r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
