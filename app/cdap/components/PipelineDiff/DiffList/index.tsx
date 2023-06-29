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

import { IPipelineConnection, IPipelineStage, JSONDiffList } from '../types';
import { ConnectionDiffListItem, PluginDiffListItem } from './DiffListItem';

const DiffListRoot = styled(Paper)`
  &.MuiPaper-root {
    height: 100%;
    width: 400px;
  }
`;
interface IDiffListProps {
  diffList: {
    stagesDiffList: JSONDiffList<IPipelineStage>;
    connectionsDiffList: JSONDiffList<IPipelineConnection>;
  };
}

export const DiffList = ({ diffList }: IDiffListProps) => {
  return (
    <DiffListRoot elevation={3}>
      <List dense={true}>
        <ListSubheader>Plugins</ListSubheader>
        {diffList.stagesDiffList.map((diffItem, index) => {
          return <PluginDiffListItem diffItem={diffItem} key={index} />;
        })}
        <ListSubheader>Connections</ListSubheader>
        {diffList.connectionsDiffList.map((diffItem, index) => {
          return <ConnectionDiffListItem diffItem={diffItem} key={index} />;
        })}
      </List>
    </DiffListRoot>
  );
};
