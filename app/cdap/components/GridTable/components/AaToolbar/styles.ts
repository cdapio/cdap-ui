import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles({
  iconContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    border: '1px solid #E0E0E0',
    height: '48px',
    marginTop: '0px',
    padding: '10px',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: '0px',
    marginRight: '0px',
  },
  searchIcon: {
    border: 'none',
    outline: 'none',
  },
});
