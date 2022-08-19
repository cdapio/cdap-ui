import { makeStyles } from '@material-ui/core';

const ExplorationCardStyles = makeStyles({
  gridContainer: {
    width: '1204px',
    height: '77px',
    border: '1px solid #DADCE0',
    borderRadius: '4px',
    marginBottom: '10px',
    cursor: 'pointer',
  },
  elementStyle: {
    width: '301px',
    flex: 1,
    paddingTop: '14px',
    paddingLeft: '23px',
    paddingBottom: '13px',
    paddingRight: '23px',
    display: 'flex',

    '& .MuiTypography-body1': {
      margin: 'auto 0px',
      fontSize: '16px',
      lineHeight: '24px',
      width: '254px',
      textOverflow: 'ellipsis',
      fontWeight: 400,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      color: '#000000',
    },
  },
  iconStyle: {
    marginRight: '32px',
    height: '50px',
    width: '50px',
  },
  percentageStyleRed: {
    lineHeight: '30px',
    fontSize: '36px',
    letterSpacing: '0.15px',
    color: '#EA4335',
    margin: 'auto 0px',
  },
  percentageSymbolRed: {
    fontSize: '20px',
    color: '#EA4335',
    letterSpacing: '0.15px',
    lineHeight: '30px',
    marginRight: '6px',
    margin: 'auto 0px',
  },
  percentageStyleGreen: {
    lineHeight: '30px',
    fontSize: '36px',
    color: '#4BAF4F',
    margin: 'auto 0px',
    letterSpacing: '0.15px',
  },
  percentageSymbolGreen: {
    fontSize: '20px',
    color: '#4BAF4F',
    lineHeight: '30px',
    marginRight: '6px',
    margin: 'auto 0px',
    letterSpacing: '0.15px',
  },
});
export default ExplorationCardStyles;
