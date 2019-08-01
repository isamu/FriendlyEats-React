import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Header from './Header';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(1),
    paddingTop: theme.spacing(10),
  },
  caption: {
    textAlign: "center",
    width: "100%",
  },
});

const About = props => {
  const { classes } = props;
  return (
    <React.Fragment>
      <Header />
      <Grid container justify="center" alignItems="center" direction="row" className={classes.root}>
          <Grid className={classes.caption}>
           <Typography component="h2" variant="h5" gutterBottom>
            <b>This is yet another  Friendly Eats React version.</b><br/>
            Origina friendlyeats-web is <a href="https://github.com/firebase/friendlyeats-web">here</a><br/>
            <a href="https://codelabs.developers.google.com/codelabs/firestore-web/index.html">Original Friendly Eats document</a>
            <br />
            <a href="https://github.com/isamu/FriendlyEats-React">Friendly Eats React version</a><br />
            <a href="https://github.com/isamu/FriendlyEats-vue">Friendly Eats Vue.js version</a><br />
            <a href="https://www.amazon.jp/hz/wishlist/ls/1DQ5CDEVBQDIP?ref_=wl_share">My Wishlist</a><br/>
          </Typography>
          </Grid>
      </Grid>
    </React.Fragment>
  );
}

About.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(About);
