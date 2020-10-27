import {action, observable, configure} from "mobx";
import 'mobx-react-lite/batchingForReactDom';
import {flowed} from "./storeUtils";
import {buildActivesByDate, buildCasesByDate, buildDeadsByDate, buildRByDate} from "./buildIndexes";
import {getColorScale} from "./colorScale";

configure({ enforceActions: "observed" });

let covidDataUrl = ((window as any).COVID_DATA_URL);
//covidDataUrl = covidDataUrl ? covidDataUrl : 'sample_data.json';
covidDataUrl = covidDataUrl ? covidDataUrl : 'https://garciafido.github.io/sample_data_test.json';

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

function getColorFromScale(scale: number[], value: number) {
    let index: number = 0;
    for (; index < scale.length; index++) {
        if (scale[index] > value) break;
    }
    return colormap[index > scale.length-1 ? scale.length-1 : index];
}

const logarithmicLimit = 500;
const scaleParts = colormap.length - 1;

class CovidData {
    @observable state: string = 'pending';
    @observable data: any = {};

    @observable current: any = {};
    @observable currentLocation = "Argentina";
    @observable currentMode = "monitoreo";
    @observable currentScale: any = [];
    @observable paletteDate: string = '';

    @observable selectedDate: string = '';
    @observable assimilationDate: string = '';
    @observable selectedChart: string = '';
    @observable chartPerDay: boolean = false;

    @observable rByDate: any = {};
    @observable casesByDate: any = {};
    @observable activesByDate: any = {};
    @observable deadsByDate: any = {};

    @observable errorMessage: any = '';

