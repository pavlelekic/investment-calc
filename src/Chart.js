import React from "react";
import { Chart } from "react-charts";
import AspectRatio from "./AspectRatio";

const series = {
  type: "area"
};

const axes = [
  { primary: true, position: "bottom", type: "linear" },
  { position: "left", type: "linear", stacked: true }
];

const AreaChart = React.memo(({ calculatedInvestments }) => {
  const data = [
    {
      label: 'Starting sum', 
      data: calculatedInvestments.map(({ initialSum }, index) => ({
        primary: index + 1,
        secondary: initialSum
      }))
    },
    {
      label: 'Monthly investments', 
      data: calculatedInvestments.map(({ monthlyInvestmentsSum }, index) => ({
        primary: index + 1,
        secondary: monthlyInvestmentsSum
      }))
    },
    {
      label: 'Total', 
      data: calculatedInvestments.map(({ initialSum, monthlyInvestmentsSum }, index) => ({
        primary: index + 1,
        secondary: initialSum + monthlyInvestmentsSum
      }))
    },
  ];
  return (
    <AspectRatio ratio={0.45}>
      <Chart data={data} series={series} axes={axes} tooltip />
    </AspectRatio>
  );
});

export default AreaChart;
