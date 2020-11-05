import React from "react";
import {ReferenceArea, ReferenceLine} from "recharts";

const getTextDimension = (str: string, size: number): any => {
    const text = document.createElement("span");
    document.body.appendChild(text);

    text.style.font = "times new roman";
    text.style.fontSize = `${size}px`;
    text.style.height = 'auto';
    text.style.width = 'auto';
    text.style.position = 'absolute';
    text.style.whiteSpace = 'no-wrap';
    text.innerHTML = str;

    const width = Math.ceil(text.clientWidth);
    const height = Math.ceil(text.clientHeight);
    document.body.removeChild(text);
    return {width, height};
};

const getReferenceArea = (
    referenceValue: any,
    referenceLabel: string,
    referenceAreaX1: string,
    referenceAreaX2: string,
    minMax: any): { referenceLine: any, referenceArea: any } => {
        const CustomLabel = (refProps: any) => {
            const fontSize = 18;
            const textDim = getTextDimension(referenceLabel, fontSize);
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
                        {referenceLabel}
                      </span>
                  </div>
                </foreignObject>
            );
        };
    const referenceArea =
          <ReferenceArea x1={referenceAreaX1}
                         x2={referenceAreaX2}
                         y1={minMax[0]}
                         y2={minMax[1]}
                         stroke=""
                         strokeOpacity={0.3}
          />;
    const referenceLine =
          <ReferenceLine
              x={referenceValue}
              label={CustomLabel}
              strokeWidth={2}
          />;
    return { referenceLine, referenceArea };
};

export { getReferenceArea };
