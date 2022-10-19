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

import React, { createRef, RefObject, useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@material-ui/core/';
import { useStyles } from './styles';
import CustomTooltip from '../CustomTooltip';

export default function OngoingDataExplorationCard({ item }) {
  const classes = useStyles();
  const connectionNameRef: RefObject<HTMLInputElement> = createRef();
  const datasetNameRef: RefObject<HTMLInputElement> = createRef();
  const [connectionRefValue, setconnectionRefValue] = useState(false);
  const [datasetNameRefValue, setdatasetNameRef] = useState(false);

  useEffect(() => {
    setconnectionRefValue(
      connectionNameRef?.current?.offsetWidth < connectionNameRef?.current?.scrollWidth
    );
    setdatasetNameRef(datasetNameRef?.current?.offsetWidth < datasetNameRef?.current?.scrollWidth);
  });

  return (
    <Grid container className={classes.gridContainer}>
      {item.map((eachItem, index) => {
        switch (eachItem.type) {
          case 'iconWithText':
            return (
              <Grid item xs={3} className={classes.elementStyle} key={index}>
                <Box className={classes.iconStyle}> {eachItem.icon}</Box>
                {connectionRefValue ? (
                  <CustomTooltip title={eachItem.label} arrow>
                    <Typography
                      variant="body1"
                      ref={connectionNameRef}
                      className={classes.iconWithText}
                    >
                      {eachItem.label}
                    </Typography>
                  </CustomTooltip>
                ) : (
                  <Typography
                    variant="body1"
                    ref={connectionNameRef}
                    className={classes.iconWithText}
                  >
                    {eachItem.label}
                  </Typography>
                )}
              </Grid>
            );
          case 'text':
            return eachItem.label.includes('Recipe steps') ? (
              <Grid item xs={3} className={classes.elementStyle} key={index}>
                <Typography variant="body1" className={classes.textWithoutIcon}>
                  {' '}
                  {eachItem.label}
                </Typography>
              </Grid>
            ) : (
              <Grid item xs={3} className={classes.elementStyle} key={index}>
                {datasetNameRefValue ? (
                  <CustomTooltip title={eachItem.label} arrow>
                    <Typography
                      variant="body1"
                      ref={datasetNameRef}
                      className={classes.textWithoutIcon}
                    >
                      {' '}
                      {eachItem.label}
                    </Typography>
                  </CustomTooltip>
                ) : (
                  <Typography
                    variant="body1"
                    ref={datasetNameRef}
                    className={classes.textWithoutIcon}
                  >
                    {' '}
                    {eachItem.label}
                  </Typography>
                )}
              </Grid>
            );
          case 'percentageWithText': {
            const percent = parseInt(eachItem.label, 10);
            return percent && !isNaN(percent) ? (
              <Grid item xs={3} className={classes.elementStyle} key={index}>
                <Box className={classes.percent}>
                  <Typography
                    variant="body2"
                    className={
                      percent < 100 ? classes.percentageStyleRed : classes.percentageStyleGreen
                    }
                  >
                    {percent}
                  </Typography>
                  <Typography
                    variant="body2"
                    className={
                      percent < 100 ? classes.percentageSymbolRed : classes.percentageSymbolGreen
                    }
                  >
                    {eachItem.percentageSymbol}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1" className={classes.dataQualityText}>
                    {eachItem.subText}
                  </Typography>
                </Box>
              </Grid>
            ) : (
              <Grid item xs={3}></Grid>
            );
          }

          default:
            break;
        }
      })}
    </Grid>
  );
}
