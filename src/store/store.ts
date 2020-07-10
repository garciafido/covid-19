import { observable } from "mobx"
import * as React from "react";

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
}

export { CovidData };