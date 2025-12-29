"use client";

import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface ParameterRadarChartProps {
  data: Record<string, number>;
}

export function ParameterRadarChart({ data }: ParameterRadarChartProps) {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Sample Parameters',
        data: Object.values(data),
        backgroundColor: 'rgba(84, 139, 47, 0.2)',
        borderColor: 'rgba(84, 139, 47, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(84, 139, 47, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(84, 139, 47, 1)',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        suggestedMin: 0,
        ticks: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="w-full max-w-[400px] mx-auto">
      <Radar data={chartData} options={options} />
    </div>
  );
}
