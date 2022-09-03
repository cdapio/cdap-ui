import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles(() => {
  return {
    paper: {
      top: '46px',
    },
    drawerContainerStyles: {
      width: 460,
      height: '100%',
      padding: '5px 20px 5px 30px',
    },
    headerStyles: {
      height: '60px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: 0,
      paddingRight: 0,
    },
    headingStyles: {
      display: 'flex',
      flexDirection: 'column',
    },
    pointerStyles: {
      cursor: 'pointer',
    },
    headingTextStyles: {
      fontFamily: 'Noto Sans',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 20,
      lineHeight: '150%',
      letterSpacing: '0.15px',
      color: '#000000',
    },
    headerRightStyles: {
      display: 'flex',
      alignItems: 'center',
    },
    dividerLineStyles: {
      width: 1,
      height: 28,
      backgroundColor: '#DADCE0',
      margin: '0 15px',
    },
  };
});
