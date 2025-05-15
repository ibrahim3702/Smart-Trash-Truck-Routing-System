"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import {
  createGraph,
  runKruskalsAlgorithm,
  findBinClusters,
  optimizeRouteWithDP,
  generateTruckRoutes,
  predictFillLevels,
} from "@/lib/routing-algorithms"
import { BPlusTree } from "@/lib/b-plus-tree"
import BinInputForm from "@/components/bin-input-form"
import TruckInputForm from "@/components/truck-input-form"
import RouteDisplay from "@/components/route-display"
import SimulationPanel from "@/components/simulation-panel"
import VisualizationPanel from "@/components/visualization-panel"
import DashboardStats from "@/components/dashboard-stats"
import RouteComparison from "@/components/route-comparison"
import AdvancedAnalytics from "@/components/advanced-analytics"
import OptimizationSettings from "@/components/optimization-settings"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import EnhancedCard from "@/components/enhanced-card"
import DemoSelector from "@/components/demo-selector"
import HelpCenter from "@/components/help-center"
import GuidedTour from "@/components/guided-tour"
import type { Bin, Truck, Route, Edge, OptimizationRecord } from "@/lib/types"
import { Trash2, TruckIcon, TrendingUp, MapPin, HelpCircle } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"

// Dynamically import the Map component with SSR disabled
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md border border-purple-200 dark:border-purple-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
        <p className="text-purple-700 dark:text-purple-400">Loading map...</p>
      </div>
    </div>
  ),
})

