import React from 'react';
import Modal from './Modal'
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  modalWindow: {
    padding: "15px",
  },
  modalHeader: {
    marginTop: 0,
    fontSize: "1.25rem",
    fontWeight: 500,
    textAlign: "left",
  },
  modalBody: {
    textAlign: "left",
    paddingTop: "10px",
  },
  modalFooter: {
    textAlign: "right",
  },
  modal: {
    alignItems: "start",
  }
});

function ErrorModal(props) {
  const { classes , errorType, toggle, config } = props;

  const message = ((_type) => {
    if (_type === "app.config") {
      return (<span>Firebase チュートリアルへようこそ！<br />Firebaseのコンソールでプロジェクトを追加して、設定をsrc/config.jsにコピーしてください。</span>)
    } else if (_type === "app.anonymouse") {
      const url = "https://console.firebase.google.com/u/0/project/" + config.projectId + "/authentication/providers";
      return (<div>
              <span>FirebaseのAnonymous Auth (匿名認証)を有効にしてください。<br/></span>
              <a href={url}>設定がこちらから</a>
              </div>)
    } else if (_type === "home.importError") {
      return (<span>src/FriendlyEats/FriendlyEats.Data.js の addRestaurant() が未実装です</span>)
    } else if (_type === "home.noFilter") {
      return (<span>src/FriendlyEats/FriendlyEats.Data.js の getFilteredRestaurants() が未実装です</span>)
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

