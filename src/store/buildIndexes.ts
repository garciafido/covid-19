const buildByDate = (data: any, field: string) =>  {
    const indexedR: any = {};
    let min = 100000000000;
    let max = -100000000000;
    for (const key of Object.keys(data.monitoreo)) {
        indexedR[key] = {values: {}, min: 100000000000, max: -100000000000};
        const items = data.monitoreo[key][field];
        items.forEach((item: any)  =>  {
            if (item.mean < indexedR[key].min) {
                indexedR[key].min = item.mean;
            }
            if (item.mean > indexedR[key].max) {
                indexedR[key].max = item.mean;
            }
            indexedR[key].values[item.date] = item.mean;
        });
        if (key !== 'Argentina') {
            if (indexedR[key].min < min) {
                min = indexedR[key].min;
            }
            if (indexedR[key].max > max) {
                max = indexedR[key].max;
            }
        }
    }
    for (const key in Object.keys(data.prediccion)) {
        if (data.prediccion[key]) {
            const items = data.prediccion[key][field];
            items.forEach((item: any)  =>  {
                // if (item.mean < indexedR[key].min) {
                //     indexedR[key].min = item.mean;
                // }
                // if (item.mean > indexedR[key].max) {
                //     indexedR[key].max = item.mean;
                // }
                // indexedR[key].values[item.date] = item.mean;
            });
        }
        // if (key !== 'Argentina') {
        //     if (indexedR[key].min < min) {
        //         min = indexedR[key].min;
        //     }
        //     if (indexedR[key].max > max) {
        //         max = indexedR[key].max;
        //     }
        // }
    }
    indexedR.min = min;
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