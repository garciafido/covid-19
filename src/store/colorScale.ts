const range = (start: number, stop: number, step: number) => {
    const result = [];
    for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }
    return result;
};

export const getColorScale = (minScale: number, maxScale: number, nScale: number, isLinear: boolean = true): any => {
    if (maxScale-minScale <= nScale + 1) {
        const result = [];
        for (let i = 0; i <= nScale; i += 1) {
            result.push(i);
        }
        return result;
    }
    // @author: jruiz
    // Primero autocorregimos el maximo de la escala para llevarlo a un valor user friendly
    const scalingFactor = (10 ** Math.round(Math.log10(maxScale / nScale))) / 5.0;
    maxScale = Math.ceil(maxScale / scalingFactor) * scalingFactor;
    minScale = minScale === 0 ? 1 : minScale;

    let scale;
    if (!isLinear) {
        const maxScaleLog = Math.log10(maxScale);
        const minScaleLog = Math.log10(minScale);
        const deltaScaleLog = (maxScaleLog - minScaleLog) / nScale;
        const scaleLog = range(minScaleLog, maxScaleLog + deltaScaleLog, deltaScaleLog);
        scale = scaleLog.map(x => 10.0 ** x);
    } else {
        scale = range(minScale, maxScale + (maxScale-minScale)/nScale, (maxScale-minScale)/nScale);
    }

    const deltaScale = [];
    for (let i=0; i < scale.length-1; i++) {
        deltaScale.push(scale[i+1] - scale[i]);
    }
    const scaleAdjusted = [...scale];

    let meanDelta;
    for (let ii=0; ii < scale.length; ii++) {
        if (ii === 0) {
            meanDelta = deltaScale[0];
        }
        else if (ii === scale.length - 1) {
            meanDelta = deltaScale[-1];
        }
        else if (ii > 0 && ii <= scale.length - 2) {
            meanDelta = 0.5 * (deltaScale[ii - 1] + deltaScale[ii]);
            const scalingFactor = 10.0 ** Math.round(Math.log10(meanDelta)) / 5.0;
            // Orden de magnitud del delta dividido 4
            scaleAdjusted[ii] = Math.ceil(scale[ii] / scalingFactor) * scalingFactor;
        }
    }

    return scaleAdjusted.map(x => Math.ceil(x));
};