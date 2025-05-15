"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react"

interface GuidedTourProps {
  onClose: () => void
}

export default function GuidedTour({ onClose }: GuidedTourProps) {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(true)

  const steps = [
    {
      title: "Welcome to Smart Trash Truck Routing",
      content:
        "This system helps optimize waste collection routes based on bin fill levels and truck capacities. Let's take a quick tour to get you started.",
      position: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
    },
    {
      title: "Sidebar Navigation",
      content:
        "Use the sidebar to navigate between different sections of the application. You can access the dashboard, map view, routes, visualizations, and settings.",
      position: { top: "50%", left: "80px", transform: "translateY(-50%)" },
    },
    {
      title: "Dashboard",
      content:
        "The dashboard provides an overview of the system status, including bin and truck counts, route statistics, and simulation controls.",
      position: { top: "120px", left: "50%", transform: "translateX(-50%)" },
    },
    {
      title: "Adding Bins and Trucks",
      content:
        "Use the forms on the dashboard to add bins and trucks to the system. You can also click on the map to select a location for a new bin.",
      position: { top: "300px", left: "50%", transform: "translateX(-50%)" },
    },
    {
      title: "Simulation Control",
      content:
        "The simulation control allows you to run a real-time simulation of bin fill level changes. This helps test the system's response to changing conditions.",
      position: { top: "400px", right: "100px", transform: "translateY(-50%)" },
    },
    {
      title: "Calculate Routes",
      content:
        "After adding bins and trucks, click the 'Calculate Routes' button in the sidebar to generate optimized collection routes.",
      position: { top: "200px", left: "80px", transform: "translateY(-50%)" },
    },
    {
      title: "View Routes",
      content:
        "Go to the Routes tab to view the generated routes. Each route shows the sequence of bins to visit, total distance, and waste collected.",
      position: { top: "250px", left: "50%", transform: "translateX(-50%)" },
    },
    {
      title: "Map View",
      content:
        "The Map View shows bins, routes, and MST connections on an interactive map. Click on a bin to see its details.",
      position: { top: "350px", left: "50%", transform: "translateX(-50%)" },
    },
    {
      title: "Settings",
      content:
        "Use the Settings tab to adjust optimization parameters. You can choose presets or customize individual settings.",
      position: { top: "300px", left: "80px", transform: "translateY(-50%)" },
    },
    {
      title: "You're Ready!",
      content:
        "You now know the basics of the Smart Trash Truck Routing System. Feel free to explore and experiment with different settings and scenarios.",
      position: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
    },
  ]

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      handleClose()
    }
  }

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleClose = () => {
    setVisible(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed z-50 w-96"
            style={steps[step].position as any}
          >
            <Card className="border-purple-200 dark:border-purple-900 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-400 text-white">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    {steps[step].title}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="h-6 w-6 text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">{steps[step].content}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Step {step + 1} of {steps.length}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrev}
                    disabled={step === 0}
                    className="border-purple-200 dark:border-purple-800"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleNext}
                    className="bg-purple-600 hover:bg-purple-700 transition-colors duration-300"
                  >
                    {step === steps.length - 1 ? "Finish" : "Next"}
                    {step !== steps.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
