import React from 'react';
import './App.css';
import { Theme, makeStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";
import { store } from '../../store/';
import { ArgentinaMapMenu } from '../ArgentinaMap';
import { ProjectInfo } from '../ProjectInfo';
import { CasesChart } from '../BaseChart';
import { Divider } from "@material-ui/core";
import {observer} from "mobx-react";
import Tooltip from '@material-ui/core/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

import {
  createMuiTheme,
  MuiThemeProvider
} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";


const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    alignItems: "center"
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  dividerFullWidth: {
    margin: `15px 0 0 ${theme.spacing(2)}px`,
  },
  box: {
    alignItems: "center",
  },
  button: {
    margin: theme.spacing(1),
  },
}));

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

const App = observer((props: any) => {
  const classes = useStyles();
  const chartWidth = 300;
  const chartHeight = 200;
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: any): void => {
    store.setCurrentMode(newValue);
  };

  if (store.state === 'pending') {
      store.fetchData();
      return <div>Initializing...</div>
  }

  if (store.state === 'error') {
    return <div>{`Error: ${store.errorMessage}`}</div>
  }

  if (store.state !== 'done') {
      return <div>Loading...</div>
  }

  const handleChartClick = (dataIndex: any) => {
      if (dataIndex.date) {
          store.setSelectedChartDate(dataIndex.chart, dataIndex.date);
      }
  };

  const handleChartTypeClick = (value: string) => {
      store.setSelectedChart(value);
  };

  const modeName = store.currentMode === 'monitoreo' ? "monitoreo" : "predicción";

  const assimilationDate = store.assimilationDate.split('-');

  let charts;
  let chartsMenu;
  if (store.current) {
          let title;
          let infoText = "";
          let minMax;
          let data;
          let provincia = store.currentLocation;
          if (store.currentLocation === "Tierra del Fuego") {
              provincia = "Tierra del Fuego, Malvinas y Antártida"
          }
          if (store.selectedChart === "actives") {
            infoText = `Número de infectados COVID-19 activos  estimados con el sistema de asimilación de datos.`;
            title = "Casos activos";
            minMax = store.current.minMaxActives;
            data = store.current.actives;
          }
          else if (store.selectedChart === "cases") {
            infoText = `Observaciones del número de casos infectados acumulados (puntos naranja) y la media del número de infectados acumulados estimados con el sistema de asimilación de datos (línea celeste). El sombreado gris muestra la desviacion estandard del ensamble el cual esta representando la incerteza en la predicción. El primer día corresponde al 3 de Marzo.`;
            title = "Casos acumulados";
            minMax = store.current.minMaxCases;
            data = store.current.cases;
          }
          else if (store.selectedChart === "deads") {
            infoText = `Observaciones del número de muertes acumuladas (puntos naranja) y la media del número de infectados acumulados estimados con el sistema de asimilación de datos (línea celeste). Las líneas grises muestran el ensamble el cual esta representando la incerteza en la predicción. El primer día corresponde al 3 de Marzo.`;
            title = "Cantidad de muertes acumuladas";
            minMax = store.current.minMaxDeaths;
            data = store.current.deads;
          }
          else if (store.selectedChart === "r") {
            infoText = `Número de reproducción efectivo, R(t), estimado con la técnica de asimilación de datos y su incerteza.`;
            title = "R(t)";
            minMax = store.current.minMaxR;
            data = store.current.r;
          }

          const chart = <>
              <Grid container>
            <Grid item xs={12}>
            <MuiThemeProvider theme={theme}>
                <Tooltip title={infoText}>
                    <Box display="flex" justifyContent="center">
                        <b><FontAwesomeIcon style={{marginLeft: 10, color: "#F88"}} icon={faInfoCircle}/></b>
                        &nbsp;Explicación
                    </Box>
                </Tooltip>
            </MuiThemeProvider>
            </Grid>
                  <Grid item xs={12}>
            <Box className={classes.box}>
                  <CasesChart width={chartWidth} height={chartHeight}
                              data={data}
                              onClick={(event: any) => handleChartClick({...event, chart: store.selectedChart})}
                              minMax={minMax}
                  />
            </Box>
            </Grid>
          </Grid>
              </>

        charts = <>
              <Grid container>
                <Grid item alignItems='center' alignContent='center' style={{height: "25%"}} xs={12} >
                      <h4>{`${title} en ${provincia}`}</h4>
                </Grid>
                <Grid item xs={12}>
                  <Divider className={classes.dividerFullWidth} />
                </Grid>
                <Grid item xs={12}>
                    {chart}
                </Grid>
              </Grid>
        </>;

        chartsMenu = <>
            <Paper className={classes.paper}>
                <MenuList>
                  <MenuItem onClick={() => handleChartTypeClick("cases")} selected={store.selectedChart==="cases"}>Casos</MenuItem>
                  <MenuItem onClick={() => handleChartTypeClick("deads")} selected={store.selectedChart==="deads"}>Muertes</MenuItem>
                  <MenuItem onClick={() => handleChartTypeClick("actives")} selected={store.selectedChart==="actives"}>Activos</MenuItem>
                  <MenuItem onClick={() => handleChartTypeClick("r")} selected={store.selectedChart==="r"}>R(t)</MenuItem>
                </MenuList>
            </Paper>
        </>;


  } else {
      charts = <Grid container>
                  <Grid item xs={12}>
                      <h2>{'No hay datos disponibles de '} {modeName} para {store.currentLocation}</h2>
                  </Grid>
               </Grid>
  }

  return (
      <MuiThemeProvider theme={defaultTheme}>
    <Box className="App">
      <header>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://jsfiddle.net/alidingling/xqjtetw0/" />
      </header>
      <Grid container className={classes.root}
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
            alignContent="center"
            spacing={2}>
          <Grid container style={{height: "50%"}} justify= "center" alignItems="stretch" spacing={3}>
              <Box height="25%">
                  <h3>Sistema de Monitoreo y Predicción de COVID-19 en Argentina</h3>
              </Box>
          </Grid>
          <Grid container alignItems="flex-start" justify="flex-end" direction="row" style={{height: "25%"}} xs={12}>
              <Box height="25%">
                  <Button size="small" color="primary" onClick={handleClickOpen}>Acerca del proyecto</Button>
              </Box>
          </Grid>
          <Grid container>
            <AppBar position="static"  color="default">
              <Tabs value={store.currentMode}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered>
                <Tab label="Monitoreo" value={'monitoreo'} />
                <Tab label="Predicción" value={'prediccion'} />
              </Tabs>
            </AppBar>
            <Grid container>
              <Grid item xs={3}>
                <Box className={classes.box}>
                  <ArgentinaMapMenu store={store} />
                </Box>
              </Grid>
              <Grid item xs={7}>
                  {charts}
                  <h5>&nbsp;{`Fecha de asimilación: ${assimilationDate[2]}/${assimilationDate[1]}/${assimilationDate[0]}`}</h5>
              </Grid>
              <Grid item xs={2}>
                  {chartsMenu}
              </Grid>
          </Grid>
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} maxWidth={"md"} fullWidth={true}>
              <DialogTitle id="simple-dialog-title">Acerca del proyecto</DialogTitle>
            <ProjectInfo />
        </Dialog>
      </Grid>
      </Grid>
    </Box>
</MuiThemeProvider>
  );
})

export default App;
