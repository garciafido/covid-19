import React from 'react';
import Argentina from './argentinaPolitico';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Colormap from "./colormap";
import {Button} from "@material-ui/core";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";


const defaultTheme = createMuiTheme();
const theme = createMuiTheme({
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: "1em",
      }
    }
  }
});

function debounce<Params extends any[]>(
    func: (...args: Params) => any,
    timeout: number,
): (...args: Params) => void {
    let timer: NodeJS.Timeout
    return (...args: Params) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            func(...args)
        }, timeout)
    }
}

const ArgentinaMap = (props: any) => {
    const [dimensions, setDimensions] = React.useState({
        height: window.innerHeight,
        width: window.innerWidth,
        factor: window.innerWidth / window.innerHeight
    });

    /*
    const debouncedHandleResize = debounce(() => {
        setDimensions({
            height: window.innerHeight,
            width: window.innerWidth,
            factor: window.innerWidth / window.innerHeight
        })
    }, 1000);

    React.useEffect(() => {
        window.addEventListener('resize', debouncedHandleResize);
        return () => {
            window.removeEventListener('resize', debouncedHandleResize);
        };
    });
    */

    const seaColor = "#0aa8f1";
    const chartsNames: any = {
        r: 'R(t)',
        actives: 'Activos',
        deads: props.store.chartPerDay ? 'Fallecidos por día' : 'Fallecimientos acumulados',
        cases: props.store.chartPerDay ? 'Casos por día' : 'Casos acumulados',
    };
    const lDate = props.store.selectedDate.split('-');
    const shortDate = `${lDate[2]}/${lDate[1]}/${lDate[0].substring(2, 4)}`;
    const backgroundColor = "#FFFFFF"; //'#C7BDC6';

    if (dimensions.factor < 1.9) {
        dimensions.height = dimensions.width / 1.9;
    }
    const height = Math.trunc(dimensions.height / 1.39) + 'px';
    const paletteHeight = Math.trunc(dimensions.height / 27) + 'px';

    return <div className="ArgentinaMap" style={{cursor: 'pointer'}}>
        <Paper style={{backgroundColor: backgroundColor}}>
            <Grid container>
                <Grid item xs={12}>
                    <h4 style={{
                        marginBottom: 0,
                        paddingBottom: 2,
                        marginTop: 0,
                        paddingTop: 3
                    }}>{`${shortDate}: ${chartsNames[props.store.selectedChart]}`}</h4>
                </Grid>
                <Grid item xs={12}>
                    <MuiThemeProvider theme={theme}>
                        <Button size="small" color="primary" onClick={props.handleClickExplain}
                                style={{marginTop: 0, paddingTop: 0, marginBottom: 0, paddingBottom: 0, fontSize: '9pt'}}>
                        <Box display="flex" justifyContent="center">
                            <span><FontAwesomeIcon style={{marginRight: 5, color: "#F88"}} icon={faInfoCircle}/>
                            Explicación</span>
                        </Box>
                        </Button>
                    </MuiThemeProvider>
                </Grid>
                <Grid item xs={12}>
                    <Argentina
                        width={props.width}
                        height={height}
                        getColor={(provincia) => props.store.getColorValue(provincia).color}
                        clicked={(provincia) => props.store.setCurrentLocation(provincia)}
                        out={"#C7BDC6"}
                        sea={seaColor}/>
                    <Grid container xs={12}>
                        <Grid item xs={12}>
                            <Colormap
                                width={props.width}
                                height={paletteHeight}
                                values={props.store.currentScale}/>
                        </Grid>
                        <Grid item xs={7} justify="flex-start" direction="row">
                            <Button
                                onClick={() => props.store.setPaletteSelectedDate()}
                                style={{
                                    marginLeft: 2,
                                    marginTop: 0,
                                    paddingTop: 0,
                                    marginBottom: 0,
                                    paddingBottom: 0,
                                    fontSize: '7pt'
                                }}
                                size="small" color="primary">Autoajustar paleta al {shortDate}</Button>
                        </Grid>
                        <Grid item xs={5} justify="flex-end" direction="row-reverse">
                            <Button
                                onClick={() => props.store.setDefaultPaletteDate()}
                                style={{
                                    marginRight: 0,
                                    paddingRight: 2,
                                    marginTop: 0,
                                    paddingTop: 0,
                                    marginBottom: 0,
                                    paddingBottom: 0,
                                    fontSize: '7pt'
                                }}
                                size="small" color="primary">Paleta por defecto</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    </div>
};

export {ArgentinaMap};
