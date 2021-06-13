import React from "react";
import { Chart } from "react-charts";
import AspectRatio from "./AspectRatio";
import './Chart.css';

const series = {
  type: "area"
};

const axes = [
  { primary: true, position: "bottom", type: "linear", format: value => `${value} (${2021 + parseInt(value, 10)})` },
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
  ];
  return (
    <AspectRatio ratio={0.45}>
      <div style={{width: 'calc(100% - 21px)', height: '100%', margin: '0 21px 0 0px'}}>
        <Chart data={data} series={series} axes={axes} tooltip/>
      </div>
    </AspectRatio>
  );
});

export default AreaChart;
