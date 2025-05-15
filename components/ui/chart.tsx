"use client"

import { useEffect, useRef } from "react"

interface ChartProps {
  data: any[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  className?: string
  yAxisWidth?: number
  showLegend?: boolean
}

export const BarChart = ({
  data,
  index,
  categories,
  colors,
  valueFormatter,
  className,
  yAxisWidth = 40,
}: ChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current || !data.length) return

    const container = chartRef.current
    container.innerHTML = ""

    // Find max value for scaling
    const maxValue = Math.max(...data.map((item) => Math.max(...categories.map((cat) => item[cat] || 0))))
    const chartHeight = 300
    const chartWidth = container.clientWidth - yAxisWidth
    const barWidth = Math.max(10, chartWidth / data.length - 10)

    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("width", "100%")
    svg.setAttribute("height", `${chartHeight + 50}px`)
    svg.style.overflow = "visible"

    // Create Y-axis
    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line")
    yAxis.setAttribute("x1", `${yAxisWidth}`)
    yAxis.setAttribute("y1", "0")
    yAxis.setAttribute("x2", `${yAxisWidth}`)
    yAxis.setAttribute("y2", `${chartHeight}`)
    yAxis.setAttribute("stroke", "currentColor")
    yAxis.setAttribute("stroke-opacity", "0.2")
    svg.appendChild(yAxis)

    // Create X-axis
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line")
    xAxis.setAttribute("x1", `${yAxisWidth}`)
    xAxis.setAttribute("y1", `${chartHeight}`)
    xAxis.setAttribute("x2", `${chartWidth + yAxisWidth}`)
    xAxis.setAttribute("y2", `${chartHeight}`)
    xAxis.setAttribute("stroke", "currentColor")
    xAxis.setAttribute("stroke-opacity", "0.2")
    svg.appendChild(xAxis)

    // Add Y-axis labels
    for (let i = 0; i <= 4; i++) {
      const value = maxValue * (1 - i / 4)
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text")
      label.setAttribute("x", `${yAxisWidth - 5}`)
      label.setAttribute("y", `${(i * chartHeight) / 4 + 5}`)
      label.setAttribute("text-anchor", "end")
      label.setAttribute("font-size", "10")
      label.setAttribute("fill", "currentColor")
      label.textContent = valueFormatter ? valueFormatter(value) : value.toFixed(1)
      svg.appendChild(label)

      // Add horizontal grid line
      const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line")
      gridLine.setAttribute("x1", `${yAxisWidth}`)
      gridLine.setAttribute("y1", `${(i * chartHeight) / 4}`)
      gridLine.setAttribute("x2", `${chartWidth + yAxisWidth}`)
      gridLine.setAttribute("y2", `${(i * chartHeight) / 4}`)
      gridLine.setAttribute("stroke", "currentColor")
      gridLine.setAttribute("stroke-opacity", "0.1")
      gridLine.setAttribute("stroke-dasharray", "2,2")
      svg.appendChild(gridLine)
    }

