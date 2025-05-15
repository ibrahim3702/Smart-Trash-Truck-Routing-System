"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import type { Truck } from "@/lib/types"

interface TruckInputFormProps {
  onAddTruck: (truck: Truck) => void
}

export default function TruckInputForm({ onAddTruck }: TruckInputFormProps) {
  const [capacity, setCapacity] = useState("")
  const [currentLoad, setCurrentLoad] = useState("0")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const cap = Number.parseInt(capacity)
    const load = Number.parseInt(currentLoad)

    if (isNaN(cap) || isNaN(load)) {
      alert("Please enter valid numbers for all fields")
      return
    }

    if (load > cap) {
      alert("Current load cannot exceed capacity")
      return
    }

    onAddTruck({
      id: 0, // Will be set by parent component
      capacity: cap,
      currentLoad: load,
    })

    // Reset form
    setCapacity("")
    setCurrentLoad("0")
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-2">
        <Label htmlFor="capacity">Capacity (kg)</Label>
        <Input
          id="capacity"
          type="number"
          placeholder="Truck capacity in kg"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          required
          className="border-purple-200 dark:border-purple-800 focus:ring-purple-500 transition-all duration-300"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="currentLoad">Current Load (kg)</Label>
        <Input
          id="currentLoad"
          type="number"
          placeholder="Current load in kg"
          value={currentLoad}
          onChange={(e) => setCurrentLoad(e.target.value)}
          required
          className="border-purple-200 dark:border-purple-800 focus:ring-purple-500 transition-all duration-300"
        />
      </div>

      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 transition-colors duration-300">
        Add Truck
      </Button>
    </motion.form>
  )
}