    getCurrentValue() {
        if (this.selectedChart === 'r') {
            return this.rByDate[this.currentLocation].originalValues[this.selectedDate];
        } else if (this.selectedChart === 'cases') {
            if (this.chartPerDay) {
                return this.casesByDate[this.currentLocation].originalDailyValues[this.selectedDate];
            } else {
                return this.casesByDate[this.currentLocation].originalValues[this.selectedDate];
            }
        } else if (this.selectedChart === 'actives') {
            return this.activesByDate[this.currentLocation].originalValues[this.selectedDate];
        } else if (this.selectedChart === 'deads') {
            if (this.chartPerDay) {
                return this.deadsByDate[this.currentLocation].originalDailyValues[this.selectedDate];
            } else {
                return this.deadsByDate[this.currentLocation].originalValues[this.selectedDate];
            }
        }
        return 0;
    }

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
            this.changeCurrentScale();
        } catch(error) {
            this.state = "error";
            this.errorMessage = error;
        }
        return this.data;
    };

    getColorValue = (provincia: string): any => {
        if (this.currentMode === 'info') {
            return {color: gray, value: undefined};
        }
        if (this.selectedDate && this.data[this.currentMode].hasOwnProperty(provincia)) {
            let value;
            if (this.selectedChart === 'r') {
                value = this.rByDate[provincia].values[this.selectedDate];
                if (value === undefined) {
                    return {color: gray, value: value};
                } else {
                    return {color: getColorFromScale(this.currentScale, value), value: value};
                }
            } else if (this.selectedChart === 'cases') {
                if (this.chartPerDay) {
                    value = this.casesByDate[provincia].dailyValues[this.selectedDate];
                } else {
                    value = this.casesByDate[provincia].values[this.selectedDate];
                }
                return {color: getColorFromScale(this.currentScale, value), value: value};
            } else if (this.selectedChart === 'deads') {
                if (this.chartPerDay) {
                    value = this.deadsByDate[provincia].dailyValues[this.selectedDate];
                } else {
                    value = this.deadsByDate[provincia].values[this.selectedDate];
                }
                return {color: getColorFromScale(this.currentScale, value), value: value};
            } else if (this.selectedChart === 'actives') {
                const value = this.activesByDate[provincia].values[this.selectedDate];
                    return {color: getColorFromScale(this.currentScale, value), value: value};
            } else {
                return {color: gray, value: undefined};
            }
        } else {
            return {color: gray, value: undefined};
        }
    }

    @action.bound
    setCurrentLocation(location: string) {
        this.currentLocation = location;
        this.current = this.data[this.currentMode][this.currentLocation];
    }

    @action.bound
    setDefaultPaletteDate() {
        this.paletteDate = "";
        this.changeCurrentScale();
    }

    @action.bound
    setPaletteSelectedDate() {
        this.paletteDate = this.selectedDate;
        this.changeCurrentScale();
    }

    @action.bound
    changeCurrentScale() {
        if (this.selectedChart === 'r') {
            const factor = (2.0-0.6) / (colormap.length-2);
            this.currentScale = [];
            for (let i=0; i < colormap.length-1; i++) {
                const value = ((i-1) * factor) + 0.6;
                this.currentScale.push(Math.ceil(value*10.0)/10.0);
            }
            this.currentScale.push(2.0);
        } else if (this.selectedChart === 'cases') {
            let maxScale;
            let minScale = 0;
            let isLog;
            if (this.chartPerDay) {
                if (this.paletteDate) {
                    maxScale = this.casesByDate.maxByDate[this.paletteDate].maxDaily;
                    if (this.currentMode !== "monitoreo") {
                        minScale = this.casesByDate.maxByDate[this.paletteDate].minDaily;
                    }
                } else {
                    if (this.currentMode === "monitoreo") {
                        maxScale = this.casesByDate.maxDaily;
                    } else {
                        maxScale = this.casesByDate.maxPredictionDaily;
                        minScale = this.casesByDate.minPredictionDaily;
                    }
                }
            } else {
                minScale = 100;
                if (this.paletteDate) {
                    maxScale = this.casesByDate.maxByDate[this.paletteDate].max;
                    if (this.currentMode !== "monitoreo") {
                        minScale = this.casesByDate.maxByDate[this.paletteDate].min;
                    }
                } else {
                    if (this.currentMode === "monitoreo") {
                        maxScale = this.casesByDate.max;
                    } else {
                        maxScale = this.casesByDate.maxPrediction;
                        minScale = this.casesByDate.minPrediction;
                    }
                }
            }
            if (minScale < 0) {
                minScale = 0;
            }
            isLog = maxScale-minScale > logarithmicLimit;
            minScale = minScale + scaleParts >= maxScale ? 0 : minScale;
            this.currentScale = getColorScale(minScale, maxScale, scaleParts, isLog);
        } else if (this.selectedChart === 'deads') {
            let maxScale;
            let minScale = 0;
            let isLog;
            if (this.chartPerDay) {
                if (this.paletteDate) {
                    maxScale = this.deadsByDate.maxByDate[this.paletteDate].maxDaily;
                    if (this.currentMode !== "monitoreo") {
                        minScale = this.deadsByDate.maxByDate[this.paletteDate].minDaily;
                    }
                } else {
                    if (this.currentMode === "monitoreo") {
                        maxScale = this.deadsByDate.maxDaily;
                    } else {
                        maxScale = this.deadsByDate.maxPredictionDaily;
                        minScale = this.deadsByDate.minPredictionDaily;
                    }
                }
            } else {
                minScale = 5;
                if (this.paletteDate) {
                    maxScale = this.deadsByDate.maxByDate[this.paletteDate].max;
                    if (this.currentMode !== "monitoreo") {
                        minScale = this.deadsByDate.maxByDate[this.paletteDate].min;
                    }
                } else {
                    if (this.currentMode === "monitoreo") {
                        maxScale = this.deadsByDate.max;
                    } else {
                        maxScale = this.deadsByDate.maxPrediction;
                        minScale = this.deadsByDate.minPrediction;
                    }
                }
            }
            if (minScale < 0) {
                minScale = 0;
            }
            isLog = maxScale-minScale > logarithmicLimit;
            minScale = minScale + scaleParts >= maxScale ? 0 : minScale;
            this.currentScale = getColorScale(minScale, maxScale, scaleParts, isLog);
        } else if (this.selectedChart === 'actives') {
            let maxScale;
            let minScale = 10;
            if (this.paletteDate) {
                maxScale = this.activesByDate.maxByDate[this.paletteDate].max;
                if (this.currentMode === "monitoreo") {
                    minScale = this.activesByDate.maxByDate[this.paletteDate].min;
                }
            } else {
                if (this.currentMode === "monitoreo") {
                    maxScale = this.activesByDate.max;
                } else {
                    maxScale = this.activesByDate.maxPrediction;
                    minScale = this.activesByDate.minPrediction;
                }
            }
            if (minScale < 0) {
                minScale = 0;
            }
            const isLog = maxScale-minScale > logarithmicLimit;
            minScale = minScale + scaleParts >= maxScale ? 0 : minScale
            this.currentScale = getColorScale(minScale, maxScale, scaleParts, isLog);
        }
    }

    @action.bound
    setCurrentMode(mode: string) {
        this.currentMode = mode;
        this.current = this.data[this.currentMode][this.currentLocation];
        this.changeCurrentScale();
    }

    @action.bound
    setSelectedChart(chart: string) {
        this.selectedChart = chart;
        this.changeCurrentScale();
    }

    @action.bound
    setChartPerDay(perDay: boolean) {
        this.chartPerDay = perDay;
        this.changeCurrentScale();
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