    // Create bars for each category
    categories.forEach((category, categoryIndex) => {
      data.forEach((item, index) => {
        const value = item[category] || 0
        const barHeight = (value / maxValue) * chartHeight
        const x = yAxisWidth + index * (chartWidth / data.length) + (barWidth * categoryIndex) / categories.length
        const y = chartHeight - barHeight

        const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect")
        bar.setAttribute("x", `${x + 5}`)
        bar.setAttribute("y", `${y}`)
        bar.setAttribute("width", `${barWidth / categories.length - 2}`)
        bar.setAttribute("height", `${barHeight}`)
        bar.setAttribute("fill", colors[categoryIndex % colors.length])
        bar.setAttribute("rx", "2")

        // Add tooltip on hover
        bar.addEventListener("mouseover", (e) => {
          const tooltip = document.createElement("div")
          tooltip.className = "chart-tooltip"
          tooltip.style.position = "absolute"
          tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.8)"
          tooltip.style.color = "white"
          tooltip.style.padding = "5px 10px"
          tooltip.style.borderRadius = "4px"
          tooltip.style.fontSize = "12px"
          tooltip.style.pointerEvents = "none"
          tooltip.style.zIndex = "10"
          tooltip.style.whiteSpace = "nowrap"

          const formattedValue = valueFormatter ? valueFormatter(value) : value.toFixed(1)
          tooltip.textContent = `${item[index]}: ${category} - ${formattedValue}`

          document.body.appendChild(tooltip)

          const updateTooltipPosition = (e: MouseEvent) => {
            tooltip.style.left = `${e.pageX + 10}px`
            tooltip.style.top = `${e.pageY - 25}px`
          }

          updateTooltipPosition(e as unknown as MouseEvent)

          bar.addEventListener("mousemove", updateTooltipPosition as EventListener)

          bar.addEventListener(
            "mouseleave",
            () => {
              document.body.removeChild(tooltip)
              bar.removeEventListener("mousemove", updateTooltipPosition as EventListener)
            },
            { once: true },
          )
        })

        svg.appendChild(bar)
      })
    })

    // Add X-axis labels
    data.forEach((item, index) => {
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text")
      label.setAttribute("x", `${yAxisWidth + index * (chartWidth / data.length) + barWidth / 2}`)
      label.setAttribute("y", `${chartHeight + 20}`)
      label.setAttribute("text-anchor", "middle")
      label.setAttribute("font-size", "10")
      label.setAttribute("fill", "currentColor")
      label.textContent = item[index] || ""
      svg.appendChild(label)
    })

    // Add legend if multiple categories
    if (categories.length > 1) {
      const legendContainer = document.createElement("div")
      legendContainer.style.display = "flex"
      legendContainer.style.justifyContent = "center"
      legendContainer.style.gap = "16px"
      legendContainer.style.marginTop = "8px"

      categories.forEach((category, index) => {
        const legendItem = document.createElement("div")
        legendItem.style.display = "flex"
        legendItem.style.alignItems = "center"
        legendItem.style.gap = "4px"

        const colorBox = document.createElement("div")
        colorBox.style.width = "12px"
        colorBox.style.height = "12px"
        colorBox.style.backgroundColor = colors[index % colors.length]
        colorBox.style.borderRadius = "2px"

        const label = document.createElement("span")
        label.style.fontSize = "12px"
        label.textContent = category

        legendItem.appendChild(colorBox)
        legendItem.appendChild(label)
        legendContainer.appendChild(legendItem)
      })

      container.appendChild(legendContainer)
    }

    container.appendChild(svg)
  }, [data, index, categories, colors, valueFormatter, yAxisWidth])

  return <div ref={chartRef} className={`bar-chart ${className || ""}`} style={{ minHeight: "300px" }}></div>
}

