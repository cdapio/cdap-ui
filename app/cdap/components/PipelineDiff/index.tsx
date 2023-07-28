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

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Provider } from 'react-redux';
import T from 'i18n-react';

import { delay, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

import PipelineModeless from 'components/PipelineDetails/PipelineModeless';
import { DiffWindow } from './DiffWindow';
import { DiffList } from './DiffList';
import { store } from './store';
import { useAppDispatch } from './store/hooks';
import { fetchExtraPluginProperties, fetchPipelineConfig } from './util/fetch';
import { actions } from './store/diffSlice';
import { computePipelineDiff } from './util/diff';

const PipelineDiffModalContents = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

interface IPipelineDiffModalProps {
  namespace: any;
  appId: any;
  version: any;
  latestVersion: any;
  isOpen: boolean;
  onClose: (event: React.MouseEvent<Document>) => void;
}

const PipelineDiffModal = ({
  namespace,
  appId,
  version,
  latestVersion,
  isOpen,
  onClose,
}: IPipelineDiffModalProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(actions.fetchPipelinesPending());
    fetchPipelineConfig({
      namespace,
      appId,
      topVersion: version,
      bottomVersion: latestVersion,
    })
      .pipe(
        switchMap((configs) => {
          const topPipelineStages = configs.topPipelineConfig.stages;
          const bottomPipelineStages = configs.bottomPipelineConfig.stages;
          const stages = topPipelineStages.concat(bottomPipelineStages);
          return Observable.forkJoin(
            of(configs),
            fetchExtraPluginProperties({ namespace, stages })
          );
        }),
        switchMap(([{ topPipelineConfig, bottomPipelineConfig }, { availablePluginsMap }]) => {
          const { diffMap } = computePipelineDiff(topPipelineConfig, bottomPipelineConfig);
          return of({
            topPipelineConfig,
            bottomPipelineConfig,
            availablePluginsMap,
            diffMap,
          });
        }),
        // TODO: currently without the timeout the graph edges renders weirdly
        // need to figure out the cause
        delay(300)
      )
      .subscribe(
        (res) => {
          dispatch(actions.fetchPipelinesFulfilled(res));
        },
        (error) => {
          dispatch(actions.fetchPipelinesRejected(error));
        }
      );
  }, []);

  return (
    <PipelineModeless
      title={T.translate('features.PipelineDiff.modalTitle').toString()}
      open={isOpen}
      onClose={(event) => {
        dispatch(actions.modalClosed());
        onClose(event);
      }}
      placement="bottom-end"
      fullScreen={true}
      style={{ width: '100%', top: '100px', bottom: 0 }}
      innerStyle={{ height: '100%' }}
    >
      <PipelineDiffModalContents>
        <DiffList />
        <DiffWindow />
      </PipelineDiffModalContents>
    </PipelineModeless>
  );
};

interface IPipelineDiffProps {
  isOpen: boolean;
  onClose: (event: React.MouseEvent<Document>) => void;
  namespace: any;
  appId: any;
  version: any;
  latestVersion: any;
}

export const PipelineDiff = ({
  isOpen,
  onClose,
  namespace,
  appId,
  version,
  latestVersion,
}: IPipelineDiffProps) => {
  return (
    <Provider store={store}>
      <PipelineDiffModal
        namespace={namespace}
        appId={appId}
        version={version}
        latestVersion={latestVersion}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Provider>
  );
};
