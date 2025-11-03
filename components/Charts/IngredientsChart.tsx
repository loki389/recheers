"use client";

import React, { useEffect, useRef } from "react";
import echarts from "@/lib/echarts";

interface IngredientsChartProps {
  data: Array<{ name: string; value: number }>;
}

export function IngredientsChart({ data }: IngredientsChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const option = {
      title: {
        text: "原料 Top10",
        left: "center",
        textStyle: {
          fontSize: 16,
          fontWeight: 600,
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: (params: unknown) => {
          const param = Array.isArray(params) && params[0] ? params[0] as { name: string; seriesName: string; value: number } : null;
          return param ? `${param.name}<br/>${param.seriesName}: ${param.value}次` : '';
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        name: "使用次数",
      },
      yAxis: {
        type: "category",
        data: data.map((item) => item.name).reverse(),
        inverse: true,
      },
      series: [
        {
          name: "使用次数",
          type: "bar",
          data: data.map((item) => item.value).reverse(),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: "#5470c6" },
              { offset: 1, color: "#91cc75" },
            ]),
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
      aria-label="原料 Top10 条形图"
    />
  );
}

