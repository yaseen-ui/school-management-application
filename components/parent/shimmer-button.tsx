"use client"

import { motion } from "framer-motion"
import { Sparkles, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ShimmerButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export function ShimmerButton({ children, onClick, className, disabled }: ShimmerButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={cn(
        "relative overflow-hidden rounded-2xl px-6 py-3.5 font-semibold text-white shadow-lg transition-all duration-300",
        "gradient-primary shadow-primary/25",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {/* Shimmer effect */}
      <span className="absolute inset-0 w-full h-full">
        <motion.span
          className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
          animate={{ left: ["-50%", "150%"] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
        />
      </span>

      {/* Sparkle particles */}
      <motion.span
        className="absolute -top-1 -right-1 text-white/30"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
      >
        <Sparkles className="h-3 w-3" />
      </motion.span>
      <motion.span
        className="absolute -bottom-1 -left-1 text-white/20"
        animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1.3 }}
      >
        <Sparkles className="h-2.5 w-2.5" />
      </motion.span>

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </motion.button>
  )
}