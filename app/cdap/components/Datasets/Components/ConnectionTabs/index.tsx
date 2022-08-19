import { styled, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { CanBrowseIcon, CanBrowseIconHover, WrangelIcon } from 'components/Datasets/iconStore';
import * as React from 'react';
import { useStyles } from 'components/Datasets/Components/ConnectionTabs/styles';
import CustomTooltip from 'components/Datasets/Components/CustomTooltip';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { Link } from 'react-router-dom';

const ConnectionTab = styled(Tab)({
  minWidth: '300px',
  padding: '15px 10px 15px 30px',
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
  '&.MuiTab-root': {
    maxWidth: '300px',
  },
  '&.MuiTab-labelIcon .MuiTab-wrapper > *:first-child': {
    marginBottom: '0px',
  },
  '&.makeStyles-canBrowseIconHover': {
    border: '10px solid green',
  },
});

const ConnectionsTabs = ({ tabsData, handleChange, value, index }) => {
  const classes = useStyles();

  return (
    <>
      {tabsData.showTabs && (
        <div className={classes.boxStyles}>
          <Tabs
            value={value}
            orientation="vertical"
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            TabIndicatorProps={{
              className: classes.tabIndicatorStyles,
            }}
            classes={{
              indicator: classes.indicator,
              root: classes.tabsContainer,
            }}
          >
            {tabsData.data.map((connectorType, connectorTypeIndex) => (
              <ConnectionTab
                onClick={() => {
                  if (index > 1) {
                    connectorType.canBrowse ? handleChange(connectorType, index) : null;
                  } else {
                    handleChange(connectorType, index);
                  }
                }}
                label={
                  index > 1 ? (
                    connectorType.canBrowse ? (
                      <TabLabelCanBrowse
                        label={connectorType.name}
                        count={index === 0 ? connectorType.count : undefined}
                        index={index}
                      />
                    ) : (
                      <TabLabelCanSample label={connectorType.name} />
                    )
                  ) : (
                    <TabLabelCanBrowse
                      label={connectorType.name}
                      count={index === 0 ? connectorType.count : undefined}
                      index={index}
                      SVG={connectorType.SVG}
                    />
                  )
                }
                value={connectorType.name}
                disableTouchRipple
                key={`${connectorType.name}=${connectorTypeIndex}`}
                id={connectorType.name}
                className={connectorType.canSample ? classes.wrangleTab : 'eachConnectionStyle'}
              />
            ))}
          </Tabs>
        </div>
      )}
    </>
  );
};

const TabLabelCanBrowse = ({
  label,
  count,
  index,
  SVG,
}: {
  label: string;
  count: number;
  index: number;
  SVG?: any;
}) => {
  const classes = useStyles();
  return (
    <CustomTooltip title={label.length > 16 ? label : ''} arrow key={`tooltip-${index}`}>
      <Box className={classes.labelContainerBox}>
        <Box className={classes.labelsContainer}>
          <Box>{SVG}</Box>
          <Typography variant="body1" className={classes.labelStyles}>
            {label}
          </Typography>
          {count && (
            <Typography variant="body1" className={classes.labelStyles}>{`(${count})`}</Typography>
          )}
        </Box>
        <Box>
          <Box className={`canBrowseNormal`}>
            <CanBrowseIcon />
          </Box>
          <Box className={`canBrowseHover`} sx={{ display: 'none' }}>
            <CanBrowseIconHover />
          </Box>
        </Box>
      </Box>
    </CustomTooltip>
  );
};

const TabLabelCanSample = ({ label }: { label: string }) => {
  const classes = useStyles();

  return (
    <CustomTooltip title={label.length > 16 ? label : ''} arrow>
      <Box className={classes.labelsContainerCanSample}>
        <Typography variant="body1" className={classes.labelStylesCanSample}>
          {label}
        </Typography>
        <Link
          to={`/ns/${getCurrentNamespace()}/wrangler-grid/${label}`}
          style={{ textDecoration: 'none' }}
        >
          <Box className={classes.wranglingHover}>
            <WrangelIcon />
            <Typography color="primary">Wrangle</Typography>
          </Box>
        </Link>
      </Box>
    </CustomTooltip>
  );
};

export default ConnectionsTabs;
