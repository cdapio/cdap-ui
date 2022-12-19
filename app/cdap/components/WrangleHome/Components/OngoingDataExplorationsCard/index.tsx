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

import {
  GridContainerAtHomePage,
  GridContainerAtWorkspaceListPage,
} from 'components/WrangleHome/Components/OngoingDataExplorationsCard/styledComponents';
import { IOngoingDataExplorationsCard } from 'components/WrangleHome/Components/OngoingDataExplorationsCard/types';
import { getExplorationDatacard } from 'components/WrangleHome/Components/OngoingDataExplorationsCard/utils';
import React, { createRef, RefObject, useEffect, useState } from 'react';

export default function({
  explorationCardDetails,
  cardIndex,
  fromAddress,
}: IOngoingDataExplorationsCard) {
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

  const OnGoingDataExplorationsContainer =
    fromAddress === 'Workspaces' ? GridContainerAtWorkspaceListPage : GridContainerAtHomePage;

  return (
    <OnGoingDataExplorationsContainer
      container
      data-testid={`ongoing-data-explorations-card-${cardIndex}`}
    >
      {explorationCardDetails?.map((eachExplorationCard, explorationCardIndex) =>
        getExplorationDatacard(
          eachExplorationCard,
          explorationCardIndex,
          connectionRefValue,
          connectionNameRef,
          cardIndex,
          datasetNameRefValue,
          datasetNameRef
        )
      )}
    </OnGoingDataExplorationsContainer>
  );
}
