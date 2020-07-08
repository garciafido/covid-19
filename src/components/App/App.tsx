import React from 'react';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import { ArgentinaMapMenu } from '../ArgentinaMap';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
}));

function App() {
  const spacing = 2;
  const classes = useStyles();

  return (
    <div className="App">
      <header>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      </header>
      <Grid container className={classes.root} spacing={2}>
          <Grid item xs={2}>
            <Grid container justify="center" spacing={spacing}>
              <Paper className={classes.paper}>
                  <ArgentinaMapMenu/>
              </Paper>
            </Grid>
          </Grid>
      </Grid>
    </div>
  );
}

export default App;
