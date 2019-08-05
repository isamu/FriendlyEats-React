import React, { useEffect } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import theme from './theme';
import Home from './Home';
import About from './About';
import Restaurant from './Restaurant';
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import config from './config';

firebase.initializeApp(config);
const db = firebase.firestore();

function App() {
  useEffect(()=>{
    firebase.auth().signInAnonymously();
  }, []);
    
  const params = { db };
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Route exact path="/" render={(props) => <Home {...props} {...params} />} />
        <Route exact path="/restaurant/:id" render={(props) => <Restaurant {...props} {...params} />} />
        <Route exact path="/about" render={(props) => <About {...props} {...params} />} />
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
