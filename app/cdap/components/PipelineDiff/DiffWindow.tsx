/*
 * Copyright © 2023 Cask Data, Inc.
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
import styled from 'styled-components';
import { WrapperCanvas } from 'components/hydrator/components/Canvas';
import { DiffAccordion } from './DiffAccordion';

const DiffWindowRoot = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

interface IDiffWindowProps {
  oldVersion: any;
  currentVersion: any;
  isLoading: boolean;
  error: any;
}

export const DiffWindow = (props: IDiffWindowProps) => {
  const { oldVersion, currentVersion, isLoading, error } = props;

  return (
    <DiffWindowRoot>
      {/* TODO: i18n */}
      <DiffAccordion title={'Old Version'} defaultOpen={true}>
        {!isLoading && !error && (
          // TODO: CDAP-20716: Implement new canvas component
          <WrapperCanvas
            angularNodes={oldVersion.nodes}
            angularConnections={oldVersion.connections}
            isPipelineDiff={true}
            backgroundId={'older-pipeline'}
          />
        )}
      </DiffAccordion>

      {/* TODO: i18n */}
      <DiffAccordion title={'Current Version'} defaultOpen={true}>
        {!isLoading && !error && (
          // TODO: CDAP-20716: Implement new canvas component
          <WrapperCanvas
            angularNodes={currentVersion.nodes}
            angularConnections={currentVersion.connections}
            isPipelineDiff={true}
            backgroundId={'current-pipeline'}
          />
        )}
      </DiffAccordion>

      {/* TODO: i18n */}
      <DiffAccordion title={'Diff'} defaultOpen={false}>
        {/* TODO DIFF TABLE */}
      </DiffAccordion>
    </DiffWindowRoot>
  );
};
