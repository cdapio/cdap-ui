import * as React from 'react';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { styled, Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  boxStyles: {
    width: '252px',
    background: 'linear-gradient(180deg, rgba(243, 246, 249, 0) -0.07%, #F3F6F9 22.66%)',
    borderRight: '1px dashed #DADCE0',
    zIndex: 1,
  },
  tabIndicatorStyles: {
    backgroundColor: 'white',
    minWidth: '257.24px',
    borderWidth: '3px',
    borderStyle: 'solid',
    borderImage: 'linear-gradient(to left, #4681F4, 2%,white,white,white,white,white,white) 1',
    zIndex: 2,
  },
  labelsContainer: {
    display: 'flex',
    gap: '4px',
  },
  labelStyles: {
    maxWidth: '125px',
    fontSize: '16px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  iconBoxStyles: {
    width: 30,
    height: 30,
    boxSizing: 'border-box',
  },
});

const StyledTab = styled(Tab)({
  minWidth: '161px',
  // maxHeight: '54px',
  padding: '15px 0px 15px 32px',
  textTransform: 'none',
  color: 'black',
  fontSize: '16px',
  minHeight: '53px !important',
  '& .MuiTab-labelIcon': { minHeight: '54px !important' },
  '& .MuiTab-wrapper': {
    fontSize: '16px',
    fontWeight: '400',
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '9.41px',
    flexDirection: 'row',
    zIndex: 3,
    whiteSpace: 'nowrap',
  },
  '&.MuiTab-labelIcon .MuiTab-wrapper > *:first-child': {
    marginBottom: '0px',
  },
  '&:first-child': {
    paddingTop: '30px',
    paddingBottom: '30px',
  },
});

const ConnectionsTabs = ({ connectorTypes, handleChange, value, dataset }) => {
  const classes = useStyles();

  return (
    <Box className={classes.boxStyles}>
      <TabsComponent handleChange={handleChange} value={value} connectorTypes={connectorTypes} />
    </Box>
  );
};

const TabsComponent = ({ handleChange, value, connectorTypes }) => {
  const classes = useStyles();
  return (
    <Tabs
      onChange={handleChange}
      value={value}
      orientation="vertical"
      variant="scrollable"
      TabIndicatorProps={{
        className: classes.tabIndicatorStyles,
      }}
    >
      {connectorTypes.map((connectorType, connectorTypeIndex) => (
        <StyledTab
          label={<TooltipLabel label={connectorType.name} count={connectorType.count} />}
          value={connectorType.name}
          icon={<Box className={classes.iconBoxStyles}>{connectorType.SVG}</Box>}
          disableTouchRipple
          key={`${connectorType.name}=${connectorTypeIndex}`}
          id={connectorType.name}
        />
      ))}
    </Tabs>
  );
};

const TooltipLabel = ({ label, count }) => {
  const classes = useStyles();

  return (
    <Tooltip title={label}>
      <Box className={classes.labelsContainer}>
        <Typography variant="body1" className={classes.labelStyles}>
          {label}
        </Typography>
        <Typography variant="body1" className={classes.labelStyles}>{`(${count})`}</Typography>
      </Box>
    </Tooltip>
  );
};

export default ConnectionsTabs;
