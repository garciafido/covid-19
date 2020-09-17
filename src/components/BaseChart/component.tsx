import React from 'react'
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend, ResponsiveContainer, Area, ComposedChart
} from 'recharts';


function patch(data: any,
               withObservation: boolean, withMean2: boolean, withMean3: boolean,
               minValue: number) {
  const newData = [];
  for (const row of data) {
    const newRow: any = {};
    newData.push(newRow);
    if (withObservation) {
        newRow["observation"] = row.observation >= minValue ? row.observation : minValue;
    }
    newRow.mean = row.mean < minValue ? minValue : row.mean;
    newRow.ensemble = [
          row.ensemble[0] < minValue ? minValue : row.ensemble[0],
          row.ensemble[1] < minValue ? minValue : row.ensemble[1],
      ];

    if (withMean2) {
      newRow.mean2 = row.mean2 < minValue ? minValue : row.mean2;
      newRow.ensemble2 = [
            row.ensemble2[0] < minValue ? minValue : row.ensemble2[0],
            row.ensemble2[1] < minValue ? minValue : row.ensemble2[1],
        ];
    }

    if (withMean3) {
      newRow.mean3 = row.mean3 < minValue ? minValue : row.mean3;
      newRow.ensemble3 = [
            row.ensemble3[0] < minValue ? minValue : row.ensemble3[0],
            row.ensemble3[1] < minValue ? minValue : row.ensemble3[1],
        ];
    }
  }
  return newData;
}

const BaseChart = (props: any) => {
  const logarithmic = (props.minMax[1] - props.minMax[0]) > 5000;
  const minValue = Math.max(1, props.minMax[0]);
  const yAxis = logarithmic ?
      <YAxis allowDecimals={false} scale="log"
             domain={[minValue, props.minMax[1]]} />
      : <YAxis allowDecimals={false} scale="linear" domain={props.minMax} />

  let data = props.data;

  const withObservation = 'observation' in data[0];
  const withMean2 = 'mean2' in data[0];
  const withMean3 = 'mean3' in data[0];

  if (logarithmic) {
    data = patch(data, withObservation, withMean2, withMean3, minValue);
  }

  const observation = withObservation ?
      <Line type="monotone" dataKey="observation" name="Observación" stroke="#ff0000" strokeDasharray="3 4 5 2"
            activeDot={{onClick: (payload: any) => {props.onClick({type: payload.dataKey, date: props.data[payload.index].date})} }}
            dot={false}
      />
      : <div/>;

  const mean2 = withMean2 ?
          <Line type="monotone" dataKey="mean2" name="Optimista" stroke="#11BBFF" dot={false}
                activeDot={{r:8, onClick: (payload: any) => {props.onClick(
                    {type: payload.dataKey, date: props.data[payload.index].date})} }} />
      : <div/>;

  const ensemble2 = withMean2 ?
        <Area type="monotone" dataKey="ensemble2" name=" " fill="#C7BDC6" stroke="#C7BDC6" dot={false}
              activeDot={{onClick: (payload: any) => {props.onClick({type: payload.dataKey, date: props.data[payload.index].date})} }} />
      : <div/>;

  const mean3 = withMean3 ?
          <Line type="monotone" dataKey="mean3" name="Pesimista" stroke="#BB11FF" dot={false}
                activeDot={{r:8, onClick: (payload: any) => {props.onClick({type: payload.dataKey, date: props.data[payload.index].date})} }} />
      : <div/>;

  const ensemble3 = withMean3 ?
        <Area type="monotone" dataKey="ensemble3" name=" " fill="#C7BDC6" stroke="#C7BDC6" dot={false}
              activeDot={{onClick: (payload: any) => {props.onClick({type: payload.dataKey, date: props.data[payload.index].date})} }} />
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

          {ensemble3}
          {ensemble2}
          <Area type="monotone" dataKey="ensemble" name="Desviación estándar" fill="#C7BDC6" stroke="#C7BDC6" dot={false}
                activeDot={{onClick: (payload: any) => {props.onClick({type: payload.dataKey, date: props.data[payload.index].date})} }} />

          {mean3}
          <Line type="monotone" dataKey="mean" name="Media" stroke="#3300FF" dot={false}
                activeDot={{r:8, onClick: (payload: any) => {props.onClick({type: payload.dataKey, date: props.data[payload.index].date})} }} />
          {mean2}

          {observation}
        </ComposedChart>
    </ResponsiveContainer>
  </>
};

export { BaseChart };