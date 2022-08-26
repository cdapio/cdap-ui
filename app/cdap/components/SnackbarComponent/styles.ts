import { makeStyles } from '@material-ui/core';

export const useErrorStyles = makeStyles({
  snackBarDiv: {
    padding: '10px',
    display: 'block',
    border: '1px solid #E97567',
    boxShadow: '-3px 4px 15px rgba(68, 132, 245, 0.25)',
    height: '148px',
    width: '401px',
    bottom: '10% !important',
  },
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
});
