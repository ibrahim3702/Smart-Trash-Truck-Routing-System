"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Play, Pause, Clock, Info, ArrowUp } from "lucide-react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SimulationPanelProps {
  isActive: boolean
  speed: number
  onToggle: () => void
  onSpeedChange: (speed: number) => void
}

export default function SimulationPanel({ isActive, speed, onToggle, onSpeedChange }: SimulationPanelProps) {
  const [localSpeed, setLocalSpeed] = useState(speed)
  const [showInfo, setShowInfo] = useState(false)

  const handleSpeedChange = (value: number[]) => {
    const newSpeed = value[0]
    setLocalSpeed(newSpeed)
    onSpeedChange(newSpeed)
  }

  return (
    <Card
      className={`border transition-all duration-300 ${
        isActive
          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-700"
          : "border-purple-200 dark:border-purple-900"
      } hover:shadow-md`}
    >
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                rotate: isActive ? 360 : 0,
              }}
              transition={{
                duration: 2,
                repeat: isActive ? Number.POSITIVE_INFINITY : 0,
                ease: "linear",
              }}
            >
              <Clock className="h-5 w-5 text-purple-500" />
            </motion.div>
            <span className="font-medium">Real-time Simulation</span>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowInfo(!showInfo)}
                    className="h-8 w-8 border-purple-200 dark:border-purple-800"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Learn about simulation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={onToggle}
              className={
                isActive
                  ? "bg-purple-600 hover:bg-purple-700 transition-colors duration-300"
                  : "border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors duration-300"
              }
            >
              {isActive ? (
                <>
                  <Pause className="h-4 w-4 mr-2" /> Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" /> Start
                </>
              )}
            </Button>
          </div>
        </div>

        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 bg-purple-100 dark:bg-purple-900/40 rounded-md border border-purple-200 dark:border-purple-800"
          >
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-purple-500" />
              What is Real-time Simulation?
            </h4>
            <p className="text-xs text-muted-foreground mb-2">
              The real-time simulation randomly increases bin fill levels to simulate waste accumulation over time.
            </p>
            <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
              <li>Bin fill levels increase by 5-15% at each update</li>
              <li>Routes are automatically recalculated when bins reach high priority</li>
              <li>Adjust the speed slider to control how frequently updates occur</li>
              <li>This helps visualize how the system responds to changing conditions</li>
            </ul>
            <div className="flex justify-end mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInfo(false)}
                className="h-7 text-xs px-2 text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/60"
              >
                <ArrowUp className="h-3 w-3 mr-1" />
                Hide
              </Button>
            </div>
          </motion.div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Update Speed</Label>
            <span className="text-sm text-muted-foreground">{(localSpeed / 1000).toFixed(1)}s</span>
          </div>
          <Slider
            min={500}
            max={5000}
            step={500}
            value={[localSpeed]}
            onValueChange={handleSpeedChange}
            disabled={!isActive}
            className="bg-purple-100 dark:bg-purple-900/30"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Fast (0.5s)</span>
            <span>Slow (5s)</span>
          </div>
        </div>

        <div className="mt-4 text-sm">
          <p className="text-muted-foreground">
            {isActive
              ? "Simulation is running. Bin fill levels are being updated randomly."
              : "Start the simulation to see real-time updates of bin fill levels."}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
