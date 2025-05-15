"use client"

import { motion } from "framer-motion"
import { Trash2, Bell, Search, HelpCircle, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  title: string
  notifications?: number
  onHelpClick?: () => void
  onTourClick?: () => void
}

export default function Header({ title, notifications = 0, onHelpClick, onTourClick }: HeaderProps) {
  return (
    <motion.div
      className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 flex items-center justify-center shadow-lg">
          <Trash2 className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-purple-400 bg-clip-text text-transparent">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            className="pl-10 w-64 border-purple-200 dark:border-purple-800 focus:ring-purple-500"
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={onHelpClick}
          className="border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900"
          title="Help Center"
        >
          <HelpCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onTourClick}
          className="border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900"
          title="Take a Tour"
        >
          <Play className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="relative border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900"
            >
              <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              {notifications > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white"
                  variant="destructive"
                >
                  {notifications}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 border-purple-200 dark:border-purple-800">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications > 0 ? (
              <>
                <DropdownMenuItem className="cursor-pointer">
                  <div className="flex flex-col">
                    <span className="font-medium">High Priority Bin Detected</span>
                    <span className="text-xs text-muted-foreground">Bin #3 has reached 90% fill level</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <div className="flex flex-col">
                    <span className="font-medium">Routes Updated</span>
                    <span className="text-xs text-muted-foreground">Routes have been recalculated</span>
                  </div>
                </DropdownMenuItem>
              </>
            ) : (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">No new notifications</div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  )
}
