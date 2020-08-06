const buildByDate = (data: any, field: string) =>  {
    const indexedR: any = {};
    for (const key of Object.keys(data.monitoreo)) {
        indexedR[key] = {};
        const items = data.monitoreo[key][field];
        items.forEach((item: any)  =>  {
            indexedR[key][item.date] = item.mean;
        });
    }
    for (const key in Object.keys(data.prediccion)) {
        if (data.prediccion[key]) {
            const items = data.prediccion[key][field];
            items.forEach((item: any)  =>  {
                indexedR[key][item.date] = item.mean;
            });
        }
    }
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