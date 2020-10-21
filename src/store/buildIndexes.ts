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
    const maxByDate: any = {};
    const indexed: any = {maxByDate: maxByDate};
    let min = 100000000000;
    let max = -100000000000;
    let minDaily = 100000000000;
    let maxDaily = -100000000000;

    for (const key of Object.keys(data.monitoreo)) {
        indexed[key] = {values: {}, dailyValues: {}, min: 100000000000, max: -100000000000,
            minDaily: 100000000000, maxDaily: -100000000000,
            minPrediccionDaily: 100000000000, maxPrediccionDaily: -100000000000};
        const items = data.monitoreo[key][field];
        let previous = 0;
        for (let i=0; i < items.length; i++) {
            const value = perMIllion ?  1.e6 * items[i].mean / population[key] : items[i].mean;
            const dailyValue = value - previous;
            if (!(items[i].date in maxByDate)) {
                maxByDate[items[i].date] = {max: -100000000000, maxDaily: -100000000000, min: -100000000000, minDaily: -100000000000};
            }
            if (maxByDate[items[i].date].max < value) {
                maxByDate[items[i].date].max = value;
            }
            if (maxByDate[items[i].date].min > value) {
                maxByDate[items[i].date].min = value;
            }
            if (maxByDate[items[i].date].maxDaily < dailyValue) {
                maxByDate[items[i].date].maxDaily = dailyValue;
            }
            if (maxByDate[items[i].date].minDaily > dailyValue) {
                maxByDate[items[i].date].minDaily = dailyValue;
            }
            if (value < min) {
                min = value;
            }
            if (dailyValue < minDaily) {
                minDaily = dailyValue;
            }
            if (key !== 'Argentina') {
                if (value > max) {
                    max = value;
                }
                if (dailyValue > maxDaily) {
                    maxDaily = dailyValue;
                }
            }
            indexed[key].values[items[i].date] = value;
            indexed[key].dailyValues[items[i].date] = dailyValue;
            previous = value;
        }
    }

    let minPrediccion = 100000000000;
    let maxPrediccion = -100000000000;
    let minPrediccionDaily = 100000000000;
    let maxPrediccionDaily = -100000000000;

    for (const key of Object.keys(data.prediccion)) {
        if (data.prediccion[key]) {
            const items = data.prediccion[key][field];
            let previous = 0;
            for (let i=0; i < items.length; i++) {
                const value = perMIllion ? 1.e6 * items[i].mean / population[key] : items[i].mean;
                const dailyValue = value - previous;
                if (!(items[i].date in maxByDate)) {
                    maxByDate[items[i].date] = {min: 100000000000, max: -100000000000, minDaily: 100000000000, maxDaily: -100000000000};
                }
                if (maxByDate[items[i].date].max < value) {
                    maxByDate[items[i].date].max = value;
                }
                if (maxByDate[items[i].date].min > value) {
                    maxByDate[items[i].date].min = value;
                }
                if (maxByDate[items[i].date].maxDaily < dailyValue) {
                    maxByDate[items[i].date].maxDaily = dailyValue;
                }
                if (maxByDate[items[i].date].minDaily > dailyValue) {
                    maxByDate[items[i].date].minDaily = dailyValue;
                }
                if (value < minPrediccion) {
                    minPrediccion = value;
                }
                if (i > 0 && dailyValue < minPrediccionDaily) {
                    minPrediccionDaily = dailyValue;
                }
                if (key !== 'Argentina') {
                    if (value > maxPrediccion) {
                        maxPrediccion = value;
                    }
                    if (i > 0 && dailyValue > maxPrediccionDaily) {
                        maxPrediccionDaily = dailyValue;
                    }
                }
                indexed[key].values[items[i].date] = value;
                if (i > 0)
                    indexed[key].dailyValues[items[i].date] = dailyValue;
                previous = value;
            }
        }
    }

    indexed.min = min < 0 ? 0 : min;
    indexed.max = max;
    indexed.minPrediction = minPrediccion < 0 ? 0 : minPrediccion;
    indexed.maxPrediction = maxPrediccion;
    indexed.minDaily = minDaily < 0 ? 0 : minDaily;
    indexed.maxDaily = maxDaily;
    indexed.minPredictionDaily = minPrediccionDaily < 0 ? 0 : minPrediccionDaily;
    indexed.maxPredictionDaily = maxPrediccionDaily;
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