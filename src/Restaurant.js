import React, { useState, useEffect } from 'react';
import Header from './Header';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import ErrorModal from './ErrorModal';
import Modal from './Modal';
import { yellow } from '@material-ui/core/colors';

import { withStyles } from '@material-ui/core/styles';

import * as firebase from "firebase/app";
import "firebase/auth";

import * as FriendlyEatsData from './FriendlyEats/FriendlyEats.Data';
import * as FriendlyEatsMock from './FriendlyEats/FriendlyEats.Mock';

const styles = theme => ({
  root: {
    paddingTop: theme.spacing(5),
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
  restaurantHeader: {
    color: "white",
    fontSize: "22px",
    fontWeight: "bold",
  },
  ErrorText: {
    color: "#000",
  },
  ratingStar: {
    float: "right",
    color: "#feb22c",
  },
  button: {
    margin: "auto",
    width: "100%",
  },
  restaurantHeaderItem: {
    width: "100%",
    "text-align": "center",
  },
  iconHover: {
    float: "right",
    margin: "0px",
    position: "relative",
    top: "23px",
    "margin-right": "10px",
    "align-self": "flex-end",
    color: yellow[600],
    "font-size": "46px",
    '&:hover': {
      color: yellow[800],
    },
  },
  modalWindowHead: {
    padding: "24px 24px 0",
  },
  modalWindowHeadText: {
    float: "left",
    fontSize: "1.25rem",
    fontWeight: 500,
  },
  
  modalWindowContent: {
    padding: "24px 24px 0",
    lineHeight: 1,
  },
  modalWindowContentStar: {
    padding: "20px",
  },
  star: {
    margin: "10px",
    color: "#727272",
    fontSize: "28px",
  },
  modalWindowContentTextarea: {
    "width": "100%",
    "box-sizing": "border-box",
    "height": "100px",
    "resize": "none",
    "border-width": "1px 0px 1px 0px",
    "padding": "10px",
  },
  modalWindowFooter: {
    padding: "8px",
  },
  modalWindowFooterText: {
    float: "right",
  },
});

function Restaurant(props) {
  const { classes } = props;

  const [restaurant, setRestaurant] = useState({});
  const [ratings, setRatings] = useState([]);
  const [modalOpen, setModalOpen ] = useState(false);
  const [errorModalOpen, setErrorModalOpen ] = useState(false);
  const [errorType, setErrorType ] = useState("");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const id = props.match.params.id;

  const toggle = () => {
    setModalOpen(!modalOpen);
  };
  const errorToggle = (type) => {
    if (type) {
      console.log(type);
      setErrorType(type);
    }
    setErrorModalOpen(!errorModalOpen);
  };
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

  const addMockRating = async (restaurantId) => {
    try {
      await FriendlyEatsMock.addMockRatings(restaurantId);
    } catch (e) {
      errorToggle("restaurant.addMockRating");
    }
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
  const randerRatingInput = () => {
    const ret = [];
    for (let r = 0; r < 5; r += 1) {
      if (r < Math.floor(rating)) {
        ret.push(<Icon key={r} onMouseOver={() => {setRating(r + 1)}} className={classes.star}>star</Icon>);
      } else {
        ret.push(<Icon key={r} onMouseOver={() => {setRating(r + 1)}} className={classes.star}>star_border</Icon>);
      }
    }
    return ret;
  };
  const saveRating = async () => {
    const ret = await FriendlyEatsData.addRating(id, {
      rating,
      text: comment,
      userName: 'Anonymous (Web)',
      timestamp: new Date(),
      userId: firebase.auth().currentUser.uid
    });
    toggle();
    if (!ret) {
      // todo error
    }
  };
  return <React.Fragment>
    <Header />
      <Grid container justify="center" alignItems="center" direction="column" className={classes.restaurantHeader} style={myStyle}>
      {restaurant.name ?
       (<React.Fragment>
        <Grid item xs={3}/ >
        <Grid item xs={6} className={classes.restaurantHeaderItem} >
          <h2 style={{margin: "5px"}}>{restaurant.name}</h2>
          <div>{renderRating(restaurant.avgRating)}</div>
          {restaurant.city} / {restaurant.category}<br/>
          <Icon className={classes.iconHover} onClick={toggle}>
            add_circle
          </Icon>
        </Grid>
        <Grid item xs={3}/ >
        </React.Fragment>) :
        (<div id="guy-container" className="mdc-toolbar-fixed-adjust">
           <img className={classes.guy} src="/img/guy_fireats.png" alt="guy fireats" /><br/>
           <div className={classes.ErrorText}>
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
        <Button color="primary" className={classes.button} onClick={() => addMockRating(id)}>Add Rating</Button>
        </div>)
       :
       ratings.map((rating) => {
         return (<React.Fragment key={rating.id}>
                 <Grid item xs={3}/ >
                 <Grid item xs={6} style={{ marginTop: "10px", paddingBottom: "10px", borderBottom: "1px solid"}}>
                 <div style={{marginBottom: "8px"}}>
                 <span style={{color: "#999"}}>{rating.userName}</span>
                 <span className={classes.ratingStar}>{renderRating(rating.rating)}</span>
                 </div>
                 {rating.text}</Grid>
                 <Grid item xs={3}/ >
                 </React.Fragment>)
       })
       }
  </Grid>
    <Modal modalOpen={modalOpen} toggle={toggle}>
    <div className={classes.modalWindowHead}>
      <span className={classes.modalWindowHeadText}>Add a Review</span>
    </div>
    <div className={classes.modalWindowContent}>
      <div className={classes.modalWindowContentStar}>
        {randerRatingInput()}
      </div>
      <div>
        <textarea className={classes.modalWindowContentTextarea} onChange={(e) => {setComment(e.target.value);}}></textarea>
      </div>
    </div>
    <div className={classes.modalWindowFooter}>
      <span className={classes.modalWindowFooterText}>
        <Button color="primary" onClick={toggle}>CANCEL</Button>
        <Button color="primary" onClick={(e ) => { saveRating()}}>SAVE</Button>
      </span>
    </div>
  </Modal>
  <ErrorModal modalOpen={errorModalOpen} toggle={errorToggle}  errorType={errorType}/>
  </React.Fragment>
}

export default withStyles(styles)(Restaurant);
