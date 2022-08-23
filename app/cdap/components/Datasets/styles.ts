import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles({
  canBrowseHover: {
    display: 'none',
  },
  iconBoxStyles: {
    width: 30,
    height: 30,
    boxSizing: 'border-box',
  },
  tooltipStyles: {
    backgroundColor: 'black',
    color: 'white',
  },
  tabHeaders: {
    backgroundColor: '#F1F8FF',
  },
  StyleForLevelZero: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '50px',
    paddingLeft: '38px',
  },
  beforeSearchIconClickDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '50px',
    paddingRight: '18px',
    paddingLeft: '30px',
  },
  hideComponent: {
    display: 'none',
  },
  tabsContainerWithHeader: {
    display: 'flex',
    flexDirection: 'column',
    height: '100% !important',
    borderRight: '1px solid #DADCE0',
  },
});
