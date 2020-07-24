import React from 'react'
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend, ResponsiveContainer, Area, ComposedChart
} from 'recharts';


const BaseChart = (props: any) => {
  const yAxis = props.minMax[1] > 10000 ?
      <YAxis allowDecimals={false} scale="log" domain={['auto', 'auto']} />
      : <YAxis allowDecimals={false} scale="linear" domain={props.minMax} />

  const withObservation = 'observation' in props.data[0];
  const observation = withObservation ?
      <Line type="monotone" dataKey="observation" name="Observación" stroke="#3300FF" dot={false} />
      : <div/>;

  return <>
    <ResponsiveContainer minWidth={props.width} aspect={2} minHeight={props.height}>
        <ComposedChart
          data={props.data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" minTickGap={30}>
          </XAxis>
          {yAxis}
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="ensemble" name="Ensamble" stroke="#CCCCCC" dot={false} />
          {observation}
          <Line type="monotone" dataKey="mean" name="Media" stroke="#ff0000" dot={false} />
        </ComposedChart>
    </ResponsiveContainer>
  </>
};

export { BaseChart };