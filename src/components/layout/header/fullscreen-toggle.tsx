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
      switch (true) {
        case e.key === "F11" && !isFullscreen:
        case e.key === "Escape" && isFullscreen:
          e.preventDefault()
          toggleFullscreen()
          break;
      }
    }

    const ctrl = new AbortController()
    document.addEventListener("fullscreenchange", handleFullscreenChange, ctrl)
    document.addEventListener("keydown", handleKeyDown, ctrl)

    return () => {
      ctrl.abort()
    }
  }, [toggleFullscreen])

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleFullscreen}
    >
      {isFullscreen
        ? <MinimizeIcon className="size-5" />
        : <MaximizeIcon className="size-5" />
      }
    </Button>
  );
} 