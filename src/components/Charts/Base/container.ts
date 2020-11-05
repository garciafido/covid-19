import { BaseChart } from "./component";
import { observer } from "mobx-react";

const BaseChartContainer = observer((props: any) => {
    return BaseChart(props);
});

export { BaseChartContainer }