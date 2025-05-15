"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"
import type { Bin, Route, Edge } from "@/lib/types"
import { motion } from "framer-motion"

interface VisualizationPanelProps {
  bins: Bin[]
  routes: Route[]
  mst: Edge[]
}

export default function VisualizationPanel({ bins, routes, mst }: VisualizationPanelProps) {
  const graphCanvasRef = useRef<HTMLCanvasElement>(null)
  const fillLevelCanvasRef = useRef<HTMLCanvasElement>(null)
  const routeDistributionCanvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Draw the graph visualization
  useEffect(() => {
    if (!graphCanvasRef.current || bins.length === 0 || !mounted) return

    const canvas = graphCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate min/max coordinates to scale the graph
    const minLat = Math.min(...bins.map((bin) => bin.location[0]))
    const maxLat = Math.max(...bins.map((bin) => bin.location[0]))
    const minLng = Math.min(...bins.map((bin) => bin.location[1]))
    const maxLng = Math.max(...bins.map((bin) => bin.location[1]))

    // Add some padding
    const padding = 50
    const scaleX = (canvas.width - 2 * padding) / (maxLng - minLng || 1)
    const scaleY = (canvas.height - 2 * padding) / (maxLat - minLat || 1)

    // Function to convert coordinates to canvas position
    const toCanvasCoords = (lat: number, lng: number) => {
      const x = padding + (lng - minLng) * scaleX
      const y = canvas.height - (padding + (lat - minLat) * scaleY) // Invert Y axis
      return { x, y }
    }

    // Set dark mode colors based on theme
    const isDarkMode = theme === "dark"
    const textColor = isDarkMode ? "#e5e5e5" : "#1f2937"
    const mutedTextColor = isDarkMode ? "#a1a1aa" : "#6b7280"
    const gridColor = isDarkMode ? "#3f3f46" : "#e5e7eb"

    // Draw background
    ctx.fillStyle = isDarkMode ? "#1f1f23" : "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 0.5

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = padding + (i / 10) * (canvas.width - 2 * padding)
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, canvas.height - padding)
      ctx.stroke()
    }

    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
      const y = padding + (i / 10) * (canvas.height - 2 * padding)
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(canvas.width - padding, y)
      ctx.stroke()
    }

    // Draw MST edges
    ctx.strokeStyle = mutedTextColor
    ctx.lineWidth = 1
    ctx.setLineDash([5, 3])
    mst.forEach((edge) => {
      const sourceBin = bins.find((b) => b.id === edge.source)
      const targetBin = bins.find((b) => b.id === edge.target)
      if (sourceBin && targetBin) {
        const sourcePos = toCanvasCoords(sourceBin.location[0], sourceBin.location[1])
        const targetPos = toCanvasCoords(targetBin.location[0], targetBin.location[1])

        ctx.beginPath()
        ctx.moveTo(sourcePos.x, sourcePos.y)
        ctx.lineTo(targetPos.x, targetPos.y)
        ctx.stroke()
      }
    })

    // Draw routes
    ctx.setLineDash([])
    routes.forEach((route, idx) => {
      ctx.strokeStyle = `hsl(${(idx * 137 + 270) % 360}, 70%, 50%)`
      ctx.lineWidth = 3

      const positions = route.binSequence
        .map((binId) => bins.find((b) => b.id === binId))
        .filter((bin): bin is Bin => bin !== undefined)
        .map((bin) => toCanvasCoords(bin.location[0], bin.location[1]))

      if (positions.length > 1) {
        ctx.beginPath()
        ctx.moveTo(positions[0].x, positions[0].y)
        for (let i = 1; i < positions.length; i++) {
          ctx.lineTo(positions[i].x, positions[i].y)
        }
        ctx.stroke()
      }
    })

    // Draw bin nodes with animation-like effect
    bins.forEach((bin) => {
      const pos = toCanvasCoords(bin.location[0], bin.location[1])

      // Draw glow effect for high priority bins
      if (bin.fillLevel > 80) {
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 5, pos.x, pos.y, 15)
        gradient.addColorStop(0, "rgba(239, 68, 68, 0.8)") // red-500 with alpha
        gradient.addColorStop(1, "rgba(239, 68, 68, 0)")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, 15, 0, 2 * Math.PI)
        ctx.fill()
      }

      // Draw circle
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, 10, 0, 2 * Math.PI)

      // Color based on fill level
      if (bin.fillLevel > 80) {
        ctx.fillStyle = "#ef4444" // Red for high priority
      } else if (bin.fillLevel > 50) {
        ctx.fillStyle = "#f59e0b" // Yellow for medium priority
      } else {
        ctx.fillStyle = "#10b981" // Green for low priority
      }

      ctx.fill()
      ctx.strokeStyle = isDarkMode ? "#e5e5e5" : "#000000"
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw bin ID
      ctx.fillStyle = "#ffffff"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(bin.id.toString(), pos.x, pos.y)
    })

    // Add legend
    ctx.font = "12px Arial"
    ctx.textAlign = "left"
    ctx.textBaseline = "middle"
    ctx.fillStyle = textColor

    // MST legend
    ctx.setLineDash([5, 3])
    ctx.strokeStyle = mutedTextColor
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(20, 20)
    ctx.lineTo(50, 20)
    ctx.stroke()
    ctx.fillText("MST Connections", 60, 20)

    // Routes legend
    ctx.setLineDash([])
    routes.forEach((route, idx) => {
      if (idx < 3) {
        ctx.strokeStyle = `hsl(${(idx * 137 + 270) % 360}, 70%, 50%)`
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(20, 40 + idx * 20)
        ctx.lineTo(50, 40 + idx * 20)
        ctx.stroke()
        ctx.fillStyle = textColor
        ctx.fillText(`Route ${idx + 1}`, 60, 40 + idx * 20)
      }
    })

    // Bin priority legend
    ctx.beginPath()
    ctx.arc(35, 100, 10, 0, 2 * Math.PI)
    ctx.fillStyle = "#ef4444"
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = textColor
    ctx.fillText("High Priority Bin", 60, 100)

    ctx.beginPath()
    ctx.arc(35, 120, 10, 0, 2 * Math.PI)
    ctx.fillStyle = "#f59e0b"
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = textColor
    ctx.fillText("Medium Priority Bin", 60, 120)

    ctx.beginPath()
    ctx.arc(35, 140, 10, 0, 2 * Math.PI)
    ctx.fillStyle = "#10b981"
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = textColor
    ctx.fillText("Low Priority Bin", 60, 140)
  }, [bins, routes, mst, theme, mounted])

  // Draw the fill level chart
  useEffect(() => {
    if (!fillLevelCanvasRef.current || bins.length === 0 || !mounted) return

    const canvas = fillLevelCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set dark mode colors based on theme
    const isDarkMode = theme === "dark"
    const textColor = isDarkMode ? "#e5e5e5" : "#1f2937"
    const mutedTextColor = isDarkMode ? "#a1a1aa" : "#6b7280"
    const gridColor = isDarkMode ? "#3f3f46" : "#e5e7eb"
    const bgColor = isDarkMode ? "#1f1f23" : "#ffffff"

    // Clear canvas
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Sort bins by ID for consistent display
    const sortedBins = [...bins].sort((a, b) => a.id - b.id)

    // Calculate bar width
    const barWidth = (canvas.width - 60) / sortedBins.length
    const barMaxHeight = canvas.height - 60

    // Draw grid
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 0.5

    for (let i = 0; i <= 100; i += 20) {
      const y = canvas.height - 30 - (i / 100) * barMaxHeight
      ctx.beginPath()
      ctx.moveTo(30, y)
      ctx.lineTo(canvas.width - 20, y)
      ctx.stroke()
    }

    // Draw axes
    ctx.strokeStyle = mutedTextColor
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(30, 20)
    ctx.lineTo(30, canvas.height - 30)
    ctx.lineTo(canvas.width - 20, canvas.height - 30)
    ctx.stroke()

    // Draw Y-axis labels
    ctx.fillStyle = textColor
    ctx.font = "12px Arial"
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"

    for (let i = 0; i <= 100; i += 20) {
      const y = canvas.height - 30 - (i / 100) * barMaxHeight
      ctx.fillText(i.toString(), 25, y)
    }

    // Draw bars with animation-like effect
    sortedBins.forEach((bin, idx) => {
      const x = 40 + idx * barWidth
      const barHeight = (bin.fillLevel / 100) * barMaxHeight
      const y = canvas.height - 30 - barHeight

      // Color based on fill level
      if (bin.fillLevel > 80) {
        const gradient = ctx.createLinearGradient(x, y, x, canvas.height - 30)
        gradient.addColorStop(0, "#ef4444") // Red
        gradient.addColorStop(1, "#fca5a5") // Lighter red
        ctx.fillStyle = gradient
      } else if (bin.fillLevel > 50) {
        const gradient = ctx.createLinearGradient(x, y, x, canvas.height - 30)
        gradient.addColorStop(0, "#f59e0b") // Yellow
        gradient.addColorStop(1, "#fcd34d") // Lighter yellow
        ctx.fillStyle = gradient
      } else {
        const gradient = ctx.createLinearGradient(x, y, x, canvas.height - 30)
        gradient.addColorStop(0, "#10b981") // Green
        gradient.addColorStop(1, "#6ee7b7") // Lighter green
        ctx.fillStyle = gradient
      }

      ctx.fillRect(x, y, barWidth - 5, barHeight)

      // Add border to bars
      ctx.strokeStyle = isDarkMode ? "#e5e5e5" : "#000000"
      ctx.lineWidth = 0.5
      ctx.strokeRect(x, y, barWidth - 5, barHeight)

      // Draw bin ID
      ctx.fillStyle = textColor
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "top"
      ctx.fillText(bin.id.toString(), x + (barWidth - 5) / 2, canvas.height - 25)

      // Draw fill level on top of bar
      if (barHeight > 20) {
        ctx.fillStyle = "#ffffff"
        ctx.textBaseline = "bottom"
        ctx.fillText(`${bin.fillLevel}%`, x + (barWidth - 5) / 2, y - 2)
      }
    })

    // Draw title
    ctx.fillStyle = textColor
    ctx.font = "14px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.fillText("Bin Fill Levels (%)", canvas.width / 2, 5)
  }, [bins, theme, mounted])

  // Draw the route distribution chart
  useEffect(() => {
    if (!routeDistributionCanvasRef.current || routes.length === 0 || !mounted) return

    const canvas = routeDistributionCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set dark mode colors based on theme
    const isDarkMode = theme === "dark"
    const textColor = isDarkMode ? "#e5e5e5" : "#1f2937"
    const bgColor = isDarkMode ? "#1f1f23" : "#ffffff"

    // Clear canvas
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Calculate total waste collected
    const totalWaste = routes.reduce((sum, route) => sum + route.totalWasteCollected, 0)

    // Draw pie chart
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 40

    let startAngle = 0
    routes.forEach((route, idx) => {
      const sliceAngle = (route.totalWasteCollected / totalWaste) * 2 * Math.PI

      // Draw slice with gradient
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
      const hue = (idx * 137 + 270) % 360
      gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.8)`)
      gradient.addColorStop(1, `hsla(${hue}, 70%, 50%, 0.8)`)

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()

      ctx.fillStyle = gradient
      ctx.fill()

      // Add border
      ctx.strokeStyle = isDarkMode ? "#e5e5e5" : "#000000"
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw label
      const labelAngle = startAngle + sliceAngle / 2
      const labelRadius = radius * 0.7
      const labelX = centerX + Math.cos(labelAngle) * labelRadius
      const labelY = centerY + Math.sin(labelAngle) * labelRadius

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(`${Math.round((route.totalWasteCollected / totalWaste) * 100)}%`, labelX, labelY)

      startAngle += sliceAngle
    })

    // Draw legend
    const legendX = 20
    let legendY = canvas.height - 20 - routes.length * 20

    ctx.font = "14px Arial"
    ctx.textAlign = "left"
    ctx.textBaseline = "middle"

    routes.forEach((route, idx) => {
      const hue = (idx * 137 + 270) % 360
      ctx.fillStyle = `hsl(${hue}, 70%, 50%)`
      ctx.fillRect(legendX, legendY - 8, 16, 16)

      ctx.strokeStyle = isDarkMode ? "#e5e5e5" : "#000000"
      ctx.lineWidth = 0.5
      ctx.strokeRect(legendX, legendY - 8, 16, 16)

      ctx.fillStyle = textColor
      ctx.fillText(`Route ${idx + 1} (Truck #${route.truckId})`, legendX + 25, legendY)

      legendY += 20
    })

    // Draw title
    ctx.fillStyle = textColor
    ctx.font = "14px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.fillText("Waste Collection Distribution", canvas.width / 2, 10)

    // Draw total waste collected
    ctx.fillStyle = textColor
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.fillText(`Total: ${totalWaste.toFixed(2)} kg`, canvas.width / 2, 30)
  }, [routes, theme, mounted])

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

  if (!mounted) return null

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="show">
      <motion.div variants={itemVariants}>
        <Card className="border-purple-200 dark:border-purple-900 transition-all duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-purple-700 dark:text-purple-400">System Visualizations</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="graph">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="graph"
                  className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-100"
                >
                  Network Graph
                </TabsTrigger>
                <TabsTrigger
                  value="fillLevels"
                  className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-100"
                >
                  Fill Levels
                </TabsTrigger>
                <TabsTrigger
                  value="routeDistribution"
                  className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-100"
                >
                  Route Distribution
                </TabsTrigger>
              </TabsList>

              <TabsContent value="graph" className="mt-4">
                <motion.div
                  className="bg-white dark:bg-gray-900 rounded-md p-4 border border-purple-200 dark:border-purple-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-lg font-medium mb-2 text-purple-700 dark:text-purple-400">
                    City Network and Routes
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Visualization of the city network with MST connections and optimized routes
                  </p>
                  <div className="h-[400px] w-full">
                    <canvas ref={graphCanvasRef} width={800} height={400} className="w-full h-full rounded-md" />
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="fillLevels" className="mt-4">
                <motion.div
                  className="bg-white dark:bg-gray-900 rounded-md p-4 border border-purple-200 dark:border-purple-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-lg font-medium mb-2 text-purple-700 dark:text-purple-400">Bin Fill Levels</h3>
                  <p className="text-sm text-muted-foreground mb-4">Current fill levels of all bins in the system</p>
                  <div className="h-[400px] w-full">
                    <canvas ref={fillLevelCanvasRef} width={800} height={400} className="w-full h-full rounded-md" />
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="routeDistribution" className="mt-4">
                <motion.div
                  className="bg-white dark:bg-gray-900 rounded-md p-4 border border-purple-200 dark:border-purple-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-lg font-medium mb-2 text-purple-700 dark:text-purple-400">
                    Waste Collection Distribution
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Distribution of waste collection across different routes
                  </p>
                  <div className="h-[400px] w-full">
                    <canvas
                      ref={routeDistributionCanvasRef}
                      width={800}
                      height={400}
                      className="w-full h-full rounded-md"
                    />
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
