export const buildRByDate = (data: any) =>  {
    const indexedR: any = {};
    for (const key of Object.keys(data.monitoreo)) {
        indexedR[key] = {};
        const items = data.monitoreo[key]['r'];
        items.forEach((item: any)  =>  {
            indexedR[key][item.date] = item.mean;
        });
    }
    for (const key in Object.keys(data.prediccion)) {
        if (data.prediccion[key]) {
            const items = data.prediccion[key]['r'];
            items.forEach((item: any)  =>  {
                indexedR[key][item.date] = item.mean;
            });
        }
    }
    return indexedR;
}