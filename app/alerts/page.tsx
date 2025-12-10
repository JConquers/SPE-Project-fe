"use client"

import { useState, useEffect, useRef } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HeartbeatIcon, ActivityIcon } from "@/components/medical-icons"
import { ChevronDown, ChevronUp } from "lucide-react"

const API_BASE = "http://127.0.0.1:8000"

// TODO: Add your Gemini API key here
const GEMINI_API_KEY = "AIzaSyBuJA25NwTwbKT4uA2huP2qhSWaKxT7UxQ"

export default function AlertsPage() {
  const [alert, setAlert] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chatHistory")
      return saved
        ? JSON.parse(saved)
        : [{ role: "assistant", content: "Hello! I'm your AI health assistant. How can I help you today?" }]
    }
    return [{ role: "assistant", content: "Hello! I'm your AI health assistant. How can I help you today?" }]
  })
  const [inputMessage, setInputMessage] = useState("")
  const [sending, setSending] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("chatHistory", JSON.stringify(chatMessages))
    }
  }, [chatMessages])

  useEffect(() => {
    fetchAlertStatus()
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  const fetchAlertStatus = async () => {
    setLoading(true)
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) return

      const response = await fetch(`${API_BASE}/api/alerts/status/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setAlert(data.alert)
      }
    } catch (error) {
      console.error("Failed to fetch alert status", error)
    } finally {
      setLoading(false)
    }
  }

  const sendChatMessage = async () => {
    if (!inputMessage.trim() || sending) return

    const userMessage = inputMessage.trim()
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setInputMessage("")
    setSending(true)

    try {
      // TODO: Replace with actual Gemini API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I understand your concern about your health. Based on your digital twin data, I'd recommend focusing on improving your sleep schedule and reducing stress levels. Would you like specific tips for either of these?",
        },
      ])
    } catch (error) {
      console.error("Chat error", error)
    } finally {
      setSending(false)
    }
  }

  const getAlertBadge = () => {
    if (!alert) return null

    const badges = {
      no_consult: {
        color: "bg-success border-success text-success-foreground",
        label: "No Consultation Needed",
        message: "Your health metrics are within normal ranges. Keep up the good work!",
        icon: "✓",
      },
      routine_consult: {
        color: "bg-info border-info text-info-foreground",
        label: "Routine Checkup Advised",
        message: "Consider scheduling a routine checkup with your doctor to maintain your health.",
        icon: "ℹ",
      },
      specialist_consult: {
        color: "bg-warning border-warning text-warning-foreground",
        label: "Specialist Consultation Required",
        message: "Some metrics indicate you should consult with a healthcare specialist soon.",
        icon: "⚠",
      },
      emergency: {
        color: "bg-destructive border-destructive text-destructive-foreground",
        label: "Emergency Medical Attention Required",
        message: "Your health metrics require immediate medical attention. Please seek emergency care.",
        icon: "🚨",
      },
    }

    return badges[alert as keyof typeof badges]
  }

  const badge = getAlertBadge()

  return (
    <div className="min-h-screen">
      <DashboardNav />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 fade-in-up">
          <h1 className="text-4xl font-bold mb-2">Health Alerts & AI Doctor</h1>
          <p className="text-muted-foreground text-lg">Get personalized health recommendations</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Alert Status */}
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <Card className="border-2 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <ActivityIcon className="w-16 h-16 mx-auto mb-4 text-accent heartbeat-animation" />
                  <p className="text-xl font-medium">Analyzing your health...</p>
                </CardContent>
              </Card>
            ) : badge ? (
              <>
                {/* Alert Badge */}
                <Card className={`border-2 ${badge.color} shadow-xl fade-in-up`}>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl">{badge.icon}</div>
                      <div>
                        <h2 className="text-2xl font-bold">{badge.label}</h2>
                      </div>
                    </div>
                    <p className="text-lg">{badge.message}</p>
                  </CardContent>
                </Card>

                <Card className="border-2 bg-card/80 backdrop-blur-sm fade-in-up" style={{ animationDelay: "0.1s" }}>
                  <CardHeader>
                    <CardTitle>Health Trends</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-4 bg-background/50 rounded-lg border-l-4 border-warning">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Heart Health</span>
                        <span className="text-warning">↓ -5%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Declined slightly over the past month</p>
                    </div>

                    <div className="p-4 bg-background/50 rounded-lg border-l-4 border-success">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Sleep Quality</span>
                        <span className="text-success">↑ +12%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Improved significantly</p>
                    </div>

                    <div className="p-4 bg-background/50 rounded-lg border-l-4 border-destructive">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Stress Levels</span>
                        <span className="text-destructive">↑ +18%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Concerning increase - needs attention</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Explanation */}
                <Card className="border-2 bg-card/80 backdrop-blur-sm fade-in-up" style={{ animationDelay: "0.2s" }}>
                  <CardHeader>
                    <CardTitle>What This Means</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {alert === "no_consult" && (
                      <div className="space-y-3">
                        <p>Your current health metrics indicate:</p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                          <li>Heart health is within optimal range</li>
                          <li>Metabolic function is normal</li>
                          <li>Mental stress levels are manageable</li>
                          <li>Organ load is within safe limits</li>
                        </ul>
                        <p className="text-sm text-muted-foreground mt-4">
                          Continue your current lifestyle and schedule regular checkups to maintain your health.
                        </p>
                      </div>
                    )}
                    {alert === "routine_consult" && (
                      <div className="space-y-3">
                        <p>Your health metrics suggest a routine checkup would be beneficial:</p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                          <li>Some metrics are trending toward suboptimal ranges</li>
                          <li>Preventive care can help maintain your health</li>
                          <li>A general physician can provide guidance</li>
                        </ul>
                        <p className="text-sm text-muted-foreground mt-4">
                          Schedule an appointment with your primary care doctor within the next month.
                        </p>
                      </div>
                    )}
                    {alert === "specialist_consult" && (
                      <div className="space-y-3">
                        <p className="font-medium">Specific areas requiring attention:</p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                          <li>Cardiovascular metrics show concerning trends</li>
                          <li>Metabolic function requires specialist evaluation</li>
                          <li>Mental health support may be beneficial</li>
                        </ul>
                        <p className="text-sm text-muted-foreground mt-4">
                          Please consult with appropriate specialists within the next 1-2 weeks.
                        </p>
                      </div>
                    )}
                    {alert === "emergency" && (
                      <div className="space-y-3">
                        <p className="font-bold text-destructive">Immediate action required:</p>
                        <ul className="list-disc list-inside space-y-2 text-destructive">
                          <li>Critical health metrics detected</li>
                          <li>Organ load is in dangerous range</li>
                          <li>Cardiovascular stress is elevated</li>
                        </ul>
                        <p className="text-sm font-medium mt-4">
                          Please seek emergency medical care immediately or call emergency services.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : null}
          </div>

          <div className="lg:col-span-1">
            <Card
              className={`border-2 bg-card/80 backdrop-blur-sm sticky top-24 fade-in-up transition-all duration-500 ${
                chatOpen ? "shadow-2xl shadow-accent/20" : ""
              }`}
            >
              <CardHeader
                className="cursor-pointer hover:bg-accent/5 transition-colors rounded-t-lg"
                onClick={() => setChatOpen(!chatOpen)}
              >
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HeartbeatIcon className="w-6 h-6 text-accent heartbeat-animation" />
                    AI Health Assistant
                  </div>
                  <Button variant="ghost" size="sm" className="transition-transform duration-300">
                    {chatOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </Button>
                </CardTitle>
              </CardHeader>

              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  chatOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <CardContent className="space-y-4 pt-4">
                  <div className="h-[400px] overflow-y-auto space-y-4 p-4 bg-background/30 rounded-lg scroll-smooth">
                    {chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg animate-fade-in ${
                          msg.role === "user"
                            ? "bg-accent/20 ml-4 text-right slide-in-right"
                            : "bg-secondary/50 mr-4 slide-in-left"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    ))}

                    {sending && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 mr-4">
                        <div className="flex gap-1">
                          <div
                            className="w-2 h-2 bg-accent rounded-full heartbeat-dot"
                            style={{ animationDelay: "0s" }}
                          />
                          <div
                            className="w-2 h-2 bg-accent rounded-full heartbeat-dot"
                            style={{ animationDelay: "0.2s" }}
                          />
                          <div
                            className="w-2 h-2 bg-accent rounded-full heartbeat-dot"
                            style={{ animationDelay: "0.4s" }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">AI is thinking...</span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask about your health..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                      className="bg-background/50 backdrop-blur-sm"
                      disabled={sending}
                    />
                    <Button onClick={sendChatMessage} disabled={sending} className="glow-border">
                      Send
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Note: Add your Gemini API key in the code to enable AI responses
                  </p>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
