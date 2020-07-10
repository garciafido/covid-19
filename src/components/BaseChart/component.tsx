import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend, Label
} from 'recharts';
import { Grid } from "@material-ui/core";

const data = [
  {
    name: '03/01', Ens: 15, Mean: 12, Obs: 10,
  },
  {
    name: '04/01', Ens: 150, Mean: 125, Obs: 100,
  },
  {
    name: '05/01', Ens: 1500, Mean: 1250, Obs: 1000,
  },
  {
    name: '06/01', Ens: 8000, Mean: 8200, Obs: 8400,
  },
];

const BaseChart = (props: any) => (
    <Grid container>
      <Grid item xs={12}>
        {props.title}
      </Grid>
      <Grid item xs={12}>
        <LineChart
          width={props.width}
          height={props.height}
          data={data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name">
            <Label value="Time" offset={0} position="insideBottom" />
          </XAxis>
          <YAxis label={{ value: 'Cases', angle: -90, position: 'insideLeft' }}
                 scale="log" domain={['auto', 'auto']}
          />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Ens" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="Mean" stroke="#82ca9d" />
          <Line type="monotone" dataKey="Obs" stroke="#ff0000" />
        </LineChart>
      </Grid>
    </Grid>
);

export { BaseChart };