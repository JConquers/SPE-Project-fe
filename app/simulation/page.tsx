"use client"

import { useState } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ActivityIcon } from "@/components/medical-icons"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Gauge } from "@/components/ui/gauge"

const API_BASE = "http://127.0.0.1:8000"

export default function SimulationPage() {
  const [years, setYears] = useState(10)
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [lifestyle, setLifestyle] = useState({
    increaseExercise: false,
    reduceSmoking: false,
    betterSleep: false,
    dietImprovement: false,
  })
  const [environment, setEnvironment] = useState({
    higherPollution: false,
    workStress: false,
    noiseExposure: false,
  })

  const handleRunSimulation = async () => {
    setIsRunning(true)

    try {
      const twinId = localStorage.getItem("twinId")
      if (!twinId) return

      const response = await fetch(`${API_BASE}/api/simulation/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          twin_id: Number.parseInt(twinId),
          years,
          lifestyle_changes: {
            increase_exercise: lifestyle.increaseExercise ? 1 : 0,
            reduce_smoking: lifestyle.reduceSmoking ? 1 : 0,
            better_sleep: lifestyle.betterSleep ? 1 : 0,
            diet_improvement: lifestyle.dietImprovement ? 1 : 0,
          },
          environmental_factors: {
            higher_pollution: environment.higherPollution ? 1 : 0,
            work_stress: environment.workStress ? 1 : 0,
            noise_exposure: environment.noiseExposure ? 1 : 0,
          },
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data)
      }
    } catch (error) {
      console.error("Simulation failed", error)
      const mockResults = {
        years,
        timeline: Array.from({ length: years }, (_, i) => ({
          year: i + 1,
          heart: 85 - i * 2 + (lifestyle.increaseExercise ? 5 : 0) - (environment.workStress ? 3 : 0),
          mental: 80 - i * 1.5 + (lifestyle.betterSleep ? 8 : 0) - (environment.workStress ? 5 : 0),
          organ:
            20 +
            i * 2 +
            (environment.higherPollution ? 3 : 0) -
            (lifestyle.dietImprovement ? 5 : 0) +
            (lifestyle.reduceSmoking ? -3 : 0),
        })),
        finalOrganLoad: 35,
        riskLevel: "warning",
      }
      setResults(mockResults)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="min-h-screen">
      <DashboardNav />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 fade-in-up">
          <h1 className="text-4xl font-bold mb-2">Future Health Simulation</h1>
          <p className="text-muted-foreground text-lg">What will happen to you?</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Simulation Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Years Input */}
            <Card className="border-2 bg-card/80 backdrop-blur-sm fade-in-up">
              <CardHeader>
                <CardTitle>Simulation Period</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Number of Years</Label>
                  <Input
                    type="number"
                    min="1"
                    max="30"
                    value={years}
                    onChange={(e) => setYears(Number.parseInt(e.target.value) || 10)}
                    className="bg-background/50 backdrop-blur-sm"
                  />
                  <div className="flex gap-2 mt-3">
                    {[5, 10, 20].map((y) => (
                      <Button key={y} variant="outline" size="sm" onClick={() => setYears(y)} className="flex-1">
                        {y}y
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lifestyle Changes */}
            <Card className="border-2 bg-card/80 backdrop-blur-sm fade-in-up" style={{ animationDelay: "0.1s" }}>
              <CardHeader>
                <CardTitle>Lifestyle Changes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="exercise"
                    checked={lifestyle.increaseExercise}
                    onCheckedChange={(checked) => setLifestyle({ ...lifestyle, increaseExercise: checked as boolean })}
                  />
                  <Label htmlFor="exercise" className="cursor-pointer">
                    💪 Increase Exercise
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="smoking"
                    checked={lifestyle.reduceSmoking}
                    onCheckedChange={(checked) => setLifestyle({ ...lifestyle, reduceSmoking: checked as boolean })}
                  />
                  <Label htmlFor="smoking" className="cursor-pointer">
                    🚭 Reduce Smoking
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sleep"
                    checked={lifestyle.betterSleep}
                    onCheckedChange={(checked) => setLifestyle({ ...lifestyle, betterSleep: checked as boolean })}
                  />
                  <Label htmlFor="sleep" className="cursor-pointer">
                    😴 Better Sleep
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="diet"
                    checked={lifestyle.dietImprovement}
                    onCheckedChange={(checked) => setLifestyle({ ...lifestyle, dietImprovement: checked as boolean })}
                  />
                  <Label htmlFor="diet" className="cursor-pointer">
                    🥗 Diet Improvement
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Environmental Changes */}
            <Card className="border-2 bg-card/80 backdrop-blur-sm fade-in-up" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <CardTitle>Environmental Factors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pollution"
                    checked={environment.higherPollution}
                    onCheckedChange={(checked) =>
                      setEnvironment({ ...environment, higherPollution: checked as boolean })
                    }
                  />
                  <Label htmlFor="pollution" className="cursor-pointer">
                    🏭 Higher Pollution
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="stress"
                    checked={environment.workStress}
                    onCheckedChange={(checked) => setEnvironment({ ...environment, workStress: checked as boolean })}
                  />
                  <Label htmlFor="stress" className="cursor-pointer">
                    😰 Work Stress
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="noise"
                    checked={environment.noiseExposure}
                    onCheckedChange={(checked) => setEnvironment({ ...environment, noiseExposure: checked as boolean })}
                  />
                  <Label htmlFor="noise" className="cursor-pointer">
                    🔊 Noise Exposure
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleRunSimulation} disabled={isRunning} className="w-full py-6 text-lg glow-border">
              {isRunning ? "Running Simulation..." : "Run Simulation"}
            </Button>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {isRunning && (
              <Card className="border-2 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <ActivityIcon className="w-16 h-16 mx-auto mb-4 text-accent heartbeat-animation" />
                  <p className="text-xl font-medium">Analyzing your future health...</p>
                </CardContent>
              </Card>
            )}

            {results && !isRunning && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="border-2 bg-card/80 backdrop-blur-sm fade-in-up">
                    <CardContent className="p-6 text-center">
                      <Gauge
                        value={results.timeline[results.timeline.length - 1].heart}
                        max={100}
                        label="Heart Health"
                        color="oklch(0.6 0.2 25)"
                      />
                    </CardContent>
                  </Card>

                  <Card className="border-2 bg-card/80 backdrop-blur-sm fade-in-up" style={{ animationDelay: "0.05s" }}>
                    <CardContent className="p-6 text-center">
                      <Gauge
                        value={results.timeline[results.timeline.length - 1].mental}
                        max={100}
                        label="Mental Health"
                        color="oklch(0.6 0.15 240)"
                      />
                    </CardContent>
                  </Card>

                  <Card className="border-2 bg-card/80 backdrop-blur-sm fade-in-up" style={{ animationDelay: "0.1s" }}>
                    <CardContent className="p-6 text-center">
                      <Gauge
                        value={100 - results.timeline[results.timeline.length - 1].organ}
                        max={100}
                        label="Organ Health"
                        color="oklch(0.75 0.15 85)"
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Health Curves */}
                <Card className="border-2 bg-card/80 backdrop-blur-sm fade-in-up" style={{ animationDelay: "0.15s" }}>
                  <CardHeader>
                    <CardTitle>Year-wise Health Projection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={results.timeline}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="year" label={{ value: "Years", position: "insideBottom", offset: -5 }} />
                        <YAxis label={{ value: "Health Score", angle: -90, position: "insideLeft" }} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="heart"
                          stroke="#ef4444"
                          strokeWidth={3}
                          name="Heart Health"
                          animationDuration={2000}
                          dot={{ r: 5 }}
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="mental"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          name="Mental Health"
                          animationDuration={2000}
                          dot={{ r: 5 }}
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="organ"
                          stroke="#eab308"
                          strokeWidth={3}
                          name="Organ Load"
                          animationDuration={2000}
                          dot={{ r: 5 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Final Verdict */}
                <Card
                  className={`border-2 bg-card/80 backdrop-blur-sm fade-in-up ${
                    results.riskLevel === "critical"
                      ? "border-destructive shadow-lg shadow-destructive/20"
                      : results.riskLevel === "warning"
                        ? "border-warning shadow-lg shadow-warning/20"
                        : "border-success shadow-lg shadow-success/20"
                  }`}
                  style={{ animationDelay: "0.2s" }}
                >
                  <CardHeader>
                    <CardTitle>Final Health Prediction</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-background/50 rounded-lg">
                      <span className="font-medium">Final Organ Load Score</span>
                      <span className="text-2xl font-bold text-warning">{results.finalOrganLoad}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-background/50 rounded-lg">
                      <span className="font-medium">Risk Level</span>
                      <span
                        className={`text-2xl font-bold uppercase ${
                          results.riskLevel === "critical"
                            ? "text-destructive"
                            : results.riskLevel === "warning"
                              ? "text-warning"
                              : "text-success"
                        }`}
                      >
                        {results.riskLevel}
                      </span>
                    </div>
                    <div
                      className={`p-6 rounded-lg border-2 ${
                        results.riskLevel === "critical"
                          ? "border-destructive bg-destructive/10"
                          : results.riskLevel === "warning"
                            ? "border-warning bg-warning/10"
                            : "border-success bg-success/10"
                      }`}
                    >
                      <p className="text-lg font-medium text-center">
                        {results.riskLevel === "critical" &&
                          `At current lifestyle, your ${years}-year risk is CRITICAL. Immediate lifestyle changes recommended.`}
                        {results.riskLevel === "warning" &&
                          `At current lifestyle, your ${years}-year risk is MODERATE. Consider lifestyle improvements.`}
                        {results.riskLevel === "safe" &&
                          `At current lifestyle, your ${years}-year risk is LOW. Keep up the good work!`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
