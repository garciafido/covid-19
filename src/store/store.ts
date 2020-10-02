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

    generateDailyData() {
        const getDaily = (actual: any, previous: any) => {
            const withObservation = 'observation' in actual;
            const withMean2 = 'mean2' in actual;
            let item: any = {
              "date": actual.date,
              "show_date": actual.show_date,
              "ensemble": [
                actual.ensemble[0] - previous.ensemble[0],
                actual.ensemble[1] - previous.ensemble[1],
              ],
              "mean": actual.mean - previous.mean,
            };
            let min: number = item.ensemble[0];
            let max: number = item.ensemble[1];
            if (withObservation) {
                item["observation"] = actual.observation - previous.observation;
                min = Math.min(min, item.observation);
                max = Math.max(max, item.observation);
            }
            if (withMean2) {
                item["mean2"] = actual.mean2 - previous.mean2;
                item["ensemble2"] = [
                  actual.ensemble2[0] - previous.ensemble2[0],
                  actual.ensemble2[1] - previous.ensemble2[1],
                ];
                item["mean3"] = actual.mean3 - previous.mean3;
                item["ensemble3"] = [
                  actual.ensemble3[0] - previous.ensemble3[0],
                  actual.ensemble3[1] - previous.ensemble3[1],
                ];
                min = Math.min(min, item.ensemble2[0], item.ensemble3[0]);
                max = Math.max(max, item.ensemble2[1], item.ensemble3[1]);
            }
            return [item, min, max];
        }

        const generate = (items: any, first: any) => {
            let min: number = first.ensemble[0];
            let max: number = first.ensemble[1];
            if ('observation' in first) {
                min = Math.min(min, first.observation);
                max = Math.max(max, first.observation);
            }
            if ('mean2' in first) {
                min = Math.min(min, first.ensemble2[0]);
                max = Math.max(max, first.ensemble2[1]);
                min = Math.min(min, first.ensemble3[0]);
                max = Math.max(max, first.ensemble3[1]);
            }
            const dailyItems = [];
            dailyItems.push(first);
            for (let i=1; i < items.length; i++) {
                const [daily, minI, maxI] = getDaily(items[i], items[i-1])
                dailyItems.push(daily);
                min = Math.min(min, minI);
                max = Math.max(max, maxI);
            }
            return [dailyItems, min, max];
        }

        const getFirst = (items: any) => {
            return {
              "date": items[0].date,
              "show_date": items[0].show_date,
              "ensemble": [
                items[0].ensemble[0],
                items[0].ensemble[1],
              ],
              "observation": items[0].observation,
              "mean": items[0].mean
            };
        };

        for (const key of Object.keys(this.data.monitoreo)) {
            let items = this.data.monitoreo[key]["cases"];
            let [daily, min, max] = generate(items, getFirst(items));
            this.data.monitoreo[key]["dailyCases"] = daily;
            this.data.monitoreo[key]["minMaxDailyCases"] = [min, max];

            items = this.data.monitoreo[key]["deads"];
            [daily, min, max] = generate(items, getFirst(items));
            this.data.monitoreo[key]["dailyDeads"] = daily;
            this.data.monitoreo[key]["minMaxDailyDeads"] = [min, max];
        }

        const getFirstPrediction = (items: any, last: any) => {
            return {
              "date": items[0].date,
              "show_date": items[0].show_date,
              "ensemble": [
                items[0].ensemble[0] - last.ensemble[0],
                items[0].ensemble[1] - last.ensemble[1],
              ],
              "ensemble2": [
                items[0].ensemble2[0] - last.ensemble[0],
                items[0].ensemble2[1] - last.ensemble[1],
              ],
              "ensemble3": [
                items[0].ensemble3[0] - last.ensemble[0],
                items[0].ensemble3[1] - last.ensemble[1],
              ],
              "mean": items[0].mean - last.mean,
              "mean2": items[0].mean2 - last.mean,
              "mean3": items[0].mean3 - last.mean
            };
        };

        for (const key of Object.keys(this.data.prediccion)) {
            let items = this.data.prediccion[key]["cases"];
            let last = this.data.monitoreo[key]["cases"][this.data.monitoreo[key]["cases"].length-2];
            let first = getFirstPrediction(items, last);
            let [daily, min, max] = generate(items, first);
            this.data.prediccion[key]["dailyCases"] = daily;
            this.data.prediccion[key]["minMaxDailyCases"] = [min, max];

            items = this.data.prediccion[key]["deads"];
            last = this.data.monitoreo[key]["deads"][this.data.monitoreo[key]["deads"].length-2];
            first = getFirstPrediction(items, last);
            [daily, min, max] = generate(items, first);
            this.data.prediccion[key]["dailyDeads"] = daily;
            this.data.prediccion[key]["minMaxDailyDeads"] = [min, max];
        }
    }

    @flowed * fetchData() {
        this.data = {};
        this.state = "loading";
        try {
            const serverData = yield fetch(covidDataUrl);
            this.data = yield serverData.json();
            this.current = this.data[this.currentMode][this.currentLocation];
            this.generateDailyData();
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
    setChartPerDay(perDay: boolean) {
        this.chartPerDay = perDay;
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