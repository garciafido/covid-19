import {action, observable, configure} from "mobx";
import 'mobx-react-lite/batchingForReactDom';
import {flowed} from "./storeUtils";

configure({ enforceActions: "observed" });

class CovidData {
    @observable state: string = 'pending';
    @observable data: any = {};

    @observable current: any = {};
    @observable currentLocation = "Argentina";

    @flowed * fetchData() {
        this.data = {};
        this.state = "loading";
        try {
            const serverData = yield fetch('https://garciafido.github.io/sample_data.json');
            this.data = yield serverData.json();
            this.current = this.data.monitoreo[this.currentLocation];
            this.state = "done";
        } catch(error) {
            console.log(error);
            this.state = "error";
        }
        return this.data;
    };

    getColor = (provincia: string): string => {
        if (['Antartida', 'Islas Malvinas'].includes(provincia)) {
            provincia = 'Tierra del Fuego';
        }
        if (this.data.monitoreo.hasOwnProperty(provincia)) {
            const r = this.data.monitoreo[provincia].lastR;
            console.log('last r', r)
            const palette = [
                '#FFFFFF',
                '#FFB9B9',
                '#FFA2A2',
                '#FF8B8B',
                '#FF7474',
                '#FF5D5D',
                '#FF4646',
                '#FF2E2E',
                '#FF1717',
                '#FF0000',
            ];
            return palette[Math.min(Math.trunc(r), 9)];
        } else {
            return '#000000';
        }
   }

   @action.bound
    setCurrentLocation(location: string) {
        this.currentLocation = location;
        this.current = this.data.monitoreo[location];
    }
}

export { CovidData };