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

import { Box, Card, TableCell, Typography } from '@material-ui/core';
import { MISSING_NULL } from 'components/GridTable/constants';
import React from 'react';
import { useGridKPICellStyles } from './styles';

export default function GridKPICell({ metricData }) {
  const classes = useGridKPICellStyles();

  const metricValue = metricData.values;

  return (
    <TableCell className={classes.tableHeaderCell}>
      <Card className={classes.root} variant="outlined">
        {metricValue &&
          Array.isArray(metricValue) &&
          metricValue.length &&
          metricValue.map((eachValue: { label: string; count: number }) => (
            <Box className={classes.KPICell} key={eachValue.label}>
              <Typography className={classes.label}>{eachValue.label}</Typography>
              <Typography
                className={
                  eachValue.label === MISSING_NULL
                    ? `${classes.missingClass} ${classes.count}`
                    : `${classes.generalClass} ${classes.count}`
                }
                data-testid={`grid-kpi-metric-value-${eachValue.label}`}
              >
                {eachValue.count}
              </Typography>
            </Box>
          ))}
      </Card>
    </TableCell>
  );
}
