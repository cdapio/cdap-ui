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

import React from 'react';
import { Box, Grid, Typography } from '@material-ui/core/';
import { useStyles } from './styles';

const OngoingDataExplorationCard = ({ item }) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.gridContainer}>
      {item.map((eachItem) => {
        switch (eachItem.type) {
          case 'iconWithText':
            return (
              <Grid item className={classes.elementStyle}>
                <Box className={classes.iconStyle}> {eachItem.icon}</Box>
                <Typography variant="body1">{eachItem.label}</Typography>
              </Grid>
            );
          case 'text':
            return (
              <Grid item className={classes.elementStyle}>
                <Typography variant="body1"> {eachItem.label}</Typography>
              </Grid>
            );
          case 'percentageWithText':
            const percent = parseInt(eachItem.label);

            return percent && !isNaN(percent) ? (
              <Grid item className={classes.elementStyle}>
                <Typography
                  variant="body2"
                  className={
                    percent > 50 ? classes.percentageStyleGreen : classes.percentageStyleRed
                  }
                >
                  {eachItem.label}
                </Typography>
                <Typography
                  variant="body2"
                  className={
                    percent > 50 ? classes.percentageSymbolGreen : classes.percentageSymbolRed
                  }
                >
                  {eachItem.percentageSymbol}
                </Typography>

                <Typography variant="body1">{eachItem.subText}</Typography>
              </Grid>
            ) : (
              <></>
            );

          default:
            break;
        }
      })}
    </Grid>
  );
};
export default OngoingDataExplorationCard;
