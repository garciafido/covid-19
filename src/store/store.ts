import { observable } from "mobx";
import * as _ from "lodash";
import { cases, r, actives, deaths } from "./sampleData";

const getShortDate = (isoDate: string) => {
    const parts = isoDate.split('-');
    return parts[2] + '/' + parts[1];
}

const getLongDate = (isoDate: string) => {
    const parts = isoDate.split('-');
    return parts[2] + '/' + parts[1] + '/' + parts[0];
}

const getObservation = (row: [string, number, number, number]) => {
  return {
    "day": getShortDate(row[0]),
    "ensemble": [
        (row[2]-row[3]).toFixed(3),
        (row[2]+row[3]).toFixed(3)
    ],
    "mean": row[2],
    "observation": row[1]
  };
}

const getMean = (row: [string, number, number]) => {
  return {
    "day": getShortDate(row[0]),
    "ensemble": [
        (row[1]-row[2]).toFixed(3),
        (row[1]+row[2]).toFixed(3)
    ],
    "mean": row[1],
  };
}

const getMinMax = (data: any) => {
    let minMax = [10000000, -100000000];
    const hasObs = 'observation' in data[0]
    for (let i=0; i < data.length; i++) {
        const minValues = [data[i].ensemble[0], minMax[0], hasObs ? data[i].observation : 1000000];
        const maxValues = [data[i].ensemble[1], minMax[1], hasObs ? data[i].observation : -1000000];
        minMax = [Math.min(...minValues), Math.max(...maxValues)]
    }
    return minMax;
}

class CovidData {
    @observable color: object = {
        "Argentina": "#fff",
        "Jujuy": "#fff",
        "Formosa": "#fff",
        "Salta": "#fff",
        "Tucuman": "#fff",
        "Catamarca": "#fff",
        "Santiago del Estero": "#fff",
        "Chaco": "#fff",
        "Misiones": "#fff",
        "Corrientes": "#fff",
        "Santa Fe": "#fff",
        "Entre Rios": "#fff",
        "Cordoba": "#fff",
        "San Luis": "#fff",
        "Mendoza": "#fff",
        "La Pampa": "#fff",
        "Buenos Aires": "#fff",
        "Neuquen": "#fff",
        "Rio Negro": "#fff",
        "Chubut": "#fff",
        "Santa Cruz": "#fff",
        "Tierra del Fuego": "#fff",
        "AMBA": "#fff",
        "GBA": "#fff",
        "CABA": "#fff",
        "La Rioja": "#fff",
        "San Juan": "#fff",
        "Antartida": "#fff",
        "Islas Malvinas": "#fff",
    }

    @observable currentCases = _.map(cases, getObservation);
    @observable minMaxCases = getMinMax(this.currentCases);

    @observable currentDeaths = _.map(deaths, getObservation);
    @observable minMaxDeaths = getMinMax(this.currentDeaths);

    @observable currentActives = _.map(actives, getMean);
    @observable minMaxActives = getMinMax(this.currentActives);

    @observable currentR = _.map(r, getMean);
    @observable minMaxR = getMinMax(this.currentR);

    @observable currentLocation = "Argentina";
    @observable currentDate = getLongDate(cases[cases.length-1][0]);

}

export { CovidData };