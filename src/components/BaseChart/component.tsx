import React from 'react'
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend, Label, ResponsiveContainer, Area, ComposedChart
} from 'recharts';

const rangeData = [
  {
    "day": "03/01",
    "ensamble": [
      10,
      15
    ],
    "media": 12.5,
    "observación": 11,
  },
  {
    "day": "04-01",
    "ensamble": [
      90,
      180
    ],
    "media": 130,
    "observación": 110,
  },
  {
    "day": "05-01",
    "ensamble": [
      899,
      1666
    ],
    "media": 1367,
    "observación": 1100,
  },
  {
    "day": "06-01",
    "ensamble": [
      7000,
      19000
    ],
    "media": 11000,
    "observación": 10000,
  },
]

const BaseChart = (props: any) => (
    <ResponsiveContainer minWidth={props.width} aspect={2} minHeight={props.height}>
        <ComposedChart
          data={rangeData}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name">
            <Label value="Tiempo" offset={0} position="insideBottom" />
          </XAxis>
          <YAxis label={{ value: 'Casos', angle: -90, position: 'insideLeft' }}
                 scale="log" domain={['auto', 'auto']}
          />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="observación" stroke="#3300FF" activeDot={{ r: 8 }} />
          <Area type="monotone" dataKey="ensamble" stroke="#CCCCCC"/>
          <Line type="monotone" dataKey="media" stroke="#ff0000" />
        </ComposedChart>
    </ResponsiveContainer>
);

export { BaseChart };