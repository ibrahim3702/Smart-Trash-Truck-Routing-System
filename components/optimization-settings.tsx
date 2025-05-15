"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Settings, Save, RotateCcw, Sliders, AlertTriangle, BarChart3 } from "lucide-react"

interface OptimizationSettingsProps {
  onApplySettings: (settings: OptimizationSettings) => void
}

export interface OptimizationSettings {
  algorithm: "standard" | "advanced" | "experimental"
  priorityWeight: number
  distanceWeight: number
  timeWeight: number
  considerTraffic: boolean
  considerWeather: boolean
  maxRouteLength: number
  maxBinsPerRoute: number
  highPriorityThreshold: number
  reoptimizationInterval: number
}

export default function OptimizationSettings({ onApplySettings }: OptimizationSettingsProps) {
  const [settings, setSettings] = useState<OptimizationSettings>({
    algorithm: "standard",
    priorityWeight: 70,
    distanceWeight: 60,
    timeWeight: 40,
    considerTraffic: true,
    considerWeather: true,
    maxRouteLength: 30,
    maxBinsPerRoute: 15,
    highPriorityThreshold: 80,
    reoptimizationInterval: 60,
  })

  const [activePreset, setActivePreset] = useState<string | null>(null)

  const handleChange = (key: keyof OptimizationSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setActivePreset(null) // Clear active preset when settings change
  }

  const applyPreset = (preset: "balanced" | "efficiency" | "priority" | "speed") => {
    switch (preset) {
      case "balanced":
        setSettings({
          algorithm: "standard",
          priorityWeight: 70,
          distanceWeight: 60,
          timeWeight: 40,
          considerTraffic: true,
          considerWeather: true,
          maxRouteLength: 30,
          maxBinsPerRoute: 15,
          highPriorityThreshold: 80,
          reoptimizationInterval: 60,
        })
        break
      case "efficiency":
        setSettings({
          algorithm: "advanced",
          priorityWeight: 40,
          distanceWeight: 90,
          timeWeight: 70,
          considerTraffic: true,
          considerWeather: true,
          maxRouteLength: 40,
          maxBinsPerRoute: 20,
          highPriorityThreshold: 85,
          reoptimizationInterval: 120,
        })
        break
      case "priority":
        setSettings({
          algorithm: "advanced",
          priorityWeight: 100,
          distanceWeight: 30,
          timeWeight: 50,
          considerTraffic: true,
          considerWeather: true,
          maxRouteLength: 25,
          maxBinsPerRoute: 12,
          highPriorityThreshold: 70,
          reoptimizationInterval: 30,
        })
        break
      case "speed":
        setSettings({
          algorithm: "standard",
          priorityWeight: 50,
          distanceWeight: 50,
          timeWeight: 100,
          considerTraffic: true,
          considerWeather: false,
          maxRouteLength: 20,
          maxBinsPerRoute: 10,
          highPriorityThreshold: 90,
          reoptimizationInterval: 15,
        })
        break
    }
    setActivePreset(preset)
  }

  const handleApplySettings = () => {
    onApplySettings(settings)
  }

  return (
    <Card className="border-purple-200 dark:border-purple-900 transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-purple-500" />
          Route Optimization Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="presets"
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-100"
            >
              <Sliders className="h-4 w-4 mr-2" />
              Presets
            </TabsTrigger>
            <TabsTrigger
              value="weights"
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-100"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Weights
            </TabsTrigger>
            <TabsTrigger
              value="limits"
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-100"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Limits
            </TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={() => applyPreset("balanced")}
                className={`p-4 rounded-md border cursor-pointer transition-all ${
                  activePreset === "balanced"
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                    : "border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700"
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">Balanced</h3>
                  <Badge
                    variant="outline"
                    className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                  >
                    Recommended
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Balances bin priority with route efficiency. Good for most scenarios.
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Priority</div>
                    <div className="font-medium">70%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Distance</div>
                    <div className="font-medium">60%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Time</div>
                    <div className="font-medium">40%</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={() => applyPreset("efficiency")}
                className={`p-4 rounded-md border cursor-pointer transition-all ${
                  activePreset === "efficiency"
                    ? "border-green-500 bg-green-50 dark:bg-green-900/30"
                    : "border-gray-200 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-700"
                }`}
              >
                <h3 className="font-medium">Efficiency</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Optimizes for minimal distance and fuel usage. Best for cost reduction.
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Priority</div>
                    <div className="font-medium">40%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Distance</div>
                    <div className="font-medium">90%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Time</div>
                    <div className="font-medium">70%</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={() => applyPreset("priority")}
                className={`p-4 rounded-md border cursor-pointer transition-all ${
                  activePreset === "priority"
                    ? "border-red-500 bg-red-50 dark:bg-red-900/30"
                    : "border-gray-200 dark:border-gray-800 hover:border-red-300 dark:hover:border-red-700"
                }`}
              >
                <h3 className="font-medium">Priority First</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Focuses on high-priority bins first. Best for urgent situations.
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Priority</div>
                    <div className="font-medium">100%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Distance</div>
                    <div className="font-medium">30%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Time</div>
                    <div className="font-medium">50%</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={() => applyPreset("speed")}
                className={`p-4 rounded-md border cursor-pointer transition-all ${
                  activePreset === "speed"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                    : "border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700"
                }`}
              >
                <h3 className="font-medium">Speed</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Optimizes for fastest collection time. Best for time-sensitive operations.
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Priority</div>
                    <div className="font-medium">50%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Distance</div>
                    <div className="font-medium">50%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Time</div>
                    <div className="font-medium">100%</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="weights" className="mt-4 space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="algorithm">Optimization Algorithm</Label>
                </div>
                <Select
                  value={settings.algorithm}
                  onValueChange={(value: "standard" | "advanced" | "experimental") => handleChange("algorithm", value)}
                >
                  <SelectTrigger className="w-full border-purple-200 dark:border-purple-800">
                    <SelectValue placeholder="Select algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard (Balanced)</SelectItem>
                    <SelectItem value="advanced">Advanced (More accurate, slower)</SelectItem>
                    <SelectItem value="experimental">Experimental (Beta)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="priorityWeight">Bin Priority Weight: {settings.priorityWeight}%</Label>
                </div>
                <Slider
                  id="priorityWeight"
                  min={0}
                  max={100}
                  step={5}
                  value={[settings.priorityWeight]}
                  onValueChange={(value) => handleChange("priorityWeight", value[0])}
                  className="bg-purple-100 dark:bg-purple-900/30"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Higher values prioritize bins with higher fill levels
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="distanceWeight">Distance Weight: {settings.distanceWeight}%</Label>
                </div>
                <Slider
                  id="distanceWeight"
                  min={0}
                  max={100}
                  step={5}
                  value={[settings.distanceWeight]}
                  onValueChange={(value) => handleChange("distanceWeight", value[0])}
                  className="bg-purple-100 dark:bg-purple-900/30"
                />
                <p className="text-xs text-muted-foreground mt-1">Higher values prioritize shorter total distances</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="timeWeight">Time Weight: {settings.timeWeight}%</Label>
                </div>
                <Slider
                  id="timeWeight"
                  min={0}
                  max={100}
                  step={5}
                  value={[settings.timeWeight]}
                  onValueChange={(value) => handleChange("timeWeight", value[0])}
                  className="bg-purple-100 dark:bg-purple-900/30"
                />
                <p className="text-xs text-muted-foreground mt-1">Higher values prioritize faster collection times</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="considerTraffic"
                  checked={settings.considerTraffic}
                  onCheckedChange={(checked) => handleChange("considerTraffic", checked)}
                />
                <Label htmlFor="considerTraffic">Consider Traffic Conditions</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="considerWeather"
                  checked={settings.considerWeather}
                  onCheckedChange={(checked) => handleChange("considerWeather", checked)}
                />
                <Label htmlFor="considerWeather">Consider Weather Conditions</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="limits" className="mt-4 space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="maxRouteLength">Max Route Length: {settings.maxRouteLength} km</Label>
                </div>
                <Slider
                  id="maxRouteLength"
                  min={5}
                  max={50}
                  step={5}
                  value={[settings.maxRouteLength]}
                  onValueChange={(value) => handleChange("maxRouteLength", value[0])}
                  className="bg-purple-100 dark:bg-purple-900/30"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="maxBinsPerRoute">Max Bins Per Route: {settings.maxBinsPerRoute}</Label>
                </div>
                <Slider
                  id="maxBinsPerRoute"
                  min={5}
                  max={30}
                  step={1}
                  value={[settings.maxBinsPerRoute]}
                  onValueChange={(value) => handleChange("maxBinsPerRoute", value[0])}
                  className="bg-purple-100 dark:bg-purple-900/30"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="highPriorityThreshold">
                    High Priority Threshold: {settings.highPriorityThreshold}%
                  </Label>
                </div>
                <Slider
                  id="highPriorityThreshold"
                  min={50}
                  max={95}
                  step={5}
                  value={[settings.highPriorityThreshold]}
                  onValueChange={(value) => handleChange("highPriorityThreshold", value[0])}
                  className="bg-purple-100 dark:bg-purple-900/30"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Bins with fill levels above this threshold are considered high priority
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="reoptimizationInterval">
                    Reoptimization Interval: {settings.reoptimizationInterval} minutes
                  </Label>
                </div>
                <Slider
                  id="reoptimizationInterval"
                  min={5}
                  max={120}
                  step={5}
                  value={[settings.reoptimizationInterval]}
                  onValueChange={(value) => handleChange("reoptimizationInterval", value[0])}
                  className="bg-purple-100 dark:bg-purple-900/30"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  How often routes should be recalculated during simulation
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            className="border-purple-200 dark:border-purple-800"
            onClick={() => applyPreset("balanced")}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
          <Button onClick={handleApplySettings} className="bg-purple-600 hover:bg-purple-700">
            <Save className="h-4 w-4 mr-2" />
            Apply Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
