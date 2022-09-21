import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles((_theme: Theme) => ({
  progress: {
    position: 'relative',
    margin: '4px',
    float: 'left',
    textAlign: 'center',
  },
  barOverflow: {
    position: 'relative',
    overflow: 'hidden' /* Comment this line to understand the trick */,
    width: '60px',
    height: '30px' /* Half circle (overflow) */,
    marginBottom: '-20px !important' /* bring the numbers up */,
  },
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '59px',
    height: '59px',
    borderRadius: '50%',
    boxSizing: 'border-box',
    border: ' 4px solid #dbdbdb' /* half gray, */,
    //    transform: rotate(63deg),
  },
  value: {
    fontSize: '14px !important',
    fontFamily: 'Noto Sans',
    fontStyle: 'normal',
  },
}));
