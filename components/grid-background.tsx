"use client"

import { useEffect, useRef } from "react"

export function GridBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const verticalLinesRef = useRef<HTMLDivElement[]>([])
  const horizontalLinesRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create grid lines
    const spacing = 50 // Grid spacing in pixels
    const vCount = Math.ceil(window.innerWidth / spacing)
    const hCount = Math.ceil(window.innerHeight / spacing)

    // Clear existing lines
    container.innerHTML = ""
    verticalLinesRef.current = []
    horizontalLinesRef.current = []

    // Create vertical lines
    for (let i = 0; i <= vCount; i++) {
      const line = document.createElement("div")
      line.className = "grid-line grid-line-vertical"
      line.style.left = `${i * spacing}px`
      container.appendChild(line)
      verticalLinesRef.current.push(line)
    }

    // Create horizontal lines
    for (let i = 0; i <= hCount; i++) {
      const line = document.createElement("div")
      line.className = "grid-line grid-line-horizontal"
      line.style.top = `${i * spacing}px`
      container.appendChild(line)
      horizontalLinesRef.current.push(line)
    }

    // Handle mouse movement - lines converge towards cursor
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2

      // Animate vertical lines
      verticalLinesRef.current.forEach((line, i) => {
        const lineX = i * spacing
        const distance = Math.abs(lineX - clientX)
        const maxDistance = 300
        const scale = Math.max(0, 1 - distance / maxDistance)
        const offset = (clientX - lineX) * scale * 0.15
        line.style.transform = `translateX(${offset}px)`
      })

      // Animate horizontal lines
      horizontalLinesRef.current.forEach((line, i) => {
        const lineY = i * spacing
        const distance = Math.abs(lineY - clientY)
        const maxDistance = 300
        const scale = Math.max(0, 1 - distance / maxDistance)
        const offset = (clientY - lineY) * scale * 0.15
        line.style.transform = `translateY(${offset}px)`
      })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return <div ref={containerRef} className="grid-background" />
}
