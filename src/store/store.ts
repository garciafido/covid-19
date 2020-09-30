import {action, observable, configure} from "mobx";
import 'mobx-react-lite/batchingForReactDom';
import {flowed} from "./storeUtils";
import {buildActivesByDate, buildCasesByDate, buildDeadsByDate, buildRByDate} from "./buildIndexes";

configure({ enforceActions: "observed" });

let covidDataUrl = ((window as any).COVID_DATA_URL);
covidDataUrl = covidDataUrl ? covidDataUrl : 'sample_data.json';
//covidDataUrl = covidDataUrl ? covidDataUrl : 'https://garciafido.github.io/sample_data_test.json';

const gray = "#C7BDC6";

const colormap = [
    "#FFFFFF",
    "#F3E08C",
    "#FAC55F",
    "#FAA930",
    "#FBA953",
    "#F96A00",
    "#F34E00",
    "#E32F00",
    "#D00A00",
]

function getColor(scale: number[], value: number) {
    let index: number = 0;
    for (; index < scale.length; index++) {
        if (scale[index] > value) break;
    }
    return colormap[index <= 7 ? index : 8];
}

class CovidData {
    @observable state: string = 'pending';
    @observable data: any = {};

    @observable current: any = {};
    @observable currentLocation = "Argentina";
    @observable currentMode = "monitoreo";

    @observable selectedDate: string = '';
    @observable assimilationDate: string = '';
    @observable selectedChart: string = '';
    @observable chartPerDay: boolean = false;

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
            this.assimilationDate = this.data.fecha_de_asimilacion;
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
                    const minR = 0.6;
                    const maxR = 2.0;
                    if (r < minR) {
                        return colormap[0]
                    } else if (r > maxR){
                        return colormap[colormap.length-1]
                    }
                    const factor = (maxR-minR) / (colormap.length-2);
                    const index = Math.trunc((r-minR) / factor) + 1;
                    return colormap[index];
                }
            } else if (this.selectedChart === 'cases') {
                const value = this.casesByDate[provincia].values[this.selectedDate];
                const scale = [100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000];
                return getColor(scale, value);
            } else if (this.selectedChart === 'deads') {
                const value = this.deadsByDate[provincia].values[this.selectedDate];
                const scale = [5, 10, 25, 50, 100, 250, 500, 1000, 2500];
                return getColor(scale, value);
            } else if (this.selectedChart === 'actives') {
                const value = this.activesByDate[provincia].values[this.selectedDate];
                const scale = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000];
                return getColor(scale, value);
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
        this.current = this.data[mode][this.currentLocation];
    }

   @action.bound
    setSelectedChart(chart: string) {
        this.selectedChart = chart;
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