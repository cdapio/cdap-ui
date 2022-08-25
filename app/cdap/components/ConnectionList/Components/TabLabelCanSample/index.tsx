/*
 * Copyright © 2017-2018 Cask Data, Inc.
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

import { setRef, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { useStyles } from './styles';
import CustomTooltip from 'components/ConnectionList/Components/CustomTooltip';
import { WrangelIcon } from 'components/ConnectionList/iconStore';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { getCurrentNamespace } from 'services/NamespaceStore';

const TabLabelCanSample = ({ label }: { label: string }) => {
  const classes = useStyles();
  const myLabelRef: any = React.createRef();
  const [refValue, setRefValue] = React.useState(false);

  React.useEffect(() => {
    setRefValue(myLabelRef?.current?.offsetWidth < myLabelRef?.current?.scrollWidth);
  }, []);

  return refValue ? (
    <CustomTooltip title={label} arrow>
      <Box className={classes.labelsContainerCanSample}>
        <Typography variant="body1" className={classes.labelStylesCanSample} ref={myLabelRef}>
          {label}
        </Typography>
        <Link
          to={`/ns/${getCurrentNamespace()}/wrangler-grid/${label}`}
          style={{ textDecoration: 'none' }}
        >
          <Box className={classes.wranglingHover}>
            <WrangelIcon />
            <Box className={classes.wrangleTypography}>Wrangle</Box>
          </Box>
        </Link>
      </Box>
    </CustomTooltip>
  ) : (
    <Box className={classes.labelsContainerCanSample}>
      <Typography variant="body1" className={classes.labelStylesCanSample} ref={myLabelRef}>
        {label}
      </Typography>
      <Link
        to={`/ns/${getCurrentNamespace()}/wrangler-grid/${label}`}
        style={{ textDecoration: 'none' }}
      >
        <Box className={classes.wranglingHover}>
          <WrangelIcon />
          <Box className={classes.wrangleTypography}>Wrangle</Box>
        </Box>
      </Link>
    </Box>
  );
};

export default TabLabelCanSample;
