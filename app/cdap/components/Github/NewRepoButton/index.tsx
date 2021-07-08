import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [contents, setContents] = React.useState({ username: null, reponame: null });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = () => {
    console.log(contents);
    setOpen(false);
  };
  function handleUserChange(event) {
    const updateContents = {
      username: event.target.value,
      reponame: contents.reponame,
    };
    setContents(updateContents);
  }
  function handleRepoChange(event) {
    const updateContents = {
      username: contents.username,
      reponame: event.target.value,
    };
    setContents(updateContents);
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Add New Repository
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To access your Github repository. Enter your Github User Name and Repository Name in the
            text boxes below.
          </DialogContentText>
          <TextField
            onChange={handleUserChange}
            autoFocus
            margin="dense"
            id="username"
            label="User Name"
            type="user"
            fullWidth
          />
          <TextField
            onChange={handleRepoChange}
            autoFocus
            margin="dense"
            id="reponame"
            label="Repository Name"
            type="repo"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
