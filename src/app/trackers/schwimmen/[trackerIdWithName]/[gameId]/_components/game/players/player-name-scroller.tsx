import React from "react";
import { motion, useMotionValue, useMotionValueEvent, useAnimation } from "motion/react";
import { cn } from "@/lib/utils";
import { useSchwimmenGameStore } from "@/store/schwimmenGameStore";

export const PlayerNameScroller = ({ className, children }: React.ComponentProps<"div">) => {
  const { currentRoundNumber } = useSchwimmenGameStore()

  const containerRef = React.useRef<HTMLDivElement>(null)
  const textRef = React.useRef<HTMLSpanElement>(null)

  const x = useMotionValue(0)
  const controls = useAnimation()

  const [shouldScroll, setShouldScroll] = React.useState(false)
  const [scrollDistance, setScrollDistance] = React.useState(0)
  const [scrollDirection, setScrollDirection] = React.useState<"none" | "left" | "right" | "both">("none")

  React.useEffect(() => {
    const container = containerRef.current
    const text = textRef.current
    if (!container || !text) return

    const checkOverflow = () => {
      const isOverflowing = text.scrollWidth > container.clientWidth
      setShouldScroll(isOverflowing)
      if (isOverflowing) {
        const distance = text.scrollWidth - container.clientWidth
        setScrollDistance(distance)
      } else {
        setScrollDirection("none")
      }
    }

    checkOverflow()
    window.removeEventListener("resize", checkOverflow)
    window.addEventListener("resize", checkOverflow)
    return () => window.removeEventListener("resize", checkOverflow)
  }, [containerRef.current?.clientWidth, currentRoundNumber])

  React.useEffect(() => {
    let animationCancelled = false

    const sequence = async () => {
      if (!shouldScroll || scrollDistance === 0) {
        controls.stop()
        controls.start({ x: 0, transition: { duration: 0 } })
        return
      }

      while (!animationCancelled) {
        await controls.start({ x: -scrollDistance, transition: { duration: 1, ease: "easeInOut" } })
        await new Promise((r) => setTimeout(r, 3000))

        await controls.start({ x: 0, transition: { duration: 1 } })
        await new Promise((r) => setTimeout(r, 3000))
      }
    }

    sequence()

    return () => {
      animationCancelled = true
      controls.stop()
    }
  }, [shouldScroll, scrollDistance, controls])

  useMotionValueEvent(x, "change", (latest) => {
    if (!shouldScroll) {
      setScrollDirection("none")
      return
    }
    const canScrollLeft = latest < 0
    const canScrollRight = latest > -scrollDistance

    if (canScrollLeft && canScrollRight) setScrollDirection("both")
    else if (canScrollRight) setScrollDirection("right")
    else if (canScrollLeft) setScrollDirection("left")
    else setScrollDirection("none")
  })

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden whitespace-nowrap mask-gradient",
        {
          "mask-left": scrollDirection === "left" || scrollDirection === "both",
          "mask-right": scrollDirection === "right" || scrollDirection === "both",
        },
        className
      )}
    >
      <motion.span
        ref={textRef}
        className="inline-block"
        style={{ x }}
        animate={controls}
      >
        {children}
      </motion.span>
    </div>
  );
}
