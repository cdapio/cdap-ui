import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    gap: '50px',
    flexWrap: 'wrap',
  },
  card: {
    padding: '0px 28px',
    height: '180px',
    width: '220px',
    border: '1px solid #E3E3E3',
    borderRadius: '10px',
    boxShadow: 'none',
    display: 'flex',
    '&:hover': {
      boxShadow: '3px 4px 15px rgba(68, 132, 245, 0.15)',
      border: '1px solid white',
      boxSizing: 'border-box',
    },
    cursor: 'pointer',
  },
  cardContent: {
    width: '100%',
    display: 'flex',
    paddingBottom: '47px',
    placeSelf: 'flex-end',
    margin: '0 auto',
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardText: {
    marginTop: '15px',
    letterSpacing: '0.15px',
    lineHeight: '24px',
    fontSize: '16px',
    fontWeight: 400,
    color: '#000000',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: '166px',
  },
  link: {
    textDecoration: 'none',
  },
});
