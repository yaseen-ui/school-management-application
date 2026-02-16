"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ZoomIn, ZoomOut, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageViewerProps {
  /** Whether the viewer is open */
  isOpen: boolean
  /** URL of the image to display */
  imageUrl: string
  /** Callback when viewer should close */
  onClose: () => void
}

export function ImageViewer({ isOpen, imageUrl, onClose }: ImageViewerProps) {
  const [zoom, setZoom] = React.useState(1)
  const imageRef = React.useRef<HTMLImageElement>(null)

  // Prevent scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = "unset"
      }
    }
  }, [isOpen])

  // Handle ESC key press
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  // Reset zoom when image changes
  React.useEffect(() => {
    setZoom(1)
  }, [imageUrl])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5))
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `image-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Close only if clicking on the overlay itself, not the image
    if (e.currentTarget === e.target) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
            aria-label="Close image viewer"
          >
            <X className="h-6 w-6" />
          </motion.button>

          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 rounded-lg p-2 backdrop-blur-sm"
          >
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 text-white hover:bg-white/20"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              title="Zoom out (-))"
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
            <div className="flex items-center justify-center min-w-12 px-2 text-sm font-medium text-white">
              {Math.round(zoom * 100)}%
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 text-white hover:bg-white/20"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              title="Zoom in (+)"
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
            <div className="w-px bg-white/20" />
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 text-white hover:bg-white/20"
              onClick={handleDownload}
              title="Download image"
            >
              <Download className="h-5 w-5" />
            </Button>
          </motion.div>

          {/* Image container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative max-h-[90vh] max-w-[90vw] overflow-auto rounded-lg bg-black/30 p-4"
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Fullscreen view"
              className="mx-auto transition-transform duration-200"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "center",
              }}
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).src = "/placeholder.svg"
              }}
            />
          </motion.div>

          {/* Info text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/60"
          >
            Click outside or press ESC to close
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
