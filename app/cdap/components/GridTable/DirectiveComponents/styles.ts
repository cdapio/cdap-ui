import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles(() => {
  return {
    functionSectionStyles: {
      padding: '15px 0',
      borderBottom: '1px solid #DADCE0',
    },
    funtionSectionWrapperStyles: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
    },
    functionHeadingTextStyles: {
      fontFamily: 'Noto Sans',
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '150%',
      letterSpacing: '0.15px',
      color: '#5F6368',
    },
    greenCheckIconStyles: {
      width: '20px',
      height: '20px',
    },
    radioStyles: {
      marginLeft: '-5px',
      '& span:last-child': {
        fontFamily: 'Noto Sans',
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '14px',
        color: '#5F6368',
      },
    },
    checkboxStyles: {
      display: 'flex',
      width: '100%',
      marginBottom: 0,
    },
    formFieldStyles: {
      width: 'calc(100% - 60px)',
      marginRight: '60px',
      border: '1px solid #DADCE0',
      height: '40px',
      padding: '5px 15px',
      fontSize: '14px',
      background: '#FFFFFF',
      fontFamily: 'Noto Sans',
      borderRadius: '4px',
      marginLeft: 0,
    },
    underlineStyles: {
      width: '100%',
      '&:before': {
        border: 'none',
      },
      '&:hover:not(.Mui-disabled):before': {
        border: 'none',
      },
      '&:after': {
        border: 'none',
      },
    },
    inputStyles: {
      width: '100%',
      '&:focus': {
        outline: 'none',
      },
    },
    formGroupStyles: {
      width: 'calc(100% - 60px)',
    },
    formLabelStyles: {
      color: '#5F6368',
      fontSize: '14px',
      fontStyle: 'normal',
      marginTop: '10px',
      fontFamily: 'Noto Sans',
      fontWeight: 400,
      lineHeight: '150%',
      letterSpacing: '0.15px',
      marginBottom: '10px',
    },
  };
});
