"use client"

import { useRef, useEffect, useState } from "react"
import { useInView } from "motion/react"
import { cn } from "@/lib/utils"

interface NumberTickerProps {
  value: number
  duration?: number
  delay?: number
  decimalPlaces?: number
  prefix?: string
  suffix?: string
  className?: string
  once?: boolean
}

export function NumberTicker({
  value,
  duration = 1800,
  delay = 0,
  decimalPlaces = 0,
  prefix = "",
  suffix = "",
  className,
  once = true,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once, margin: "0px 0px -40px 0px" })
  const [displayValue, setDisplayValue] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const started = useRef(false)

  useEffect(() => {
    if (!isInView || started.current) return
    started.current = true

    const easeOutExpo = (t: number) =>
      t === 1 ? 1 : 1 - Math.pow(2, -10 * t)

    const timeoutId = setTimeout(() => {
      startTimeRef.current = null

      const tick = (timestamp: number) => {
        if (startTimeRef.current === null) startTimeRef.current = timestamp
        const elapsed = timestamp - startTimeRef.current
        const progress = Math.min(elapsed / duration, 1)
        setDisplayValue(easeOutExpo(progress) * value)
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          setDisplayValue(value)
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }, delay)

    return () => {
      clearTimeout(timeoutId)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [isInView, value, duration, delay])

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {displayValue.toFixed(decimalPlaces)}
      {suffix}
    </span>
  )
}
