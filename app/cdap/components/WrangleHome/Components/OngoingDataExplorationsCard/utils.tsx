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

import { Grid, Box, Typography } from '@material-ui/core';
import React from 'react';
import CustomTooltip from '../CustomTooltip';

const getIconComponent = (explorationCardIndex, classes, eachExplorationCard) => (
  <Grid item xs={3} key={explorationCardIndex} className={classes.connectorIcon}>
    <Box>{eachExplorationCard.icon}</Box>
  </Grid>
);

const getIconWithTextComponent = (
  explorationCardIndex,
  classes,
  eachExplorationCard,
  connectionRefValue,
  connectionNameRef
) => (
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
      <Typography variant="body1" ref={connectionNameRef} className={classes.iconWithText}>
        {eachExplorationCard.label}
      </Typography>
    )}
  </Grid>
);

const gettextIncludingRecipeStepsComponent = (
  classes,
  explorationCardIndex,
  eachExplorationCard
) => (
  <Grid item xs={3} className={classes.explorationCard} key={explorationCardIndex}>
    <Typography variant="body1" className={classes.textWithoutIcon} component="p">
      {eachExplorationCard.label}
    </Typography>
  </Grid>
);

const getTextComponent = (
  classes,
  explorationCardIndex,
  eachExplorationCard,
  cardIndex,
  datasetNameRefValue,
  datasetNameRef
) => (
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
      <Typography variant="body1" ref={datasetNameRef} className={classes.textWithoutIcon}>
        {eachExplorationCard.label}
      </Typography>
    )}
  </Grid>
);

const getPercentageWithTextComponent = (
  classes,
  explorationCardIndex,
  percent,
  eachExplorationCard
) => (
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
        className={percent > 0 ? classes.percentageStyleRed : classes.percentageStyleGreen}
        data-testid="ongoing-data-card-percentage"
        component="p"
      >
        {Math.round(percent)}
      </Typography>
      <Typography
        variant="body2"
        className={percent > 0 ? classes.percentageSymbolRed : classes.percentageSymbolGreen}
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
);

export const getExplorationDatacard = (
  eachExplorationCard,
  explorationCardIndex,
  classes,
  connectionRefValue,
  connectionNameRef,
  cardIndex,
  datasetNameRefValue,
  datasetNameRef
) => {
  switch (eachExplorationCard.type) {
    case 'icon':
      return getIconComponent(explorationCardIndex, classes, eachExplorationCard);
    case 'iconWithText':
      return getIconWithTextComponent(
        explorationCardIndex,
        classes,
        eachExplorationCard,
        connectionRefValue,
        connectionNameRef
      );
    case 'text':
      return eachExplorationCard.label.includes('Recipe steps')
        ? gettextIncludingRecipeStepsComponent(classes, explorationCardIndex, eachExplorationCard)
        : getTextComponent(
            classes,
            explorationCardIndex,
            eachExplorationCard,
            cardIndex,
            datasetNameRefValue,
            datasetNameRef
          );
    case 'percentageWithText': {
      return Number(eachExplorationCard.label) >= 0 && !isNaN(Number(eachExplorationCard.label)) ? (
        getPercentageWithTextComponent(
          classes,
          explorationCardIndex,
          Number(eachExplorationCard.label),
          eachExplorationCard
        )
      ) : (
        <Grid item xs={3}></Grid>
      );
    }
    default:
      break;
  }
};
