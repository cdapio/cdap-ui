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
import { getExplorationDatacard } from './utils';

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
      {explorationCardDetails?.map((eachExplorationCard, explorationCardIndex) =>
        getExplorationDatacard(
          eachExplorationCard,
          explorationCardIndex,
          classes,
          connectionRefValue,
          connectionNameRef,
          cardIndex,
          datasetNameRefValue,
          datasetNameRef
        )
      )}
    </Grid>
  );
}
