import React from 'react';
import Argentina from './argentina_politico';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

const ArgentinaMap = (props: any) => {
    const seaColor = "#0aa8f1";
    const chartsNames: any = {
        r: 'R(t)',
        actives: 'Activos',
        deads: 'Muertes',
        cases: 'Casos',
    };
    const lDate = props.store.selectedDate.split('-');
    return <div className="ArgentinaMap" style={{cursor: 'pointer'}}>
                <Paper  style={{ backgroundColor:'#C7BDC6',}}>
        <Grid container>
            <Grid item xs={12}>
                    <h3>{`${chartsNames[props.store.selectedChart]} ${lDate[2]}-${lDate[1]}-${lDate[0].substring(2,4)}`}</h3>
            </Grid>
            <Grid item xs={12}>
                <Argentina
                    width={props.width}
                    height={props.height}
                    getColor={(provincia) => props.store.getColor(provincia)}
                    clicked={(provincia) => props.store.setCurrentLocation(provincia)}
                    out={"#C7BDC6"}
                    sea={seaColor}/>
            </Grid>
        </Grid>
                </Paper>
    </div>
};

export { ArgentinaMap };
