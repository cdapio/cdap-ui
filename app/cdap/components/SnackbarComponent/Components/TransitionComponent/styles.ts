import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  warningIcon: {
    color: '#E97567',
    fontSize: '20px !important',
  },
  errorHead: {
    color: '#E97567',
    fontSize: '20px !important',
  },
  dismissSpan: {
    display: 'block',
    fontSize: '14px',
    color: '#4681F4',
    cursor: 'pointer',
  },
  errorMessage: {
    color: '#000000',
    fontSize: '14px',
    padding: '10px',
  },
  headFlex: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));
