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

import React, { useMemo, useState } from 'react';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import T from 'i18n-react';

import styled from 'styled-components';

import { ConnectionDiffListItem, PluginDiffListItem } from './DiffListItem';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  getPluginNameFromStageDiffKey,
  getStageDiffKey,
  getStageNameFromStageDiffKey,
} from '../util/diff';
import { getAvailabePluginsMapKeyFromPlugin, getCustomIconSrc } from '../util/helpers';
import { getPluginIcon } from 'services/helpers';
import { actions } from '../store/diffSlice';
import { DiffSearch } from '../DiffSearch';
import { AvailablePluginsMap, IPipelineDiffMap, IPipelineStage } from '../types';
import LoadingSVG from 'components/shared/LoadingSVG';
import { I18N_PREFIX } from '../constants';

const LoadingSVGContainer = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  width: 100%;
`;

const DiffSidebar = styled(Paper)`
  &.MuiPaper-root {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 400px;
    min-width: 400px;
    z-index: 1;
  }
`;

const DiffListContainer = styled.div`
  backgroundcolor: inherit;
  flex: 1;
`;

const DiffListRoot = styled(List)`
  backgroundcolor: inherit;
  overflow: auto;
  max-height: 100%;
`;

function getStageProps(
  stage: IPipelineStage,
  availablePluginsMap: AvailablePluginsMap,
  diffMap: IPipelineDiffMap
) {
  const diffKey = getStageDiffKey(stage);
  const nodeName = getStageNameFromStageDiffKey(diffKey);
  const customIconSrc = getCustomIconSrc(
    availablePluginsMap,
    getAvailabePluginsMapKeyFromPlugin(stage.plugin)
  );
  const iconName = getPluginIcon(getPluginNameFromStageDiffKey(diffKey));
  const diffIndicator = diffMap.stages[diffKey]?.diffIndicator;
  return {
    nodeName,
    customIconSrc,
    iconName,
    diffIndicator,
    diffKey,
  };
}

function getConnectionProps(
  fromStage,
  toStage,
  connectionKey: string,
  availablePluginsMap: AvailablePluginsMap,
  diffMap: IPipelineDiffMap
) {
  const fromProps = getStageProps(fromStage, availablePluginsMap, diffMap);
  const toProps = getStageProps(toStage, availablePluginsMap, diffMap);
  return {
    fromNodeName: fromProps.nodeName,
    fromCustomIconSrc: fromProps.customIconSrc,
    fromIconName: fromProps.iconName,
    toNodeName: toProps.nodeName,
    toCustomIconSrc: toProps.customIconSrc,
    toIconName: toProps.iconName,
    diffKey: connectionKey,
    diffIndicator: diffMap.connections[connectionKey].diffIndicator,
  };
}

export const DiffList = () => {
  const { diffMap, availablePluginsMap, isLoading } = useAppSelector((state) => {
    return {
      diffMap: state.pipelineDiff.diffMap,
      availablePluginsMap: state.pipelineDiff.availablePluginsMap,
      isLoading: state.pipelineDiff.isLoading,
    };
  });

  const dispatch = useAppDispatch();

  const [search, setSearch] = useState('');

  const pluginDiffList = useMemo(() => {
    return Object.keys(diffMap.stages)
      .map((diffKey) => {
        // The stage must exist in either the second pipeline(current version)
        // or the first pipeline (older version).
        const stage = diffMap.stages[diffKey].stage2 ?? diffMap.stages[diffKey].stage1;
        return getStageProps(stage, availablePluginsMap, diffMap);
      })
      .filter(({ nodeName }) => nodeName.toLowerCase().includes(search.toLowerCase()));
  }, [search, diffMap, availablePluginsMap]);

  const connectionDiffList = useMemo(() => {
    return Object.keys(diffMap.connections)
      .map((connectionKey) => {
        const fromStage = diffMap.connections[connectionKey].from;
        const toStage = diffMap.connections[connectionKey].to;
        return getConnectionProps(fromStage, toStage, connectionKey, availablePluginsMap, diffMap);
      })
      .filter(
        ({ fromNodeName, toNodeName }) =>
          fromNodeName.toLowerCase().includes(search.toLowerCase()) ||
          toNodeName.toLowerCase().includes(search.toLowerCase())
      );
  }, [search, diffMap, availablePluginsMap]);

  return (
    <DiffSidebar elevation={3}>
      <DiffSearch search={search} setSearch={setSearch} />
      <DiffListContainer>
        {isLoading && (
          <LoadingSVGContainer>
            <LoadingSVG />
          </LoadingSVGContainer>
        )}
        {!isLoading && (
          <DiffListRoot dense={true}>
            <ListSubheader style={{ backgroundColor: 'inherit' }}>
              {T.translate(`${I18N_PREFIX}.diffList.plugins`)}
            </ListSubheader>
            {pluginDiffList.map((props) => {
              return (
                <PluginDiffListItem
                  {...props}
                  onClick={() => {
                    dispatch(actions.showDiffDetails(props.diffKey));
                    dispatch(actions.startNavigateTo({ type: 'node', name: props.diffKey }));
                  }}
                  key={props.diffKey}
                />
              );
            })}
            <ListSubheader style={{ backgroundColor: 'inherit' }}>
              {T.translate(`${I18N_PREFIX}.diffList.connections`)}
            </ListSubheader>
            {connectionDiffList.map((props) => {
              return (
                <ConnectionDiffListItem
                  {...props}
                  onClick={() =>
                    dispatch(actions.startNavigateTo({ type: 'edge', name: props.diffKey }))
                  }
                  key={props.diffKey}
                />
              );
            })}
          </DiffListRoot>
        )}
      </DiffListContainer>
    </DiffSidebar>
  );
};
