"use client"

import { cn } from "@/lib/utils"

interface GaugeProps {
  value: number
  max: number
  label: string
  color?: string
  className?: string
}

export function Gauge({ value, max, label, color = "oklch(0.6 0.2 25)", className }: GaugeProps) {
  const percentage = Math.min((value / max) * 100, 100)
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="oklch(0.92 0 0)" strokeWidth="8" className="opacity-20" />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            style={{
              animation: "gaugeAnimation 2s ease-out",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{Math.round(value)}</span>
          <span className="text-xs text-muted-foreground">/ {max}</span>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-center">{label}</p>
    </div>
  )
}
