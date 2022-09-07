import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles(() => {
  return {
    addTransformationBodyStyles: {
      height: 'calc(100% - 100px)',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
    },
    addTransformationBodyWrapperStyles: {
      height: 'calc(100% - 40px)',
      overflowY: 'auto',
    },
    columnsCountTextStyles: {
      fontFamily: 'Noto Sans',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '150%',
      letterSpacing: '0.15px',
      color: '#5F6368',
      paddingTop: '5px',
      paddingBottom: '15px',
      borderBottom: '1px solid #DADCE0',
    },
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
    functionInfoSectionStyles: {
      display: 'flex',
      alignItems: 'center',
    },
    functionTextStyles: {
      fontFamily: 'Noto Sans',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '150%',
      letterSpacing: '0.15px',
      color: '#5F6368',
    },
    infoIconTextStyles: {
      marginLeft: '5px',
      width: '20px',
      height: '20px',
    },
    greenCheckIconStyles: {
      width: '20px',
      height: '20px',
    },
    quickSelectTextStyles: {
      fontFamily: 'Noto Sans',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '150%',
      letterSpacing: '0.15px',
      color: '#5F6368',
      marginTop: '10px',
    },
    selectButtonStyles: {
      fontFamily: 'Noto Sans',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '15px',
      lineHeight: '26px',
      letterSpacing: '0.46px',
      color: '#4681F4;',
      textTransform: 'none',
      marginTop: '15px',
    },
    applyStepButtonStyles: {
      width: '162px',
      height: '36px',
      background: '#3994FF',
      boxShadow: '0px 2px 4px rgba(70, 129, 244, 0.15)',
      borderRadius: '4px',
      fontFamily: 'Noto Sans',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '15px',
      lineHeight: '26px',
      letterSpacing: '0.46px',
      color: '#FFFFFF',
      alignSelf: 'flex-end',
      marginTop: '30px',
      textTransform: 'none',
      marginBottom: '20px',
    },
    buttonStyles: {
      '&:hover': {
        backgroundColor: '#3994FF',
      },
    },
    selectColumnsHeaderStyles: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    recipeStepsTableHeadStyles: {
      padding: '10px',
      fontFamily: 'Noto Sans',
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '150%',
      letterSpacing: '0.15px',
      color: '#5F6368',
    },
    recipeStepsTableRowStyles: {
      fontFamily: 'Noto Sans',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '150%',
      letterSpacing: '0.15px',
      color: '#5F6368',
      padding: '15px 10px',
    },
    recipeStepsTableBodyRowStyles: {
      '&:hover': {
        background: '#EFF0F2',
        '& td:last-child': {
          visibility: 'visible',
        },
      },
    },
    recipeStepsActionTypeStyles: {
      fontWeight: 600,
    },
    displayNone: {
      visibility: 'hidden',
    },
    recipeStepsDeleteStyles: {
      width: '18px',
      height: '20px',
      cursor: 'pointer',
      //   padding: '15px 10px',
    },
    radioStyles: {
      '& span:last-child': {
        fontFamily: 'Noto Sans',
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '14px',
        color: '#5F6368',
      },
    },
    replaceWithInput: {
      width: '90%',
    },
    replaceWithText: {
      fontFamily: 'Noto Sans',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '12px',
      color: '#5F6368',
    },
    searchFormControl: {
      position: 'relative',
    },
    searchTextField: {},
    searchInputAdornment: {
      zIndex: 0,
      cursor: 'pointer',
      position: 'absolute',
      right: 0,
    },
    isFocused: {
      border: 'none',
      borderBottom: '1px solid grey',
      outline: 'none',
    },
    isBlurred: {
      border: 'none',
      borderBottom: '1px solid transparent',
    },
    circularProgress: {
      transform: 'rotate(180deg) !important',
    },
    circularProgressSuccess: {
      color: '#8BCC74',
    },
    circularProgressRed: {
      color: '#E97567',
    },
  };
});