export default function Home() {
  const [bins, setBins] = useState<Bin[]>([])
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [previousRoutes, setPreviousRoutes] = useState<Route[]>([])
  const [mst, setMst] = useState<Edge[]>([])
  const [binTree, setBinTree] = useState<BPlusTree | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.505, -0.09])
  const [showDemo, setShowDemo] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null)
  const [isSimulationActive, setIsSimulationActive] = useState(false)
  const [simulationSpeed, setSimulationSpeed] = useState(1000) // ms between updates
  const [routeUpdateCount, setRouteUpdateCount] = useState(0)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [optimizationHistory, setOptimizationHistory] = useState<OptimizationRecord[]>([])
  const [predictedFillLevels, setPredictedFillLevels] = useState<{ [key: number]: number }>({})
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showHelpCenter, setShowHelpCenter] = useState(false)
  const [showGuidedTour, setShowGuidedTour] = useState(false)
  const [isFirstVisit, setIsFirstVisit] = useState(true)
  const [optimizationSettings, setOptimizationSettings] = useState<OptimizationSettings>({
    algorithm: "standard",
    priorityWeight: 70,
    distanceWeight: 60,
    timeWeight: 40,
    considerTraffic: true,
    considerWeather: false, // Disabled weather consideration
    maxRouteLength: 30,
    maxBinsPerRoute: 15,
    highPriorityThreshold: 80,
    reoptimizationInterval: 60,
  })
  const simulationRef = useRef<NodeJS.Timeout | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    // Initialize B+ Tree for bin storage
    const tree = new BPlusTree(5) // Order 5 B+ Tree
    setBinTree(tree)

    // Check if this is the first visit
    const hasVisitedBefore = localStorage.getItem("hasVisitedBefore")
    if (!hasVisitedBefore) {
      // Show guided tour on first visit
      setShowGuidedTour(true)
      localStorage.setItem("hasVisitedBefore", "true")
    } else {
      setIsFirstVisit(false)
    }
  }, [])

  useEffect(() => {
    // Update B+ Tree when bins change
    if (binTree) {
      binTree.clear()
      bins.forEach((bin) => {
        binTree.insert(bin.id, bin)
      })
    }
  }, [bins, binTree])

  // Effect for real-time simulation
  useEffect(() => {
    if (isSimulationActive && bins.length > 0) {
      simulationRef.current = setInterval(() => {
        // Simulate random changes in bin fill levels
        const updatedBins = [...bins]
        const binToUpdate = Math.floor(Math.random() * updatedBins.length)

        // Increase fill level by 5-15%
        const fillIncrease = Math.floor(Math.random() * 10) + 5
        updatedBins[binToUpdate] = {
          ...updatedBins[binToUpdate],
          fillLevel: Math.min(100, updatedBins[binToUpdate].fillLevel + fillIncrease),
        }

        setBins(updatedBins)

        // Update predicted fill levels
        const predictions = predictFillLevels(updatedBins)
        setPredictedFillLevels(predictions)

        // Recalculate routes if a bin becomes high priority (>80%)
        if (updatedBins[binToUpdate].fillLevel > optimizationSettings.highPriorityThreshold) {
          calculateRoutes()
          setRouteUpdateCount((prev) => prev + 1)

          toast({
            title: "High Priority Bin Detected",
            description: `Bin #${updatedBins[binToUpdate].id} has reached ${updatedBins[binToUpdate].fillLevel}% fill level. Routes updated.`,
            variant: "destructive",
          })
        }
      }, simulationSpeed)

      return () => {
        if (simulationRef.current) {
          clearInterval(simulationRef.current)
        }
      }
    }
  }, [isSimulationActive, bins, simulationSpeed, optimizationSettings.highPriorityThreshold])

  const addBin = (bin: Bin) => {
    const newBin = { ...bin, id: bins.length + 1 }
    setBins((prev) => [...prev, newBin])
    setSelectedLocation(null)

    toast({
      title: "Bin Added",
      description: `Bin #${newBin.id} has been added at location [${newBin.location[0].toFixed(4)}, ${newBin.location[1].toFixed(4)}]`,
    })
  }

  const addTruck = (truck: Truck) => {
    const newTruck = { ...truck, id: trucks.length + 1 }
    setTrucks((prev) => [...prev, newTruck])

    toast({
      title: "Truck Added",
      description: `Truck #${newTruck.id} with capacity ${newTruck.capacity}kg has been added`,
    })
  }

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation([lat, lng])

    toast({
      title: "Location Selected",
      description: `Location [${lat.toFixed(4)}, ${lng.toFixed(4)}] selected. Fill in the details to add a bin.`,
    })
  }

  const calculateRoutes = () => {
    if (bins.length === 0 || trucks.length === 0) {
      toast({
        title: "Cannot Calculate Routes",
        description: "Please add bins and trucks first",
        variant: "destructive",
      })
      return
    }

    // Save previous routes for comparison
    setPreviousRoutes(routes)

    // Step 1: Create graph representation
    const graph = createGraph(bins)

    // Step 2: Run Kruskal's algorithm to get MST
    const generatedMst = runKruskalsAlgorithm(graph)
    setMst(generatedMst)

    // Step 3: Find bin clusters using adapted Kadane's algorithm
    const clusters = findBinClusters(bins, generatedMst)

    // Step 4: For each cluster, optimize the sequence using DP
    const optimizedClusters = clusters.map((cluster) => optimizeRouteWithDP(cluster, graph))

    // Step 5: Generate truck routes considering capacity constraints
    const generatedRoutes = generateTruckRoutes(
      optimizedClusters,
      trucks,
      bins.filter((bin) => bin.fillLevel > optimizationSettings.highPriorityThreshold), // High priority bins
    )

    setRoutes(generatedRoutes)

    // Add to optimization history
    const totalDistance = generatedRoutes.reduce((sum, route) => sum + route.totalDistance, 0)
    const totalWaste = generatedRoutes.reduce((sum, route) => sum + route.totalWasteCollected, 0)

    setOptimizationHistory((prev) => [
      ...prev,
      {
        timestamp: new Date(),
        totalDistance,
        totalWaste,
        routeCount: generatedRoutes.length,
        highPriorityBins: bins.filter((bin) => bin.fillLevel > optimizationSettings.highPriorityThreshold).length,
      },
    ])

    toast({
      title: "Routes Calculated",
      description: `Generated ${generatedRoutes.length} optimized routes with total distance of ${totalDistance.toFixed(2)}km`,
    })
  }

  const toggleSimulation = () => {
    setIsSimulationActive(!isSimulationActive)

    toast({
      title: isSimulationActive ? "Simulation Paused" : "Simulation Started",
      description: isSimulationActive
        ? "Real-time bin fill level simulation has been paused"
        : "Real-time bin fill level simulation has started",
    })
  }

  const updateSimulationSpeed = (speed: number) => {
    setSimulationSpeed(speed)
  }

  const loadDemoData = (
    demoBins: Bin[],
    demoTrucks: Truck[],
    demoMapCenter: [number, number],
    calculateRoutesAfterLoad = false,
  ) => {
    setBins(demoBins)
    setTrucks(demoTrucks)
    setMapCenter(demoMapCenter)
    setShowDemo(true)

    toast({
      title: "Demo Data Loaded",
      description: `Loaded ${demoBins.length} bins and ${demoTrucks.length} trucks for demonstration`,
    })

    // Calculate routes immediately if requested
    if (calculateRoutesAfterLoad) {
      setTimeout(() => {
        calculateRoutes()
      }, 100) // Small delay to ensure state is updated
    }
  }

  const resetData = () => {
    setBins([])
    setTrucks([])
    setRoutes([])
    setPreviousRoutes([])
    setMst([])
    setShowDemo(false)
    setIsSimulationActive(false)
    setOptimizationHistory([])
    setPredictedFillLevels({})
    if (simulationRef.current) {
      clearInterval(simulationRef.current)
    }

    toast({
      title: "Data Reset",
      description: "All bins, trucks, routes, and history have been reset",
    })
  }

  const exportData = () => {
    // Create data object
    const data = {
      bins,
      trucks,
      routes,
      optimizationHistory,
      settings: optimizationSettings,
    }

    // Convert to JSON
    const jsonData = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonData], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    // Create download link
    const link = document.createElement("a")
    link.href = url
    link.download = "smart_trash_routing_data.json"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Data Exported",
      description: "All system data has been exported to JSON file",
    })
  }

  const handleApplySettings = (settings: OptimizationSettings) => {
    setOptimizationSettings(settings)

    toast({
      title: "Settings Applied",
      description: "Optimization settings have been updated",
    })
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {isFirstVisit && (
              <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-md border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-purple-500" />
                    <h3 className="text-lg font-medium text-purple-700 dark:text-purple-300">
                      Welcome to Smart Trash Truck Routing
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowGuidedTour(true)}
                      className="border-purple-200 dark:border-purple-800"
                    >
                      Take a Tour
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowHelpCenter(true)}
                      className="border-purple-200 dark:border-purple-800"
                    >
                      View Help
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  This system helps optimize waste collection routes based on bin fill levels and truck capacities. Get
                  started by loading a demo dataset or adding your own bins and trucks.
                </p>
              </div>
            )}

            <DashboardStats
              bins={bins}
              trucks={trucks}
              routes={routes}
              routeUpdateCount={routeUpdateCount}
              isSimulationActive={isSimulationActive}
              optimizationHistory={optimizationHistory}
              predictedFillLevels={predictedFillLevels}
            />

            {showHelpCenter && <HelpCenter />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <DemoSelector onLoadDemoData={(bins, trucks, mapCenter) => loadDemoData(bins, trucks, mapCenter, true)} />

              <EnhancedCard
                title="Simulation Control"
                description="Control the real-time simulation"
                icon={<TrendingUp className="h-5 w-5" />}
                delay={0.4}
              >
                <SimulationPanel
                  isActive={isSimulationActive}
                  speed={simulationSpeed}
                  onToggle={toggleSimulation}
                  onSpeedChange={updateSimulationSpeed}
                />
              </EnhancedCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <EnhancedCard
                title="Add Bin"
                description={selectedLocation ? "Location selected from map" : "Add a new bin to the system"}
                icon={<Trash2 className="h-5 w-5" />}
                delay={0.2}
              >
                <BinInputForm onAddBin={addBin} selectedLocation={selectedLocation} />
              </EnhancedCard>

              <EnhancedCard
                title="Add Truck"
                description="Add a new truck to the system"
                icon={<TruckIcon className="h-5 w-5" />}
                delay={0.3}
              >
                <TruckInputForm onAddTruck={addTruck} />
              </EnhancedCard>
            </div>

            <div className="mt-6">
              <EnhancedCard
                title="Optimization Settings"
                description="Configure system optimization parameters"
                icon={<TrendingUp className="h-5 w-5" />}
              >
                <OptimizationSettings onApplySettings={handleApplySettings} />
              </EnhancedCard>
            </div>
          </motion.div>
        )
      case "map":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <EnhancedCard
              title="Interactive Map"
              description="View bins, routes, and select locations"
              icon={<MapPin className="h-5 w-5" />}
              contentClassName="p-0"
            >
              <MapComponent
                bins={bins}
                routes={routes}
                mst={mst}
                mapCenter={mapCenter}
                selectedLocation={selectedLocation}
                onMapClick={handleMapClick}
                predictedFillLevels={predictedFillLevels}
              />
            </EnhancedCard>

            <motion.div
              className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-md border border-purple-200 dark:border-purple-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-lg font-medium mb-2 text-purple-700 dark:text-purple-300">Map Instructions</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Click anywhere on the map to select a location for a new bin</li>
                <li>Gray dashed lines represent the Minimum Spanning Tree (MST) connections</li>
                <li>Colored solid lines represent optimized routes for each truck</li>
                <li>
                  Red markers indicate high priority bins (&gt;{optimizationSettings.highPriorityThreshold}% fill level)
                </li>
                <li>Use the mouse wheel to zoom in/out and drag to pan the map</li>
              </ul>
            </motion.div>
          </motion.div>
        )
      case "routes":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <EnhancedCard
              title="Route Display"
              description="View optimized routes for all trucks"
              icon={<TruckIcon className="h-5 w-5" />}
            >
              <RouteDisplay routes={routes} bins={bins} trucks={trucks} />
            </EnhancedCard>
          </motion.div>
        )
      case "visualization":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <EnhancedCard
              title="Visualization Panel"
              description="Visual analytics of the routing system"
              icon={<TrendingUp className="h-5 w-5" />}
            >
              <VisualizationPanel bins={bins} routes={routes} mst={mst} />
            </EnhancedCard>
          </motion.div>
        )
      case "analytics":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <EnhancedCard
              title="Advanced Analytics"
              description="Detailed system analytics and metrics"
              icon={<TrendingUp className="h-5 w-5" />}
            >
              <AdvancedAnalytics
                bins={bins}
                trucks={trucks}
                routes={routes}
                optimizationHistory={optimizationHistory}
              />
            </EnhancedCard>
          </motion.div>
        )
      case "comparison":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <EnhancedCard
              title="Route Comparison"
              description="Compare current and previous routes"
              icon={<TruckIcon className="h-5 w-5" />}
            >
              <RouteComparison
                currentRoutes={routes}
                previousRoutes={previousRoutes}
                optimizationHistory={optimizationHistory}
                bins={bins}
              />
            </EnhancedCard>
          </motion.div>
        )
      case "help":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <HelpCenter />
          </motion.div>
        )
      default:
        return null
    }
  }

  // Calculate notifications count
  const notificationsCount = bins.filter((bin) => bin.fillLevel > optimizationSettings.highPriorityThreshold).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-gray-900">
      {!isMobile && (
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onCalculateRoutes={calculateRoutes}
          onLoadDemoData={(bins, trucks, mapCenter, calculateRoutes) =>
            loadDemoData(bins, trucks, mapCenter, calculateRoutes)
          }
          onResetData={resetData}
          onExportData={exportData}
          onShowHelp={() => setShowHelpCenter(!showHelpCenter)}
          onShowTour={() => setShowGuidedTour(true)}
        />
      )}

      <main
        className={`main-content ${
          isMobile ? "" : sidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded"
        } p-4 transition-all duration-300`}
      >
        <Header
          title="Smart Trash Truck Routing"
          notifications={notificationsCount}
          onHelpClick={() => setShowHelpCenter(!showHelpCenter)}
          onTourClick={() => setShowGuidedTour(true)}
        />

        {renderContent()}
      </main>

      {showGuidedTour && <GuidedTour onClose={() => setShowGuidedTour(false)} />}

      <Toaster />
    </div>
  )
}
