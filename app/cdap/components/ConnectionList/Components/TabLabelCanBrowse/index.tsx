/*
 * Copyright © 2022 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { useStyles } from './styles';
import CustomTooltip from 'components/ConnectionList/Components/CustomTooltip';
import { CanBrowseIcon, CanBrowseIconHover } from 'components/ConnectionList/iconStore';
import * as React from 'react';
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
