import React, {useState, useEffect }  from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Header from './Header';

import * as FriendlyEatsData from './FriendlyEats/FriendlyEats.Data';
import * as FriendlyEatsMock from './FriendlyEats/FriendlyEats.Mock';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  caption: {
    textAlign: "center",
    width: "100%",
  },
  "guy-container": {
    paddingTop: "100px",
    textAlign: "center",
  },
  guy: {
    maxWidth: "200px",
    marginBottom: "20px",
  }
});

function Home(props) {
  const { classes } = props;

  const [restaurants, setRestaurants] = useState([]);
    
  useEffect(()=>{
    const data = FriendlyEatsData.getAllRestaurants();
    if (data) {
      const detacher = data.onSnapshot((snapshot) => {
        const rets = []
        snapshot.forEach((doc) => {
          const ret = doc.data();
          ret.id = doc.id;
          rets.push(ret);
        });
        setRestaurants(rets);
      });
      return () => detacher();
    }
  });

  const importData = () => {
    FriendlyEatsMock.addMockRestaurants();
  }
  const goRestaurant = (restaurantId) => {
    props.history.push(`/restaurant/${restaurantId}`);
  }
  return (
    <React.Fragment>
      <Header />
      <Grid container justify="center" alignItems="center" direction="row" className={classes.root}>
        {restaurants.length > 0 ?
         restaurants.map((restaurant) => {
           return (<Grid item xs={3} onClick={() => {goRestaurant(restaurant.id)}} key={restaurant.id}>
                   <img src={restaurant.photo} alt={restaurant.name}/> <br/>
                     {restaurant.name}
                   </Grid>)
         })
         :
         <div id="guy-container" className="mdc-toolbar-fixed-adjust">
           <img className={classes.guy} src="/img/guy_fireats.png" alt="guy fireats" />
           <div className="text">
             This app is connected to the Firebase project "<b>{}</b>".<br />
             <br />
             Your Cloud Firestore has no documents in <b>/restaurants/</b>.
           </div>
           <br />
           <button color="success" onClick={() => importData()}>Import Data</button>
         </div>
        }
      </Grid>
    </React.Fragment>
  );
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
