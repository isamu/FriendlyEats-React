import React, { useState, useEffect } from 'react';
import Header from './Header';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';

import { withStyles } from '@material-ui/core/styles';

import * as FriendlyEatsData from './FriendlyEats/FriendlyEats.Data';
import * as FriendlyEatsMock from './FriendlyEats/FriendlyEats.Mock';

const styles = theme => ({
  root: {
//    paddingTop: theme.spacing(10),
  },
  "guy-container": {
    paddingTop: "100px",
    textAlign: "center",
  },
  guy: {
    maxWidth: "200px",
    marginBottom: "20px",
  },
  imageHead: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  restaurantHeade: {
    color: "white",
    fontSize: "22px",
    fontWeight: "bold",
  }
  
});

function Restaurant(props) {
  const { classes } = props;

  const [restaurant, setRestaurant] = useState({});
  const [ratings, setRatings] = useState([]);

  const id = props.match.params.id;
  
  useEffect(() => {
    (async () => {
      const restaurant = await FriendlyEatsData.getRestaurant(id);
      if (restaurant && restaurant.exists) {
        setRestaurant(restaurant.data());

        const data =  await FriendlyEatsData.getRating(id);
        data.onSnapshot((snapshot) => {
          const ratings = [];
          snapshot.forEach((doc) => {
            const rating = doc.data();
            rating.id = doc.id;
            console.log(rating);
            ratings.push(rating);
          });
          setRatings(ratings);
        });
      }
    })();
  }, [id]);

  const addRating = async (restaurantId) => {
    await FriendlyEatsMock.addMockRatings(restaurantId);
  }
  const myStyle = {
    backgroundImage: "url(" + restaurant.photo + ")",
    width: "100%",
  }
  const renderRating = (rating) => {
    const ret = [];
    for (let r = 0; r < 5; r += 1) {
      if (r < Math.floor(rating)) {
        ret.push(<Icon>star</Icon>);
      } else {
        ret.push(<Icon>star_border</Icon>);
      }
    }
    return ret;
  };

  return <React.Fragment>
    <Header />
      <Grid container justify="center" alignItems="center" direction="column" className={classes.restaurantHeade} style={myStyle}>
      {restaurant.name ?
       (<React.Fragment>
        <h2 style={{margin: "5px"}}>{restaurant.name}</h2>
        {restaurant.city} / {restaurant.category}<br/>
        <div>{renderRating(restaurant.avgRating)}</div>
        </React.Fragment>) :
        (<div id="guy-container" className="mdc-toolbar-fixed-adjust">
           <img className={classes.guy} src="/img/guy_fireats.png" alt="guy fireats" /><br/>
           <div className="text">
          No restaurant data.<br />
          Implement getRestaurant.
          </div>
          <br />
        </div>)}
      </Grid>
      <Grid container justify="center" alignItems="center" direction="row" className={classes.root}>
      {(restaurant.name && ratings.length === 0) ?
       (<div id="guy-container" className="mdc-toolbar-fixed-adjust">
           <img className={classes.guy} src="/img/guy_fireats.png" alt="guy fireats" />
          <div className="text">
            This restaurant has no ratings.<br />
          </div>
          <br />
        <v-btn color="success" onClick={() => addRating(id)} >Add Rating</v-btn>
        </div>)
       :
       ratings.map((rating) => {
         return (<React.Fragment>
                 <Grid item xs={2}/ >
                 <Grid item xs={8}>{rating.text}/{rating.rating}/{rating.userName}</Grid>
                 <Grid item xs={2}/ >
                 </React.Fragment>)
       })
       }
      </Grid>
    </React.Fragment>
}

export default withStyles(styles)(Restaurant);