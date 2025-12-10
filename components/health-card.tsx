"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type React from "react"

type RiskLevel = "safe" | "warning" | "risk"

interface Metric {
  label: string
  value: number
  risk: RiskLevel
}

interface HealthCardProps {
  title: string
  icon: React.ReactNode
  metrics: Metric[]
  riskLevel: RiskLevel
}

export function HealthCard({ title, icon, metrics, riskLevel }: HealthCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const tiltX = ((y - centerY) / centerY) * -10
    const tiltY = ((x - centerX) / centerX) * 10

    setTilt({ x: tiltX, y: tiltY })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  const riskColors = {
    safe: "border-success hover:shadow-success/30",
    warning: "border-warning hover:shadow-warning/30",
    risk: "border-destructive hover:shadow-destructive/30",
  }

  const riskGlowColors = {
    safe: "shadow-success/30",
    warning: "shadow-warning/30",
    risk: "shadow-destructive/30",
  }

  return (
    <Card
      className={cn(
        "border-2 transition-all duration-300 bg-card/80 backdrop-blur-sm hover:shadow-2xl fade-in-up",
        riskColors[riskLevel],
      )}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.1s ease-out",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="text-accent">{icon}</div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={cn(
              "flex justify-between items-center p-3 rounded-lg border-2 transition-all duration-300",
              metric.risk === "safe" &&
                "border-success/30 bg-success/5 hover:bg-success/10 hover:border-success hover:shadow-lg hover:shadow-success/20",
              metric.risk === "warning" &&
                "border-warning/30 bg-warning/5 hover:bg-warning/10 hover:border-warning hover:shadow-lg hover:shadow-warning/20",
              metric.risk === "risk" &&
                "border-destructive/30 bg-destructive/5 hover:bg-destructive/10 hover:border-destructive hover:shadow-lg hover:shadow-destructive/20",
            )}
          >
            <span
              className={cn(
                "font-medium",
                metric.risk === "safe" && "text-success",
                metric.risk === "warning" && "text-warning",
                metric.risk === "risk" && "text-destructive",
              )}
            >
              {metric.label}
            </span>
            <span
              className={cn(
                "text-xl font-bold",
                metric.risk === "safe" && "text-success",
                metric.risk === "warning" && "text-warning",
                metric.risk === "risk" && "text-destructive",
              )}
            >
              {metric.value}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
