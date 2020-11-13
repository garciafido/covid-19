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
import {BaseChartContainer} from '../Charts/Base';
import {MultiChartContainer} from '../Charts/Multi';
import {observer} from "mobx-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import fileDownload from 'js-file-download';
import axios from 'axios';

import {
  createMuiTheme,
  MuiThemeProvider
} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import {ChartExplanation} from "./ChartExplanation";
import {ChartMapExplanation} from "./ChartMapExplanation";
import {DialogContent} from "@material-ui/core";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import {fileNames} from "../../store/store";
import Tooltip from "@material-ui/core/Tooltip";
import withStyles from "@material-ui/core/styles/withStyles";

const url_facena = "http://exa.unne.edu.ar/";
const url_cima = "http://www.cima.fcen.uba.ar/index.php";
const url_unne = "https://www.unne.edu.ar/";
const url_imit = "https://imit.conicet.gov.ar/";
const url_datos = "http://datos.salud.gob.ar/dataset/covid-19-casos-registrados-en-la-republica-argentina";

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
  disclaimerBox: {
    alignItems: "left",
  },
  button: {
    margin: theme.spacing(1),
  },
  largeLogo: {
    height: theme.spacing(6),
  },
}));

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

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

function numberWithCommas(x: number | undefined) {
    if (x === undefined) return "";
    return (x as number).toString().replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const App = observer((props: any) => {
  const classes = useStyles();
  const chartWidth = 300;
  const chartHeight = 200;
  const [open, setOpen] = React.useState(false);
  const [explain, setExplain] = React.useState(false);
  const [mapExplain, setMapExplain] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const filesURL = "/data/";

  const handleDownload = (filenames: string[]) => {
      for (let filename of filenames) {
          axios.get(`${filesURL}${filename}`, {
                responseType: 'blob',
            }).then(res => {
                fileDownload(res.data, filename);
            }).catch(err => {
                console.log(err);
            });
      }
  };

  const handleClickExplain = () => {
    setExplain(true);
  };

  const handleCloseExplain = () => {
    setExplain(false);
  };

  const handleClickMapExplain = () => {
    setMapExplain(true);
  };

  const handleCloseMapExplain = () => {
    setMapExplain(false);
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: any): void => {
    store.setCurrentMode(newValue);
  };

  const handleRadioChange = (event: any): void => {
      store.setChartPerDay(event.target.value === "daily");
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

  const handleChartTypeClick = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
      store.setSelectedChart(value);
  };

  const modeName = store.currentMode === 'monitoreo' ? "monitoreo" : "predicción";

  const assimilationDate = store.assimilationDate.split('-');

  let charts;
  let chartsMenu;
  let title;
  let explainTitle;
  let explainMapTitle = "Mapa de Argentina";
  let currentValuePerMillion: number | undefined = undefined;
  let currentValue: number | undefined = undefined;
  let provinciaLabel = store.currentLocation;
  let shortDate: string = "";
  let referenceAreaValue: string = "";
  let referenceValue: string = "";
  let referenceLabel: string = "Hoy (*)";

  const currentFilenames: string[] = [];
  const locations = store.multiSelect ? store.selectedLocations : [store.currentLocation];
  for (let location of locations) {
    const fileName = fileNames[location];
    if (store.currentMode === 'monitoreo') {
        currentFilenames.push(`${fileName}.csv`);
//        currentFilenames.push(`${fileName}-val1.csv`);
//        currentFilenames.push(`${fileName}-val2.csv`);
//        currentFilenames.push(`${fileName}-val3.csv`);
    } else {
        currentFilenames.push(`${fileName}-for1.csv`);
        currentFilenames.push(`${fileName}-for2.csv`);
        currentFilenames.push(`${fileName}-for3.csv`);
    }
  }

  if (store.current) {
          let minMax;
          let data;
          let chartPerDay = false;
          const lDate = store.selectedDate.split('-');
          shortDate = `${lDate[2]}/${lDate[1]}/${lDate[0]}`;
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1)
          currentValue = Math.trunc(store.getCurrentValue()*10)/10;
          if (store.currentMode === "prediccion") {
            referenceAreaValue = `${tomorrow.getDate().toString().padStart(2,"0")}/${(tomorrow.getMonth()+1).toString().padStart(2,"0")}`;
            referenceValue = `${today.getDate().toString().padStart(2,"0")}/${(today.getMonth()+1).toString().padStart(2,"0")}`;
          }

          if (store.currentLocation === "Tierra del Fuego") {
              provinciaLabel = "Tierra del Fuego, Malvinas y Antártida"
          } else if (store.currentLocation === "Buenos Aires") {
              provinciaLabel = "Buenos Aires (sin G.B.A.)"
          }

          if (store.selectedChart === "actives") {
            title = "Casos activos";
            minMax = store.current.minMaxActives;
            data = store.current.actives;
            currentValuePerMillion = Math.trunc(store.getColorValue(store.currentLocation).value*10)/10;
          }
          else if (store.selectedChart === "cases") {
            if (store.chartPerDay) {
                title = "Casos diarios";
                minMax = store.current.minMaxDailyCases;
                data = store.current.dailyCases;
            } else {
                title = "Casos acumulados";
                minMax = store.current.minMaxCases;
                data = store.current.cases;
            }
            chartPerDay = true;
            currentValuePerMillion = Math.trunc(store.getColorValue(store.currentLocation).value*10)/10;
          }
          else if (store.selectedChart === "deads") {
            if (store.chartPerDay) {
                minMax = store.current.minMaxDailyDeads;
                data = store.current.dailyDeads;
                title = "Fallecimientos diarios";
            } else {
                minMax = store.current.minMaxDeaths;
                data = store.current.deads;
                title = "Fallecimientos acumulados";
            }
            currentValuePerMillion = Math.trunc(store.getColorValue(store.currentLocation).value*10)/10;
            chartPerDay = true;
          }
          else if (store.selectedChart === "r") {
            if (store.currentMode === "prediccion") {
                title = "R(t) proyectado";
            } else {
                title = "R(t) estimado";
            }
            minMax = [0, store.current.minMaxR[1]];
            data = store.current.r;
          }
          explainTitle = title;

          const radioPerDay = chartPerDay ? <RadioGroup row aria-label="position"
                                                        style={{height:31, marginBottom: 0, paddingBottom: 0}}
                                                        value={store.chartPerDay ? "daily" : "accumulated"}
                                                        onChange={handleRadioChange}>
                    <FormControlLabel value="accumulated"
                                      style={{marginBottom: 0, paddingBottom: 0}}
                                      control={<Radio size="small" />} label="Acumulado" />
                    <FormControlLabel value="daily"
                                      style={{marginBottom: 0, paddingBottom: 0}}
                                      control={<Radio size="small" />} label="Por día" />
                </RadioGroup> : <div/>;


          let chartContainer;
          if (store.multiSelect) {
                chartContainer = <MultiChartContainer width={chartWidth} height={chartHeight}
                                      multiData={store.multiData}
                                      yLabel={title}
                                      multiChartColors={store.selectedMultiChartColors}
                                      mode={store.currentMode}
                                      referenceValue={referenceValue}
                                      referenceAreaValue={referenceAreaValue}
                                      referenceLabel={referenceLabel}
                                      constantLine={store.selectedChart==="r" ? 1 : undefined}
                                      constantLabel={store.selectedChart==="r" ? "R(t)=1" : undefined}
                                      onClick={(event: any) => handleChartClick({...event, chart: store.selectedChart})}
                                      minMax={store.globalMinMax}
                  />;
          } else {
                chartContainer = <BaseChartContainer width={chartWidth} height={chartHeight}
                                      data={data}
                                      yLabel={title}
                                      mode={store.currentMode}
                                      referenceValue={referenceValue}
                                      referenceAreaValue={referenceAreaValue}
                                      referenceLabel={referenceLabel}
                                      constantLine={store.selectedChart==="r" ? 1 : undefined}
                                      constantLabel={store.selectedChart==="r" ? "R(t)=1" : undefined}
                                      onClick={(event: any) => handleChartClick({...event, chart: store.selectedChart})}
                                      minMax={minMax}
                  />;
          }



          const chart = <>
            <Grid container>
            <Grid container alignItems="flex-start" direction="row" style={{height: "25%", marginLeft: 35}} xs={12}>
                <Grid xs={1}>
                </Grid>
                <Grid xs={4}>
                    {radioPerDay}
                </Grid>
                <Grid xs={5}>
                </Grid>
                <Grid xs={2}>
                    <MuiThemeProvider theme={theme}>
                        <Button size="small" color="primary" onClick={handleClickExplain}
                                style={{marginTop: 10, paddingTop: 0, marginBottom: 0, paddingBottom: 0, fontSize: '9pt'}}>
                        <Box display="flex" justifyContent="center">
                            <span><FontAwesomeIcon style={{marginRight: 5, color: "#F88"}} icon={faInfoCircle}/>
                            Explicación</span>
                        </Box>
                        </Button>
                    </MuiThemeProvider>
                </Grid>
            </Grid>
            <Grid item xs={12}>
            <Box className={classes.box}>
                { chartContainer }
            </Box>
            </Grid>
          </Grid>
              </>

        charts = <>
              <Grid container>
                <Grid container alignItems='center' alignContent='center'
                      style={{paddingBottom: 0, marginBottom: 0, marginLeft: 35}} xs={12}>
                    <Grid item xs={1}>
                    </Grid>
                    <Grid item xs={11}>
                    <Typography align="left">
                      <h2 style={{paddingTop: 0, marginTop: 5, paddingBottom: 0, marginBottom: 0}}>
                          {store.multiSelect ? "Comparativa" : `${provinciaLabel}`}</h2>
                      <h4 style={{paddingTop: 0, marginTop: 0, paddingBottom: 0, marginBottom: 0}}>
                          {`${title}`}</h4>
                    </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    {chart}
                </Grid>
              </Grid>
        </>;

        chartsMenu = <>
            <Paper className={classes.paper}>
        <RadioGroup aria-label="gender" name="gender1" value={store.selectedChart} onChange={handleChartTypeClick}>
            <FormControlLabel value="cases" control={<Radio />} label="Casos" />
            <FormControlLabel value="actives" control={<Radio />} label="Activos" />
            <FormControlLabel value="deads" control={<Radio />} label="Fallecidos" />
            <FormControlLabel value="r" control={<Radio />} label="R(t) estimado" />
          </RadioGroup>
            </Paper>
        </>;
  } else {
      charts = <Grid container>
                  <Grid item xs={12}>
                      <h2>{'No hay datos disponibles de '} {modeName} para {store.currentLocation}</h2>
                  </Grid>
               </Grid>
  }

  let footnote: string = "";
  if (referenceValue) {
      footnote = "(*)  Debido a que no se terminan de cargar los casos de los últimos 5 días en la base de datos del SNVS, no se puede hacer el análisis hasta el día de hoy. Por esta razón  las predicciones se inician 5 días antes a la fecha de hoy, por un plazo de 30 días.";
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
          <Grid container style={{marginTop: 3, paddingBottom: 0, marginBottom: 0}}
                justify="center" alignItems="stretch">
              <Grid item xs={3} style={{paddingRight: 25, marginTop: 15, paddingBottom: 0, marginBottom: 0}}>
                <a href={url_facena} target="_blank" rel="noopener noreferrer" style={{paddingLeft: 15}} >
                    <img alt="FaCENA" src="recor-facena.png" className={classes.largeLogo}/>
                </a>
                <a href={url_cima} target="_blank" rel="noopener noreferrer" style={{paddingLeft: 15}} >
                    <img alt="CIMA-UBA-CONICET" src="logo_cima.png"  className={classes.largeLogo}/>
                </a>
                <a href={url_imit} target="_blank" rel="noopener noreferrer" style={{paddingLeft: 15}} >
                    <img alt="IMIT-CONICET" src="logo_imit.png" className={classes.largeLogo}/>
                </a>
                <a href={url_unne} target="_blank" rel="noopener noreferrer" style={{paddingLeft: 15}} >
                    <img alt="IMIT-CONICET" src="logo_unne.png" className={classes.largeLogo}/>
                </a>
              </Grid>
              <Grid item xs={6}>
                  <Box >
                      <h3>Sistema de Monitoreo y Predicción de COVID-19 en Argentina</h3>
                  </Box>
              </Grid>
              <Grid item xs={3}>
                  <Box >
                      <h3><b><FontAwesomeIcon style={{marginRight: 5, color: "#F88"}} icon={faInfoCircle}/></b><Button size="small" color="primary" onClick={handleClickOpen}>Acerca del proyecto</Button></h3>
                  </Box>
              </Grid>
          </Grid>
          <Grid container>
            <AppBar position="static" color="default">
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
                  <ArgentinaMapMenu store={store} handleClickExplain={handleClickMapExplain} />
                </Box>
              </Grid>
              <Grid item xs={9}>
                  <Grid container>
                      <Grid item xs={10}>
                        {charts}
                      </Grid>
                      <Grid item xs={2}>
                          <Grid container>
                              <Grid item xs={12}>
                                {chartsMenu}
                              </Grid>
                          </Grid>
                      </Grid>
                      <Grid container>

                          <Grid item xs={1}>
                          </Grid>
                          <Grid container
                                justify="flex-start" alignItems='flex-start' alignContent='flex-start'
                                style={{paddingBottom: 0, marginBottom: 0, paddingTop: 0, marginTop: 0}}
                                xs={7}>
                              <Paper elevation={5}>
                                <Box p={1}>
                            <Typography align="left">
                              <h2 style={{paddingBottom: 0, marginBottom: 0, paddingTop: 0, marginTop: 0}}>
                                  {store.multiSelect ? `${shortDate}: --` : `${shortDate}:  ${numberWithCommas(currentValue)} ${currentValuePerMillion ? "(" + numberWithCommas(currentValuePerMillion) + " / millón)" : ""}`}
                              </h2>
                            </Typography>
                                </Box>
                              </Paper>
                          </Grid>
                          <Grid item xs={2}>
                            <HtmlTooltip title={
                              <React.Fragment>
                                <Typography color="inherit">Descargar Datos</Typography>
                                {'Se descargarán los datos utilizados para generar el gráfico actual en formato '}<b>{'CSV'}</b>.
                              </React.Fragment>
                              }>
                              <Button onClick={() => handleDownload(currentFilenames)} color="primary">
                                Descargar Datos
                              </Button>
                            </HtmlTooltip>
                          </Grid>
                          <Grid item xs={2}>
                          </Grid>

                          <Grid item xs={1}>
                          </Grid>
                          <Grid item xs={9}>
                          <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                                  <Box p={1}>
                                    <h4 style={{paddingBottom:0, marginBottom: 0, paddingTop:0, marginTop: 0}}>{`Fecha de asimilación: ${assimilationDate[2]}/${assimilationDate[1]}/${assimilationDate[0]}`}</h4>
                                  </Box>
                          </Typography>
                          </Grid>
                          <Grid item xs={2}>
                          </Grid>


                          <Grid item xs={1}>
                          </Grid>
                          <Grid item xs={9}>
                          <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                                <Box p={1}>
                                    <h5 style={{paddingBottom:0, marginBottom: 0, paddingTop:0, marginTop: 0}}>{footnote}</h5>
                                </Box>
                          </Typography>
                          </Grid>
                          <Grid item xs={2}>
                          </Grid>


                          <Grid item xs={1}>
                          </Grid>
                          <Grid item xs={9} alignContent={"flex-start"}>
                            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                                <Box p={1}>
                                  Este es un sistema experimental que se alimenta de los datos publicados diariamente
                                    por el Ministerio de Salud de la Nación a través del sistema
                                    &nbsp;
                                    <a href={url_datos} target="_blank" rel="noopener noreferrer">
                                         SNVS (Sistema Nacional de Vigilancia de la Salud)
                                    </a>
                                    &nbsp;
                                    y no cuenta con supervisión humana.
                                    Es por esta razón que las instituciones y los investigadores que participan de este
                                    proyecto no se responsabilizan ni por las malas interpretaciones que estos productos
                                    pueden causar ni por la ausencia o no actualización de la información distribuida
                                    en este sitio. Las instituciones e investigadores participantes entienden que
                                    más allá de las dificultades mencionadas, el potencial benéfico de la información
                                    provista por este sistema justifica el hacerla pública.

                                </Box>
                            </Typography>
                          </Grid>
                          <Grid item xs={2}>
                          </Grid>
                      </Grid>
                  </Grid>
              </Grid>
          </Grid>
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} maxWidth={"md"} fullWidth={true}>
              <DialogTitle id="simple-dialog-title">Acerca del proyecto</DialogTitle>
            <DialogContent>
                <ProjectInfo />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
        <Dialog onClose={handleCloseExplain} aria-labelledby="simple-dialog-title"
                open={explain} maxWidth={"sm"} fullWidth={false}>
              <DialogTitle id="simple-dialog-title">{explainTitle}</DialogTitle>
            <DialogContent>
                <ChartExplanation explanation={store.selectedChart} mode={store.currentMode}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseExplain} color="primary">
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
        <Dialog onClose={handleCloseMapExplain} aria-labelledby="simple-dialog-title"
                open={mapExplain} maxWidth={"sm"} fullWidth={false}>
              <DialogTitle id="simple-dialog-title">{explainMapTitle}</DialogTitle>
            <DialogContent>
                <ChartMapExplanation explanation={store.selectedChart} mode={store.currentMode}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseMapExplain} color="primary">
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
      </Grid>
      </Grid>
    </Box>
</MuiThemeProvider>
  );
})

export default App;
