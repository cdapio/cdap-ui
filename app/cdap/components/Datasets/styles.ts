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
  tabsContainerWithHeader: {
    display: 'flex',
    flexDirection: 'column',
  },
  tabHeaders: {
    width: '300px',
    backgroundColor: '#F1F8FF',
  },
  StyleForLevelZero: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '53px',
    borderRight: '1px dashed #DADCE0',
  },
  beforeSearchIconClickDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '53px',
    borderRight: '1px dashed #DADCE0',
    paddingRight: '18px',
    paddingLeft: '30px',
  },
  hideComponent: {
    display: 'none',
  },
});
