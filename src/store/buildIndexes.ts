const buildByDate = (data: any, field: string) =>  {
    const indexedR: any = {};
    let min = 100000000000;
    let max = -100000000000;

    for (const key of Object.keys(data.monitoreo)) {
        indexedR[key] = {values: {}, min: 100000000000, max: -100000000000};
        const items = data.monitoreo[key][field];
        for (let i=0; i < items.length; i++) {
            if (items[i].mean < min) {
                min = items[i].mean;
            }
            if (key !== 'Argentina') {
                if (items[i].mean > max) {
                    max = items[i].mean;
                }
            }
            indexedR[key].values[items[i].date] = items[i].mean;
        }
    }

    for (const key of Object.keys(data.prediccion)) {
        if (data.prediccion[key]) {
            const items = data.prediccion[key][field];
            for (let i=0; i < items.length; i++) {
                if (items[i].mean < min) {
                    min = items[i].mean;
                }
                if (key !== 'Argentina') {
                    if (items[i].mean > max) {
                        max = items[i].mean;
                    }
                }
                indexedR[key].values[items[i].date] = items[i].mean;
            }
        }
    }

    indexedR.min = min < 0 ? 0 : min;
    indexedR.max = max;
    return indexedR;
}

export const buildRByDate = (data: any) =>  {
    return buildByDate(data, 'r');
}

export const buildCasesByDate = (data: any) =>  {
    return buildByDate(data, 'cases');
}

export const buildActivesByDate = (data: any) =>  {
    return buildByDate(data, 'actives');
}

export const buildDeadsByDate = (data: any) =>  {
    return buildByDate(data, 'deads');
}