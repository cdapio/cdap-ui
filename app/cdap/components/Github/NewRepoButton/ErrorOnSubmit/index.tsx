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

export default function ErrorModal({ openErrorModal, handleError }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(openErrorModal);

  const handleClose = () => {
    handleError(false);
  };

  const errorBody = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">ERROR!</h2>
      <p id="simple-modal-description">Incorrect repository information inputted.</p>
    </div>
  );

  return (
    <div>
      <Modal
        open={openErrorModal}
        onClick={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {errorBody}
      </Modal>
    </div>
  );
}
