import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles({
  wrapper: {
    maxWidth: '1206px',
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  subHeader: {
    display: 'flex',
    gap: '110px',
  },
  welcome: {
    fontSize: '36px',
    fontWeight: 600,
    lineHeight: '54px',
    letterSpacing: '0.15px',
    maxWidth: '382px',
    padding: '47px 0px 0px 0px',
    color: '#000000',
  },
});
