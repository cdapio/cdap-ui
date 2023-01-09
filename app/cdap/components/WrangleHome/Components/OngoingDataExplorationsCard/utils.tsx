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

import { Box, Grid } from '@material-ui/core';
import CustomTooltip from 'components/WrangleHome/Components/CustomTooltip';
import {
  GridForConnectorIcon,
  GridForExplorationCard,
  IconWithoutTextTypography,
  IconWithTextTypography,
  NullValueCountContainer,
  PercentageSymbolGreen,
  PercentageSymbolRed,
  QualityTextContainer,
  StyledTyporgraphy,
  TypographyWithGreenColorText,
  TypographyWithRedColorText,
} from 'components/WrangleHome/Components/OngoingDataExplorationsCard/styledComponents';
import React, { RefObject } from 'react';
import { IExplorationCardDetails } from 'components/WrangleHome/Components/OngoingDataExplorationsCard/types';

const getIconComponent = (
  explorationCardIndex: number,
  eachExplorationCard: IExplorationCardDetails
) => (
  <GridForConnectorIcon item xs={3} key={explorationCardIndex}>
    <Box>{eachExplorationCard.icon}</Box>
  </GridForConnectorIcon>
);

const getIconWithTextComponent = (
  explorationCardIndex: number,
  eachExplorationCard: IExplorationCardDetails,
  connectionRefValue: boolean,
  connectionNameRef: RefObject<HTMLInputElement>
) => {
  const ExplorationCardLabel = (
    <IconWithTextTypography variant="body1" ref={connectionNameRef} component="p">
      {eachExplorationCard.label}
    </IconWithTextTypography>
  );

  const IconTextWithCustomToolTip = (
    <CustomTooltip title={eachExplorationCard.label} arrow>
      {ExplorationCardLabel}
    </CustomTooltip>
  );

  return (
    <GridForExplorationCard item xs={3} key={explorationCardIndex}>
      {connectionRefValue ? IconTextWithCustomToolTip : ExplorationCardLabel}
    </GridForExplorationCard>
  );
};

const gettextIncludingRecipeStepsComponent = (
  explorationCardIndex: number,
  eachExplorationCard: IExplorationCardDetails
) => (
  <GridForExplorationCard item xs={3} key={explorationCardIndex}>
    <IconWithoutTextTypography variant="body1" component="p">
      {eachExplorationCard.label}
    </IconWithoutTextTypography>
  </GridForExplorationCard>
);

const getTextComponent = (
  explorationCardIndex: number,
  eachExplorationCard: IExplorationCardDetails,
  cardIndex: number,
  datasetNameRefValue: boolean,
  datasetNameRef: RefObject<HTMLInputElement>
) => {
  const ExplorationCardLabel = (
    <IconWithoutTextTypography variant="body1" ref={datasetNameRef} component="p">
      {eachExplorationCard.label}
    </IconWithoutTextTypography>
  );

  const ExplorationCardLabelWithCustomToolTip = (
    <CustomTooltip title={eachExplorationCard.label} arrow>
      {ExplorationCardLabel}
    </CustomTooltip>
  );

  return (
    <GridForExplorationCard
      item
      xs={3}
      key={explorationCardIndex}
      data-testid={`home-ongoing-explorations-${eachExplorationCard.type}-${cardIndex}`}
    >
      {datasetNameRefValue ? ExplorationCardLabelWithCustomToolTip : ExplorationCardLabel}
    </GridForExplorationCard>
  );
};

const getPercentageWithTextComponent = (
  explorationCardIndex: number,
  percent: number,
  eachExplorationCard: IExplorationCardDetails
) => {
  const NullValueCountText =
    percent > 0 ? TypographyWithRedColorText : TypographyWithGreenColorText;
  const PercentageSymbol = percent > 0 ? PercentageSymbolRed : PercentageSymbolGreen;
  return (
    <GridForExplorationCard
      item
      xs={3}
      key={explorationCardIndex}
      data-testid="ongoing-data-exploration-card-percentage-nan"
    >
      <NullValueCountContainer>
        <NullValueCountText
          variant="body2"
          data-testid="ongoing-data-card-percentage"
          component="p"
        >
          {Math.round(percent)}
        </NullValueCountText>
        <PercentageSymbol
          variant="body2"
          data-testid="ongoing-data-percentage-symbol"
          component="p"
        >
          {eachExplorationCard.percentageSymbol}
        </PercentageSymbol>
      </NullValueCountContainer>
      <QualityTextContainer>
        <StyledTyporgraphy variant="body1" component="p">
          {eachExplorationCard.subText}
        </StyledTyporgraphy>
      </QualityTextContainer>
    </GridForExplorationCard>
  );
};

export const getExplorationDatacard = (
  eachExplorationCard: IExplorationCardDetails,
  explorationCardIndex: number,
  connectionRefValue: boolean,
  connectionNameRef: RefObject<HTMLInputElement>,
  cardIndex: number,
  datasetNameRefValue: boolean,
  datasetNameRef: RefObject<HTMLInputElement>
) => {
  switch (eachExplorationCard.type) {
    case 'icon':
      return getIconComponent(explorationCardIndex, eachExplorationCard);
    case 'iconWithText':
      return getIconWithTextComponent(
        explorationCardIndex,
        eachExplorationCard,
        connectionRefValue,
        connectionNameRef
      );
    case 'text':
      return eachExplorationCard.label.includes('Recipe steps')
        ? gettextIncludingRecipeStepsComponent(explorationCardIndex, eachExplorationCard)
        : getTextComponent(
            explorationCardIndex,
            eachExplorationCard,
            cardIndex,
            datasetNameRefValue,
            datasetNameRef
          );
    case 'percentageWithText': {
      return Number(eachExplorationCard.label) >= 0 && !isNaN(Number(eachExplorationCard.label)) ? (
        getPercentageWithTextComponent(
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