export const LineChart = ({
  data,
  index,
  categories,
  colors,
  valueFormatter,
  className,
  yAxisWidth = 40,
}: ChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current || !data.length) return

    const container = chartRef.current
    container.innerHTML = ""

    // Find max value for scaling
    const maxValue = Math.max(...data.map((item) => Math.max(...categories.map((cat) => item[cat] || 0))))
    const chartHeight = 300
    const chartWidth = container.clientWidth - yAxisWidth

    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("width", "100%")
    svg.setAttribute("height", `${chartHeight + 50}px`)
    svg.style.overflow = "visible"

    // Create Y-axis
    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line")
    yAxis.setAttribute("x1", `${yAxisWidth}`)
    yAxis.setAttribute("y1", "0")
    yAxis.setAttribute("x2", `${yAxisWidth}`)
    yAxis.setAttribute("y2", `${chartHeight}`)
    yAxis.setAttribute("stroke", "currentColor")
    yAxis.setAttribute("stroke-opacity", "0.2")
    svg.appendChild(yAxis)

    // Create X-axis
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line")
    xAxis.setAttribute("x1", `${yAxisWidth}`)
    xAxis.setAttribute("y1", `${chartHeight}`)
    xAxis.setAttribute("x2", `${chartWidth + yAxisWidth}`)
    xAxis.setAttribute("y2", `${chartHeight}`)
    xAxis.setAttribute("stroke", "currentColor")
    xAxis.setAttribute("stroke-opacity", "0.2")
    svg.appendChild(xAxis)

    // Add Y-axis labels
    for (let i = 0; i <= 4; i++) {
      const value = maxValue * (1 - i / 4)
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text")
      label.setAttribute("x", `${yAxisWidth - 5}`)
      label.setAttribute("y", `${(i * chartHeight) / 4 + 5}`)
      label.setAttribute("text-anchor", "end")
      label.setAttribute("font-size", "10")
      label.setAttribute("fill", "currentColor")
      label.textContent = valueFormatter ? valueFormatter(value) : value.toFixed(1)
      svg.appendChild(label)

      // Add horizontal grid line
      const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line")
      gridLine.setAttribute("x1", `${yAxisWidth}`)
      gridLine.setAttribute("y1", `${(i * chartHeight) / 4}`)
      gridLine.setAttribute("x2", `${chartWidth + yAxisWidth}`)
      gridLine.setAttribute("y2", `${(i * chartHeight) / 4}`)
      gridLine.setAttribute("stroke", "currentColor")
      gridLine.setAttribute("stroke-opacity", "0.1")
      gridLine.setAttribute("stroke-dasharray", "2,2")
      svg.appendChild(gridLine)
    }

    // Create lines for each category
    categories.forEach((category, categoryIndex) => {
      const points: [number, number][] = data.map((item, index) => {
        const value = item[category] || 0
        const x = yAxisWidth + index * (chartWidth / (data.length - 1))
        const y = chartHeight - (value / maxValue) * chartHeight
        return [x, y]
      })

      // Create path for the line
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
      let pathData = `M ${points[0][0]} ${points[0][1]}`

      for (let i = 1; i < points.length; i++) {
        pathData += ` L ${points[i][0]} ${points[i][1]}`
      }

      path.setAttribute("d", pathData)
      path.setAttribute("fill", "none")
      path.setAttribute("stroke", colors[categoryIndex % colors.length])
      path.setAttribute("stroke-width", "2")
      svg.appendChild(path)

      // Add data points
      points.forEach(([x, y], index) => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
        circle.setAttribute("cx", `${x}`)
        circle.setAttribute("cy", `${y}`)
        circle.setAttribute("r", "4")
        circle.setAttribute("fill", colors[categoryIndex % colors.length])

        // Add tooltip on hover
        circle.addEventListener("mouseover", (e) => {
          const tooltip = document.createElement("div")
          tooltip.className = "chart-tooltip"
          tooltip.style.position = "absolute"
          tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.8)"
          tooltip.style.color = "white"
          tooltip.style.padding = "5px 10px"
          tooltip.style.borderRadius = "4px"
          tooltip.style.fontSize = "12px"
          tooltip.style.pointerEvents = "none"
          tooltip.style.zIndex = "10"
          tooltip.style.whiteSpace = "nowrap"

          const value = data[index][category] || 0
          const formattedValue = valueFormatter ? valueFormatter(value) : value.toFixed(1)
          tooltip.textContent = `${data[index][index]}: ${category} - ${formattedValue}`

          document.body.appendChild(tooltip)

          const updateTooltipPosition = (e: MouseEvent) => {
            tooltip.style.left = `${e.pageX + 10}px`
            tooltip.style.top = `${e.pageY - 25}px`
          }

          updateTooltipPosition(e as unknown as MouseEvent)

          circle.addEventListener("mousemove", updateTooltipPosition as EventListener)

          circle.addEventListener(
            "mouseleave",
            () => {
              document.body.removeChild(tooltip)
              circle.removeEventListener("mousemove", updateTooltipPosition as EventListener)
            },
            { once: true },
          )
        })

        svg.appendChild(circle)
      })
    })

    // Add X-axis labels
    data.forEach((item, index) => {
      const x = yAxisWidth + index * (chartWidth / (data.length - 1))
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text")
      label.setAttribute("x", `${x}`)
      label.setAttribute("y", `${chartHeight + 20}`)
      label.setAttribute("text-anchor", "middle")
      label.setAttribute("font-size", "10")
      label.setAttribute("fill", "currentColor")
      label.textContent = item[index] || ""
      svg.appendChild(label)
    })

    // Add legend if multiple categories
    if (categories.length > 1) {
      const legendContainer = document.createElement("div")
      legendContainer.style.display = "flex"
      legendContainer.style.justifyContent = "center"
      legendContainer.style.gap = "16px"
      legendContainer.style.marginTop = "8px"

      categories.forEach((category, index) => {
        const legendItem = document.createElement("div")
        legendItem.style.display = "flex"
        legendItem.style.alignItems = "center"
        legendItem.style.gap = "4px"

        const colorBox = document.createElement("div")
        colorBox.style.width = "12px"
        colorBox.style.height = "12px"
        colorBox.style.backgroundColor = colors[index % colors.length]
        colorBox.style.borderRadius = "2px"

        const label = document.createElement("span")
        label.style.fontSize = "12px"
        label.textContent = category

        legendItem.appendChild(colorBox)
        legendItem.appendChild(label)
        legendContainer.appendChild(legendItem)
      })

      container.appendChild(legendContainer)
    }

    container.appendChild(svg)
  }, [data, index, categories, colors, valueFormatter, yAxisWidth])

  return <div ref={chartRef} className={`line-chart ${className || ""}`} style={{ minHeight: "300px" }}></div>
}

