"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Truck, Trash2, MapPin, Info, Route, TruckIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Bin, Truck as TruckType } from "@/lib/types"

interface DemoSelectorProps {
  onLoadDemoData: (bins: Bin[], trucks: TruckType[], mapCenter: [number, number], calculateRoutes: boolean) => void
}

export default function DemoSelector({ onLoadDemoData }: DemoSelectorProps) {
  const [selectedDemo, setSelectedDemo] = useState<"small" | "medium" | "large" | null>(null)

  // Demo data sets
  const demoData = {
    small: {
      name: "Small City",
      description: "A small city with 6 bins and 2 trucks, generating 2 routes",
      bins: [
        { id: 1, location: [51.505, -0.09], fillLevel: 90, capacity: 100 },
        { id: 2, location: [51.51, -0.1], fillLevel: 85, capacity: 100 },
        { id: 3, location: [51.515, -0.09], fillLevel: 80, capacity: 100 },
        { id: 4, location: [51.52, -0.1], fillLevel: 75, capacity: 100 },
        { id: 5, location: [51.518, -0.08], fillLevel: 70, capacity: 100 },
        { id: 6, location: [51.51, -0.05], fillLevel: 65, capacity: 100 },
      ],
      trucks: [
        { id: 1, capacity: 200, currentLoad: 0 },
        { id: 2, capacity: 200, currentLoad: 0 },
      ],
      mapCenter: [51.51, -0.08] as [number, number],
      expectedRoutes: 2,
      highPriorityBins: 3,
    },
    medium: {
      name: "Medium City",
      description: "A medium-sized city with 9 bins and 3 trucks, generating 3 routes",
      bins: [
        { id: 1, location: [51.505, -0.09], fillLevel: 90, capacity: 100 },
        { id: 2, location: [51.51, -0.1], fillLevel: 85, capacity: 100 },
        { id: 3, location: [51.515, -0.09], fillLevel: 80, capacity: 100 },
        { id: 4, location: [51.52, -0.1], fillLevel: 75, capacity: 100 },
        { id: 5, location: [51.518, -0.08], fillLevel: 70, capacity: 100 },
        { id: 6, location: [51.51, -0.05], fillLevel: 65, capacity: 100 },
        { id: 7, location: [51.505, -0.06], fillLevel: 60, capacity: 100 },
        { id: 8, location: [51.508, -0.11], fillLevel: 55, capacity: 100 },
        { id: 9, location: [51.512, -0.07], fillLevel: 50, capacity: 100 },
      ],
      trucks: [
        { id: 1, capacity: 150, currentLoad: 0 },
        { id: 2, capacity: 150, currentLoad: 0 },
        { id: 3, capacity: 150, currentLoad: 0 },
      ],
      mapCenter: [51.51, -0.08] as [number, number],
      expectedRoutes: 3,
      highPriorityBins: 3,
    },
    large: {
      name: "Large City",
      description: "A large city with 12 bins and 4 trucks, generating 4 routes",
      bins: [
        { id: 1, location: [51.505, -0.09], fillLevel: 90, capacity: 100 },
        { id: 2, location: [51.51, -0.1], fillLevel: 85, capacity: 100 },
        { id: 3, location: [51.515, -0.09], fillLevel: 80, capacity: 100 },
        { id: 4, location: [51.52, -0.1], fillLevel: 75, capacity: 100 },
        { id: 5, location: [51.518, -0.08], fillLevel: 70, capacity: 100 },
        { id: 6, location: [51.51, -0.05], fillLevel: 65, capacity: 100 },
        { id: 7, location: [51.505, -0.06], fillLevel: 60, capacity: 100 },
        { id: 8, location: [51.508, -0.11], fillLevel: 55, capacity: 100 },
        { id: 9, location: [51.512, -0.07], fillLevel: 50, capacity: 100 },
        { id: 10, location: [51.502, -0.08], fillLevel: 45, capacity: 100 },
        { id: 11, location: [51.5, -0.12], fillLevel: 40, capacity: 100 },
        { id: 12, location: [51.525, -0.07], fillLevel: 35, capacity: 100 },
      ],
      trucks: [
        { id: 1, capacity: 100, currentLoad: 0 },
        { id: 2, capacity: 100, currentLoad: 0 },
        { id: 3, capacity: 100, currentLoad: 0 },
        { id: 4, capacity: 100, currentLoad: 0 },
      ],
      mapCenter: [51.51, -0.08] as [number, number],
      expectedRoutes: 4,
      highPriorityBins: 3,
    },
  }

  const handleLoadDemo = (demoType: "small" | "medium" | "large") => {
    setSelectedDemo(demoType)
    const demo = demoData[demoType]
    onLoadDemoData(demo.bins, demo.trucks, demo.mapCenter, true)
  }

  return (
    <Card className="border-purple-200 dark:border-purple-900 transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-purple-500" />
          Demo Data Selection
        </CardTitle>
        <CardDescription>Choose a demo dataset to get started quickly</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="small" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="small"
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-100"
            >
              Small City
            </TabsTrigger>
            <TabsTrigger
              value="medium"
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-100"
            >
              Medium City
            </TabsTrigger>
            <TabsTrigger
              value="large"
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-100"
            >
              Large City
            </TabsTrigger>
          </TabsList>

          {Object.entries(demoData).map(([key, demo]) => (
            <TabsContent key={key} value={key} className="mt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">{demo.name}</h3>
                    <p className="text-sm text-muted-foreground">{demo.description}</p>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="border-purple-200 dark:border-purple-800">
                          <Info className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This demo will generate approximately {demo.expectedRoutes} routes</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                    <Trash2 className="h-8 w-8 text-purple-500 mb-2" />
                    <span className="text-xl font-bold">{demo.bins.length}</span>
                    <span className="text-xs text-muted-foreground">Bins</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                    <Truck className="h-8 w-8 text-purple-500 mb-2" />
                    <span className="text-xl font-bold">{demo.trucks.length}</span>
                    <span className="text-xs text-muted-foreground">Trucks</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                    <Route className="h-8 w-8 text-purple-500 mb-2" />
                    <span className="text-xl font-bold">{demo.expectedRoutes}</span>
                    <span className="text-xs text-muted-foreground">Expected Routes</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="destructive">{demo.highPriorityBins} High Priority Bins</Badge>
                  <Badge
                    variant="outline"
                    className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                  >
                    {demo.bins.length - demo.highPriorityBins} Normal Bins
                  </Badge>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={() => handleLoadDemo(selectedDemo || "small")}
          className="bg-purple-600 hover:bg-purple-700 transition-colors duration-300"
        >
          <TruckIcon className="h-4 w-4 mr-2" />
          Load Selected Demo
        </Button>
      </CardFooter>
    </Card>
  )
}
