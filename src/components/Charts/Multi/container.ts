import { MultiChart } from "./component";
import { observer } from "mobx-react";

const MultiChartContainer = observer((props: any) => {
    return MultiChart(props);
});

export { MultiChartContainer }