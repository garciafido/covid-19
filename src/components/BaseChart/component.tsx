import React from 'react'
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend, ResponsiveContainer, Area, ComposedChart
} from 'recharts';


function patch(data: any, withObservation: boolean) {
  const newData = [];
  for (const row of data) {
    const minValue = 1;
    const newValue = {
      mean: row.mean < minValue ? minValue : row.mean,
      ensemble: [
          row.ensemble[0] < minValue ? minValue : row.ensemble[0],
          row.ensemble[1] < minValue ? minValue : row.ensemble[1],
      ],
      observation: withObservation && row.observation > minValue ? row.observation : minValue,
      show_date: row.show_date,
    }
    newData.push(newValue);
  }
  return newData;
}

const BaseChart = (props: any) => {
  const logarithmic = props.minMax[1] > 50000;
  const yAxis = logarithmic ?
      <YAxis allowDecimals={false} scale="log" domain={[1, props.minMax[1]]} />
      : <YAxis allowDecimals={false} scale="linear" domain={props.minMax} />

  let data = props.data;

  const withObservation = 'observation' in data[0];

  if (logarithmic) {
    data = patch(data, withObservation);
  }
  const observation = withObservation ?
      <Line type="monotone" dataKey="observation" name="Observación" stroke="#ff0000" strokeDasharray="3 4 5 2" dot={false} />
      : <div/>;

  return <>
    <ResponsiveContainer minWidth={props.width} aspect={2} minHeight={props.height}>
        <ComposedChart
          data={data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="show_date" minTickGap={30}>
          </XAxis>
          {yAxis}
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="ensemble" name="Ensamble" fill="#C7BDC6" stroke="#C7BDC6" dot={false} />
          {observation}
          <Line type="monotone" dataKey="mean" name="Media" stroke="#3300FF" dot={false} />
        </ComposedChart>
    </ResponsiveContainer>
  </>
};

export { BaseChart };