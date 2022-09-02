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
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
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

  const myLabelRef: any = React.createRef();
  const [refValue, setRefValue] = React.useState(false);

  React.useEffect(() => {
    setRefValue(myLabelRef?.current?.offsetWidth < myLabelRef?.current?.scrollWidth);
  }, []);

  return refValue ? (
    <CustomTooltip title={label} arrow key={`tooltip-${index}`}>
      <Box className={classes.labelContainerBox}>
        <Box className={classes.labelsContainer}>
          {SVG && <Box>{SVG}</Box>}
          <Typography variant="body1" className={classes.labelStyles} ref={myLabelRef}>
            {label}
          </Typography>
          {count && (
            <Typography variant="body1" className={classes.labelStyles}>{`(${count})`}</Typography>
          )}
        </Box>
        <Box>
          <Box className={`canBrowseNormal`}>
            <ChevronRightRoundedIcon className={classes.rightArrow} />
          </Box>
          <Box className={`canBrowseHover`} sx={{ display: 'none' }}>
            <ChevronRightRoundedIcon className={classes.rightArrowSelected} />
          </Box>
        </Box>
      </Box>
    </CustomTooltip>
  ) : (
    <Box className={classes.labelContainerBox}>
      <Box className={classes.labelsContainer}>
        {SVG && <Box>{SVG}</Box>}
        <Typography variant="body1" className={classes.labelStyles} ref={myLabelRef}>
          {label}
        </Typography>
        {count && (
          <Typography variant="body1" className={classes.labelStyles}>{`(${count})`}</Typography>
        )}
      </Box>
      <Box>
        <Box className={`canBrowseNormal`}>
          <ChevronRightRoundedIcon className={classes.rightArrow} />
        </Box>
        <Box className={`canBrowseHover`} sx={{ display: 'none' }}>
          <ChevronRightRoundedIcon className={classes.rightArrowSelected} />
        </Box>
      </Box>
    </Box>
  );
};
export default TabLabelCanBrowse;
