import { makeStyles } from '@material-ui/core/styles';

export const useNestedMenuStyles = makeStyles({
  divider: {
    borderColor: '#DADCE0',
  },
  heading: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#5F6368',
    padding: '0px 20px',
  },
  root: {
    width: '199px',
    '& .MuiMenu-root': {
      width: '199px',
    },
  },
});
