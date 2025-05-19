"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Play, Pause, Maximize, Volume2, VolumeX, Loader2, SkipBack, Settings, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface VideoDemoProps {
  title: string
  description: string
  videoSrc?: string
  animationComponent?: React.ReactNode
  className?: string
}

export function VideoDemo({ title, description, videoSrc, animationComponent, className }: VideoDemoProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(80)
  const [isLoading, setIsLoading] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hoverTime, setHoverTime] = useState<number | null>(null)
  const [showControls, setShowControls] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [quality, setQuality] = useState("high")
  const videoRef = useRef<HTMLVideoElement>(null)
  const intervalRef = useRef<NodeJS.Timeout>()
  const containerRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  // Start or pause the video/animation
  const togglePlay = () => {
    setIsLoading(true)

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch((error) => {
          console.error("Error playing video:", error)
          setIsLoading(false)
        })
      }
    } else {
      // For animation components, we'll simulate progress
      if (!isPlaying) {
        intervalRef.current = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(intervalRef.current)
              setIsPlaying(false)
              return 0
            }
            return prev + 0.1
          })
        }, 100)

        // Dispatch custom event for animation components
        window.dispatchEvent(
          new CustomEvent("videoDemoPlayPause", {
            detail: { isPlaying: true },
          }),
        )
      } else if (intervalRef.current) {
        clearInterval(intervalRef.current)

        // Dispatch custom event for animation components
        window.dispatchEvent(
          new CustomEvent("videoDemoPlayPause", {
            detail: { isPlaying: false },
          }),
        )
      }

      // Simulate loading for animations
      setTimeout(() => {
        setIsLoading(false)
        setIsPlaying(!isPlaying)
      }, 800)
    }
  }

  // Reset the demo
  const resetDemo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      setProgress(0)
      if (!isPlaying) {
        togglePlay()
      }
    } else {
      setProgress(0)
      setIsPlaying(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      // Dispatch custom event for animation components
      window.dispatchEvent(new CustomEvent("videoDemoReset"))
    }
  }

  // Handle video loaded
  const handleVideoLoaded = () => {
    setIsLoading(false)
    setIsPlaying(true)
  }

  // Toggle mute state
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
    setIsMuted(!isMuted)
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)

    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100
    }

    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true)
        })
        .catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        })
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(false)
        })
        .catch((err) => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`)
        })
    }
  }

  // Update progress for video
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const percentage = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(percentage)

      if (percentage >= 99.9) {
        setIsPlaying(false)
      }
    }
  }

  // Handle progress bar click
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return

    const rect = progressBarRef.current.getBoundingClientRect()
    const clickPosition = (e.clientX - rect.left) / rect.width

    if (videoRef.current) {
      videoRef.current.currentTime = clickPosition * videoRef.current.duration
    } else {
      // For animations, set progress directly
      setProgress(clickPosition * 100)

      // Dispatch custom event for animation components
      window.dispatchEvent(
        new CustomEvent("videoDemoSeek", {
          detail: { progress: clickPosition * 100 },
        }),
      )
    }
  }

  // Handle progress bar hover
  const handleProgressBarHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return

    const rect = progressBarRef.current.getBoundingClientRect()
    const hoverPosition = (e.clientX - rect.left) / rect.width

    if (videoRef.current) {
      setHoverTime(hoverPosition * videoRef.current.duration)
    } else {
      setHoverTime(hoverPosition * 180) // Assume 3 minutes for animations
    }
  }

  // Format time in MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Auto-hide controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true)

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }

      if (isPlaying && !isHovering) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false)
        }, 3000)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [isPlaying, isHovering])

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [])

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  return (
    <div
      className={cn(
        "aspect-video w-full max-w-5xl mx-auto rounded-lg overflow-hidden border border-[#44475a] bg-[#282a36] shadow-xl transition-all relative",
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : "",
        className,
      )}
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Video header */}
      <div className="bg-gradient-to-r from-[#282a36] to-[#1d1e26] p-4 border-b border-[#44475a] flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-[#f8f8f2]">{title}</h3>
          <p className="text-[#6272a4] mt-1 text-sm">{description}</p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowInfo(!showInfo)}
                className="text-[#bd93f9] hover:text-[#ff79c6] hover:bg-[#44475a]/30"
              >
                <Info className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Show more information</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Video content */}
      <div className="relative aspect-video bg-[#21222c]">
        {videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            className="w-full h-full object-cover"
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onLoadedData={handleVideoLoaded}
            muted={isMuted}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">{animationComponent}</div>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="bg-[#282a36] rounded-lg p-6 shadow-xl flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-[#ff79c6] animate-spin mb-4" />
              <p className="text-[#f8f8f2]">Loading high-resolution simulation...</p>
            </div>
          </div>
        )}

        {/* Play button overlay */}
        {!isPlaying && !isLoading && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer transition-opacity hover:bg-black/40 z-10"
            onClick={togglePlay}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full bg-[#ff79c6]/80 flex items-center justify-center transition-transform hover:scale-110"
            >
              <Play className="w-10 h-10 text-white ml-1" />
            </motion.div>
          </div>
        )}

        {/* Info overlay */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-[#282a36]/95 z-20 p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-[#ff79c6]">About this Simulation</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowInfo(false)}
                  className="text-[#6272a4] hover:text-[#f8f8f2] hover:bg-[#44475a]/30"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4 text-[#f8f8f2]">
                <p>
                  This advanced scientific visualization demonstrates key principles in {title.toLowerCase()}. The
                  simulation uses high-precision numerical methods to accurately represent complex scientific phenomena.
                </p>

                <div className="bg-[#21222c] p-4 rounded-md border border-[#44475a]">
                  <h4 className="text-[#8be9fd] font-semibold mb-2">Technical Details</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-[#bd93f9]">
                    <li>Rendering: WebGL-accelerated canvas with custom shaders</li>
                    <li>Physics: Runge-Kutta 4th order integration</li>
                    <li>Resolution: Adaptive high-definition rendering</li>
                    <li>Performance: Optimized for real-time interaction</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[#8be9fd] font-semibold mb-2">Educational Value</h4>
                  <p className="text-sm text-[#f8f8f2]">
                    This simulation helps visualize abstract concepts that are difficult to grasp through equations
                    alone. By interacting with the visualization, you can develop an intuitive understanding of the
                    underlying principles.
                  </p>
                </div>

                <div className="bg-[#21222c] p-4 rounded-md border border-[#44475a]">
                  <h4 className="text-[#8be9fd] font-semibold mb-2">Controls</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4 text-[#ff79c6]" />
                      <span>Play/Pause</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <SkipBack className="w-4 h-4 text-[#ff79c6]" />
                      <span>Reset</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-[#ff79c6]" />
                      <span>Volume</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Maximize className="w-4 h-4 text-[#ff79c6]" />
                      <span>Fullscreen</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video controls */}
        <AnimatePresence>
          {(showControls || !isPlaying || isHovering) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-10"
            >
              {/* Progress bar with hover preview */}
              <div
                className="relative h-2 bg-[#44475a] rounded-full overflow-hidden cursor-pointer group mb-2"
                onClick={handleProgressBarClick}
                onMouseMove={handleProgressBarHover}
                onMouseLeave={() => setHoverTime(null)}
                ref={progressBarRef}
              >
                <div className="absolute top-0 left-0 h-full bg-[#ff79c6]" style={{ width: `${progress}%` }} />
                <div
                  className="absolute top-0 left-0 h-full bg-[#bd93f9]/50 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    width: `${hoverTime !== null ? (hoverTime / (videoRef.current?.duration || 180)) * 100 : 0}%`,
                  }}
                />

                {/* Time tooltip on hover */}
                {hoverTime !== null && (
                  <div
                    className="absolute bottom-full mb-2 bg-[#282a36] text-[#f8f8f2] px-2 py-1 rounded text-xs transform -translate-x-1/2 pointer-events-none"
                    style={{ left: `${(hoverTime / (videoRef.current?.duration || 180)) * 100}%` }}
                  >
                    {formatTime(hoverTime)}
                  </div>
                )}
              </div>

              {/* Controls row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={togglePlay}
                          className="text-[#f8f8f2] hover:text-[#8be9fd] hover:bg-white/10"
                        >
                          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isPlaying ? "Pause" : "Play"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={resetDemo}
                          className="text-[#f8f8f2] hover:text-[#8be9fd] hover:bg-white/10"
                        >
                          <SkipBack className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Reset</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <div className="flex items-center gap-2 group relative">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleMute}
                            className="text-[#f8f8f2] hover:text-[#8be9fd] hover:bg-white/10"
                          >
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isMuted ? "Unmute" : "Mute"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <div className="w-0 overflow-hidden transition-all duration-300 group-hover:w-20">
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={handleVolumeChange}
                        className="w-20"
                      />
                    </div>
                  </div>

                  {/* Time display */}
                  <div className="text-[#f8f8f2] text-xs font-mono hidden sm:block">
                    {videoRef.current
                      ? `${formatTime(videoRef.current.currentTime)} / ${formatTime(videoRef.current.duration || 0)}`
                      : `${formatTime((progress / 100) * 180)} / 3:00`}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-[#f8f8f2] hover:text-[#8be9fd] hover:bg-white/10"
                          onClick={() => {
                            const newQuality = quality === "high" ? "medium" : "high"
                            setQuality(newQuality)
                            // In a real implementation, this would change the video quality
                          }}
                        >
                          <Settings className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Quality: {quality}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleFullscreen}
                          className="text-[#f8f8f2] hover:text-[#8be9fd] hover:bg-white/10"
                        >
                          <Maximize className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Fullscreen</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
