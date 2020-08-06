import React from 'react';
import Argentina from './argentina_politico';
import Grid from "@material-ui/core/Grid";

const ArgentinaMap = (props: any) => {
    const lDate = props.store.selectedDate.split('-');
    return <div className="ArgentinaMap" style={{cursor: 'pointer'}}>
        <Grid container>
            <Grid item xs={12}>
                <h3>{`R(t) al ${lDate[2]}/${lDate[1]} de ${lDate[0]}`}</h3>
            </Grid>
            <Grid item xs={12}>
                <Argentina
                    width={props.width}
                    height={props.height}
                    getColor={(provincia) => props.store.getColor(provincia)}
                    clicked={(provincia) => props.store.setCurrentLocation(provincia)}
                    out={"#C7BDC6"}
                    sea={"#4791db"}/>
            </Grid>
        </Grid>
    </div>
};

export { ArgentinaMap };
