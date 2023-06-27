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
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/Inbox';
import EditIcon from '@material-ui/icons/Edit';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@material-ui/icons/IndeterminateCheckBoxOutlined';

import styled from 'styled-components';
import classnames from 'classnames';

import { DiffIndicator, IPipelineConnection, IPipelineStage, JSONDiffList } from '../types';
import { getPluginIcon } from 'services/helpers';

const DiffIcon = ({ diffType }: { diffType: DiffIndicator }) => {
  if (diffType === '+') {
    return <AddBoxOutlinedIcon style={{ color: 'green' }} />;
  } else if (diffType === '-') {
    return <IndeterminateCheckBoxOutlinedIcon style={{ color: 'red' }} />;
  } else {
    // === '~'
    return <EditIcon style={{ color: 'orange' }} />;
  }
};

const DiffListRoot = styled.div`
  background: white;
  height: 100%;
  width: 400px;
`;

interface IDiffListProps {
  diffList: {
    stagesDiffList: JSONDiffList<IPipelineStage>;
    connectionsDiffList: JSONDiffList<IPipelineConnection>;
  };
}

const IconDiv = styled.div`
  text-align: center;
  width: 100%;
`;

export const DiffList = ({ diffList }: IDiffListProps) => {
  console.log({ diffList });
  return (
    <DiffListRoot>
      <List component="nav">
        {diffList.stagesDiffList.map((diffItem, index) => {
          const [diffType, stageName] = diffItem;
          const [pluginName, nodeName] = stageName.split('__');
          return (
            <ListItem button key={index}>
              <ListItemIcon>
                <IconDiv className={classnames('node-icon fa', getPluginIcon(pluginName))} />
              </ListItemIcon>
              <ListItemText primary={nodeName} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="comments">
                  <DiffIcon diffType={diffType} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    </DiffListRoot>
  );
};
