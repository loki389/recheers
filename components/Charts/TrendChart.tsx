"use client";

import React, { useEffect, useRef } from "react";
import echarts from "@/lib/echarts";

interface TrendChartProps {
  data: Array<{ month: string; count: number }>;
}

export function TrendChart({ data }: TrendChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const option = {
      title: {
        text: "月度趋势",
        left: "center",
        textStyle: {
          fontSize: 16,
          fontWeight: 600,
        },
      },
      tooltip: {
        trigger: "axis",
        formatter: (params: unknown) => {
          const param = Array.isArray(params) && params[0] ? params[0] as { name: string; seriesName: string; value: number } : null;
          return param ? `${param.name}<br/>${param.seriesName}: ${param.value}人` : '';
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data.map((item) => item.month),
      },
      yAxis: {
        type: "value",
        name: "人数",
      },
      series: [
        {
          name: "调研人数",
          type: "line",
          data: data.map((item) => item.count),
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(84, 112, 198, 0.3)" },
              { offset: 1, color: "rgba(84, 112, 198, 0.1)" },
            ]),
          },
          itemStyle: {
            color: "#5470c6",
          },
          lineStyle: {
            width: 3,
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
      aria-label="月度趋势折线图"
    />
  );
}

