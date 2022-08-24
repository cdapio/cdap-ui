import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { useStyles } from './styles';
import CustomTooltip from 'components/ConnectionList/Components/CustomTooltip';
import { CanBrowseIcon, CanBrowseIconHover } from 'components/ConnectionList/iconStore';
import React from 'react';

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

export default TabLabelCanBrowse;
