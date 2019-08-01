import React, {useState, useEffect }  from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
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
  }, []);

  const importData = () => {
    FriendlyEatsMock.addMockRestaurants();
  }
  const goRestaurant = (restaurantId) => {
    props.history.push(`/restaurant/${restaurantId}`);
  }
  const getStar = (rating) => {
    const ret = [];
    for (let r = 0; r < 5; r += 1) {
      if (r < Math.floor(rating)) {
        ret.push({id: r, value: "star"});
      } else {
        ret.push({id: r, value: "star_border"});
      }
    }
    return ret;
  };
  const getPrice = (price) => {
    const ret = [];
    for (let r = 0; r < price; r += 1) {
      ret.push("$");
    }
    return ret;

  }
  return (
    <React.Fragment>
      <Header />
      <Grid container justify="center" direction="row" className={classes.root}>
        {restaurants.length > 0 ?
         restaurants.map((restaurant) => {
           return (<Grid item xs={4} onClick={() => {goRestaurant(restaurant.id)}} key={restaurant.id}>
                   <div style={{marginLeft: "auto", marginRight: "auto", marginBottom: "20px", width: "80%"}}>
                   <img src={restaurant.photo} alt={restaurant.name} style={{width: "100%", objectFit: "cover"}}/> <br/>
                   <span style={{ position: 'relative', float: 'right'}}>{getPrice(restaurant.price)}</span>
                   <h2 style={{ marginTop: '2px', marginBottom: '5px'}}>{restaurant.name}</h2>
                   {getStar(restaurant.avgRating).map((star) => (<Icon style={{color: '#feb22c'}} key={star.id}>{star.value}</Icon>) )}<br/>
                   {restaurant.city}
                   ●
                   {restaurant.category}
                   </div>
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
