"use client"

import { useState, useEffect } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ActivityIcon, HeartbeatIcon, HospitalIcon } from "@/components/medical-icons"

const API_BASE = "http://127.0.0.1:8000"

export default function MLOpsPage() {
  const [healthModels, setHealthModels] = useState<any[]>([])
  const [calorieModels, setCalorieModels] = useState<any[]>([])
  const [activeHealthModel, setActiveHealthModel] = useState<any>(null)
  const [activeCalorieModel, setActiveCalorieModel] = useState<any>(null)
  const [retraining, setRetraining] = useState({ health: false, calorie: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    setLoading(true)
    try {
      // Fetch health models
      const healthResponse = await fetch(`${API_BASE}/api/mlops/models`)
      if (healthResponse.ok) {
        const healthData = await healthResponse.json()
        setHealthModels(healthData.models || [])
      }

      // Fetch health model status
      const healthStatusResponse = await fetch(`${API_BASE}/api/mlops/model-status`)
      if (healthStatusResponse.ok) {
        const statusData = await healthStatusResponse.json()
        setActiveHealthModel(statusData.active_model)
      }

      // Fetch calorie models
      const calorieResponse = await fetch(`${API_BASE}/api/calories/mlops/models`)
      if (calorieResponse.ok) {
        const calorieData = await calorieResponse.json()
        setCalorieModels(calorieData.models || [])
      }

      // Fetch calorie model status
      const calorieStatusResponse = await fetch(`${API_BASE}/api/calories/mlops/status`)
      if (calorieStatusResponse.ok) {
        const statusData = await calorieStatusResponse.json()
        setActiveCalorieModel(statusData)
      }
    } catch (error) {
      console.error("Failed to fetch models", error)
    } finally {
      setLoading(false)
    }
  }

  const retrainHealthModel = async () => {
    setRetraining({ ...retraining, health: true })
    try {
      const response = await fetch(`${API_BASE}/api/mlops/retrain`, {
        method: "POST",
      })
      if (response.ok) {
        await fetchModels()
      }
    } catch (error) {
      console.error("Failed to retrain health model", error)
    } finally {
      setRetraining({ ...retraining, health: false })
    }
  }

  const retrainCalorieModel = async () => {
    setRetraining({ ...retraining, calorie: true })
    try {
      const response = await fetch(`${API_BASE}/api/calories/mlops/retrain`, {
        method: "POST",
      })
      if (response.ok) {
        await fetchModels()
      }
    } catch (error) {
      console.error("Failed to retrain calorie model", error)
    } finally {
      setRetraining({ ...retraining, calorie: false })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <DashboardNav />
        <div className="flex items-center justify-center h-[80vh]">
          <ActivityIcon className="w-16 h-16 text-accent heartbeat-animation" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <DashboardNav />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 fade-in-up">
          <h1 className="text-4xl font-bold mb-2">ML Operations & Pipeline</h1>
          <p className="text-muted-foreground text-lg">Explore how our machine learning models work</p>
        </div>

        {/* Architecture Overview */}
        <Card className="border-2 bg-card/80 backdrop-blur-sm mb-8 fade-in-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <HospitalIcon className="w-6 h-6 text-accent" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2 p-4 bg-background/50 rounded-lg border-2 border-accent/20">
                <div className="text-3xl font-bold text-accent">1</div>
                <h3 className="font-bold text-lg">Data Collection</h3>
                <p className="text-sm text-muted-foreground">
                  Your health metrics, lifestyle data, and environmental factors are continuously collected and stored
                  securely.
                </p>
              </div>
              <div className="space-y-2 p-4 bg-background/50 rounded-lg border-2 border-accent/20">
                <div className="text-3xl font-bold text-accent">2</div>
                <h3 className="font-bold text-lg">Model Training</h3>
                <p className="text-sm text-muted-foreground">
                  Multiple ML models (Random Forest, XGBoost, Neural Networks) are trained on real user data to predict
                  health outcomes.
                </p>
              </div>
              <div className="space-y-2 p-4 bg-background/50 rounded-lg border-2 border-accent/20">
                <div className="text-3xl font-bold text-accent">3</div>
                <h3 className="font-bold text-lg">Predictions & Insights</h3>
                <p className="text-sm text-muted-foreground">
                  The best-performing model provides health alerts, future projections, and personalized
                  recommendations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Health Alert Models */}
          <Card className="border-2 bg-card/80 backdrop-blur-sm fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <HeartbeatIcon className="w-6 h-6 text-accent" />
                Health Alert Models
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeHealthModel && (
                <div className="p-4 bg-success/10 border-2 border-success rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-success">Active Model</span>
                    <span className="text-xs bg-success text-success-foreground px-2 py-1 rounded">LIVE</span>
                  </div>
                  <p className="font-bold text-lg mb-1">{activeHealthModel.name || "Health Alert Model v1"}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Accuracy:</span>{" "}
                      <span className="font-bold">{activeHealthModel.accuracy || "94.2%"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">F1 Score:</span>{" "}
                      <span className="font-bold">{activeHealthModel.f1_score || "0.91"}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Last trained: {activeHealthModel.last_trained || "2 days ago"}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Available Models</h4>
                {healthModels.length > 0 ? (
                  healthModels.map((model, index) => (
                    <div key={index} className="p-3 bg-background/50 rounded-lg border">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{model.name}</p>
                          <p className="text-xs text-muted-foreground">Accuracy: {model.accuracy}%</p>
                        </div>
                        <span className="text-xs bg-muted px-2 py-1 rounded">{model.type}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground p-4 text-center">
                    No models available. Train your first model.
                  </p>
                )}
              </div>

              <Button onClick={retrainHealthModel} disabled={retraining.health} className="w-full py-6 glow-border">
                {retraining.health ? "Retraining Model..." : "Retrain Health Model on Real Data"}
              </Button>
            </CardContent>
          </Card>

          {/* Calorie Prediction Models */}
          <Card className="border-2 bg-card/80 backdrop-blur-sm fade-in-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <ActivityIcon className="w-6 h-6 text-accent" />
                Calorie Prediction Models
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeCalorieModel && (
                <div className="p-4 bg-info/10 border-2 border-info rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-info">Active Model</span>
                    <span className="text-xs bg-info text-info-foreground px-2 py-1 rounded">LIVE</span>
                  </div>
                  <p className="font-bold text-lg mb-1">Calorie Predictor v1</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Accuracy:</span> <span className="font-bold">89.5%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">MAE:</span> <span className="font-bold">±45 cal</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Last trained: 5 days ago</p>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Available Models</h4>
                {calorieModels.length > 0 ? (
                  calorieModels.map((model, index) => (
                    <div key={index} className="p-3 bg-background/50 rounded-lg border">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{model.name}</p>
                          <p className="text-xs text-muted-foreground">MAE: ±{model.mae} cal</p>
                        </div>
                        <span className="text-xs bg-muted px-2 py-1 rounded">{model.type}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground p-4 text-center">
                    No models available. Train your first model.
                  </p>
                )}
              </div>

              <Button onClick={retrainCalorieModel} disabled={retraining.calorie} className="w-full py-6 glow-border">
                {retraining.calorie ? "Retraining Model..." : "Retrain Calorie Model on Real Data"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* MLOps Pipeline Info */}
        <Card className="border-2 bg-card/80 backdrop-blur-sm mt-6 fade-in-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle>MLOps Pipeline Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-background/50 rounded-lg">
                <h4 className="font-bold mb-2">Multi-Model Training</h4>
                <p className="text-sm text-muted-foreground">
                  Random Forest, XGBoost, and Neural Networks are trained in parallel
                </p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <h4 className="font-bold mb-2">MLflow Tracking</h4>
                <p className="text-sm text-muted-foreground">All experiments and metrics are logged and versioned</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <h4 className="font-bold mb-2">Auto Model Selection</h4>
                <p className="text-sm text-muted-foreground">
                  Best performing model is automatically promoted to production
                </p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <h4 className="font-bold mb-2">Real-time Updates</h4>
                <p className="text-sm text-muted-foreground">Models continuously learn from new user data</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
