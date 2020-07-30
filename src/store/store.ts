import {action, observable, configure} from "mobx";
import 'mobx-react-lite/batchingForReactDom';
import {flowed} from "./storeUtils";

configure({ enforceActions: "observed" });

class CovidData {
    @observable state: string = 'pending';
    @observable data: any = {};

    @observable current: any = {};
    @observable currentLocation = "Argentina";
    @observable currentMode = "monitoreo";

    @flowed * fetchData() {
        this.data = {};
        this.state = "loading";
        try {
            const serverData = yield fetch('https://garciafido.github.io/sample_data.json');
            this.data = yield serverData.json();
            this.current = this.data[this.currentMode][this.currentLocation];
            this.state = "done";
        } catch(error) {
            console.log(error);
            this.state = "error";
        }
        return this.data;
    };

    getColor = (provincia: string): string => {
        if (this.data.monitoreo.hasOwnProperty(provincia)) {
            let r = this.data[this.currentMode][provincia].lastR;
            console.log('last r', r)
            if (r > 10) {
                return '#FF0000';
            } else if (r < 1) {
                return '#FFFFFF';
            } else if (r < 2) {
                const pos = Math.min(Math.trunc(((r-1) / 1) * 7.0), 7);
                const palette = [
                '#fffafd',
                '#feebf5',
                '#ffdbea',
                '#ffccde',
                '#ffbccf',
                '#ffacbf',
                '#ff9cad',
                '#ff8c99',
                ]
                console.log('R:', r, pos)
                return palette[pos];
            } else {
                const pos = Math.min(Math.trunc(((r-2) / 10) * 7.0), 7);
                const palette = [
                '#ff0516',
                '#ff2a2f',
                '#ff3f44',
                '#ff5157',
                '#ff6169',
                '#ff707a',
                '#ff7e8a',
                '#ff8c99',
                ]
                console.log('R:', r, pos)
                return palette[pos];
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
}

export { CovidData };