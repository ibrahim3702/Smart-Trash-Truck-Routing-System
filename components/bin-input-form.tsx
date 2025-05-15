"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin } from "lucide-react"
import { motion } from "framer-motion"
import type { Bin } from "@/lib/types"

interface BinInputFormProps {
  onAddBin: (bin: Bin) => void
  selectedLocation: [number, number] | null
}

export default function BinInputForm({ onAddBin, selectedLocation }: BinInputFormProps) {
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [fillLevel, setFillLevel] = useState(50)
  const [capacity, setCapacity] = useState("100")

  // Update form when a location is selected on the map
  useEffect(() => {
    if (selectedLocation) {
      setLatitude(selectedLocation[0].toString())
      setLongitude(selectedLocation[1].toString())
    }
  }, [selectedLocation])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const lat = Number.parseFloat(latitude)
    const lng = Number.parseFloat(longitude)
    const cap = Number.parseInt(capacity)

    if (isNaN(lat) || isNaN(lng) || isNaN(cap)) {
      alert("Please enter valid numbers for all fields")
      return
    }

    onAddBin({
      id: 0, // Will be set by parent component
      location: [lat, lng],
      fillLevel,
      capacity: cap,
    })

    // Reset form
    setLatitude("")
    setLongitude("")
    setFillLevel(50)
    setCapacity("100")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {selectedLocation && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Alert className="bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800">
            <AlertDescription className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-purple-500" />
              Location selected from map
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="text"
            placeholder="e.g. 51.505"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
            className="border-purple-200 dark:border-purple-800 focus:ring-purple-500 transition-all duration-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="text"
            placeholder="e.g. -0.09"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
            className="border-purple-200 dark:border-purple-800 focus:ring-purple-500 transition-all duration-300"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="fillLevel">Fill Level: {fillLevel}%</Label>
          <motion.span
            className={`text-xs font-medium ${
              fillLevel > 80 ? "text-red-500" : fillLevel > 50 ? "text-yellow-500" : "text-green-500"
            }`}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [1, 0.8, 1],
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          >
            {fillLevel > 80 ? "High Priority" : fillLevel > 50 ? "Medium Priority" : "Low Priority"}
          </motion.span>
        </div>
        <Slider
          id="fillLevel"
          min={0}
          max={100}
          step={1}
          value={[fillLevel]}
          onValueChange={(value) => setFillLevel(value[0])}
          className={`${fillLevel > 80 ? "bg-red-100" : fillLevel > 50 ? "bg-yellow-100" : "bg-green-100"} dark:bg-gray-700 transition-colors duration-300`}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="capacity">Capacity (kg)</Label>
        <Input
          id="capacity"
          type="number"
          placeholder="Bin capacity in kg"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          required
          className="border-purple-200 dark:border-purple-800 focus:ring-purple-500 transition-all duration-300"
        />
      </div>

      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 transition-colors duration-300">
        Add Bin
      </Button>
    </form>
  )
}
