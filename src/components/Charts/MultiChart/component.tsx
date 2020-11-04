import React from 'react'
import {
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend, ResponsiveContainer, Area, ComposedChart, ReferenceLine, ReferenceArea
} from 'recharts';
import {getTextDimension} from "../common";

function patch(data: any, minValue: number) {
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
      />

  let data = props.data;

  const red = "#b71c1c";
  const green = "#1abaa8";
  const blue = "#01579b";

  if (logarithmic) {
    data = patch(data, minValue);
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

  let referenceLine = <div/>;
  let referenceArea = <div/>;
  if (props.referenceValue) {
        const CustomLabel = (refProps: any) => {
            const fontSize = 18;
            const textDim = getTextDimension(props.referenceLabel, fontSize);
            const labelHeight = textDim.height;
            const x = Math.round(refProps.viewBox.x-labelHeight);
            return (
                <foreignObject
                    style={{
                        width: `${labelHeight}px`,
                        height: `${refProps.viewBox.height}px`}}
                    x={x}
                    y={0}>
                  <div style={{
                      transform: `rotate(270deg) translate(-${refProps.viewBox.height}px, -${0}px)`,
                      transformOrigin: "left top",
                      height: `${labelHeight}px`,
                      width: `${refProps.viewBox.height}px`
                  }}>
                      <span style={{fontSize: fontSize}}>
                        {props.referenceLabel}
                      </span>
                  </div>
                </foreignObject>
            );
        };
        referenceArea =
          <ReferenceArea x1={data[0].show_date}
                         x2={props.referenceAreaValue}
                         y1={props.minMax[0]}
                         y2={props.minMax[1]}
                         stroke=""
                         strokeOpacity={0.3}
          />;
      referenceLine =
          <ReferenceLine
              x={props.referenceValue}
              label={CustomLabel}
              strokeWidth={2}
          />;
  }

  return <>
    <ResponsiveContainer minWidth={props.width} aspect={2} minHeight={props.height}>
        <ComposedChart
          data={data}
          onClick={payload => {if (payload && payload.activePayload) props.onClick({type: "mean", date: payload.activePayload[0].payload.date})}}
          margin={{
            top: 5, right: 10, left: 40, bottom: 5,
          }}
        >
          {referenceArea}
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

          <Line type="monotone"
                dataKey="mean"
                name={props.mode === "monitoreo" ? "Media" : "Sin cambios"} strokeWidth={3}
                stroke={blue} dot={false}
                activeDot={{r:8, onClick: (payload: any) => {props.onClick({type: payload.dataKey, date: props.data[payload.index].date})} }} />

          {constantLine}
          {referenceLine}

        </ComposedChart>
    </ResponsiveContainer>
  </>
};

export { MultiChart };
