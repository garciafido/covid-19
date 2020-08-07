import {action, observable, configure} from "mobx";
import 'mobx-react-lite/batchingForReactDom';
import {flowed} from "./storeUtils";
import {colormaps} from "./colormaps";
import {buildActivesByDate, buildCasesByDate, buildDeadsByDate, buildRByDate} from "./buildIndexes";

configure({ enforceActions: "observed" });

let covidDataUrl = ((window as any).COVID_DATA_URL);
covidDataUrl = covidDataUrl ? covidDataUrl : 'https://garciafido.github.io/sample_data.json';

const gray = "#C7BDC6";

class CovidData {
    @observable state: string = 'pending';
    @observable data: any = {};

    @observable current: any = {};
    @observable currentLocation = "Argentina";
    @observable currentMode = "monitoreo";

    @observable selectedDate: string = '';
    @observable selectedChart: string = '';

    @observable rByDate: any = {};
    @observable casesByDate: any = {};
    @observable activesByDate: any = {};
    @observable deadsByDate: any = {};

    @observable errorMessage: any = '';

    @flowed * fetchData() {
        this.data = {};
        this.state = "loading";
        try {
            const serverData = yield fetch(covidDataUrl);
            this.data = yield serverData.json();
            this.current = this.data[this.currentMode][this.currentLocation];
            this.selectedDate = this.current.lastDate;
            this.selectedChart = 'r';
            this.rByDate = buildRByDate(this.data);
            this.casesByDate = buildCasesByDate(this.data);
            this.activesByDate = buildActivesByDate(this.data);
            this.deadsByDate = buildDeadsByDate(this.data);
            this.state = "done";
        } catch(error) {
            this.state = "error";
            this.errorMessage = error;
        }
        return this.data;
    };

    autoColorMap(cases: any, min: number, max: number) {
        if (cases === undefined) {
            return gray;
        } else {
            const factor = 200 / ((max - min) + min);
            cases = Math.trunc(factor * (cases - min));
            if (cases < 100) {
                return colormaps.Oranges[Math.trunc(cases)]
            } else if (cases < 200) {
                return colormaps.Reds[Math.trunc(cases - 100)]
            } else {
                return gray;
            }
        }
    }

    getColor = (provincia: string): string => {
        if (this.currentMode === 'info') {
            return gray;
        }
        if (this.selectedDate && this.data[this.currentMode].hasOwnProperty(provincia)) {
            if (this.selectedChart === 'r') {
                let r = this.rByDate[provincia].values[this.selectedDate];
                if (r === undefined) {
                    return gray;
                } else {
                    if (r < 1) {
                        return colormaps.Oranges[Math.trunc(r*100)]
                    } else {
                        const rPow = Math.trunc(Math.min(r**2, 99));
                        return colormaps.Reds[rPow];
                    }
                }
            } else if (this.selectedChart === 'cases') {
                const cases = this.casesByDate[provincia].values[this.selectedDate];
                const min = this.casesByDate.min;
                const max = this.casesByDate.max;
                return this.autoColorMap(cases, min, max);
            } else if (this.selectedChart === 'deads') {
                const deads = this.deadsByDate[provincia].values[this.selectedDate];
                const min = this.deadsByDate.min;
                const max = this.deadsByDate.max;
                return this.autoColorMap(deads, min, max);
            } else if (this.selectedChart === 'actives') {
                const actives = this.activesByDate[provincia].values[this.selectedDate];
                const min = this.activesByDate.min;
                const max = this.activesByDate.max;
                return this.autoColorMap(actives, min, max);
            } else {
                return gray;
            }
        } else {
            return gray;
        }
   }

   @action.bound
    setCurrentLocation(location: string) {
        this.currentLocation = location;
        this.current = this.data[this.currentMode][location];
    }

   @action.bound
    setCurrentMode(mode: string) {
        this.currentMode = mode;
        if (this.currentMode !== 'info') {
            this.current = this.data[mode][this.currentLocation];
        }
    }

   @action.bound
    setSelectedChartDate(chart: string, date: string | undefined) {
        if (date === undefined) {
            this.selectedDate = this.current.lastDate
        } else {
            this.selectedDate = date;
        }
        this.selectedChart = chart;
    }
}

export { CovidData };