import React from 'react'
import {
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend, ResponsiveContainer, Area, ComposedChart, ReferenceArea
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
    newRow.show_date = row.show_date;
    newRow.date = row.date;
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
  const logarithmic = (props.minMax[1] - props.minMax[0]) > 500;
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
      />

  let data = props.data;

  const withObservation = 'observation' in data[0];
  const withMean2 = 'mean2' in data[0];
  const withMean3 = 'mean3' in data[0];

  const red = "#b71c1c";
  const green = "#1abaa8";
  const blue = "#01579b";

  if (logarithmic) {
    data = patch(data, withObservation, withMean2, withMean3, minValue);
  }

  if (props.constantLine) {
    data.map((v: any) => v["constant"] = props.constantLine);
  }

  const constantLine = props.constantLine ?
      <Line type="monotone" dataKey="constant" name={props.constantLabel} strokeWidth={1}
            stroke="#000000" strokeDasharray="3 4 5 2"
            activeDot={{onClick: (payload: any) => {props.onClick({type: payload.dataKey, date: props.data[payload.index].date})} }}
            dot={false}
      />
      : <div/>;

  const observation = withObservation ?
      <Line type="monotone" dataKey="observation" name="Observación" strokeWidth={3}
            stroke={red} strokeDasharray="3 4 5 2"
            activeDot={{onClick: (payload: any) => {props.onClick({type: payload.dataKey, date: props.data[payload.index].date})} }}
            dot={false}
      />
      : <div/>;

  const mean2 = withMean2 ?
          <Line type="monotone" dataKey="mean2" name="Optimista" strokeWidth={3}
                stroke={green} dot={false}
                activeDot={{r:8, onClick: (payload: any) => {props.onClick(
                    {type: payload.dataKey, date: props.data[payload.index].date})} }} />
      : <div/>;

  const ensemble2 = withMean2 ?
        <Area type="monotone" dataKey="ensemble2" legendType={"none"} name=" " fillOpacity="0.3"
              fill={green} stroke={green} strokeWidth={0} dot={false}
              activeDot={{onClick: (payload: any) => {props.onClick({type: payload.dataKey, date: props.data[payload.index].date})} }} />
      : <div/>;

  const mean3 = withMean3 ?
          <Line type="monotone" dataKey="mean3" name="Pesimista" strokeWidth={3}
                stroke={red} dot={false}
                activeDot={{r:8, onClick: (payload: any) => {props.onClick({type: payload.dataKey, date: props.data[payload.index].date})} }} />
      : <div/>;

  const ensemble3 = withMean3 ?
        <Area type="monotone" dataKey="ensemble3" strokeWidth={0} legendType={"none"} name=" " fillOpacity="0.3"
              fill={red} stroke={red} dot={false}
              activeDot={{onClick: (payload: any) => {props.onClick({type: payload.dataKey, date: props.data[payload.index].date})} }} />
      : <div/>;

  const referenceVerticalLine = props.referenceValue ?
      <ReferenceArea x1={data[0].show_date} x2={props.referenceValue}
                     y1={props.minMax[0]} y2={props.minMax[1]}
                     label={props.referenceLabel}
                     stroke="" strokeOpacity={0.3} />
      : <div/>;

  return <>
    <ResponsiveContainer minWidth={props.width} aspect={2} minHeight={props.height}>
        <ComposedChart
          data={data}
          onClick={payload => {if (payload && payload.activePayload) props.onClick({type: "mean", date: payload.activePayload[0].payload.date})}}
          margin={{
            top: 5, right: 10, left: 40, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip formatter={(value, name, payload, index) => {
            if (Array.isArray(value)) {
              return [`[${Number(value[0]).toFixed(1)}, ${Number(value[1]).toFixed(1)}]`,
                "d.e."];
            }
            return `${Number(value).toFixed(1)}`;
          }
          } />
          <XAxis dataKey="show_date" minTickGap={30} >
          </XAxis>
          {yAxis}
          <Tooltip />
          <Legend />

          {ensemble3}
          <Area type="monotone" dataKey="ensemble" strokeWidth={0} legendType={"none"} name="Desviación estándar" fillOpacity="0.3"
                fill={blue} stroke={blue} dot={false}
                activeDot={{onClick: (payload: any) => {props.onClick({type: payload.dataKey, date: props.data[payload.index].date})} }} />
          {ensemble2}

          {mean3}
          <Line type="monotone" dataKey="mean" name={props.mode === "monitoreo" ? "Media" : "Sin cambios"} strokeWidth={3}
                stroke={blue} dot={false}
                activeDot={{r:8, onClick: (payload: any) => {props.onClick({type: payload.dataKey, date: props.data[payload.index].date})} }} />
          {mean2}

          {observation}
          {constantLine}
          {referenceVerticalLine}

        </ComposedChart>
    </ResponsiveContainer>
  </>
};

export { BaseChart };
