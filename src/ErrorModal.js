import React from 'react';
import Modal from './Modal'
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  modalWindow: {
    padding: "10px",
  },
  modalHeader: {
    marginTop: 0,
    fontSize: "1.25rem",
    fontWeight: 500,
    textAlign: "left",
  },
  modalBody: {
    textAlign: "left",
  },
  modalFooter: {
    textAlign: "right",
  },
  modal: {
    alignItems: "start",
    // textAlign: "left",
  }
});

function ErrorModal(props) {
  const { classes , errorType, toggle } = props;

  const message = ((_type) => {
    if (_type === "home.importError") {
      return (<span>src/FriendlyEats/FriendlyEats.Data.js の addRestaurant() が未実装です</span>)
    } else if (_type === "restaurant.addMockRating") {
      return (<span>src/FriendlyEats/FriendlyEats.Data.js の addRating() が未実装です</span>)
    }
  })(errorType);
  return (<Modal {...props}>
	  <div className={classes.modalHeader}> Error </div>
	  <div className={classes.modalBody}>{message}</div>
	  <div className={classes.modalFooter}><Button onClick={toggle}>close</Button></div>
	  </Modal>)
  
}

export default withStyles(styles)(ErrorModal);

