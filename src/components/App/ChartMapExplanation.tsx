import React from "react";
import Typography from "@material-ui/core/Typography";
import {Box} from "@material-ui/core";

const box = (color: string) => {return <Box width={65} height={5} bgcolor={color} />};

const red = "#b71c1c";
const green = "#1abaa8";
const blue = "#01579b";

const ChartMapExplanation = (props: any) => {
         return <>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
            </Typography>
         </>;
};

export { ChartMapExplanation };
