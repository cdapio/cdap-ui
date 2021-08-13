import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function ConnectionModal({ openConnectionModal, handleConnection, isConnected }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const handleClose = () => {
    handleConnection(false);
  };

  const connectionBody = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Connection Successful!</h2>
    </div>
  );
  const notConnectedBody = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">ERROR! Connection Unsuccessful!</h2>
    </div>
  );

  return (
    <div>
      <Modal
        open={openConnectionModal}
        onClick={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {isConnected ? connectionBody : notConnectedBody}
      </Modal>
    </div>
  );
}
