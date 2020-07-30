import React from 'react';
import './App.css';
import { Theme, makeStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { store } from '../../store/';
import { ArgentinaMapMenu } from '../ArgentinaMap';
import { ProjectInfo } from '../ProjectInfo';
import { CasesChart } from '../BaseChart';
import { Divider } from "@material-ui/core";
import {observer} from "mobx-react";
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import InfoIcon from '@material-ui/icons/Info';
import {
  createMuiTheme,
  MuiThemeProvider
} from "@material-ui/core/styles";
import {DragHandleOutlined} from "@material-ui/icons";


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
  const [open, setOpen] = React.useState(false);
  const chartWidth = 300;
  const chartHeight = 200;

  const handleChange = (event: React.ChangeEvent<{}>, newValue: any): void => {
    store.setCurrentMode(newValue);
  };

  if (store.state === 'pending') {
      store.fetchData();
      return <div>Initializing...</div>
  }

  if (store.state === 'error') {
    return <div>Error...</div>
  }

  if (store.state !== 'done') {
      return <div>Loading...</div>
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const modeName = store.currentMode === 'monitoreo' ? "monitoreo" : "predicción";

  const totalCasesText = `Observaciones del número de casos infectados acumulados (puntos naranja) y la media del número de infectados acumulados estimados con el sistema de asimilación de datos (línea celeste). El sombreado gris muestra la desviacion estandard del ensamble el cual esta representando la incerteza en la predicción. El primer día corresponde al 3 de Marzo.`;
  const deadsText = `Observaciones del número de muertes acumuladas (puntos naranja) y la media del número de infectados acumulados estimados con el sistema de asimilación de datos (línea celeste). Las líneas grises muestran el ensamble el cual esta representando la incerteza en la predicción. El primer día corresponde al 3 de Marzo.`;
  const activesText = `Número de infectados COVID-19 activos  estimados con el sistema de asimilación de datos.`;
  const RText = `Número de reproducción efectivo, R(t), estimado con la técnica de asimilación de datos y su incerteza.`;

  let charts;
  if (store.current) {
    charts = <Grid item xs={8}>
                  <Grid container>
                      <Grid item xs={12}>
                          <h2>{store.currentLocation}</h2> ({"fecha de actualización: " + store.current.lastDate})
                      </Grid>
                      <Grid item xs={12}>
                          <Divider className={classes.dividerFullWidth} />
                      </Grid>
                      <Grid item xs={6}>
                        <MuiThemeProvider theme={theme}>
                            <Tooltip title={totalCasesText}>
                                <div style={{ marginBottom: "20px" }}>
                                    Casos totales
                                </div>
                            </Tooltip>
                        </MuiThemeProvider>
                          <Box className={classes.box}>
                              <CasesChart width={chartWidth} height={chartHeight}
                                          data={store.current.cases}
                                          minMax={store.current.minMaxCases}
                              />
                          </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <MuiThemeProvider theme={theme}>
                        <Tooltip title={deadsText}>
                            <div style={{ marginBottom: "20px" }}>
                                Cantidad de muertos
                            </div>
                        </Tooltip>
                        </MuiThemeProvider>
                          <Box className={classes.box}>
                              <CasesChart width={chartWidth} height={chartHeight}
                                          data={store.current.deads}
                                          minMax={store.current.minMaxDeaths}
                              />
                          </Box>
                      </Grid>
                      <Grid item xs={12}>
                          <Divider className={classes.dividerFullWidth} />
                      </Grid>
                      <Grid item xs={6}>
                        <MuiThemeProvider theme={theme}>
                        <Tooltip title={activesText}>
                            <div style={{ marginBottom: "20px" }}>
                                Casos activos
                            </div>
                        </Tooltip>
                        </MuiThemeProvider>
                          <Box className={classes.box}>
                              <CasesChart width={chartWidth} height={chartHeight}
                                          data={store.current.actives}
                                          minMax={store.current.minMaxActives}

                              />
                          </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <MuiThemeProvider theme={theme}>
                        <Tooltip title={RText}>
                            <div style={{ marginBottom: "20px" }}>
                                    R(t)
                            </div>
                        </Tooltip>
                        </MuiThemeProvider>
                          <Box className={classes.box}>
                              <CasesChart width={chartWidth} height={chartHeight}
                                          data={store.current.r}
                                          minMax={store.current.minMaxR}
                              />
                          </Box>
                      </Grid>
                  </Grid>
              </Grid>;
  } else {
      charts = <Grid item xs={8}>
                  <Grid container>
                      <Grid item xs={12}>
                          <h2>{'No hay datos disponibles de '} {modeName} para {store.currentLocation}</h2>
                      </Grid>
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
      <ProjectInfo open={open} onClose={handleClose}/>
      <Grid container className={classes.root}
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
            alignContent="center"
            spacing={2}>
          <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                  <h3>Sistema de monitoreo y predicción del COVID-19 en la provincia de Corrientes [DEMO]</h3>
                  <Button style={{ background: 'transparent', boxShadow: 'none'}}
                        onClick={handleClickOpen}
                        startIcon={<InfoIcon>info</InfoIcon>}
                        >Info</Button>
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
              <Grid item xs={3}>
                  <Box className={classes.box}>
                      <ArgentinaMapMenu store={store} />
                  </Box>
              </Grid>
              {charts}
          </Grid>
      </Grid>
    </Box>
      </MuiThemeProvider>
  );
})

export default App;
