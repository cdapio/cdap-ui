import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles((theme) => ({
  boxStyles: {
    zIndex: 1,
    height: '100%',
  },
  tabIndicatorStyles: {
    backgroundColor: '#3994FF',
    color: 'white !important',
    width: '100%',
    zIndex: 2,
  },
  indicator: {
    color: '#fff',
  },
  tabsContainer: {
    '& .MuiTabs-scroller': {
      '& .MuiButtonBase-root.Mui-selected': {
        color: '#fff',
        '& .canBrowseHover': {
          display: 'inline',
        },
        '& .canBrowseNormal': {
          display: 'none',
        },
      },
    },
  },
  wrangleTab: {
    '&:hover': {
      backgroundColor: '#EFF0F2',
    },
  },
  labelContainerBox: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  labelsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '4px',
  },
  labelStyles: {
    fontSize: '16px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  labelsContainerCanSample: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '4px',
    '&:hover': {
      '&>.MuiBox-root': {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '10px',
      },
    },
    '&>.MuiBox-root': {
      display: 'none',
    },
  },
  labelStylesCanSample: {
    maxWidth: '145px',
    fontSize: '16px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  wranglingHover: {
    display: 'flex',
    textDecoration: 'none',
    gap: '10px',
  },
  wrangleTypography: {
    color: '#4681F4 !important',
    fontSize: '14px',
  },
  eachConnectionStyle: {
    width: '100%',
  },
}));
