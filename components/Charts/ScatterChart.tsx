"use client";

import React, { useEffect, useRef } from "react";
import echarts from "@/lib/echarts";

interface ScatterChartProps {
  data: number[][];
}

export function ScatterChart({ data }: ScatterChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const option = {
      title: {
        text: "频率与花费",
        left: "center",
        textStyle: {
          fontSize: 16,
          fontWeight: 600,
        },
      },
      tooltip: {
        trigger: "item",
        formatter: (params: unknown) => {
          const param = params as { value: [number, number] } | null;
          return param ? `频率: ${param.value[0]}次/周<br/>花费: ¥${param.value[1]}` : '';
        },
      },
      xAxis: {
        type: "value",
        name: "每周频率",
        nameLocation: "middle",
        nameGap: 30,
      },
      yAxis: {
        type: "value",
        name: "平均花费 (¥)",
        nameLocation: "middle",
        nameGap: 50,
      },
      series: [
        {
          name: "频率与花费",
          type: "scatter",
          data: data,
          symbolSize: (value: number[]) => {
            return Math.max(8, Math.min(20, value[1] / 2));
          },
          itemStyle: {
            color: "#5470c6",
            opacity: 0.6,
          },
        },
      ],
    };

    chartInstanceRef.current.setOption(option);

    const handleResize = () => {
      chartInstanceRef.current?.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, [data]);

  return (
    <div
      ref={chartRef}
      className="w-full h-[400px]"
      role="img"
      aria-label="频率与花费散点图"
    />
  );
}

