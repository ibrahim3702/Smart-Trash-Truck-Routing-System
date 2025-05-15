"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"
import { HelpCircle, BookOpen, Lightbulb, Truck, Trash2, Route, MapPin, BarChart3, Settings, Play } from "lucide-react"

export default function HelpCenter() {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div initial={{ height: "auto" }} animate={{ height: expanded ? "auto" : "auto" }} className="mb-6">
      <Card className="border-purple-200 dark:border-purple-900 transition-all duration-300 hover:shadow-md">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-400 text-white">
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            System Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-100"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="howto"
                className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-100"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                How To
              </TabsTrigger>
              <TabsTrigger
                value="features"
                className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-100"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Features
              </TabsTrigger>
              <TabsTrigger
                value="faq"
                className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-100"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                FAQ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                <h3 className="text-lg font-medium mb-2 text-purple-700 dark:text-purple-300">
                  Smart Trash Truck Routing System
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This system optimizes waste collection routes based on bin fill levels, truck capacities, and
                  geographical locations. It uses advanced algorithms to create efficient routes that prioritize bins
                  with high fill levels while minimizing travel distance.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                    <Trash2 className="h-8 w-8 text-purple-500 mb-2" />
                    <h4 className="font-medium">Bins</h4>
                    <p className="text-xs text-center text-muted-foreground">
                      Add and monitor trash bins with real-time fill levels
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                    <Truck className="h-8 w-8 text-purple-500 mb-2" />
                    <h4 className="font-medium">Trucks</h4>
                    <p className="text-xs text-center text-muted-foreground">
                      Manage your fleet of collection trucks and their capacities
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                    <Route className="h-8 w-8 text-purple-500 mb-2" />
                    <h4 className="font-medium">Routes</h4>
                    <p className="text-xs text-center text-muted-foreground">
                      Generate optimized collection routes automatically
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="howto" className="mt-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100">
                    <div className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      How to add a bin
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                      <li>Go to the Dashboard tab</li>
                      <li>Find the "Add Bin" card</li>
                      <li>Enter the latitude and longitude coordinates</li>
                      <li>Set the fill level using the slider</li>
                      <li>Enter the bin capacity in kg</li>
                      <li>Click "Add Bin" to add it to the system</li>
                      <li>
                        <strong>Tip:</strong> You can also click directly on the map to select a location
                      </li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      How to add a truck
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                      <li>Go to the Dashboard tab</li>
                      <li>Find the "Add Truck" card</li>
                      <li>Enter the truck capacity in kg</li>
                      <li>Enter the current load (if any)</li>
                      <li>Click "Add Truck" to add it to the system</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100">
                    <div className="flex items-center gap-2">
                      <Route className="h-4 w-4" />
                      How to calculate routes
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                      <li>Add bins and trucks to the system</li>
                      <li>Click the "Calculate Routes" button in the sidebar</li>
                      <li>The system will automatically generate optimized routes</li>
                      <li>View the routes in the Routes tab</li>
                      <li>
                        <strong>Note:</strong> Routes are automatically recalculated when bin fill levels change
                        significantly
                      </li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100">
                    <div className="flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      How to run the simulation
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                      <li>Go to the Dashboard tab</li>
                      <li>Find the "Simulation Control" card</li>
                      <li>Click the "Start" button to begin the simulation</li>
                      <li>Adjust the update speed using the slider</li>
                      <li>The simulation will randomly increase bin fill levels over time</li>
                      <li>Routes will be automatically recalculated when needed</li>
                      <li>Click "Pause" to stop the simulation</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      How to adjust optimization settings
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                      <li>Go to the Settings tab</li>
                      <li>Choose a preset or adjust individual settings</li>
                      <li>Modify weights for bin priority, distance, and time</li>
                      <li>Set limits for route length and bins per route</li>
                      <li>Adjust the high priority threshold</li>
                      <li>Click "Apply Settings" to save your changes</li>
                      <li>Recalculate routes to see the effect of your changes</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent value="features" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-purple-500" />
                    <h3 className="font-medium">Interactive Map</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    View bins, routes, and MST connections on an interactive map. Click to add new bins at specific
                    locations.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Play className="h-5 w-5 text-purple-500" />
                    <h3 className="font-medium">Real-time Simulation</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Simulate bin fill level changes over time to test the system's response to changing conditions.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                    <h3 className="font-medium">Advanced Analytics</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    View detailed analytics and visualizations of system performance, including efficiency metrics and
                    predictions.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Route className="h-5 w-5 text-purple-500" />
                    <h3 className="font-medium">Route Comparison</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Compare current and previous routes to track improvements in efficiency and waste collection.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="faq" className="mt-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="faq-1">
                  <AccordionTrigger>What algorithms are used for route optimization?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">The system uses a combination of algorithms:</p>
                    <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground">
                      <li>Kruskal's algorithm to find the Minimum Spanning Tree (MST)</li>
                      <li>Adapted Kadane's algorithm to find bin clusters</li>
                      <li>Dynamic Programming for optimal bin visit sequence</li>
                      <li>Custom algorithms for truck route generation with capacity constraints</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-2">
                  <AccordionTrigger>How are high priority bins determined?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      Bins are considered high priority when their fill level exceeds the high priority threshold
                      (default: 80%). This threshold can be adjusted in the Settings tab. High priority bins are
                      prioritized in route generation to ensure they are emptied first.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-3">
                  <AccordionTrigger>Can I export the generated routes?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      Yes, you can export all system data including routes by clicking the "Export Data" button in the
                      sidebar. This will download a JSON file containing all bins, trucks, routes, and optimization
                      history.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-4">
                  <AccordionTrigger>How does the simulation work?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      The simulation randomly increases bin fill levels over time to simulate waste accumulation. When a
                      bin's fill level exceeds the high priority threshold, routes are automatically recalculated. You
                      can adjust the simulation speed to control how frequently updates occur.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-5">
                  <AccordionTrigger>What do the different optimization presets do?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">The system offers several optimization presets:</p>
                    <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground">
                      <li>
                        <strong>Balanced:</strong> Equal weight to bin priority and route efficiency
                      </li>
                      <li>
                        <strong>Efficiency:</strong> Prioritizes minimal distance and fuel usage
                      </li>
                      <li>
                        <strong>Priority First:</strong> Focuses on high-priority bins first
                      </li>
                      <li>
                        <strong>Speed:</strong> Optimizes for fastest collection time
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
