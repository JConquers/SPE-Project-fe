"use client"

import type React from "react"

import { useState, useRef } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { PillIcon, ActivityIcon } from "@/components/medical-icons"
import { Upload, Camera } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const API_BASE = "http://127.0.0.1:8000"

const FOODS = {
  breakfast: [
    "Idli",
    "Dosa",
    "Paratha",
    "Poha",
    "Upma",
    "Omelette",
    "Toast",
    "Cereal",
    "Pancakes",
    "Waffles",
    "Sandwich",
    "Fruits",
    "Smoothie",
    "Cornflakes",
    "Bread & Butter",
    "Boiled Eggs",
    "Aloo Puri",
    "Poori Bhaji",
    "Vada",
    "Medu Vada",
  ],
  lunch: [
    "Rice",
    "Roti",
    "Dal",
    "Chicken Curry",
    "Fish",
    "Salad",
    "Curd",
    "Paneer",
    "Rajma",
    "Chole",
    "Biryani",
    "Pulao",
    "Vegetable Curry",
    "Tandoori Chicken",
    "Grilled Fish",
    "Mixed Vegetables",
    "Palak Paneer",
    "Butter Chicken",
    "Egg Curry",
    "Sambar Rice",
  ],
  dinner: [
    "Soup",
    "Pasta",
    "Grilled Chicken",
    "Vegetable Curry",
    "Biryani",
    "Khichdi",
    "Quinoa",
    "Sandwich",
    "Pizza",
    "Noodles",
    "Fried Rice",
    "Stir Fry",
    "Roasted Vegetables",
    "Grilled Fish",
    "Chicken Tikka",
    "Dal Tadka",
    "Mixed Dal",
    "Vegetable Pulao",
    "Roti Sabzi",
    "Stuffed Paratha",
  ],
}

