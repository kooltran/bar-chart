import React, { useState, useEffect } from 'react'

function getChartData(data, x, y, type) {
  if (!data) return []
  if (data.length === 0) return data
  const getDataXYValue = (value, key) => {
    if (!value) return null
    if (!Array.isArray(key) && typeof key !== 'string') {
      return null
    }
    if (Array.isArray(key)) {
      return key.map(k => ({
        key: k,
        value: value[k]
      }))
    }
    return value
  }
  return data.map((dataItem, idx) => {
    let xData, yData
    if (x) {
      xData = {
        value: type === 'horizontal' ? getDataXYValue(dataItem, x) : null,
        label: dataItem.label || '',
        key: x
      }
    }
    if (y) {
      yData = {
        value: type === 'vertical' ? getDataXYValue(dataItem, y) : null,
        label: dataItem.label || '',
        key: y
      }
    }
    const result = {
      x: xData,
      y: yData
    }
    return result
  })
}

const Chart = ({ data, x, y, type, parentWidth, parentHeight, interval }) => {
  const [chartData, setChartData] = useState(getChartData(data, x, y, type))
  const [xAxisHeight, setXAxisHeight] = useState(0)
  const [yAxisWidth, setYAxisWidth] = useState(0)
  const xAxisRef = React.createRef()
  const yAxisRef = React.createRef()
  const isVertical = type === 'vertical'
  console.log(parentHeight, 'parentHeight')
  useEffect(() => {
    if (xAxisRef.current) {
      setXAxisHeight(xAxisRef.current.getBBox().height)
    }

    if (yAxisRef.current) {
      setYAxisWidth(yAxisRef.current.getBBox().width)
    }
  }, [])

  console.log(xAxisHeight, 'xAxisHeight')

  const getChartValue = () => {
    const chartValueData = []
    const dataLength = chartData.length
    const totalValues = chartData.map(item => {
      return item.y.value.reduce((acc, val) => acc + val.value, 0)
    })
    const maxChartVal = Math.max(...totalValues)

    const ratio = (isVertical ? parentHeight - 40 : parentWidth) / maxChartVal

    const chartValues = {}

    for (let i = 0; i < interval; i++) {
      const unit = (ratio * maxChartVal) / (interval - 1)

      chartValues.pos = parentHeight - (ratio * maxChartVal - unit * i)
      chartValues.label = Math.round(maxChartVal - (i * unit) / ratio)
      chartValueData.push({ ...chartValues })
    }
    return chartValueData
  }

  const getChartLabelVal = () => {
    const chartLabelData = []
    const labelData = {}

    const MIN_WIDTH_BAR_ITEM = 5
    const BASE_WIDTH_BAR_ITEM = 32
    const MIN_SPACE_BAR_ITEM = 2
    const maxBarItems = Math.round(
      parentWidth / (MIN_WIDTH_BAR_ITEM + MIN_SPACE_BAR_ITEM)
    )
    const spaceBarItem = (parentWidth - 20 - 40) / (chartData.length - 1)

    for (let i = 0; i < chartData.length; i++) {
      if (i === 0) {
        labelData.pos = 20
      } else if (i === chartData.length - 1) {
        labelData.pos = parentWidth - 40
      } else {
        labelData.pos = 20 + spaceBarItem * i
      }

      labelData.label = chartData[i].x.label
      chartLabelData.push({ ...labelData })
    }

    return chartLabelData
  }

  const valueAxis = getChartValue()
  const labelAxis = getChartLabelVal()

  return (
    <svg width={parentWidth + yAxisWidth} height={parentHeight + xAxisHeight}>
      <g transform={`translate(${yAxisWidth}, ${xAxisHeight})`}>
        <g className='x-axis' ref={xAxisRef}>
          {labelAxis.map((item, idx) => {
            return (
              <g
                key={idx}
                transform={`translate(${item.pos}, ${parentHeight})`}
              >
                <line
                  x2='0'
                  y2={`-${xAxisHeight}`}
                  style={{ stroke: '#333' }}
                />
                <text fontSize='.825rem' textAnchor='start'>
                  {item.label}
                </text>
              </g>
            )
          })}
          <line
            x1={0}
            y1={parentHeight - xAxisHeight}
            x2={parentWidth}
            y2={parentHeight - xAxisHeight}
            style={{ stroke: '#333' }}
          />
        </g>

        <g className='y-axis' ref={yAxisRef}>
          {valueAxis.map((item, idx) => {
            return (
              <g
                key={idx}
                transform={`translate(0, ${item.pos - xAxisHeight})`}
              >
                <g transform={`translate(-${yAxisWidth}, 0)`}>
                  <text ref={xAxisRef} fontSize='.825rem' textAnchor='start'>
                    {item.label}
                  </text>
                </g>
              </g>
            )
          })}
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={parentHeight - xAxisHeight}
            style={{ stroke: '#333' }}
          />
        </g>
      </g>
    </svg>
  )
}

export default Chart
