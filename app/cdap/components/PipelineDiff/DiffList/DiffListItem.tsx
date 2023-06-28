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

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@material-ui/icons/IndeterminateCheckBoxOutlined';

import styled from 'styled-components';
import classnames from 'classnames';

import { DiffIndicator, IPipelineConnection, IPipelineStage, JSONDiffList } from '../types';
import { getPluginIcon } from 'services/helpers';

interface IDiffIconProps {
  diffType: DiffIndicator;
}
const DiffIcon = ({ diffType }: IDiffIconProps) => {
  if (diffType === '+') {
    return <AddBoxOutlinedIcon style={{ color: 'green' }} />;
  } else if (diffType === '-') {
    return <IndeterminateCheckBoxOutlinedIcon style={{ color: 'red' }} />;
  } else {
    // === '~'
    return <EditIcon style={{ color: 'orange' }} />;
  }
};

const PluginIconDiv = styled.div`
  text-align: center;
  width: 100%;
`;

function pluginAndNodeName(stageName: string) {
  return stageName.split('__');
}

function fromAndToStageName(connectionName: string) {
  return connectionName.split('%');
}

interface IPluginDiffListItemProps {
  jsonDiffItem: JSONDiffList<IPipelineStage>[number];
}
export const PluginDiffListItem = ({ jsonDiffItem }: IPluginDiffListItemProps) => {
  const [diffType, stageName] = jsonDiffItem;
  const [pluginName, nodeName] = pluginAndNodeName(stageName);
  return (
    <ListItem button>
      <ListItemIcon>
        <PluginIconDiv className={classnames('node-icon fa', getPluginIcon(pluginName))} />
      </ListItemIcon>
      <ListItemText primary={nodeName} />
      <IconButton edge="end" size="small">
        <DiffIcon diffType={diffType} />
      </IconButton>
    </ListItem>
  );
};

interface IConnectionDiffListItemProps {
  jsonDiffItem: JSONDiffList<IPipelineConnection>[number];
}
export const ConnectionDiffListItem = ({ jsonDiffItem }: IConnectionDiffListItemProps) => {
  const [diffType, connectionName] = jsonDiffItem;
  const [fromStageName, toStageName] = fromAndToStageName(connectionName);
  const [fromPluginName, fromNodeName] = pluginAndNodeName(fromStageName);
  const [toPluginName, toNodeName] = pluginAndNodeName(toStageName);
  return (
    <ListItem button>
      <ListItemIcon>
        <PluginIconDiv className={classnames('node-icon fa', getPluginIcon(fromPluginName))} />
      </ListItemIcon>
      <ListItemText primary={fromNodeName} />
      <IconButton size="small">
        <DiffIcon diffType={diffType} />
      </IconButton>
      <ListItemIcon>
        <PluginIconDiv className={classnames('node-icon fa', getPluginIcon(toPluginName))} />
      </ListItemIcon>
      <ListItemText primary={toNodeName} />
    </ListItem>
  );
};
