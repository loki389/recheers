"use client";

import React, { useEffect, useRef } from "react";
import echarts from "@/lib/echarts";

interface RadarChartProps {
  data: Array<{ name: string; value: number }>;
}

export function RadarChart({ data }: RadarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const option = {
      title: {
        text: "工具拥有率",
        left: "center",
        textStyle: {
          fontSize: 16,
          fontWeight: 600,
        },
      },
      tooltip: {
        trigger: "item",
      },
      radar: {
        indicator: data.map((item) => ({
          name: item.name,
          max: 100,
        })),
        radius: "70%",
      },
      series: [
        {
          name: "工具拥有率",
          type: "radar",
          data: [
            {
              value: data.map((item) => item.value),
              name: "拥有率 (%)",
              areaStyle: {
                color: "rgba(84, 112, 198, 0.3)",
              },
              itemStyle: {
                color: "#5470c6",
              },
            },
          ],
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
      aria-label="工具拥有率雷达图"
    />
  );
}

