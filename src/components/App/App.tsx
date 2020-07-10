import React from 'react';
import './App.css';
import { Theme, makeStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { store } from '../../store/';
import { ArgentinaMapMenu } from '../ArgentinaMap';
import { BaseChart } from '../BaseChart';
import {Box} from "@material-ui/core";


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
}));

const App = () => {
  const classes = useStyles();
  const chartWidth = 500;
  const chartHeight = 300;
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
                  Sistema de monitoreo y prediccion del COVID-19 en la provincia de Corrientes
              </Paper>
          </Grid>
          <Grid container>
              <Grid item xs={3}>
                  <Paper className={classes.paper}>
                      <ArgentinaMapMenu store={store} />
                  </Paper>
              </Grid>
              <Grid item xs={9}>
                  <Grid container>
                      <Grid item xs={12}>
                          Argentina
                      </Grid>
                      <Grid item xs={6}>
                          <Box className={classes.paper}>
                              <BaseChart width={chartWidth} height={chartHeight} title={"Titulo 1"} />
                          </Box>
                      </Grid>
                      <Grid item xs={6}>
                          <Box className={classes.paper}>
                              <BaseChart width={chartWidth} height={chartHeight} title={"Titulo 2"} />
                          </Box>
                      </Grid>
                      <Grid item xs={12}>
                          Corrientes
                      </Grid>
                      <Grid item xs={6}>
                          <Box className={classes.paper}>
                              <BaseChart width={chartWidth} height={chartHeight} title={"Titulo 3"} />
                          </Box>
                      </Grid>
                      <Grid item xs={6}>
                          <Box className={classes.paper}>
                              <BaseChart width={chartWidth} height={chartHeight} title={"Titulo 4"} />
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
