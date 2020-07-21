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
import { CasesChart } from '../BaseChart';
import {Divider} from "@material-ui/core";


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
}));

const App = () => {
  const [value, setValue] = React.useState(0);
  const classes = useStyles();
  const chartWidth = 300;
  const chartHeight = 200;

  const handleChange = (event: React.ChangeEvent<{}>, newValue: any): void => {
    setValue(newValue);
  };

 return (
    <div className="App">
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
          <Grid item xs={12}>
              <Paper className={classes.paper}>
                  <h3>Sistema de monitoreo y predicción del COVID-19 en la provincia de Corrientes</h3>
              </Paper>
          </Grid>
          <Grid container>
            <AppBar position="static"  color="default">
              <Tabs value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered>
                <Tab label="Monitoreo" />
                <Tab label="Predicción" />
              </Tabs>
            </AppBar>
              <Grid item xs={3}>
                  <Box className={classes.box}>
                      <ArgentinaMapMenu store={store} />
                  </Box>
              </Grid>
              <Grid item xs={8}>
                  <Grid container>
                      <Grid item xs={12}>
                          <h3>Total Argentina</h3>
                      </Grid>
                      <Grid item xs={12}>
                          <Divider className={classes.dividerFullWidth} />
                      </Grid>
                      <Grid item xs={6}>
                          Casos totales
                          <Box className={classes.box}>
                              <CasesChart width={chartWidth} height={chartHeight} data={store.argentinaCases} />
                          </Box>
                      </Grid>
                      <Grid item xs={6}>
                          Cantidad de muertos
                          <Box className={classes.box}>
                              <CasesChart width={chartWidth} height={chartHeight} data={store.argentinaDeaths} />
                          </Box>
                      </Grid>
                      <Grid item xs={12}>
                          <Divider className={classes.dividerFullWidth} />
                      </Grid>
                      <Grid item xs={6}>
                          Casos activos
                          <Box className={classes.box}>
                              <CasesChart width={chartWidth} height={chartHeight} data={store.argentinaActives} />
                          </Box>
                      </Grid>
                      <Grid item xs={6}>
                          R
                          <Box className={classes.box}>
                              <CasesChart width={chartWidth} height={chartHeight} data={store.argentinaR} />
                          </Box>
                      </Grid>
                  </Grid>
              </Grid>
          </Grid>
      </Grid>
    </div>
  );
}

export default App;
