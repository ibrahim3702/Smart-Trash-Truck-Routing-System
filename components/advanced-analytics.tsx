"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart, PieChart, ScatterChart } from "@/components/ui/chart"
import { motion } from "framer-motion"
import type { Bin, Truck, Route, OptimizationRecord } from "@/lib/types"
import { BarChart3, LineChartIcon, PieChartIcon, Download, Calendar, TrendingUp, Map, Layers } from "lucide-react"

interface AdvancedAnalyticsProps {
  bins: Bin[]
  trucks: Truck[]
  routes: Route[]
  optimizationHistory: OptimizationRecord[]
}

export default function AdvancedAnalytics({ bins, trucks, routes, optimizationHistory }: AdvancedAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("day")

  // Calculate analytics data
  const binsByFillLevel = {
    high: bins.filter((bin) => bin.fillLevel > 80).length,
    medium: bins.filter((bin) => bin.fillLevel > 50 && bin.fillLevel <= 80).length,
    low: bins.filter((bin) => bin.fillLevel <= 50).length,
  }

  const routeEfficiency = routes.map((route) => ({
    id: route.truckId,
    distance: route.totalDistance,
    waste: route.totalWasteCollected,
    efficiency: route.totalDistance > 0 ? route.totalWasteCollected / route.totalDistance : 0,
    binCount: route.binSequence.length,
  }))

  // Generate mock historical data if optimization history is limited
  const generateHistoricalData = () => {
    const now = new Date()
    const data = []

    const pointCount = timeRange === "day" ? 24 : timeRange === "week" ? 7 : 30
    const interval =
      timeRange === "day" ? 60 * 60 * 1000 : timeRange === "week" ? 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000

    for (let i = pointCount - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * interval)
      const baseValue = 50 + Math.random() * 30

      data.push({
        timestamp,
        fillLevel: Math.min(100, baseValue + (pointCount - i) * (5 / pointCount)),
        wasteCollected: 20 + Math.random() * 40,
        distance: 5 + Math.random() * 10,
        efficiency: 2 + Math.random() * 3,
      })
    }

    return data
  }

  const historicalData = generateHistoricalData()

  // Prepare chart data
  const fillLevelData = historicalData.map((item) => ({
    name:
      timeRange === "day"
        ? item.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : item.timestamp.toLocaleDateString([], { month: "short", day: "numeric" }),
    "Average Fill Level": item.fillLevel,
  }))

  const wasteCollectionData = historicalData.map((item) => ({
    name:
      timeRange === "day"
        ? item.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : item.timestamp.toLocaleDateString([], { month: "short", day: "numeric" }),
    "Waste Collected (kg)": item.wasteCollected,
  }))

  const efficiencyData = historicalData.map((item) => ({
    name:
      timeRange === "day"
        ? item.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : item.timestamp.toLocaleDateString([], { month: "short", day: "numeric" }),
    "Efficiency (kg/km)": item.efficiency,
    "Distance (km)": item.distance,
  }))

  const binDistributionData = [
    { name: "High Priority", value: binsByFillLevel.high },
    { name: "Medium Priority", value: binsByFillLevel.medium },
    { name: "Low Priority", value: binsByFillLevel.low },
  ]

  const routeComparisonData = routeEfficiency.map((route) => ({
    name: `Truck ${route.id}`,
    "Efficiency (kg/km)": route.efficiency,
    "Distance (km)": route.distance,
    "Waste (kg)": route.waste,
  }))

  // Scatter plot data for bin locations and fill levels
  const binScatterData = bins.map((bin) => ({
    x: bin.location[1], // longitude
    y: bin.location[0], // latitude
    size: bin.fillLevel,
    category: bin.fillLevel > 80 ? "High" : bin.fillLevel > 50 ? "Medium" : "Low",
    id: bin.id,
  }))

  // Export data as CSV
  const exportCSV = (dataType: string) => {
    let csvContent = ""
    let data: any[] = []
    let headers: string[] = []

    switch (dataType) {
      case "bins":
        headers = ["Bin ID", "Latitude", "Longitude", "Fill Level (%)", "Capacity (kg)"]
        data = bins.map((bin) => [bin.id, bin.location[0], bin.location[1], bin.fillLevel, bin.capacity])
        break
      case "routes":
        headers = [
          "Route ID",
          "Truck ID",
          "Total Distance (km)",
          "Waste Collected (kg)",
          "Bin Count",
          "Efficiency (kg/km)",
        ]
        data = routes.map((route) => [
          routes.indexOf(route) + 1,
          route.truckId,
          route.totalDistance.toFixed(2),
          route.totalWasteCollected.toFixed(2),
          route.binSequence.length,
          (route.totalWasteCollected / route.totalDistance).toFixed(2),
        ])
        break
      case "history":
        headers = ["Timestamp", "Average Fill Level (%)", "Waste Collected (kg)", "Distance (km)", "Efficiency (kg/km)"]
        data = historicalData.map((item) => [
          item.timestamp.toLocaleString(),
          item.fillLevel.toFixed(2),
          item.wasteCollected.toFixed(2),
          item.distance.toFixed(2),
          item.efficiency.toFixed(2),
        ])
        break
    }

    // Add headers
    csvContent += headers.join(",") + "\n"

    // Add data rows
    data.forEach((row) => {
      csvContent += row.join(",") + "\n"
    })

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${dataType}_data_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400">Advanced Analytics</h2>
          <p className="text-muted-foreground">
            Detailed insights and visualizations for waste collection optimization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(value: "day" | "week" | "month") => setTimeRange(value)}>
            <SelectTrigger className="w-[180px] border-purple-200 dark:border-purple-800">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="border-purple-200 dark:border-purple-800">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="col-span-1"
        >
          <Card className="border-purple-200 dark:border-purple-900 transition-all duration-300 hover:shadow-md h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-purple-500" />
                Bin Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <PieChart
                  data={binDistributionData}
                  index="name"
                  categories={["value"]}
                  valueFormatter={(value) => `${value} bins`}
                  colors={["#ef4444", "#f59e0b", "#10b981"]}
                  className="h-full"
                />
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-xs">High</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="text-xs">Medium</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-xs">Low</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="col-span-1"
        >
          <Card className="border-purple-200 dark:border-purple-900 transition-all duration-300 hover:shadow-md h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                Route Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <BarChart
                  data={routeComparisonData}
                  index="name"
                  categories={["Efficiency (kg/km)"]}
                  colors={["#9333ea"]}
                  valueFormatter={(value) => `${value.toFixed(2)} kg/km`}
                  className="h-full"
                />
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-purple-200 dark:border-purple-800"
                  onClick={() => exportCSV("routes")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Route Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="col-span-1"
        >
          <Card className="border-purple-200 dark:border-purple-900 transition-all duration-300 hover:shadow-md h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                Key Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Average Fill Level</span>
                    <span className="text-sm font-medium">
                      {bins.length > 0
                        ? (bins.reduce((sum, bin) => sum + bin.fillLevel, 0) / bins.length).toFixed(1)
                        : "N/A"}
                      %
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{
                        width: `${
                          bins.length > 0
                            ? (bins.reduce((sum, bin) => sum + bin.fillLevel, 0) / bins.length).toFixed(1)
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Total Waste Collected</span>
                    <span className="text-sm font-medium">
                      {routes.reduce((sum, route) => sum + route.totalWasteCollected, 0).toFixed(1)} kg
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{
                        width: `${Math.min(
                          100,
                          (routes.reduce((sum, route) => sum + route.totalWasteCollected, 0) /
                            (trucks.reduce((sum, truck) => sum + truck.capacity, 0) || 1)) *
                            100,
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">System Efficiency</span>
                    <span className="text-sm font-medium">
                      {routes.reduce((sum, route) => sum + route.totalDistance, 0) > 0
                        ? (
                            routes.reduce((sum, route) => sum + route.totalWasteCollected, 0) /
                            routes.reduce((sum, route) => sum + route.totalDistance, 0)
                          ).toFixed(2)
                        : "N/A"}{" "}
                      kg/km
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{
                        width: `${Math.min(
                          100,
                          routes.reduce((sum, route) => sum + route.totalDistance, 0) > 0
                            ? (routes.reduce((sum, route) => sum + route.totalWasteCollected, 0) /
                                routes.reduce((sum, route) => sum + route.totalDistance, 0)) *
                                25
                            : 0,
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2">
                  <Badge
                    variant="outline"
                    className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                  >
                    {routes.length} Active Routes
                  </Badge>{" "}
                  <Badge
                    variant={binsByFillLevel.high > 0 ? "destructive" : "outline"}
                    className={
                      binsByFillLevel.high === 0
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : ""
                    }
                  >
                    {binsByFillLevel.high} High Priority Bins
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="fillLevel" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger
            value="fillLevel"
            className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-100"
          >
            <LineChartIcon className="h-4 w-4 mr-2" />
            Fill Levels
          </TabsTrigger>
          <TabsTrigger
            value="wasteCollection"
            className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-100"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Waste Collection
          </TabsTrigger>
          <TabsTrigger
            value="efficiency"
            className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-100"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Efficiency
          </TabsTrigger>
          <TabsTrigger
            value="heatmap"
            className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-100"
          >
            <Map className="h-4 w-4 mr-2" />
            Bin Distribution
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fillLevel" className="mt-4">
          <Card className="border-purple-200 dark:border-purple-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <LineChartIcon className="h-5 w-5 text-purple-500" />
                Average Fill Level Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <LineChart
                  data={fillLevelData}
                  index="name"
                  categories={["Average Fill Level"]}
                  colors={["#9333ea"]}
                  valueFormatter={(value) => `${value.toFixed(1)}%`}
                  yAxisWidth={60}
                  className="h-full"
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-200 dark:border-purple-800"
                  onClick={() => exportCSV("history")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wasteCollection" className="mt-4">
          <Card className="border-purple-200 dark:border-purple-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                Waste Collection History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <BarChart
                  data={wasteCollectionData}
                  index="name"
                  categories={["Waste Collected (kg)"]}
                  colors={["#16a34a"]}
                  valueFormatter={(value) => `${value.toFixed(1)} kg`}
                  yAxisWidth={60}
                  className="h-full"
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-200 dark:border-purple-800"
                  onClick={() => exportCSV("history")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="efficiency" className="mt-4">
          <Card className="border-purple-200 dark:border-purple-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                System Efficiency Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <LineChart
                  data={efficiencyData}
                  index="name"
                  categories={["Efficiency (kg/km)", "Distance (km)"]}
                  colors={["#9333ea", "#3b82f6"]}
                  valueFormatter={(value) => `${value.toFixed(2)}`}
                  yAxisWidth={60}
                  className="h-full"
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-200 dark:border-purple-800"
                  onClick={() => exportCSV("history")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap" className="mt-4">
          <Card className="border-purple-200 dark:border-purple-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5 text-purple-500" />
                Bin Distribution Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ScatterChart
                  data={binScatterData}
                  xAxisKey="x"
                  yAxisKey="y"
                  sizeKey="size"
                  categoryKey="category"
                  valueFormatter={{
                    x: (value) => `Longitude: ${value.toFixed(4)}`,
                    y: (value) => `Latitude: ${value.toFixed(4)}`,
                    size: (value) => `Fill Level: ${value}%`,
                  }}
                  colors={["#ef4444", "#f59e0b", "#10b981"]}
                  showLegend={true}
                  className="h-full"
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-200 dark:border-purple-800"
                  onClick={() => exportCSV("bins")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Bin Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