export default function CaloriesPage() {
  const [selectedMeal, setSelectedMeal] = useState<"breakfast" | "lunch" | "dinner">("breakfast")
  const [selectedFood, setSelectedFood] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [mealItems, setMealItems] = useState<{ [key: string]: any[] }>({
    breakfast: [],
    lunch: [],
    dinner: [],
  })
  const [todayCalories, setTodayCalories] = useState(0)
  const [recommendedCalories, setRecommendedCalories] = useState(2000)
  const [loading, setLoading] = useState(false)

  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [recognizing, setRecognizing] = useState(false)
  const [textInput, setTextInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addFood = () => {
    if (!selectedFood || quantity <= 0) return

    const estimatedCalories = quantity * 100

    setMealItems({
      ...mealItems,
      [selectedMeal]: [
        ...mealItems[selectedMeal],
        {
          name: selectedFood,
          quantity,
          calories: estimatedCalories,
        },
      ],
    })

    setTodayCalories(todayCalories + estimatedCalories)
    setSelectedFood("")
    setQuantity(1)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setRecognizing(true)
    const reader = new FileReader()

    reader.onloadend = async () => {
      const base64Image = reader.result as string
      setUploadedImage(base64Image)

      try {
        // TODO: Call Gemini API to recognize food
        // For now, mock response
        await new Promise((resolve) => setTimeout(resolve, 2000))

        const mockRecognizedFood = {
          name: "Mixed Vegetable Curry",
          calories: 350,
          quantity: 1,
        }

        setMealItems({
          ...mealItems,
          [selectedMeal]: [...mealItems[selectedMeal], mockRecognizedFood],
        })

        setTodayCalories(todayCalories + mockRecognizedFood.calories)
        setUploadedImage(null)
      } catch (error) {
        console.error("Failed to recognize food", error)
      } finally {
        setRecognizing(false)
      }
    }

    reader.readAsDataURL(file)
  }

  const handleTextRecognition = async () => {
    if (!textInput.trim()) return

    setRecognizing(true)
    try {
      // TODO: Call Gemini API to estimate calories from text description
      // For now, mock response
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockCalories = Math.floor(Math.random() * 400) + 200

      setMealItems({
        ...mealItems,
        [selectedMeal]: [
          ...mealItems[selectedMeal],
          {
            name: textInput,
            quantity: 1,
            calories: mockCalories,
          },
        ],
      })

      setTodayCalories(todayCalories + mockCalories)
      setTextInput("")
    } catch (error) {
      console.error("Failed to estimate calories", error)
    } finally {
      setRecognizing(false)
    }
  }

  const logMeal = async () => {
    setLoading(true)
    try {
      const twinId = localStorage.getItem("twinId")
      if (!twinId) return

      const response = await fetch(`${API_BASE}/api/calories/meal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          twin_id: Number.parseInt(twinId),
          meal_type: selectedMeal,
          items: mealItems[selectedMeal].map((item) => ({
            name: item.name.toLowerCase().replace(" ", "_"),
            quantity: item.quantity,
          })),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setTodayCalories(data.daily_summary.total_calories)
        setRecommendedCalories(data.daily_summary.required_calories)
      }
    } catch (error) {
      console.error("Failed to log meal", error)
    } finally {
      setLoading(false)
    }
  }

  const caloriesRemaining = recommendedCalories - todayCalories
  const caloriesProgress = (todayCalories / recommendedCalories) * 100

  const weeklyData = [
    { day: "Mon", calories: 1850 },
    { day: "Tue", calories: 2100 },
    { day: "Wed", calories: 1950 },
    { day: "Thu", calories: 2250 },
    { day: "Fri", calories: 2050 },
    { day: "Sat", calories: 2400 },
    { day: "Sun", calories: todayCalories },
  ]

  const mealDistribution = [
    {
      name: "Breakfast",
      value: mealItems.breakfast.reduce((sum, item) => sum + item.calories, 0),
      color: "#ef4444",
    },
    { name: "Lunch", value: mealItems.lunch.reduce((sum, item) => sum + item.calories, 0), color: "#3b82f6" },
    { name: "Dinner", value: mealItems.dinner.reduce((sum, item) => sum + item.calories, 0), color: "#eab308" },
  ]

  return (
    <div className="min-h-screen">
      <DashboardNav />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 fade-in-up">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <PillIcon className="w-10 h-10 text-accent" />
            Calorie Tracker
          </h1>
          <p className="text-muted-foreground text-lg">Track your daily nutrition and stay on target</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Food Logger */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 bg-card/80 backdrop-blur-sm fade-in-up">
              <CardHeader>
                <CardTitle>Log Your Meals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Meal Type</Label>
                  <Select value={selectedMeal} onValueChange={(val: any) => setSelectedMeal(val)}>
                    <SelectTrigger className="bg-background/50 backdrop-blur-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">🍳 Breakfast</SelectItem>
                      <SelectItem value="lunch">🍛 Lunch</SelectItem>
                      <SelectItem value="dinner">🍽️ Dinner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Food Item</Label>
                  <Select value={selectedFood} onValueChange={setSelectedFood}>
                    <SelectTrigger className="bg-background/50 backdrop-blur-sm">
                      <SelectValue placeholder="Select food" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {FOODS[selectedMeal].map((food) => (
                        <SelectItem key={food} value={food}>
                          {food}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quantity (servings)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                    className="bg-background/50 backdrop-blur-sm"
                  />
                </div>

                <Button onClick={addFood} className="w-full glow-border" disabled={!selectedFood}>
                  Add to {selectedMeal}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 bg-card/80 backdrop-blur-sm fade-in-up" style={{ animationDelay: "0.1s" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Upload Food Photo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full"
                  disabled={recognizing}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {recognizing ? "Analyzing..." : "Upload Food Image"}
                </Button>

                {recognizing && (
                  <div className="text-center py-4">
                    <ActivityIcon className="w-12 h-12 mx-auto mb-2 text-accent heartbeat-animation" />
                    <p className="text-sm text-muted-foreground">Recognizing food and calculating calories...</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Or Describe Your Food</Label>
                  <Textarea
                    placeholder="E.g., 'Two slices of pizza with extra cheese'"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="bg-background/50 backdrop-blur-sm"
                    rows={3}
                  />
                  <Button
                    onClick={handleTextRecognition}
                    variant="outline"
                    className="w-full bg-transparent"
                    disabled={!textInput.trim() || recognizing}
                  >
                    Get Calorie Estimate
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  AI-powered calorie recognition using Gemini. Add your API key in the code.
                </p>
              </CardContent>
            </Card>

            {/* Current Meal Items */}
            <Card className="border-2 bg-card/80 backdrop-blur-sm fade-in-up" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <CardTitle>Today's {selectedMeal}</CardTitle>
              </CardHeader>
              <CardContent>
                {mealItems[selectedMeal].length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No items added yet</p>
                ) : (
                  <div className="space-y-2">
                    {mealItems[selectedMeal].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-background/50 rounded">
                        <span>
                          {item.name} x{item.quantity}
                        </span>
                        <span className="font-bold text-accent">{item.calories} cal</span>
                      </div>
                    ))}
                    <Button onClick={logMeal} className="w-full mt-4 glow-border" disabled={loading}>
                      {loading ? "Logging..." : "Log Meal"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Calorie Summary & Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Summary */}
            <Card className="border-2 bg-card/80 backdrop-blur-sm fade-in-up">
              <CardHeader>
                <CardTitle>Today's Calorie Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Consumed</p>
                    <p className="text-3xl font-bold text-accent">{todayCalories}</p>
                    <p className="text-xs text-muted-foreground">calories</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Goal</p>
                    <p className="text-3xl font-bold">{recommendedCalories}</p>
                    <p className="text-xs text-muted-foreground">calories</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className={`text-3xl font-bold ${caloriesRemaining < 0 ? "text-destructive" : "text-success"}`}>
                      {Math.abs(caloriesRemaining)}
                    </p>
                    <p className="text-xs text-muted-foreground">{caloriesRemaining < 0 ? "over" : "left"}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Daily Progress</span>
                    <span className="font-bold">{Math.round(caloriesProgress)}%</span>
                  </div>
                  <Progress
                    value={Math.min(caloriesProgress, 100)}
                    className={`h-4 ${caloriesProgress > 100 ? "bg-destructive/20" : ""}`}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Meal Distribution Pie */}
            <Card className="border-2 bg-card/80 backdrop-blur-sm fade-in-up" style={{ animationDelay: "0.1s" }}>
              <CardHeader>
                <CardTitle>Meal Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {mealDistribution.some((m) => m.value > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={mealDistribution.filter((m) => m.value > 0)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value} cal`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        animationDuration={1500}
                      >
                        {mealDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    <p>No meals logged yet today</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weekly Trend */}
            <Card className="border-2 bg-card/80 backdrop-blur-sm fade-in-up" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <CardTitle>Weekly Calorie Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="calories"
                      stroke="oklch(0.6 0.2 25)"
                      strokeWidth={3}
                      name="Daily Calories"
                      animationDuration={2000}
                      dot={{ r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                    <Line
                      type="monotone"
                      dataKey={() => recommendedCalories}
                      stroke="oklch(0.6 0.15 240)"
                      strokeDasharray="5 5"
                      name="Goal"
                      animationDuration={2000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
