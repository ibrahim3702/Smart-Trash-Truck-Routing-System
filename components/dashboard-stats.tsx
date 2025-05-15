"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Bin, Truck, Route, OptimizationRecord } from "@/lib/types"
import { Trash2, TruckIcon, BarChart3, RefreshCw, AlertTriangle, TrendingUp, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface DashboardStatsProps {
  bins: Bin[]
  trucks: Truck[]
  routes: Route[]
  routeUpdateCount: number
  isSimulationActive: boolean
  optimizationHistory: OptimizationRecord[]
  predictedFillLevels: { [key: number]: number }
}

export default function DashboardStats({
  bins,
  trucks,
  routes,
  routeUpdateCount,
  isSimulationActive,
  optimizationHistory,
  predictedFillLevels,
}: DashboardStatsProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Calculate stats
  const totalDistance = routes.reduce((sum, route) => sum + route.totalDistance, 0)
  const totalWaste = routes.reduce((sum, route) => sum + route.totalWasteCollected, 0)
  const highPriorityBins = bins.filter((bin) => bin.fillLevel > 80).length
  const mediumPriorityBins = bins.filter((bin) => bin.fillLevel > 50 && bin.fillLevel <= 80).length
  const lowPriorityBins = bins.filter((bin) => bin.fillLevel <= 50).length

  // Calculate predicted high priority bins
  const predictedHighPriorityCount = Object.values(predictedFillLevels).filter((level) => level > 80).length

  // Calculate efficiency if we have routes
  const efficiency = totalDistance > 0 ? totalWaste / totalDistance : 0

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="show">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400">System Dashboard</h2>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{currentTime.toLocaleTimeString()}</span>
          {isSimulationActive && (
            <Badge
              variant="outline"
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 animate-pulse"
            >
              Simulation Active
            </Badge>
          )}
        </div>
      </div>

      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <Card className="border-purple-200 dark:border-purple-900 transition-all duration-300 hover:shadow-md bg-white dark:bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Trash2 className="h-4 w-4 text-purple-500" />
                Total Bins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bins.length}</div>
              <div className="mt-2 flex gap-2">
                {highPriorityBins > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {highPriorityBins} High
                  </Badge>
                )}
                {mediumPriorityBins > 0 && (
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 text-xs"
                  >
                    {mediumPriorityBins} Medium
                  </Badge>
                )}
                {lowPriorityBins > 0 && (
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs"
                  >
                    {lowPriorityBins} Low
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-purple-200 dark:border-purple-900 transition-all duration-300 hover:shadow-md bg-white dark:bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TruckIcon className="h-4 w-4 text-purple-500" />
                Trucks & Routes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {trucks.length} / {routes.length}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {routes.length > 0
                  ? `${(routes.length / trucks.length).toFixed(1)} routes per truck`
                  : "No routes generated"}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-purple-200 dark:border-purple-900 transition-all duration-300 hover:shadow-md bg-white dark:bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-500" />
                Collection Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalWaste > 0 ? `${totalWaste.toFixed(1)} kg` : "N/A"}</div>
              <div className="mt-2 text-xs text-muted-foreground">
                {totalDistance > 0 ? `${totalDistance.toFixed(1)} km total distance` : "No routes"}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-purple-200 dark:border-purple-900 transition-all duration-300 hover:shadow-md bg-white dark:bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-purple-500" />
                Route Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{routeUpdateCount}</div>
              <div className="mt-2 text-xs text-muted-foreground">
                {optimizationHistory.length > 0
                  ? `Last update: ${new Date(optimizationHistory[optimizationHistory.length - 1].timestamp).toLocaleTimeString()}`
                  : "No updates yet"}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <Card className="border-purple-200 dark:border-purple-900 transition-all duration-300 hover:shadow-md bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-md font-medium flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">High Priority Bins</span>
                    <span className="text-sm font-medium">
                      {highPriorityBins} of {bins.length}
                    </span>
                  </div>
                  <Progress
                    value={bins.length > 0 ? (highPriorityBins / bins.length) * 100 : 0}
                    className="h-2"
                    indicatorClassName="bg-red-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Truck Utilization</span>
                    <span className="text-sm font-medium">
                      {routes.length > 0
                        ? `${((totalWaste / trucks.reduce((sum, t) => sum + t.capacity, 0)) * 100).toFixed(1)}%`
                        : "0%"}
                    </span>
                  </div>
                  <Progress
                    value={
                      trucks.reduce((sum, t) => sum + t.capacity, 0) > 0
                        ? (totalWaste / trucks.reduce((sum, t) => sum + t.capacity, 0)) * 100
                        : 0
                    }
                    className="h-2"
                    indicatorClassName="bg-purple-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">System Efficiency</span>
                    <span className="text-sm font-medium">
                      {efficiency > 0 ? `${efficiency.toFixed(2)} kg/km` : "N/A"}
                    </span>
                  </div>
                  <Progress
                    value={efficiency > 0 ? Math.min((efficiency / 2) * 100, 100) : 0}
                    className="h-2"
                    indicatorClassName="bg-green-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-purple-200 dark:border-purple-900 transition-all duration-300 hover:shadow-md bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-md font-medium flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                Predictions & Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Predicted High Priority Bins</p>
                    <p className="text-xs text-muted-foreground">Within next 24 hours</p>
                  </div>
                  <Badge
                    variant={predictedHighPriorityCount > highPriorityBins ? "destructive" : "outline"}
                    className={
                      predictedHighPriorityCount > highPriorityBins
                        ? "animate-pulse"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    }
                  >
                    {predictedHighPriorityCount}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Optimization Runs</p>
                    <p className="text-xs text-muted-foreground">Total route calculations</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                  >
                    {optimizationHistory.length}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Average Route Length</p>
                    <p className="text-xs text-muted-foreground">Per truck</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                  >
                    {routes.length > 0
                      ? `${(routes.reduce((sum, r) => sum + r.totalDistance, 0) / routes.length).toFixed(1)} km`
                      : "N/A"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">System Status</p>
                  </div>
                  <Badge
                    variant={highPriorityBins > 0 ? "destructive" : "outline"}
                    className={
                      highPriorityBins === 0 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : ""
                    }
                  >
                    {highPriorityBins === 0 ? "Optimal" : "Needs Attention"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
