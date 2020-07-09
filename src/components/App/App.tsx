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
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  control: {
    padding: theme.spacing(2),
  },
}));

function App() {
  const classes = useStyles();

  return (
    <div className="App">
      <header>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      </header>
      <Grid container className={classes.root}
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
            spacing={2}>
          <Grid item xs={12}>
              <Paper className={classes.paper}>
                  <ArgentinaMapMenu />
              </Paper>
          </Grid>
      </Grid>
    </div>
  );
}

export default App;
