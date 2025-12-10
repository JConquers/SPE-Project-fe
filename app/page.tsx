import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StethoscopeIcon, HeartbeatIcon, ActivityIcon, HospitalIcon } from "@/components/medical-icons"

export default function LandingPage() {
  const timelineItems = [
    {
      icon: <ActivityIcon className="w-8 h-8" />,
      title: "AI Powered Insights",
      description: "Get real insights about your body and see its health status",
    },
    {
      icon: <HeartbeatIcon className="w-8 h-8" />,
      title: "Track Your Current Habits",
      description: "Track and improve your current habits before it's too late",
    },
    {
      icon: <StethoscopeIcon className="w-8 h-8" />,
      title: "Future Health Simulation",
      description: "Witness how your lifestyle choices shape your tomorrow",
    },
    {
      icon: <HospitalIcon className="w-8 h-8" />,
      title: "Personalized Recommendations",
      description: "Get AI-driven suggestions tailored to your health profile",
    },
    {
      icon: <ActivityIcon className="w-8 h-8" />,
      title: "Real-Time Monitoring",
      description: "Stay connected with continuous health tracking and alerts",
    },
  ]

  const pricingPlans = [
    {
      name: "Basic",
      price: "Free",
      features: ["Digital Twin Creation", "Basic Health Metrics", "Limited Simulations", "Community Support"],
    },
    {
      name: "Professional",
      price: "$29/mo",
      features: [
        "Unlimited Simulations",
        "Advanced AI Insights",
        "Calorie Tracking",
        "Priority Support",
        "Export Reports",
      ],
    },
    {
      name: "Enterprise",
      price: "$99/mo",
      features: ["Everything in Pro", "Multi-User Access", "API Access", "Custom ML Models", "Dedicated Support"],
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center mb-8 fade-in-up">
            <div className="flex items-center gap-4">
              <Image src="/images/logo.png" alt="Simulafy Me Logo" width={80} height={80} className="object-contain" />
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-foreground">
                Simulafy{" "}
                <span className="bg-gradient-to-r from-red-600 via-red-500 to-black bg-clip-text text-transparent">
                  Me
                </span>
              </h1>
            </div>
          </div>

          {/* Tagline */}
          <p
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            Witness how the environment, your health and your habits shape your tomorrow, track your calories and get
            suggestions on how to improve
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Link href="/register">
              <Button
                size="lg"
                className="text-lg px-8 py-6 glow-border bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 glow-border bg-transparent">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-border" />

            {/* Timeline Items */}
            <div className="space-y-12">
              {timelineItems.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex items-center fade-in-up ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Card */}
                  <div className={`w-5/12 ${index % 2 === 0 ? "pr-12 text-right" : "pl-12 text-left"}`}>
                    <Card className="border-2 hover:border-accent transition-all duration-300 glow-border bg-card/80 backdrop-blur-sm">
                      <CardContent className="p-6 space-y-3">
                        <div className={`flex items-center gap-3 ${index % 2 === 0 ? "justify-end" : "justify-start"}`}>
                          <div className="text-accent">{item.icon}</div>
                          <h3 className="text-xl font-bold">{item.title}</h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Center Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-accent border-4 border-background z-10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">Choose Your Plan</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">Start your digital health journey today</p>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`border-2 hover:border-accent transition-all duration-300 fade-in-up glow-border ${
                  plan.name === "Professional" ? "md:scale-105 border-accent" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold text-accent">{plan.price}</div>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/register">
                    <Button className="w-full" variant={plan.name === "Professional" ? "default" : "outline"}>
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
            <span className="text-2xl font-bold">Simulafy Me</span>
          </div>
          <p className="text-muted-foreground">Your digital health twin for a better tomorrow</p>
          <p className="text-sm text-muted-foreground mt-4">© 2025 Simulafy Me. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
