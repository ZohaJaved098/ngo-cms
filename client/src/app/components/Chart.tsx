// chart-setup.ts
"use client";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement, // needed for Doughnut / Pie
  Tooltip,
  Legend,
  Title,
  CategoryScale, // needed for Bar
  LinearScale,
  BarElement // needed for Bar
);
import dynamic from "next/dynamic";
import { ChartData, ChartOptions } from "chart.js";
import React from "react";

// lazy imports with proper typing
const DoughnutChart = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Doughnut),
  { ssr: false }
);

const BarChart = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Bar),
  { ssr: false }
);

type DoughnutData = ChartData<"doughnut">;
type BarData = ChartData<"bar">;
type DoughnutOptions = ChartOptions<"doughnut">;
type BarOptions = ChartOptions<"bar">;

type ChartProps =
  | {
      type: "doughnut";
      data: DoughnutData;
      options?: DoughnutOptions;
      className?: string;
    }
  | {
      type: "bar";
      data: BarData;
      options?: BarOptions;
      className?: string;
    };

const Chart: React.FC<ChartProps> = ({ type, data, options, className }) => {
  if (type === "doughnut") {
    return (
      <DoughnutChart data={data} options={options} className={className} />
    );
  }
  if (type === "bar") {
    return <BarChart data={data} options={options} className={className} />;
  }
  return null;
};

export default Chart;
