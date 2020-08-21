import colors from 'utils/colors'
import {
  drawHeight as chartHeight,
  drawWidth as chartWidth,
  chartWindowBegins,
  chartWindowEnds
} from './constants'

function drawChart(ctx, rangeFrom, rangeTo) {
  const fontSize = 36

  ctx.clearRect(0, 0, chartWidth * 0.97, chartHeight)

  ctx.lineWidth = 4
  ctx.font = `${fontSize}px Arial`

  ctx.beginPath()
  ctx.lineCap = 'round'
  ctx.strokeStyle = '#ddd'
  ctx.moveTo(chartWidth * 0.05, 0)
  ctx.lineTo(chartWidth * 0.05, chartHeight)
  ctx.stroke()
  ctx.closePath()

  ctx.beginPath()
  ctx.setLineDash([5, 15])
  const intermediateLanes = 5
  const step = (chartWindowEnds - chartWindowBegins) / intermediateLanes
  for (let i = 1; i < intermediateLanes; i++) {
    const lineY = chartWindowBegins + i * step

    ctx.moveTo(chartWidth * 0.05, lineY)
    ctx.lineTo(chartWidth * 0.97, lineY)

    ctx.fillText(
      rangeFrom - ((rangeFrom - rangeTo) / intermediateLanes) * i,
      chartWidth * 0.01,
      lineY + fontSize / 3
    )
  }
  ctx.stroke()
  ctx.setLineDash([])
  ctx.closePath()

  ctx.beginPath()
  ctx.strokeStyle = '#06D6A0'
  ctx.moveTo(chartWidth * 0.05, chartWindowBegins)
  ctx.lineTo(chartWidth * 0.97, chartWindowBegins)
  ctx.fillText(rangeFrom, chartWidth * 0.01, chartWindowBegins + fontSize / 3)
  ctx.stroke()
  ctx.closePath()

  ctx.beginPath()
  ctx.strokeStyle = '#EF476F'
  ctx.moveTo(chartWidth * 0.05, chartWindowEnds)
  ctx.lineTo(chartWidth * 0.97, chartWindowEnds)
  ctx.fillText(rangeTo, chartWidth * 0.01, chartWindowEnds + fontSize / 3)
  ctx.stroke()
  ctx.closePath()
}

function getChartCoordinates(altitude, distance, rangeFrom, rangeTo, distanceRange) {
  const plotXPadding = 100
  const minY = 0
  const maxY = chartHeight
  const yRatio = (chartWindowEnds - chartWindowBegins) / (rangeFrom - rangeTo)

  const minX = chartWidth * 0.05
  const maxX = chartWidth * 0.97

  const xRatio =
    (maxX - minX) / (distanceRange.max - distanceRange.min + 2 * plotXPadding)

  const y = Math.min(
    maxY,
    Math.max(minY, chartWindowBegins + (rangeFrom - altitude) * yRatio)
  )
  const x = Math.min(
    maxX,
    Math.max(minX, minX + (distance - distanceRange.min + plotXPadding) * xRatio)
  )

  return [x, y]
}

function drawPath(ctx, points, color, rangeFrom, rangeTo, distanceRange) {
  ctx.save()
  ctx.beginPath()
  ctx.lineWidth = 8
  ctx.strokeStyle = color

  ctx.shadowBlur = 4
  ctx.shadowColor = 'rgba(0, 0, 0, 0.14)'
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 3

  const { altitude: startAltitude, chartDistance: startDistance } = points[0]
  const [startX, startY] = getChartCoordinates(
    startAltitude,
    startDistance,
    rangeFrom,
    rangeTo,
    distanceRange
  )

  ctx.moveTo(startX, startY)
  points.forEach(point => {
    const { altitude, chartDistance } = point
    const [x, y] = getChartCoordinates(
      altitude,
      chartDistance,
      rangeFrom,
      rangeTo,
      distanceRange
    )

    ctx.lineTo(x, y)
  })

  ctx.stroke()
  ctx.closePath()

  const lastPoint = points[points.length - 1]
  const { altitude: lastAltitude, chartDistance: lastDistance } = lastPoint
  const [lastX, lastY] = getChartCoordinates(
    lastAltitude,
    lastDistance,
    rangeFrom,
    rangeTo,
    distanceRange
  )

  ctx.beginPath()
  ctx.lineWidth = 4
  ctx.arc(lastX, lastY, 12, 0, Math.PI * 2)
  ctx.stroke()
  ctx.closePath()

  ctx.restore()
}

function updateChart(ctx, paths, rangeFrom, rangeTo, distanceRange) {
  drawChart(ctx, rangeFrom, rangeTo)

  paths.forEach((points, idx) => {
    if (points.length === 0) return

    drawPath(ctx, points, colors[idx], rangeFrom, rangeTo, distanceRange)
  })
}

export { drawChart, updateChart }
