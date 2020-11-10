import React from 'react'
import {
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend, ResponsiveContainer, Area, ComposedChart
} from 'recharts';
import {getReferenceArea} from "../common";

const range = (start: number, stop: number, step: number): number[] => {
    const result = [];
    for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }
    return result;
};

const MultiChart = (props: any) => {
  const logarithmic = (props.minMax[1] - props.minMax[0]) > 5000;
  const minMax: [number, number] = [Math.max(logarithmic ? 1 : 0,  props.minMax[0]), props.minMax[1]];
    const yAxis = logarithmic ?
      <YAxis allowDecimals={false} scale="log"
             domain={minMax}
             label={{
               angle: -90,
               x:0,
               y:0,
               dx:-60,
               offset:0,
               value: props.yLabel}}
      />
      : <YAxis allowDecimals={false} scale="linear" domain={minMax}
             label={{
               angle: -90,
               x:0,
               y:0,
               dx:-60,
               offset:0,
               value: props.yLabel}}
      />;

  const lines = [];
  let max_length = 0;
  const xDates: any = [];
  const yData: any = {};
  let index = 0;

  for (let key in props.multiData) {
      let data = props.multiData[key];
      yData[key] = {};
      for (let i=0; i < data.length; i++) {
          yData[key][data[i].show_date] = data[i].mean < minMax[0] ? minMax[0] : data[i].mean;
          if (xDates.indexOf(data[i].date) < 0) {
            xDates.push(data[i].date);
          }
      }
      if (max_length < props.multiData[key].length) {
          max_length = props.multiData[key].length;
      }
      lines.push(
          <Area type="monotone"
                dataKey={(data) => yData[key][xData[data]]}
                key={key}
                name={key}
                strokeWidth={3}
                activeDot={{r:8, onClick: (payload: any) => {props.onClick(
                    {type: payload.dataKey, date: xDates[payload.index]})} }}
                stroke={props.multiChartColors[key]}
                fill={props.multiChartColors[key]}
                dot={false} />
      );
      index++;
  }

  xDates.sort();
  const xData = xDates.map((val: string) => {
      const lDate = val.split('-');
      return `${lDate[2]}/${lDate[1]}`;
  });
  const xIndexes: any[] = range(0, xData.length, 1);

  const constantLine = props.constantLine ?
      <Line type="monotone" dataKey={(data) => props.constantLine} name={props.constantLabel} strokeWidth={1}
            stroke="#000000" strokeDasharray="3 4 5 2"
            activeDot={{onClick: (payload: any) => {props.onClick(
                    {type: payload.dataKey, date: xDates[payload.index]})} }}
            dot={false}
      />
      : <div/>;


  let referenceLine = <div/>;
  let referenceArea = <div/>;
  if (props.referenceValue) {
      const lineArea = getReferenceArea(
          props.referenceValue,
          props.referenceLabel,
          xData[0],
          props.referenceAreaValue,
          minMax);
      referenceLine = lineArea.referenceLine;
      referenceArea = lineArea.referenceArea;
  }

  return <>
    <ResponsiveContainer minWidth={props.width} aspect={2} minHeight={props.height}>
        <ComposedChart
          data={xIndexes}
          onClick={payload => {if (payload && payload.activePayload) {
              props.onClick({type: "mean", date: xDates[payload.activePayload[0].payload]})
          }}}
          margin={{
            top: 5, right: 10, left: 40, bottom: 5,
          }}
        >
          {referenceArea}
          <CartesianGrid strokeDasharray="3 3" />
          } />
          <XAxis dataKey={(i: any) => xData[i]} minTickGap={30} >
          </XAxis>
          {yAxis}
          <Tooltip />
          <Legend />
          {lines}

          {constantLine}
          {referenceLine}
        </ComposedChart>
    </ResponsiveContainer>
  </>
};

export {MultiChart};
