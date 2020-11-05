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


function patch(data: any,
               minValue: number) {
  const newData = [];
  for (const row of data) {
    const newRow: any = {};
    newData.push(newRow);
    newRow.show_date = row.show_date;
    newRow.date = row.date;
    newRow.mean = row.mean < minValue ? minValue : row.mean;
  }
  return newData;
}

const range = (start: number, stop: number, step: number): number[] => {
    const result = [];
    for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }
    return result;
};

const MultiChart = (props: any) => {
  const logarithmic = (props.minMax[1] - props.minMax[0]) > 5000;
  const minValue = Math.max(1, props.minMax[0]);
  const yAxis = logarithmic ?
      <YAxis allowDecimals={false} scale="log"
             domain={[minValue, props.minMax[1]]}
             label={{
               angle: -90,
               x:0,
               y:0,
               dx:-60,
               offset:0,
               value: props.yLabel}}
      />
      : <YAxis allowDecimals={false} scale="linear" domain={props.minMax}
             label={{
               angle: -90,
               x:0,
               y:0,
               dx:-60,
               offset:0,
               value: props.yLabel}}
      />;

  const colors = [
      "#01579b",
      "#1abaa8",
      "#d861dd",
      "#ead968",
      "#9d0719",
  ]

  const getDataValue = (key: string, data: any) => {
      const values = props.multiData[key][data];
      return values ? values.mean : undefined;
  };

  const lines = [];
  let first_show_date;
  let data1: any = [];
  let index = 0;
  for (let key in props.multiData) {
      console.log(key);
      let data = props.multiData[key];
      if (data1.length < props.multiData[key].length) {
          data1 = range(0, props.multiData[key].length, 1);
      }
      if (logarithmic) {
          data = patch(data, minValue);
          props.multiData[key] = data;
      }
      first_show_date = data[0].show_date;
      lines.push(
          <Line type="monotone"
                dataKey={(data) => getDataValue(key, data)} key={key} name={key} strokeWidth={3}
                stroke={colors[index]} dot={false} />
      );
      index++;
  }

  let referenceLine = <div/>;
  let referenceArea = <div/>;
  if (props.referenceValue) {
      const lineArea = getReferenceArea(
          props.referenceValue,
          props.referenceLabel,
          first_show_date,
          props.referenceAreaValue,
          props.minMax);
      referenceLine = lineArea.referenceLine;
      referenceArea = lineArea.referenceArea;
  }

  return <>
    <ResponsiveContainer minWidth={props.width} aspect={2} minHeight={props.height}>
        <ComposedChart
          data={data1}
          onClick={payload => {if (payload && payload.activePayload) props.onClick({type: "mean", date: payload.activePayload[0].payload.date})}}
          margin={{
            top: 5, right: 10, left: 40, bottom: 5,
          }}
        >
          {referenceArea}
          <CartesianGrid strokeDasharray="3 3" />
          } />
          <XAxis dataKey="show_date" minTickGap={30} >
          </XAxis>
          {yAxis}
          <Tooltip />
          <Legend />
          {lines}

          {referenceLine}
        </ComposedChart>
    </ResponsiveContainer>
  </>
};

export {MultiChart};
