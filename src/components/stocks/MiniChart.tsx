'use client'

import { useEffect, useRef } from 'react'
import type { HistoricalPoint } from '@/types'

interface MiniChartProps {
  data: HistoricalPoint[]
  isPositive: boolean
  entryPrice?: number | null
}

export function MiniChart({ data, isPositive, entryPrice }: MiniChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let chart: any = null

    const init = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { createChart, ColorType, LineStyle } = await import('lightweight-charts') as any
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
        height: 96,
      })

      const color = isPositive ? '#22c55e' : '#ef4444'
      const areaSeries = chart.addAreaSeries({
        lineColor: color,
        topColor: color + '55',
        bottomColor: 'transparent',
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
      })

      const chartData = data.map((d) => ({
        time: d.date as `${number}-${number}-${number}`,
        value: d.close,
      }))

      areaSeries.setData(chartData)

      if (entryPrice != null && chartData.length > 0) {
        const lineSeries = chart.addLineSeries({
          color: 'rgba(148,163,184,0.4)',
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          priceLineVisible: false,
          lastValueVisible: false,
          crosshairMarkerVisible: false,
        })
        lineSeries.setData(
          chartData.map((d) => ({ time: d.time, value: entryPrice }))
        )
      }
    }

    init()

    return () => {
      if (chart) chart.remove()
    }
  }, [data, isPositive, entryPrice])

  return <div ref={containerRef} className="w-full h-24" />
}
