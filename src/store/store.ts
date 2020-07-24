import {action, observable, configure} from "mobx";
import 'mobx-react-lite/batchingForReactDom';
import { cases, r, actives, deaths } from "./sampleData";
import {getColor, getLongDate, transformFromServer} from './dataMap';
import {flowed} from "./storeUtils";

configure({ enforceActions: "observed" });

function * fetchFromServer(): any {
    const mock = {
            cases: cases,
            r: r,
            actives: actives,
            deaths: deaths,
            lastDate: getLongDate(cases[cases.length - 1][0]),
            color: getColor(r[r.length - 1][1]),
        };

    yield {
        "Argentina": mock,
        "Jujuy": mock,
        "Formosa": mock,
        "Salta": mock,
        "Tucuman": mock,
        "Catamarca": mock,
        "Santiago del Estero": mock,
        "Chaco": mock,
        "Misiones": mock,
        "Corrientes": mock,
        "Santa Fe": mock,
        "Entre Rios": mock,
        "Cordoba": mock,
        "San Luis": mock,
        "Mendoza": mock,
        "La Pampa": mock,
        "Buenos Aires": mock,
        "Neuquen": mock,
        "Rio Negro": mock,
        "Chubut": mock,
        "Santa Cruz": mock,
        "Tierra del Fuego": mock,
        "AMBA": mock,
        "GBA": mock,
        "CABA": mock,
        "La Rioja": mock,
        "San Juan": mock,
        "Antartida": mock,
        "Islas Malvinas": mock,
    };
}

class CovidData {
    constructor() {
        this.fetchData();
    }

    @observable state: string = 'pending';
    @observable data: any = {};

    @observable current: any = {};
    @observable currentLocation = "Argentina";

    @flowed * fetchData() {
        this.data = {};
        this.state = "loading";
        try {
            const results = yield fetchFromServer();
            const serverData = results.next().value;
            this.data = transformFromServer(serverData);
            this.current = this.data[this.currentLocation];
            this.state = "done";
        } catch(error) {
            console.log(error);
            this.state = "error";
        }
    };

    @action.bound
    setCurrentLocation(location: string) {
        this.currentLocation = location;
        this.current = this.data[location];
    }
}

export { CovidData };