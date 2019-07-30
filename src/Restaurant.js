import React, { useState, useEffect } from 'react';
import Header from './Header';

import { withStyles } from '@material-ui/core/styles';

import * as FriendlyEatsData from './FriendlyEats/FriendlyEats.Data';
import * as FriendlyEatsMock from './FriendlyEats/FriendlyEats.Mock';

const styles = theme => ({
  root: {
    paddingTop: theme.spacing(10),
  },
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
  
  return <React.Fragment>
    <Header />
    <div className={classes.root}>
      <img src={restaurant.photo} />
      {restaurant.name}
      {(ratings.length === 0) ?
       (<div id="guy-container" class="mdc-toolbar-fixed-adjust">
          <img class="guy" src="/img/guy_fireats.png" />
          <div class="text">
            This restaurant has no ratings.<br />
          </div>
          <br />
        <v-btn color="success" onClick={() => addRating(id)} >Add Rating</v-btn>
        </div>)
       :
       ratings.map((rating) => {
         return <div>{rating.text}</div>
       })
       }
    </div>
    </React.Fragment>
}

export default withStyles(styles)(Restaurant);