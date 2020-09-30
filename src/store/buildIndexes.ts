const population: {[key: string]: number} = {
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


const buildByDate = (data: any, field: string, perMIllion: boolean) =>  {
    const indexed: any = {};
    let min = 100000000000;
    let max = -100000000000;

    for (const key of Object.keys(data.monitoreo)) {
        indexed[key] = {values: {}, min: 100000000000, max: -100000000000};
        const items = data.monitoreo[key][field];
        for (let i=0; i < items.length; i++) {
            const value = perMIllion ?  1.e6 * items[i].mean / population[key] : items[i].mean;
            if (value < min) {
                min = value;
            }
            if (key !== 'Argentina') {
                if (value > max) {
                    max = value;
                }
            }
            indexed[key].values[items[i].date] = value;
        }
    }

    let min_prediccion = 100000000000;
    let max_prediccion = -100000000000;

    for (const key of Object.keys(data.prediccion)) {
        if (data.prediccion[key]) {
            const items = data.prediccion[key][field];
            for (let i=0; i < items.length; i++) {
                const value = items[i].mean;
                if (value < min_prediccion) {
                    min_prediccion = value;
                }
                if (key !== 'Argentina') {
                    if (value > max_prediccion) {
                        max_prediccion = value;
                    }
                }
                indexed[key].values[items[i].date] = value;
            }
        }
    }

    indexed.min = min < 0 ? 0 : min;
    indexed.max = max;
    indexed.min_prediccion = min_prediccion < 0 ? 0 : min_prediccion;
    indexed.max_prediccion = max_prediccion;
    return indexed;
}

export const buildRByDate = (data: any) =>  {
    return buildByDate(data, 'r', false);
}

export const buildCasesByDate = (data: any) =>  {
    return buildByDate(data, 'cases', true);
}

export const buildActivesByDate = (data: any) =>  {
    return buildByDate(data, 'actives', true);
}

export const buildDeadsByDate = (data: any) =>  {
    return buildByDate(data, 'deads', true);
}