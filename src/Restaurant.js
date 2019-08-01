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
  },
  ratingStart: {
    float: "right",
    color: "#feb22c",
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
        const detacher = data.onSnapshot((snapshot) => {
          const ratings = [];
          snapshot.forEach((doc) => {
            const rating = doc.data();
            rating.id = doc.id;
            ratings.push(rating);
          });
          setRatings(ratings);
        });
        return () => detacher();
      }
    })();
  }, [id, ratings.length]);

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
        ret.push(<Icon key={r}>star</Icon>);
      } else {
        ret.push(<Icon key={r}>star_border</Icon>);
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
        <div>{renderRating(restaurant.avgRating)}</div>
        {restaurant.city} / {restaurant.category}<br/>
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
         return (<React.Fragment key={rating.id}>
                 <Grid item xs={3}/ >
                 <Grid item xs={6} style={{ marginTop: "10px", paddingBottom: "10px", borderBottom: "1px solid"}}>
                 <div style={{marginBottom: "8px"}}>
                 <span style={{color: "#999"}}>{rating.userName}</span>
                 <span className={classes.ratingStart}>{renderRating(rating.rating)}</span>
                 </div>
                 {rating.text}</Grid>
                 <Grid item xs={3}/ >
                 </React.Fragment>)
       })
       }
      </Grid>
    </React.Fragment>
}

export default withStyles(styles)(Restaurant);