import type React from "react"
import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { GridBackground } from "@/components/grid-background"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Simulafy Me - Digital Health Twin",
  description: "Witness how the environment, your health and your habits shape your tomorrow",
  generator: "v0.app",
  icons: {
    icon: "/images/logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} font-sans antialiased`}>
        <GridBackground />
        <div className="relative z-10">{children}</div>
        <Analytics />
      </body>
    </html>
  )
}
