"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, LayoutDashboard, MapPin, TruckIcon, BarChart3, TrendingUp, History, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function MobileNavigation({ activeTab, onTabChange }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: "map", label: "Map View", icon: <MapPin className="h-5 w-5" /> },
    { id: "routes", label: "Routes", icon: <TruckIcon className="h-5 w-5" /> },
    { id: "visualization", label: "Visualizations", icon: <BarChart3 className="h-5 w-5" /> },
    { id: "analytics", label: "Analytics", icon: <TrendingUp className="h-5 w-5" /> },
    { id: "comparison", label: "History", icon: <History className="h-5 w-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ]

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleTabChange = (tab: string) => {
    onTabChange(tab)
    setIsOpen(false)
  }

  return (
    <div className="relative z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleMenu}
        className="border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-12 right-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-purple-200 dark:border-purple-800 overflow-hidden"
          >
            <div className="p-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full justify-start mb-1 ${
                    activeTab === item.id
                      ? "bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100 font-medium"
                      : "text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/50"
                  }`}
                  onClick={() => handleTabChange(item.id)}
                >
                  <span className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