export const PieChart = ({ data, index, categories, colors, valueFormatter, className }: ChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current || !data.length) return

    const container = chartRef.current
    container.innerHTML = ""

    const chartSize = Math.min(container.clientWidth, 300)
    const radius = chartSize / 2 - 10
    const centerX = chartSize / 2
    const centerY = chartSize / 2

    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("width", `${chartSize}px`)
    svg.setAttribute("height", `${chartSize}px`)

    // Calculate total value
    const total = data.reduce((sum, item) => sum + (item[categories[0]] || 0), 0)

    // Create pie slices
    let startAngle = 0

    data.forEach((item, i) => {
      const value = item[categories[0]] || 0
      const percentage = value / total
      const endAngle = startAngle + percentage * 2 * Math.PI

      // Calculate path
      const x1 = centerX + radius * Math.cos(startAngle)
      const y1 = centerY + radius * Math.sin(startAngle)
      const x2 = centerX + radius * Math.cos(endAngle)
      const y2 = centerY + radius * Math.sin(endAngle)

      const largeArcFlag = percentage > 0.5 ? 1 : 0

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        "Z",
      ].join(" ")

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
      path.setAttribute("d", pathData)
      path.setAttribute("fill", colors[i % colors.length])

      // Add hover effect
      path.addEventListener("mouseover", (e) => {
        path.setAttribute("opacity", "0.8")

        const tooltip = document.createElement("div")
        tooltip.className = "chart-tooltip"
        tooltip.style.position = "absolute"
        tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.8)"
        tooltip.style.color = "white"
        tooltip.style.padding = "5px 10px"
        tooltip.style.borderRadius = "4px"
        tooltip.style.fontSize = "12px"
        tooltip.style.pointerEvents = "none"
        tooltip.style.zIndex = "10"

        const formattedValue = valueFormatter ? valueFormatter(value) : value.toFixed(1)
        tooltip.textContent = `${item[index]}: ${formattedValue} (${(percentage * 100).toFixed(1)}%)`

        document.body.appendChild(tooltip)

        const updateTooltipPosition = (e: MouseEvent) => {
          tooltip.style.left = `${e.pageX + 10}px`
          tooltip.style.top = `${e.pageY - 25}px`
        }

        updateTooltipPosition(e as unknown as MouseEvent)

        path.addEventListener("mousemove", updateTooltipPosition as EventListener)

        path.addEventListener(
          "mouseleave",
          () => {
            path.setAttribute("opacity", "1")
            document.body.removeChild(tooltip)
            path.removeEventListener("mousemove", updateTooltipPosition as EventListener)
          },
          { once: true },
        )
      })

      svg.appendChild(path)

      // Update start angle for next slice
      startAngle = endAngle
    })

    container.appendChild(svg)

    // Add legend
    const legendContainer = document.createElement("div")
    legendContainer.style.display = "flex"
    legendContainer.style.flexDirection = "column"
    legendContainer.style.gap = "8px"
    legendContainer.style.marginTop = "16px"

    data.forEach((item, index) => {
      const legendItem = document.createElement("div")
      legendItem.style.display = "flex"
      legendItem.style.alignItems = "center"
      legendItem.style.gap = "8px"

      const colorBox = document.createElement("div")
      colorBox.style.width = "12px"
      colorBox.style.height = "12px"
      colorBox.style.backgroundColor = colors[index % colors.length]
      colorBox.style.borderRadius = "2px"

      const value = item[categories[0]] || 0
      const percentage = value / total
      const formattedValue = valueFormatter ? valueFormatter(value) : value.toFixed(1)

      const label = document.createElement("span")
      label.style.fontSize = "12px"
      label.textContent = `${item[index] || ""}: ${formattedValue} (${(percentage * 100).toFixed(1)}%)`

      legendItem.appendChild(colorBox)
      legendItem.appendChild(label)
      legendContainer.appendChild(legendItem)
    })

    container.appendChild(legendContainer)
  }, [data, index, categories, colors, valueFormatter, className])

  return <div ref={chartRef} className={`pie-chart ${className || ""}`} style={{ minHeight: "300px" }}></div>
}

interface ScatterChartProps {
  data: any[]
  xAxisKey: string
  yAxisKey: string
  sizeKey: string
  categoryKey: string
  colors: string[]
  valueFormatter?: {
    x?: (value: number) => string
    y?: (value: number) => string
    size?: (value: number) => string
  }
  className?: string
  showLegend?: boolean
}

