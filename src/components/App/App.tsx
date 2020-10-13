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
import {observer} from "mobx-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

import {
  createMuiTheme,
  MuiThemeProvider
} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import {ChartExplanation} from "./ChartExplanation";
import {DialogContent} from "@material-ui/core";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Typography from "@material-ui/core/Typography";

const url_facena = "http://exa.unne.edu.ar/";
const url_cima = "http://www.cima.fcen.uba.ar/index.php";
const url_imit = "https://imit.conicet.gov.ar/";


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
  const [explain, setExplain] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickExplain = () => {
    setExplain(true);
  };

  const handleCloseExplain = () => {
    setExplain(false);
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
  if (store.current) {
          let minMax;
          let data;
          let provincia = store.currentLocation;
          let chartPerDay = false;
          if (store.currentLocation === "Tierra del Fuego") {
              provincia = "Tierra del Fuego, Malvinas y Antártida"
          }
          if (store.selectedChart === "actives") {
            title = "Casos activos";
            minMax = store.current.minMaxActives;
            data = store.current.actives;
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
          }
          else if (store.selectedChart === "deads") {
            if (store.chartPerDay) {
                minMax = store.current.minMaxDailyDeads;
                data = store.current.dailyDeads;
                title = "Cantidad de fallecimientos diarios";
            } else {
                minMax = store.current.minMaxDeaths;
                data = store.current.deads;
                title = "Cantidad de fallecimientos acumulados";
            }
            chartPerDay = true;
          }
          else if (store.selectedChart === "r") {
            title = "R(t) estimado";
            minMax = [0, store.current.minMaxR[1]];
            data = store.current.r;
          }
          explainTitle = title;

          const radioPerDay = chartPerDay ? <RadioGroup row aria-label="position" value={store.chartPerDay ? "daily" : "accumulated"} onChange={handleRadioChange}>
                    <FormControlLabel value="accumulated" control={<Radio size="small" />} label="Acumulado" />
                    <FormControlLabel value="daily" control={<Radio size="small" />} label="Diario" />
                </RadioGroup> : <div/>;

          const chart = <>
            <Grid container>
            <Grid container alignItems="flex-start" direction="row" style={{height: "25%", marginLeft: 35}} xs={12}>
                <Grid xs={1}>
                </Grid>
                <Grid xs={8}>
                    {radioPerDay}
                </Grid>
                <Grid xs={3}>
                    <MuiThemeProvider theme={theme}>
                        <Button size="small" color="primary" onClick={handleClickExplain}
                                style={{paddingTop: 0, paddingBottom: 0, marginBottom: 0, marginTop: 0}}>
                        <Box display="flex" justifyContent="center"
                             style={{paddingTop: 0, paddingBottom: 0, marginBottom: 0, marginTop: 0}}>
                            <b><FontAwesomeIcon style={{marginRight: 5, color: "#F88"}} icon={faInfoCircle}/>
                            Explicación</b>
                        </Box>
                        </Button>
                    </MuiThemeProvider>
                </Grid>
            </Grid>
            <Grid item xs={12}>
            <Box className={classes.box}>
                  <CasesChart width={chartWidth} height={chartHeight}
                              data={data}
                              yLabel={title}
                              mode={store.currentMode}
                              constantLine={store.selectedChart==="r" ? 1 : undefined}
                              constantLabel={store.selectedChart==="r" ? "R(t)=1" : undefined}
                              onClick={(event: any) => handleChartClick({...event, chart: store.selectedChart})}
                              minMax={minMax}
                  />
            </Box>
            </Grid>
          </Grid>
              </>

        charts = <>
              <Grid container>
                <Grid item alignItems='center' alignContent='center'
                      style={{paddingBottom: 0, marginBottom: 0}} xs={12}>
                      <h4 style={{paddingBottom: 0, marginBottom: 0}}>{`${title} en ${provincia}`}</h4>
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
            <FormControlLabel value="actives" control={<Radio />} label="Casos activos" />
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
                    <img alt="IMIT-UNNE-CONICET" src="logo_imit.jpg" className={classes.largeLogo}/>
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
              <Grid item xs={9}>
                  <Grid container>
                      <Grid item xs={10}>
                        {charts}
                      </Grid>
                      <Grid item xs={2}>
                          {chartsMenu}
                      </Grid>
                      <Grid container>
                          <Grid item xs={1}>

                          </Grid>
                          <Grid item xs={9} alignContent={"flex-start"}>
                            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                                <Box p={1}>
                                  <h4>{`Fecha de asimilación: ${assimilationDate[2]}/${assimilationDate[1]}/${assimilationDate[0]}`}</h4>
                                  El sistema es puramente experimental. Por ser totalmente automático no se controlan ni realizan evaluaciones diarias de los resultados. Quienes desarrollamos este proyecto no nos responsabilizamos por la mala interpretación o uso de la información que se está publicando en el sitio.
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
            <ProjectInfo />
        </Dialog>
        <Dialog onClose={handleCloseExplain} aria-labelledby="simple-dialog-title"
                open={explain} maxWidth={"sm"} fullWidth={false}>
              <DialogTitle id="simple-dialog-title">{explainTitle}</DialogTitle>
            <DialogContent>
                <ChartExplanation explanation={store.selectedChart} mode={store.currentMode}/>
            </DialogContent>
        </Dialog>
      </Grid>
      </Grid>
    </Box>
</MuiThemeProvider>
  );
})

export default App;
