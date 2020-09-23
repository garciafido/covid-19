import {action, observable, configure} from "mobx";
import 'mobx-react-lite/batchingForReactDom';
import {flowed} from "./storeUtils";
import {colormaps} from "./colormaps";
import {buildActivesByDate, buildCasesByDate, buildDeadsByDate, buildRByDate} from "./buildIndexes";

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

const population = {
    'Argentina': 40117096.,
    'Buenos Aires':  5708369.,
    'CABA': 2890151.,
    'Catamarca':  367828.,
    'Chaco':  1055259.,
    'Chubut':  499790.,
    'GBA':  9916715.,
    'Cordoba':  3308876.,
    'Corrientes':  992595.,
    'Entre Rios':  1215811.,
    'Formosa':  530162.,
    'Jujuy':  673307.,
    'La Pampa':  318951.,
    'La Rioja':  333642.,
    'Mendoza':  1738929.,
    'Misiones':  1101593.,
    'Neuquen':  551266.,
    'Rio Negro':  638645.,
    'Salta':  1214441.,
    'San Juan':  681055.,
    'San Luis':  432310.,
    'Santa Fe':  3194537.,
    'Santiago del Estero':  874006.,
    'Santa Cruz':  273964.,
    'Tierra del Fuego':  127205.,
    'Tucuman':  1448188.
};


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
    @observable population: any = population;

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

    autoColorMap(cases: any, min: number, max: number) {
        if (cases === undefined) {
            return gray;
        } else {
            const factor = 200 / ((max - min) + min);
            let normalized_cases = Math.trunc(factor * (cases - min));
            normalized_cases = normalized_cases >= 200 ? 199 : normalized_cases;
            if (normalized_cases < 100) {
                return colormaps.Oranges[Math.trunc(normalized_cases)]
            } else if (normalized_cases < 200) {
                return colormaps.Reds[Math.trunc(normalized_cases - 100)]
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
                const cases = this.casesByDate[provincia].values[this.selectedDate];
                let min, max;
                if (this.currentMode === 'monitoreo') {
                    min = this.casesByDate.min;
                    max = this.casesByDate.max;
                } else {
                    min = Math.min(this.casesByDate.min_prediccion, this.casesByDate.min);
                    max = Math.max(this.casesByDate.max_prediccion, this.casesByDate.max);
                }
                return this.autoColorMap(cases, min, max);
            } else if (this.selectedChart === 'deads') {
                const deads = this.deadsByDate[provincia].values[this.selectedDate];
                let min, max;
                if (this.currentMode === 'monitoreo') {
                    min = this.deadsByDate.min;
                    max = this.deadsByDate.max;
                } else {
                    min = Math.min(this.deadsByDate.min_prediccion, this.deadsByDate.min);
                    max = Math.max(this.deadsByDate.max_prediccion, this.deadsByDate.max);
                }
                return this.autoColorMap(deads, min, max);
            } else if (this.selectedChart === 'actives') {
                const actives = this.activesByDate[provincia].values[this.selectedDate];
                let min, max;
                if (this.currentMode === 'monitoreo') {
                    min = this.activesByDate.min;
                    max = this.activesByDate.max;
                } else {
                    min = Math.min(this.activesByDate.min_prediccion, this.activesByDate.min);
                    max = Math.max(this.activesByDate.max_prediccion, this.activesByDate.max);
                }
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