export const ScatterChart = ({
  data,
  xAxisKey,
  yAxisKey,
  sizeKey,
  categoryKey,
  colors,
  valueFormatter,
  className,
  showLegend,
}: ScatterChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current || !data.length) return

    const container = chartRef.current
    container.innerHTML = ""

    // Find min and max values for scaling
    const xValues = data.map((item) => item[xAxisKey])
    const yValues = data.map((item) => item[yAxisKey])
    const sizeValues = data.map((item) => item[sizeKey])

    const xMin = Math.min(...xValues)
    const xMax = Math.max(...xValues)
    const yMin = Math.min(...yValues)
    const yMax = Math.max(...yValues)
    const sizeMin = Math.min(...sizeValues)
    const sizeMax = Math.max(...sizeValues)

    const chartHeight = 300
    const chartWidth = container.clientWidth - 60
    const padding = 40

    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("width", "100%")
    svg.setAttribute("height", `${chartHeight + padding * 2}px`)

    // Create axes
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line")
    xAxis.setAttribute("x1", `${padding}`)
    xAxis.setAttribute("y1", `${chartHeight + padding}`)
    xAxis.setAttribute("x2", `${chartWidth + padding}`)
    xAxis.setAttribute("y2", `${chartHeight + padding}`)
    xAxis.setAttribute("stroke", "currentColor")
    xAxis.setAttribute("stroke-opacity", "0.2")
    svg.appendChild(xAxis)

    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line")
    yAxis.setAttribute("x1", `${padding}`)
    yAxis.setAttribute("y1", `${padding}`)
    yAxis.setAttribute("x2", `${padding}`)
    yAxis.setAttribute("y2", `${chartHeight + padding}`)
    yAxis.setAttribute("stroke", "currentColor")
    yAxis.setAttribute("stroke-opacity", "0.2")
    svg.appendChild(yAxis)

    // Add grid lines
    for (let i = 1; i <= 4; i++) {
      // Horizontal grid lines
      const yPos = padding + (chartHeight / 4) * i
      const hGridLine = document.createElementNS("http://www.w3.org/2000/svg", "line")
      hGridLine.setAttribute("x1", `${padding}`)
      hGridLine.setAttribute("y1", `${yPos}`)
      hGridLine.setAttribute("x2", `${chartWidth + padding}`)
      hGridLine.setAttribute("y2", `${yPos}`)
      hGridLine.setAttribute("stroke", "currentColor")
      hGridLine.setAttribute("stroke-opacity", "0.1")
      hGridLine.setAttribute("stroke-dasharray", "2,2")
      svg.appendChild(hGridLine)

      // Vertical grid lines
      const xPos = padding + (chartWidth / 4) * i
      const vGridLine = document.createElementNS("http://www.w3.org/2000/svg", "line")
      vGridLine.setAttribute("x1", `${xPos}`)
      vGridLine.setAttribute("y1", `${padding}`)
      vGridLine.setAttribute("x2", `${xPos}`)
      vGridLine.setAttribute("y2", `${chartHeight + padding}`)
      vGridLine.setAttribute("stroke", "currentColor")
      vGridLine.setAttribute("stroke-opacity", "0.1")
      vGridLine.setAttribute("stroke-dasharray", "2,2")
      svg.appendChild(vGridLine)
    }

    // Add axis labels
    for (let i = 0; i <= 4; i++) {
      // X-axis labels
      const xValue = xMin + (xMax - xMin) * (i / 4)
      const xLabel = document.createElementNS("http://www.w3.org/2000/svg", "text")
      xLabel.setAttribute("x", `${padding + (chartWidth / 4) * i}`)
      xLabel.setAttribute("y", `${chartHeight + padding + 20}`)
      xLabel.setAttribute("text-anchor", "middle")
      xLabel.setAttribute("font-size", "10")
      xLabel.setAttribute("fill", "currentColor")
      xLabel.textContent = xValue.toFixed(2)
      svg.appendChild(xLabel)

      // Y-axis labels
      const yValue = yMax - (yMax - yMin) * (i / 4)
      const yLabel = document.createElementNS("http://www.w3.org/2000/svg", "text")
      yLabel.setAttribute("x", `${padding - 10}`)
      yLabel.setAttribute("y", `${padding + (chartHeight / 4) * i + 5}`)
      yLabel.setAttribute("text-anchor", "end")
      yLabel.setAttribute("font-size", "10")
      yLabel.setAttribute("fill", "currentColor")
      yLabel.textContent = yValue.toFixed(2)
      svg.appendChild(yLabel)
    }

    // Get unique categories
    const categories = Array.from(new Set(data.map((item) => item[categoryKey])))

    // Plot data points
    data.forEach((item) => {
      const x = padding + ((item[xAxisKey] - xMin) / (xMax - xMin)) * chartWidth
      const y = padding + chartHeight - ((item[yAxisKey] - yMin) / (yMax - yMin)) * chartHeight
      const size = 5 + ((item[sizeKey] - sizeMin) / (sizeMax - sizeMin)) * 15
      const categoryIndex = categories.indexOf(item[categoryKey])

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
      circle.setAttribute("cx", `${x}`)
      circle.setAttribute("cy", `${y}`)
      circle.setAttribute("r", `${size}`)
      circle.setAttribute("fill", colors[categoryIndex % colors.length])
      circle.setAttribute("opacity", "0.7")

      // Add hover effect
      circle.addEventListener("mouseover", (e) => {
        circle.setAttribute("opacity", "1")
        circle.setAttribute("stroke", "white")
        circle.setAttribute("stroke-width", "2")

        const tooltip = document.createElement("div")
        tooltip.className = "chart-tooltip"
        tooltip.style.position = "absolute"
        tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.8)"
        tooltip.style.color = "white"
        tooltip.style.padding = "5px 10px"
        tooltip.style.borderRadius = "4px"
        tooltip.style.fontSize = "12px"
        tooltip.style.pointerEvents = "none"
        tooltip.style.zIndex = "10"

        const xFormatted = valueFormatter?.x ? valueFormatter.x(item[xAxisKey]) : `${xAxisKey}: ${item[xAxisKey]}`
        const yFormatted = valueFormatter?.y ? valueFormatter.y(item[yAxisKey]) : `${yAxisKey}: ${item[yAxisKey]}`
        const sizeFormatted = valueFormatter?.size ? valueFormatter.size(item[sizeKey]) : `${sizeKey}: ${item[sizeKey]}`

        tooltip.innerHTML = `
          <div>${item.id || ""}</div>
          <div>${xFormatted}</div>
          <div>${yFormatted}</div>
          <div>${sizeFormatted}</div>
          <div>Category: ${item[categoryKey]}</div>
        `

        document.body.appendChild(tooltip)

        const updateTooltipPosition = (e: MouseEvent) => {
          tooltip.style.left = `${e.pageX + 10}px`
          tooltip.style.top = `${e.pageY - 25}px`
        }

        updateTooltipPosition(e as unknown as MouseEvent)

        circle.addEventListener("mousemove", updateTooltipPosition as EventListener)

        circle.addEventListener(
          "mouseleave",
          () => {
            circle.setAttribute("opacity", "0.7")
            circle.removeAttribute("stroke")
            document.body.removeChild(tooltip)
            circle.removeEventListener("mousemove", updateTooltipPosition as EventListener)
          },
          { once: true },
        )
      })

      svg.appendChild(circle)
    })

    container.appendChild(svg)

    // Add legend if showLegend is true
    if (showLegend) {
      const legendContainer = document.createElement("div")
      legendContainer.style.display = "flex"
      legendContainer.style.justifyContent = "center"
      legendContainer.style.gap = "16px"
      legendContainer.style.marginTop = "16px"

      categories.forEach((category, index) => {
        const legendItem = document.createElement("div")
        legendItem.style.display = "flex"
        legendItem.style.alignItems = "center"
        legendItem.style.gap = "8px"

        const colorBox = document.createElement("div")
        colorBox.style.width = "12px"
        colorBox.style.height = "12px"
        colorBox.style.backgroundColor = colors[index % colors.length]
        colorBox.style.borderRadius = "50%"
        colorBox.style.opacity = "0.7"

        const label = document.createElement("span")
        label.style.fontSize = "12px"
        label.textContent = category as string

        legendItem.appendChild(colorBox)
        legendItem.appendChild(label)
        legendContainer.appendChild(legendItem)
      })

      container.appendChild(legendContainer)
    }
  }, [data, xAxisKey, yAxisKey, sizeKey, categoryKey, colors, valueFormatter, showLegend])

  return <div ref={chartRef} className={`scatter-chart ${className || ""}`} style={{ minHeight: "300px" }}></div>
}
