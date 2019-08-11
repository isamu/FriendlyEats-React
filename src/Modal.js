import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  modal: {
    position: "fixed",
    display: "flex",
    "align-items": "center",
    "justify-content": "center",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(100,100,100,0.4)",
    "z-index": 100000
  },
  modalWindow: {
    position: "absolute",
    top: "50%",
    left: "50%;",
    transform: "translateY(-50%) translateX(-50%)",
    "-webkit-transform": "translateY(-50%) translateX(-50%)",
    "z-index": 100001,
    animation: "fadein .3s 1, zoomin .3s 1",
    width: "60%",
    margin: "auto",
    "text-align": "center",
    background: "#fff",
  },
  modalHeader: {
  },
  modalBody: {
  },
  modalFooter: {
  },
});

function Modal(props) {
  const { classes, modalOpen, toggle } = props;
  
  return (
      <div style={{display: modalOpen ? 'block' : 'none' }} className={classes.modal} onClick={toggle}>
      <div className={classes.modalWindow} onClick={(e) => {e.stopPropagation()}}>
      {props.children}
      </div>
      </div>);
}

export default withStyles(styles)(Modal);

