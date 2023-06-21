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

import PipelineModeless from 'components/PipelineDetails/PipelineModeless';
import React from 'react';
import styled from 'styled-components';
import { DiffWindow } from './DiffWindow';
import { DiffList } from './DiffList';

const StyledContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const PipelineDiff = ({ isOpen, onClose, namespace, appId, version, latestVersion }) => {
  return (
    <PipelineModeless
      title="pipeline difference"
      open={isOpen}
      onClose={onClose}
      placement="bottom-end"
      fullScreen={true}
      style={{ width: '100%', top: '100px', bottom: 0 }}
      innerStyle={{ height: '100%' }}
    >
      <StyledContainer>
        <DiffList />
        <DiffWindow {...{ namespace, appId, version, latestVersion }} />
      </StyledContainer>
    </PipelineModeless>
  );
};
