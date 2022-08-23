import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles({
  breadCombContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '48px',
    alignItems: 'center',
    marginRight: '30px',
    marginLeft: '34px',
  },
  selectPrevPage: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  importData: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  importDataContainer: {
    display: 'flex',
    gap: '30px',
    alignItems: 'flex-end',
    fontSize: '14px',
  },
  breadCrumbTyporgraphy: {
    color: '#000000',
    fontSize: '14px',
    lineHeight: '21px',
  },
});
