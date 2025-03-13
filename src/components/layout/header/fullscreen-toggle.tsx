"use client"

import React from 'react';

import { Button } from '@/components/ui/button';
import { MaximizeIcon, MinimizeIcon } from 'lucide-react';

export const FullscreenToggle = () => {
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false)

  const toggleFullscreen = React.useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error)
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(console.error)
    }
  }, [])

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F11" || e.key === "Escape") {
        e.preventDefault()
        toggleFullscreen()
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [toggleFullscreen])

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleFullscreen}
    >
      {isFullscreen ?
        <MinimizeIcon className="size-5" />
        :
        <MaximizeIcon className="size-5" />
      }
      <span className="sr-only">Toggle fullscreen mode</span>
    </Button>
  );
} 