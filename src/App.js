import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import theme from './theme';
import Home from './Home';
import About from './About';
import ErrorModal from './ErrorModal';
import Restaurant from './Restaurant';
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import config from './config';

try {
  firebase.initializeApp(config);
} catch (e) {
  // console.log(firebase init error)
}

function App() {
  const [errorModalOpen, setErrorModalOpen ] = useState(false);
  const [errorType, setErrorType ] = useState("");
  
  useEffect(()=>{
    const init = async () => {
      if (!config || Object.keys(config).length === 0) {
        setErrorType("app.config");
        setErrorModalOpen(true);
      } else {
        try {
          await firebase.auth().signInAnonymously();
        } catch (e) {
          setErrorType("app.anonymouse");
          setErrorModalOpen(true); 
        }
      }
    };
    init();
  }, []);
    
  const errorToggle = (type) => {
    if (type) {
      setErrorType(type);
    }
    setErrorModalOpen(!errorModalOpen);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Route exact path="/" render={(props) => <Home {...props} errorToggle={errorToggle} setErrorType={setErrorType} setErrorModalOpen={setErrorModalOpen} />} />
        <Route exact path="/restaurant/:id" render={(props) => <Restaurant {...props} errorToggle={errorToggle} />} />
        <Route exact path="/about" render={(props) => <About {...props} />} />
      </Router>
      <ErrorModal modalOpen={errorModalOpen} toggle={() => {setErrorModalOpen(!errorModalOpen)}} errorType={errorType} config={config} />
    </MuiThemeProvider>
  );
}

export default App;
