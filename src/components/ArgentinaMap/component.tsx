import React from 'react';
import Argentina from './argentinaPolitico';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Colormap from "./colormap";

const ArgentinaMap = (props: any) => {
    const seaColor = "#0aa8f1";
    const chartsNames: any = {
        r: 'R(t)',
        actives: 'Activos',
        deads: props.store.chartPerDay ? 'Fallecidos por día' : 'Fallecimientos acumulados',
        cases: props.store.chartPerDay ? 'Casos por día' : 'Casos acumulados',
    };
    const lDate = props.store.selectedDate.split('-');
    return <div className="ArgentinaMap" style={{cursor: 'pointer'}}>
      <Paper  style={{ backgroundColor:'#C7BDC6',}}>
        <Grid container>
            <Grid item xs={12} >
                    <h5 style={{marginBottom: 0, paddingBottom: 2, marginTop: 0, paddingTop: 3}}>{`${lDate[2]}-${lDate[1]}-${lDate[0].substring(2, 4)}: ${chartsNames[props.store.selectedChart]}`}</h5>
            </Grid>
            <Grid item xs={12}>
                <Colormap values={props.store.currentScale}/>
                <Argentina
                    width={props.width}
                    height={props.height}
                    getColor={(provincia) => props.store.getColorValue(provincia).color}
                    clicked={(provincia) => props.store.setCurrentLocation(provincia)}
                    out={"#C7BDC6"}
                    sea={seaColor}/>
            </Grid>
        </Grid>
      </Paper>
    </div>
};

export { ArgentinaMap };
