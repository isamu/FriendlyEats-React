import React, {useState, useEffect, useReducer }  from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import ErrorModal from './ErrorModal';
import Header from './Header';

import * as FriendlyEatsData from './FriendlyEats/FriendlyEats.Data';
import * as FriendlyEatsMock from './FriendlyEats/FriendlyEats.Mock';
import * as FriendlyEats from './FriendlyEats/FriendlyEats';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  caption: {
    textAlign: "center",
    width: "100%",
  },
  guyContainer: {
    paddingTop: "100px",
    textAlign: "center",
  },
  guy: {
    maxWidth: "200px",
    marginBottom: "20px",
  },
  button: {
    margin: "auto",
    width: "100%",
  },  
});

const reducer = (state, action) => {
  switch (action.type) {
  case 'change':
    const newState = state.slice();
    const index = newState.findIndex((element) => { return element.id === action.data.id });
    if (index !== -1) {
      newState[index] = action.data;
    } else {
      newState.push(action.data);
    }
    return newState;
  case 'remove':
    return state.filter(n => n.id !== action.data.id);
  case 'empty':
    return [];
  default:
    throw new Error();
  }  
}

function Home(props) {
  const { classes } = props;

  const [restaurants, setRestaurants] = useReducer(reducer, []); 
  const [state, setState] = useState({}); 
  const [searchState, setSearchState] = useState(null);

  const [errorModalOpen, setErrorModalOpen ] = useState(false);
  const [errorType, setErrorType ] = useState("");

  const errorToggle = (type) => {
    if (type) {
      console.log(type);
      setErrorType(type);
    }
    setErrorModalOpen(!errorModalOpen);
  };

  useEffect(() => {
    const renderer = {
      remove: (doc) => {
        const data = doc.data();
        data.id = doc.id;
        setRestaurants({type: 'remove', data})
      },
      display: (doc) => {
        const data = doc.data();
        data.id = doc.id;
        setRestaurants({type: 'change', data})
      },
      empty: () => {
        setRestaurants({type: 'empty'});
      },
    }

    const query = searchState ?
      FriendlyEatsData.getFilteredRestaurants(searchState) :
      FriendlyEatsData.getAllRestaurants();
    if (query) {
      setRestaurants({type: 'empty'});
      const detacher = FriendlyEatsData.getDocumentsInQuery(query, renderer);
      return () => detacher();
    }
  }, [searchState]);

  const importData = async () => {
    try {
      await FriendlyEatsMock.addMockRestaurants();
    } catch (e) {
      errorToggle("home.importError");
    }
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
  const categoriesOptions = FriendlyEats.data.categories.map((name) => {
    return {value: name, label: name, type: "category" }
  })
  categoriesOptions.unshift({value: "Any", label: "全て", type: "category" });

  const citiesOptions = FriendlyEats.data.cities.map((name) => {
    return {value: name, label: name, type: 'city' }
  }); 
  citiesOptions.unshift({value: "Any", label: "全て", type: "city" });
 
  const priceOptions = [ "$", "$$", "$$$", "$$$$"].map((name) => {
    return {value: name, label: name, type: 'price' }
  });
  priceOptions.unshift({value: "Any", label: "全て", type: "price" });

  const sortOrderOptions = ['Rating', 'Reviews'].map((name) => {
    return {value: name, label: name, type: "sort" }
  });

  const handleChange =(e) => {
    const newState = Object.assign({}, state);
    newState[e.type] = e
    setState(newState)
  }
  const getStateValue = (key) => {
    if (state[key]) {
      return state[key]['value'];
    }
    return 'Any';
  }
  const submitButton = () => { 
    const filters = {
      city: getStateValue("city"),
      category: getStateValue("category"),
      price: getStateValue("price"),
      sortOrder: getStateValue("sort"),
    }
    setSearchState(filters);
  }
  const { city, category, price, sort } = state;

  return (
    <React.Fragment>
      <Header />
      <Grid container justify="center" direction="row" className={classes.root}>
      <Grid item xs={1}>
      </Grid>
      <Grid item xs={2}>
      <Select options={citiesOptions} value={city} onChange={handleChange} placeholder="都道府県"/>
      </Grid>
      <Grid item xs={2}>
      <Select options={categoriesOptions} value={category} onChange={handleChange} placeholder="カテゴリー"/>
      </Grid>
      <Grid item xs={2}>
      <Select options={priceOptions} value={price} onChange={handleChange} placeholder="金額"/>
      </Grid>
      <Grid item xs={2}>
      <Select options={sortOrderOptions} value={sort} onChange={handleChange} placeholder="順"/>
      </Grid>
      <Grid item xs={2}>
      <Button onClick={submitButton} color="primary" className={classes.button} >Search</Button>
      </Grid>
      <Grid item xs={1}>
      </Grid>
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
         <div className={classes.guyContainer}>
           <img className={classes.guy} src="/img/guy_fireats.png" alt="guy fireats" />
           <div className="text">
             This app is connected to the Firebase project "<b>{}</b>".<br />
             <br />
             Your Cloud Firestore has no documents in <b>/restaurants/</b>.
           </div>
           <br />
         <Button onClick={() => importData()} color="primary" className={classes.button} >Import Data</Button>


         </div>
        }
      </Grid>
      <ErrorModal modalOpen={errorModalOpen} toggle={errorToggle} errorType={errorType} />
    </React.Fragment>
  );
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
