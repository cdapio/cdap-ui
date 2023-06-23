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
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { DiffWindow } from './DiffWindow';
import { DiffList } from './DiffList';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store';
import { fetchPipelineConfig } from './store/diffSlice';

const StyledContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const DiffContentContainer = ({ namespace, appId, version, latestVersion }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    fetchPipelineConfig(namespace, appId, version, latestVersion, dispatch);
  }, []);

  const { topPipeline, bottomPipeline, isLoading, diffList } = useSelector((state) => {
    return {
      topPipeline: state.pipelineDiff.topPipeline,
      bottomPipeline: state.pipelineDiff.bottomPipeline,
      isLoading: state.pipelineDiff.isLoading,
      diffList: state.pipelineDiff.diffList,
    };
  });
  return (
    <StyledContainer>
      <DiffList diffList={diffList} />
      <DiffWindow oldVersion={topPipeline} currentVersion={bottomPipeline} isLoading={isLoading} />
    </StyledContainer>
  );
};

export const PipelineDiff = ({ isOpen, onClose, namespace, appId, version, latestVersion }) => {
  return (
    <Provider store={store}>
      <PipelineModeless
        title="pipeline difference" // TODO: i18n
        open={isOpen}
        onClose={onClose}
        placement="bottom-end"
        fullScreen={true}
        style={{ width: '100%', top: '100px', bottom: 0 }}
        innerStyle={{ height: '100%' }}
      >
        <DiffContentContainer {...{ namespace, appId, version, latestVersion }} />
      </PipelineModeless>
    </Provider>
  );
};
