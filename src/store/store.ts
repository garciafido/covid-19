import {action, observable, configure} from "mobx";
import 'mobx-react-lite/batchingForReactDom';
import {flowed} from "./storeUtils";
import {colormaps} from "./colormaps";
import {buildRByDate} from "./buildIndexes";

configure({ enforceActions: "observed" });

let covidDataUrl = ((window as any).COVID_DATA_URL);
covidDataUrl = covidDataUrl ? covidDataUrl : 'https://garciafido.github.io/sample_data.json';

class CovidData {
    @observable state: string = 'pending';
    @observable data: any = {};

    @observable current: any = {};
    @observable currentLocation = "Argentina";
    @observable currentMode = "monitoreo";

    @observable selectedDate: string = '';
    @observable rByDate: any = {};
    @observable errorMessage: any = '';

    @flowed * fetchData() {
        this.data = {};
        this.state = "loading";
        try {
            const serverData = yield fetch(covidDataUrl);
            this.data = yield serverData.json();
            this.current = this.data[this.currentMode][this.currentLocation];
            this.selectedDate = this.current.lastDate;
            this.rByDate = buildRByDate(this.data);
            this.state = "done";
        } catch(error) {
            this.state = "error";
            this.errorMessage = error;
        }
        return this.data;
    };

    getColor = (provincia: string): string => {
        if (this.selectedDate && this.data.monitoreo.hasOwnProperty(provincia)) {
            let r = this.rByDate[provincia][this.selectedDate];
            if (r < 1) {
                return colormaps.Oranges[Math.trunc(r*100)]
            } else {
                const rPow = Math.trunc(Math.min(r**2, 99));
                return colormaps.Reds[rPow];
            }
        } else {
            return '#000000';
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
    setSelectedDate(date: string | undefined) {
        if (date === undefined) {
            this.selectedDate = this.current.lastDate
        } else {
            this.selectedDate = date;
        }
    }
}

export { CovidData };