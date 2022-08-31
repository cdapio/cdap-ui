import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({
  divider: {
    borderColor: '#DADCE0',
  },
  heading: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#5F6368',
    padding: '0px 21px',
  },
  root: {
    '& .MuiMenuItem-root': {
      padding: '6px 11px 6px 20px',
      height: '33px',
    },
    '& .MuiMenu-paper': {
      width: '199px',
    },
    '& .MuiMenu-list': {
      color: '#5F6368',
      border: '1px solid #DADCE0',
    },
    '& .MuiListItem-button': {
      display: 'flex',
      justifyContent: 'space-between',
    },
    '& .MuiList-padding': {
      padding: '13px 0px',
    },
  },
});
