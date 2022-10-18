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
import CustomTooltip from 'components/ConnectionList/Components/CustomTooltip';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import * as React from 'react';
import { createRef, Ref, useEffect, useState } from 'react';
import { useStyles } from './styles';

export default function TabLabelCanBrowse({
  label,
  count,
  index,
  icon,
}: {
  label: string;
  count: number;
  index: number;
  icon?: JSX.Element;
}) {
  const classes = useStyles();

  const myLabelRef: Ref<HTMLSpanElement> = createRef();
  const [refValue, setRefValue] = useState(false);

  useEffect(() => {
    /**
     * In case, the size of the lable or file name exceeds the maximum width
     * of it's wrapping container we are showing ellipses using styles and
     * we are also showing the custom tooltip using the following logic.
     * So the following statement checks whether the size of the text is greater than the maximum
     * width of the wrapping element or not. if the size is greater then it sets true for custom tooltip
     * otherwise it sets false.
     */
    setRefValue(myLabelRef?.current?.offsetWidth < myLabelRef?.current?.scrollWidth);
  }, []);

  return refValue ? (
    <CustomTooltip title={label} arrow key={`tooltip-${index}`}>
      <Box className={classes.labelContainerBox}>
        <Box className={classes.labelsContainer}>
          {icon && <Box>{icon}</Box>}
          <Typography variant="body1" className={classes.labelStyles} ref={myLabelRef}>
            {label}
          </Typography>
          {count && (
            <Typography variant="body1" className={classes.labelStyles}>{`(${count})`}</Typography>
          )}
        </Box>
        <Box>
          <Box className={'canBrowseNormal'}>
            <ChevronRightRoundedIcon className={classes.rightArrow} />
          </Box>
          <Box className={'canBrowseHover'}>
            <ChevronRightRoundedIcon className={classes.rightArrowSelected} />
          </Box>
        </Box>
      </Box>
    </CustomTooltip>
  ) : (
    <Box className={classes.labelContainerBox}>
      <Box className={classes.labelsContainer}>
        {icon && <Box>{icon}</Box>}
        <Typography variant="body1" className={classes.labelStyles} ref={myLabelRef}>
          {label}
        </Typography>
        {count && (
          <Typography variant="body1" className={classes.labelStyles}>{`(${count})`}</Typography>
        )}
      </Box>
      <Box>
        <Box className={'canBrowseNormal'}>
          <ChevronRightRoundedIcon className={classes.rightArrow} />
        </Box>
        <Box className={'canBrowseHover'}>
          <ChevronRightRoundedIcon className={classes.rightArrowSelected} />
        </Box>
      </Box>
    </Box>
  );
}
