import { observable } from "mobx";
import * as _ from "lodash";
import { cases, r, actives, deaths } from "./sampleData";

function getShortDate(isoDate: string) {
    const parts = isoDate.split('-');
    return parts[2] + '/' + parts[1];
}

function getObservation(row: [string, number, number, number]) {
  return {
    "day": getShortDate(row[0]),
    "ensemble": [
      row[2]-row[3],
      row[2]+row[3]
    ],
    "mean": row[2],
    "observation": row[1]
  };
}

function getMean(row: [string, number, number]) {
  return {
    "day": getShortDate(row[0]),
    "ensemble": [
      row[1]-row[2],
      row[1]+row[2]
    ],
    "mean": row[1],
  };
}

class CovidData {
    @observable color: object = {
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
        "Argentina": "#fff",
        "Antartida": "#fff",
        "Islas Malvinas": "#fff",
    }
    @observable argentinaCases = _.map(cases, getObservation);
    @observable argentinaR = _.map(r, getMean);
    @observable argentinaActives = _.map(actives, getMean);
    @observable argentinaDeaths = _.map(deaths, getObservation);
}

export { CovidData };