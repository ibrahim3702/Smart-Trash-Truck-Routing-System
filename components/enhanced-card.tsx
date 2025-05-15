"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface EnhancedCardProps {
  title: string
  description?: string
  icon?: ReactNode
  children: ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
  delay?: number
}

export default function EnhancedCard({
  title,
  description,
  icon,
  children,
  className,
  headerClassName,
  contentClassName,
  delay = 0,
}: EnhancedCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}>
      <Card
        className={cn(
          "border-purple-200 dark:border-purple-900 transition-all duration-300 hover:shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm",
          className,
        )}
      >
        <CardHeader
          className={cn("bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-t-lg", headerClassName)}
        >
          <CardTitle className="flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          {description && <CardDescription className="text-purple-100">{description}</CardDescription>}
        </CardHeader>
        <CardContent className={cn("pt-6", contentClassName)}>{children}</CardContent>
      </Card>
    </motion.div>
  )
}
