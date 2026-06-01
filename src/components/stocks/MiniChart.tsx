'use client'

import { useEffect, useRef } from 'react'
import type { HistoricalPoint } from '@/types'

interface MiniChartProps {
  data: HistoricalPoint[]
  isPositive: boolean
}

export function MiniChart({ data, isPositive }: MiniChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let chart: any = null

    const init = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { createChart, ColorType } = await import('lightweight-charts') as any
      if (!containerRef.current) return

      chart = createChart(containerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: 'transparent',
        },
        grid: {
          vertLines: { visible: false },
          horzLines: { visible: false },
        },
        crosshair: { mode: 0 },
        rightPriceScale: { visible: false },
        timeScale: { visible: false },
        handleScroll: false,
        handleScale: false,
        width: containerRef.current.clientWidth,
        height: 64,
      })

      const color = isPositive ? '#22c55e' : '#ef4444'
      const series = chart.addAreaSeries({
        lineColor: color,
        topColor: color + '33',
        bottomColor: 'transparent',
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
      })

      series.setData(
        data.map((d) => ({
          time: d.date as `${number}-${number}-${number}`,
          value: d.close,
        }))
      )
    }

    init()

    return () => {
      if (chart) chart.remove()
    }
  }, [data, isPositive])

  return <div ref={containerRef} className="w-full h-16" />
}
