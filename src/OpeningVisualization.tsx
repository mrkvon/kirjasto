import { useEffect, useRef } from 'react'
import { Library } from './api'
import { getTimeRange, schedule2OpeningTimes } from './time'

const OpeningVisualization = ({
  libraries,
  time,
}: {
  libraries: Library[]
  time: number
}) => {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (ref.current) {
      const canvas = ref.current

      const timeRange = getTimeRange(libraries)

      drawLibraryGraph(
        getLibraryGraph(libraries),
        timeRange,
        [0, libraries.length],
        canvas,
      )

      drawVerticalLine(time, timeRange, 'red', 3, canvas)

      const dayRange = timeRange.map(a => a / (24 * 3600 * 1000)) as [
        number,
        number,
      ]

      for (let i = dayRange[0] + 1; i < dayRange[1]; ++i) {
        drawVerticalLine(i * 24 * 3600 * 1000, timeRange, '#000b', 0.5, canvas)
      }
    }
  })

  return (
    <canvas
      ref={ref}
      style={{
        width: '60vw',
        height: '50px',
        position: 'absolute',
        bottom: 0,
        left: 0,
        zIndex: 1000,
      }}
    />
  )
}

export default OpeningVisualization

type GraphPoint = {
  time: number
  open: number // percentage of open libraries
  selfService: number // percentage of libraries in self-service mode
}

const getLibraryGraph = (libraries: Library[]): GraphPoint[] => {
  // collect all time points
  const times: {
    [time: number]: {
      open: number
      selfService: number
    }
  } = {}
  const allTimes = libraries
    .map(library =>
      library.Schedules.map(schedule => schedule2OpeningTimes(schedule)),
    )
    .flat(2)

  allTimes.forEach(({ opens, closes, status }) => {
    times[opens] = times[opens] ?? {
      open: 0,
      selfService: 0,
    }
    times[closes] = times[closes] ?? {
      open: 0,
      selfService: 0,
    }

    times[opens][status === 1 ? 'open' : 'selfService']++
    times[closes][status === 1 ? 'open' : 'selfService']--
  })

  const openingChanges = Object.entries(times)
    .map(([key, value]) => [+key, value] as const)
    .sort(([a], [b]) => a - b)
    .map(([time, openings]) => ({ time, ...openings }))

  const openings = openingChanges.reduce((prev, curr) => {
    prev.push({
      time: curr.time,
      open: curr.open + (prev[prev.length - 1]?.open ?? 0),
      selfService: curr.selfService + (prev[prev.length - 1]?.selfService ?? 0),
    })
    return prev
  }, [] as GraphPoint[])

  return openings
}

const pointToGraph = (
  [time, amount]: [number, number],
  xRange: [number, number],
  yRange: [number, number],
  size: [number, number],
): [number, number] => {
  const x = ((time - xRange[0]) / (xRange[1] - xRange[0])) * size[0]

  const y = (1 - amount / yRange[1]) * size[1]

  return [x, y]
}

const points2Rect = (
  a: [number, number],
  b: [number, number],
): [number, number, number, number] => [
  Math.min(a[0], b[0]),
  Math.min(a[1], b[1]),
  Math.abs(a[0] - b[0]),
  Math.abs(a[1] - b[1]),
]

const drawVerticalLine = (
  x: number,
  xRange: [number, number],
  color: string,
  lineWidth: number,
  canvas: HTMLCanvasElement,
): void => {
  const { width, height } = canvas.getBoundingClientRect()
  const context = canvas.getContext('2d')

  if (context) {
    const graphX = pointToGraph([x, 0], xRange, [0, 10], [width, height])[0]
    context.strokeStyle = color
    context.lineWidth = lineWidth
    context.beginPath()
    context.moveTo(graphX, 0)
    context.lineTo(graphX, height)
    context.stroke()
  }
}

const drawLibraryGraph = (
  graph: GraphPoint[],
  xRange: [number, number],
  yRange: [number, number],
  canvas: HTMLCanvasElement,
) => {
  const { width, height } = canvas.getBoundingClientRect()
  const context = canvas.getContext('2d')

  if (context) {
    context.canvas.width = width
    context.canvas.height = height
    context.clearRect(0, 0, width, height)
    //context.fillStyle = 'white'
    //context.fillRect(0, 0, width, height)

    // draw first white rectangle, until first opening time
    context.fillStyle = '#fff7'
    context.fillRect(
      ...points2Rect(
        pointToGraph([xRange[0], 0], xRange, yRange, [width, height]),
        pointToGraph([graph[0]?.time ?? xRange[1], yRange[1]], xRange, yRange, [
          width,
          height,
        ]),
      ),
    )

    for (let i = 0; i < graph.length; ++i) {
      const point1 = graph[i]
      const point2 = graph[i + 1] ?? {
        time: xRange[1],
        open: 0,
        selfService: 0,
      }
      const red1 = pointToGraph(
        [point1.time, point1.selfService],
        xRange,
        yRange,
        [width, height],
      )
      const red2 = pointToGraph([point2.time, 0], xRange, yRange, [
        width,
        height,
      ])
      const green1 = pointToGraph(
        [point1.time, point1.open + point1.selfService],
        xRange,
        yRange,
        [width, height],
      )
      const green2 = pointToGraph(
        [point2.time, point1.selfService],
        xRange,
        yRange,
        [width, height],
      )

      const white1 = pointToGraph(
        [point1.time, point1.open + point1.selfService],
        xRange,
        yRange,
        [width, height],
      )
      const white2 = pointToGraph([point2.time, yRange[1]], xRange, yRange, [
        width,
        height,
      ])

      context.fillStyle = '#228b22cc'
      context.fillRect(...points2Rect(green1, green2))

      context.fillStyle = '#cf0000cc'
      context.fillRect(...points2Rect(red1, red2))

      context.fillStyle = '#fff7'
      context.fillRect(...points2Rect(white1, white2))
    }
  }
}
