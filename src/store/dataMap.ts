import * as _ from "lodash";

const getShortDate = (isoDate: string) => {
    const parts = isoDate.split('-');
    return parts[2] + '/' + parts[1];
}

export const getLongDate = (isoDate: string) => {
    const parts = isoDate.split('-');
    return parts[2] + '/' + parts[1] + '/' + parts[0];
}

const getObservation = (row: [string, number, number, number]) => {
  return {
    "day": getShortDate(row[0]),
    "date": getLongDate(row[0]),
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
    "date": getLongDate(row[0]),
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

export const getColor = (r: number): string => {
    console.log('viene r: ' ,r);
    const palette = [
        '#FFFFFF',
        '#FFB9B9',
        '#FFA2A2',
        '#FF8B8B',
        '#FF7474',
        '#FF5D5D',
        '#FF4646',
        '#FF2E2E',
        '#FF1717',
        '#FF0000',
    ];
    return palette[Math.min(Math.trunc(r), 9)];
}

const transformLocation = (data: any) => {
    const currentCases = _.map(data.cases, getObservation);
    const currentDeaths = _.map(data.deaths, getObservation);
    const currentActives = _.map(data.actives, getMean);
    const currentR = _.map(data.r, getMean);

    return {
        cases: currentCases,
        minMaxCases: getMinMax(currentCases),
        deaths: currentDeaths,
        minMaxDeaths: getMinMax(currentDeaths),
        actives: currentActives,
        minMaxActives: getMinMax(currentActives),
        r: currentR,
        minMaxR: getMinMax(currentR),
        lastDate: currentCases[currentCases.length - 1].date,
        color: getColor(currentR[currentR.length - 1].mean),
    };
}

export const transformFromServer = (serverData: any) => {
    const data: any = {};
    for (const key in serverData) {
      data[key] = transformLocation(serverData[key]);
    }
    return data;
}

