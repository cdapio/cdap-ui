import { makeStyles } from '@material-ui/core/styles';
import { UnderLine } from './iconStore';
import './styles.scss';

export const useConnectorTypesComponentStyles = makeStyles(() => ({
  dashBoard: {
    fontFamily: 'noto-sans !important',
    padding: '0px 59px 0px 60px',
    maxWidth: '620px',
    border: '0px',
    borderRight: '1px dashed #DADCE0',
    backgroundImage: 'linear-gradient(180deg, rgba(243, 246, 249, 0) -0.07%, #F3F6F9 22.66%)',
  },
  flexContainer: {
    marginTop: '17px',
    paddingBottom: '17px',
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
    background: 'transparent',
    '& > :nth-child(3n+1)': {
      borderRight: '1px solid #E3E3E3',
      borderBottom: '1px solid #E3E3E3',
      // width: '160px',
    },
    '& > :nth-child(3n+2)': {
      borderBottom: '1px solid #E3E3E3',
      // width: '180px',
    },
    '& > :nth-child(3n)': {
      borderLeft: '1px solid #E3E3E3',
      borderBottom: '1px solid #E3E3E3',
      // width: '160px',
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
  linkLine: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none !important',
    },
  },
  subTitle: {
    fontSize: '18px',
    fontWeight: 400,
    lineHeight: '27px',
    marginTop: '63.5px',
  },
  underLine: {
    lineHeight: '2px',
  },
}));
