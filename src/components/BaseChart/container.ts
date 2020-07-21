import { BaseChart } from "./component";
import { observer } from "mobx-react";

const CasesChart = observer((props: any) => {
    return BaseChart(props);
});

export { CasesChart }