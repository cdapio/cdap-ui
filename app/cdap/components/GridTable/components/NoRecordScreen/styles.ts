import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles({
  noRecordWrapper: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& *': {
      fontFamily: "'Noto Sans', sans-serif",
    },
  },
  firstHeadData: {
    fontSize: '20px',
    color: '#000000',
    marginTop: '20px',
  },
  secondHeadData: {
    fontSize: '16px',
    color: '#000000',
  },
  innerWrapper: {
    textAlign: 'center',
  },
});
