import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles(() => {
  return {
    importIconStyles: {
      marginRight: '20px',
    },
    emptyScreenStyles: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyScreenText: {
      fontFamily: 'Noto Sans',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '20px',
      lineHeight: '150%',
      letterSpacing: '0.15px',
      color: '#000000',
    },
    emptyScreenInfoText: {
      fontFamily: 'Noto Sans',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '150%',
      letterSpacing: '0.15px',
      color: '#5F6368',
    },
    RecipeStepsBodyStyles: {
      height: 'calc(100% - 100px)',
      padding: '0',
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
    recipeStepsTableBodyRowStyles: {
      '&:hover': {
        background: '#EFF0F2',
        '& td:last-child': {
          visibility: 'visible',
        },
      },
    },
  };
});
