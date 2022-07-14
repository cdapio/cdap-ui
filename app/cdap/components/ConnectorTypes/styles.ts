import { makeStyles } from '@material-ui/core/styles';

export const useConnectorTypesComponentStyles = makeStyles(() => ({
  flexContainer: {
    paddingTop: '18px',
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: '#F3F6F9',
    width: '100%',
    height: '100%',
    '& > :nth-child(3n+1)': {
      borderRight: '1px solid #E3E3E3',
      borderBottom: '1px solid #E3E3E3',
      width: '160px',
    },
    '& > :nth-child(3n+2)': {
      borderBottom: '1px solid #E3E3E3',
      width: '180px',
    },
    '& > :nth-child(3n)': {
      borderLeft: '1px solid #E3E3E3',
      borderBottom: '1px solid #E3E3E3',
      width: '160px',
    },
    '& > :nth-last-child(1)': {
      borderBottom: '0px',
    },
    '& > :nth-last-child(2)': {
      borderBottom: '0px',
    },
    '& > :nth-last-child(3)': {
      borderBottom: '0px',
    },
  },
  dashBoard: {
    padding: '18px 59px 18px 60px',
    backgroundColor: '#F3F6F9',
    maxWidth: '620px',
    border: '0px',
    borderRight: '1px dashed #DADCE0',
  },
}));
