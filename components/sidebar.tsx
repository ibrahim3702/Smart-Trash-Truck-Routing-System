"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import ThemeToggle from "@/components/theme-toggle"
import {
  LayoutDashboard,
  MapPin,
  TruckIcon,
  BarChart3,
  TrendingUp,
  History,
  ChevronLeft,
  ChevronRight,
  Trash2,
  RefreshCw,
  Download,
  HelpCircle,
  Play,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Bin, Truck } from "@/lib/types"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onCalculateRoutes: () => void
  onLoadDemoData: (bins: Bin[], trucks: Truck[], mapCenter: [number, number], calculateRoutes: boolean) => void
  onResetData: () => void
  onExportData: () => void
  onShowHelp: () => void
  onShowTour: () => void
}

export default function Sidebar({
  activeTab,
  onTabChange,
  onCalculateRoutes,
  onLoadDemoData,
  onResetData,
  onExportData,
  onShowHelp,
  onShowTour,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: "map", label: "Map View", icon: <MapPin className="h-5 w-5" /> },
    { id: "routes", label: "Routes", icon: <TruckIcon className="h-5 w-5" /> },
    { id: "visualization", label: "Visualizations", icon: <BarChart3 className="h-5 w-5" /> },
    { id: "analytics", label: "Analytics", icon: <TrendingUp className="h-5 w-5" /> },
    { id: "comparison", label: "History", icon: <History className="h-5 w-5" /> },
    { id: "help", label: "Help", icon: <HelpCircle className="h-5 w-5" /> },
  ]

  // Demo data for small city (2 routes)
  const smallCityDemo = {
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
  }

  // Demo data for medium city (3 routes)
  const mediumCityDemo = {
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
  }

  const actionItems = [
    { id: "calculate", label: "Calculate Routes", icon: <RefreshCw className="h-5 w-5" />, action: onCalculateRoutes },
    {
      id: "demo-small",
      label: "Load Small City (2 Routes)",
      icon: <Trash2 className="h-5 w-5" />,
      action: () => onLoadDemoData(smallCityDemo.bins, smallCityDemo.trucks, smallCityDemo.mapCenter, true),
    },
    {
      id: "demo-medium",
      label: "Load Medium City (3 Routes)",
      icon: <Trash2 className="h-5 w-5" />,
      action: () => onLoadDemoData(mediumCityDemo.bins, mediumCityDemo.trucks, mediumCityDemo.mapCenter, true),
    },
    { id: "reset", label: "Reset Data", icon: <RefreshCw className="h-5 w-5" />, action: onResetData },
    { id: "export", label: "Export Data", icon: <Download className="h-5 w-5" />, action: onExportData },
    { id: "help", label: "Help Center", icon: <HelpCircle className="h-5 w-5" />, action: onShowHelp },
    { id: "tour", label: "Take a Tour", icon: <Play className="h-5 w-5" />, action: onShowTour },
  ]

  return (
    <TooltipProvider>
      <motion.div
        className={cn(
          "fixed left-0 top-0 z-30 h-screen bg-white dark:bg-gray-900 border-r border-purple-200 dark:border-purple-800 transition-all duration-300 flex flex-col",
          collapsed ? "w-20" : "w-64",
        )}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-purple-200 dark:border-purple-800">
          <motion.div
            className={cn("flex items-center gap-3", collapsed && "justify-center w-full")}
            animate={{ opacity: collapsed ? 0 : 1 }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 flex items-center justify-center">
              <Trash2 className="h-4 w-4 text-white" />
            </div>
            {!collapsed && (
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-700 to-purple-400 bg-clip-text text-transparent">
                Smart Routing
              </h1>
            )}
          </motion.div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Tooltip key={item.id} delayDuration={collapsed ? 300 : 999999}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start mb-1 transition-all",
                      collapsed ? "px-3" : "px-4",
                      activeTab === item.id
                        ? "bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100 font-medium"
                        : "text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/50",
                    )}
                    onClick={() => onTabChange(item.id)}
                  >
                    <span
                      className={cn("flex items-center", collapsed ? "justify-center w-full" : "justify-start gap-3")}
                    >
                      {item.icon}
                      {!collapsed && <span>{item.label}</span>}
                    </span>
                  </Button>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
              </Tooltip>
            ))}
          </nav>

          <div className="mt-8 pt-4 border-t border-purple-200 dark:border-purple-800">
            <h3
              className={cn(
                "text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2",
                collapsed ? "text-center" : "px-4",
              )}
            >
              {!collapsed && "ACTIONS"}
            </h3>
            <nav className="space-y-1">
              {actionItems.map((item) => (
                <Tooltip key={item.id} delayDuration={collapsed ? 300 : 999999}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start mb-1 transition-all",
                        collapsed ? "px-3" : "px-4",
                        "text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/50",
                      )}
                      onClick={item.action}
                    >
                      <span
                        className={cn("flex items-center", collapsed ? "justify-center w-full" : "justify-start gap-3")}
                      >
                        {item.icon}
                        {!collapsed && <span>{item.label}</span>}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                </Tooltip>
              ))}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-purple-200 dark:border-purple-800 flex justify-center">
          <ThemeToggle />
        </div>
      </motion.div>
    </TooltipProvider>
  )
}
