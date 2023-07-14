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
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';

import styled from 'styled-components';

import { ConnectionDiffListItem, PluginDiffListItem } from './DiffListItem';
import { useAppSelector } from '../store/hooks';
import {
  getPluginNameFromStageDiffKey,
  getStageDiffKeysFromConnectionDiffKey,
  getStageNameFromStageDiffKey,
} from '../util/diff';
import { getAvailabePluginsMapKeyFromPlugin, getCustomIconSrc } from '../util/helpers';
import { getPluginIcon } from 'services/helpers';

const DiffListRoot = styled(Paper)`
  &.MuiPaper-root {
    height: 100%;
    width: 400px;
    min-width: 400px;
  }
`;

export const DiffList = () => {
  const { diffMap, availablePluginsMap } = useAppSelector((state) => {
    return {
      diffMap: state.pipelineDiff.diffMap,
      availablePluginsMap: state.pipelineDiff.availablePluginsMap,
    };
  });
  return (
    <DiffListRoot elevation={3}>
      <List dense={true}>
        {/* TODO: i18n */}
        <ListSubheader>Plugins</ListSubheader>
        {Object.keys(diffMap.stages).map((stageKey) => {
          // The stage must exist in either the second pipeline(current version)
          // or the first pipeline (older version).
          const stage = diffMap.stages[stageKey].stage2 ?? diffMap.stages[stageKey].stage1;
          const nodeName = getStageNameFromStageDiffKey(stageKey);
          const customIconSrc = getCustomIconSrc(
            availablePluginsMap,
            getAvailabePluginsMapKeyFromPlugin(stage.plugin)
          );
          const iconName = getPluginIcon(getPluginNameFromStageDiffKey(stageKey));
          const diffIndicator = diffMap.stages[stageKey].diffIndicator;
          return (
            <PluginDiffListItem
              nodeName={nodeName}
              customIconSrc={customIconSrc}
              iconName={iconName}
              diffKey={stageKey}
              diffType={diffIndicator}
              key={stageKey}
            />
          );
        })}
        {/* TODO: i18n */}
        <ListSubheader>Connections</ListSubheader>
        {Object.keys(diffMap.connections).map((connectionKey) => {
          const [fromStageKey, toStageKey] = getStageDiffKeysFromConnectionDiffKey(connectionKey);
          const fromStage = diffMap.connections[connectionKey].from;
          const toStage = diffMap.connections[connectionKey].to;

          const fromNodeName = getStageNameFromStageDiffKey(fromStageKey);
          const fromCustomIconSrc = getCustomIconSrc(
            availablePluginsMap,
            getAvailabePluginsMapKeyFromPlugin(fromStage.plugin)
          );
          const fromIconName = getPluginIcon(getPluginNameFromStageDiffKey(fromStageKey));

          const toNodeName = getStageNameFromStageDiffKey(toStageKey);
          const toCustomIconSrc = getCustomIconSrc(
            availablePluginsMap,
            getAvailabePluginsMapKeyFromPlugin(toStage.plugin)
          );
          const toIconName = getPluginIcon(getPluginNameFromStageDiffKey(toStageKey));
          return (
            <ConnectionDiffListItem
              fromNodeName={fromNodeName}
              fromCustomIconSrc={fromCustomIconSrc}
              fromIconName={fromIconName}
              toNodeName={toNodeName}
              toCustomIconSrc={toCustomIconSrc}
              toIconName={toIconName}
              diffKey={connectionKey}
              diffType={diffMap.connections[connectionKey].diffIndicator}
              key={connectionKey}
            />
          );
        })}
      </List>
    </DiffListRoot>
  );
};
