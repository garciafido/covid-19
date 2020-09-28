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
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import {ChartExplanation} from "./ChartExplanation";
import {DialogContent} from "@material-ui/core";


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
  let title;
  let explainTitle;
  if (store.current) {
          let minMax;
          let data;
          let provincia = store.currentLocation;
          if (store.currentLocation === "Tierra del Fuego") {
              provincia = "Tierra del Fuego, Malvinas y Antártida"
          }
          if (store.selectedChart === "actives") {
            title = "Casos activos";
            minMax = store.current.minMaxActives;
            data = store.current.actives;
          }
          else if (store.selectedChart === "cases") {
            title = "Casos acumulados";
            minMax = store.current.minMaxCases;
            data = store.current.cases;
          }
          else if (store.selectedChart === "deads") {
            title = "Cantidad de fallecimientos acumulados";
            minMax = store.current.minMaxDeaths;
            data = store.current.deads;
          }
          else if (store.selectedChart === "r") {
            title = "R(t) estimado";
            minMax = [0, store.current.minMaxR[1]];
            data = store.current.r;
          }
          explainTitle = title;

          const chart = <>
            <Grid container>
            <Grid container alignItems="flex-start" justify="flex-end" direction="row" style={{height: "25%", marginRight: 35}} xs={12}>
            <MuiThemeProvider theme={theme}>
                <Button size="small" color="primary" onClick={handleClickExplain}>
                <Box display="flex" justifyContent="center">
                    <b><FontAwesomeIcon style={{marginRight: 5, color: "#F88"}} icon={faInfoCircle}/></b>
                    Explicación
                </Box>
                </Button>
            </MuiThemeProvider>
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
                <Grid item alignItems='center' alignContent='center' style={{height: "25%"}} xs={12} >
                      <h4>{`${title} en ${provincia}`}</h4>
                </Grid>
                <Grid item xs={12}>
                    {chart}
                </Grid>
              </Grid>
        </>;

        chartsMenu = <>
            <Paper className={classes.paper}>
                <MenuList>
                  <MenuItem onClick={() => handleChartTypeClick("cases")}
                            selected={store.selectedChart==="cases"}>Casos</MenuItem>
                  <MenuItem onClick={() => handleChartTypeClick("actives")}
                            selected={store.selectedChart==="actives"}>Casos activos</MenuItem>
                  <MenuItem onClick={() => handleChartTypeClick("deads")}
                            selected={store.selectedChart==="deads"}>Fallecidos</MenuItem>
                  <MenuItem onClick={() => handleChartTypeClick("r")}
                            selected={store.selectedChart==="r"}>R(t) estimado</MenuItem>
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
          <Grid container alignItems="flex-start" justify="flex-end" direction="row" style={{height: "25%", marginRight: 25}} xs={12}>
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
                  <h6>El sistema  es puramente experimental. Por ser totalmente automático no se controlan ni realizan evaluaciones diarias de los resultados. Quienes desarrollamos este proyecto no nos responsabilizamos por la mala interpretación o uso de la información que se está publicando en el sitio.</h6>
              </Grid>
              <Grid item xs={2}>
                  {chartsMenu}
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
