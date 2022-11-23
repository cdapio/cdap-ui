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
import { useStyles } from 'components/WrangleHome/Components/OngoingDataExplorationsCard/styles';
import CustomTooltip from 'components/WrangleHome/Components/CustomTooltip';
import { IOngoingDataExplorationsCard } from 'components/WrangleHome/Components/OngoingDataExplorationsCard/types';

export default function({ explorationCardDetails, cardIndex }: IOngoingDataExplorationsCard) {
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
    <Grid
      container
      className={classes.gridContainer}
      data-testid={`ongoing-data-explorations-card-${cardIndex}`}
    >
      {explorationCardDetails &&
        Array.isArray(explorationCardDetails) &&
        explorationCardDetails?.map((eachExplorationCard, explorationCardIndex) => {
          switch (eachExplorationCard.type) {
            case 'icon':
              return (
                <Grid item xs={3} key={explorationCardIndex} className={classes.connectorIcon}>
                  <Box>{eachExplorationCard.icon}</Box>
                </Grid>
              );
            case 'iconWithText':
              return (
                <Grid item xs={3} className={classes.explorationCard} key={explorationCardIndex}>
                  {connectionRefValue ? (
                    <CustomTooltip title={eachExplorationCard.label} arrow>
                      <Typography
                        variant="body1"
                        ref={connectionNameRef}
                        className={classes.iconWithText}
                        component="p"
                      >
                        {eachExplorationCard.label}
                      </Typography>
                    </CustomTooltip>
                  ) : (
                    <Typography
                      variant="body1"
                      ref={connectionNameRef}
                      className={classes.iconWithText}
                    >
                      {eachExplorationCard.label}
                    </Typography>
                  )}
                </Grid>
              );
            case 'text':
              return eachExplorationCard.label.includes('Recipe steps') ? (
                <Grid item xs={3} className={classes.explorationCard} key={explorationCardIndex}>
                  <Typography variant="body1" className={classes.textWithoutIcon} component="p">
                    {eachExplorationCard.label}
                  </Typography>
                </Grid>
              ) : (
                <Grid
                  item
                  xs={3}
                  className={classes.explorationCard}
                  key={explorationCardIndex}
                  data-testid={`home-ongoing-explorations-${eachExplorationCard.type}-${cardIndex}`}
                >
                  {datasetNameRefValue ? (
                    <CustomTooltip title={eachExplorationCard.label} arrow>
                      <Typography
                        variant="body1"
                        ref={datasetNameRef}
                        className={classes.textWithoutIcon}
                        component="p"
                      >
                        {eachExplorationCard.label}
                      </Typography>
                    </CustomTooltip>
                  ) : (
                    <Typography
                      variant="body1"
                      ref={datasetNameRef}
                      className={classes.textWithoutIcon}
                    >
                      {eachExplorationCard.label}
                    </Typography>
                  )}
                </Grid>
              );
            case 'percentageWithText': {
              const percent = 100 - Number(eachExplorationCard.label);
              return percent >= 0 && !isNaN(percent) ? (
                <Grid
                  item
                  xs={3}
                  className={classes.explorationCard}
                  key={explorationCardIndex}
                  data-testid="ongoing-data-exploration-card-percentage-nan"
                >
                  <Box className={classes.percent}>
                    <Typography
                      variant="body2"
                      className={
                        percent > 0 ? classes.percentageStyleRed : classes.percentageStyleGreen
                      }
                      data-testid="ongoing-data-card-percentage"
                      component="p"
                    >
                      {Math.round(percent)}
                    </Typography>
                    <Typography
                      variant="body2"
                      className={
                        percent > 0 ? classes.percentageSymbolRed : classes.percentageSymbolGreen
                      }
                      data-testid="ongoing-data-percentage-symbol"
                      component="p"
                    >
                      {eachExplorationCard.percentageSymbol}
                    </Typography>
                  </Box>
                  <Box className={classes.dataQualityTextContainer}>
                    <Typography variant="body1" className={classes.dataQualityText} component="p">
                      {eachExplorationCard.subText}
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
