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
import MuiListItemIcon from '@material-ui/core/ListItemIcon';
import MuiListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';

import styled from 'styled-components';
import classnames from 'classnames';

import { DiffIndicator } from '../types';
import { DiffIcon } from '../DiffIcon';

const PluginIconDiv = styled.div`
  text-align: center;
  width: 100%;
`;
const CustomIconImgContainer = styled.div`
  width: 100%;
  height: 1.25125rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 4px;
`;
const CustomIconImg = styled.img`
  height: 100%;
`;

const ListItemText = styled(MuiListItemText)`
  flex: 1;
`;

const ListItemIcon = styled(MuiListItemIcon)`
  min-width: 18px;
  margin-left: 5px;
  margin-right: 5px;
`;

interface IPluginDiffListItemProps {
  nodeName: string;
  customIconSrc?: string;
  iconName: string;
  diffIndicator: DiffIndicator;
  diffKey: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}
export const PluginDiffListItem = ({
  nodeName,
  customIconSrc,
  iconName,
  diffIndicator,
  onClick,
}: IPluginDiffListItemProps) => {
  return (
    <ListItem button onClick={onClick}>
      <ListItemIcon>
        {customIconSrc ? (
          <CustomIconImgContainer>
            <CustomIconImg src={customIconSrc} />
          </CustomIconImgContainer>
        ) : (
          <PluginIconDiv className={classnames('node-icon fa', iconName)} />
        )}
      </ListItemIcon>
      <ListItemText primary={nodeName} />
      <IconButton edge="end" size="small">
        <DiffIcon diffIndicator={diffIndicator} />
      </IconButton>
    </ListItem>
  );
};

interface IConnectionDiffListItemProps {
  fromNodeName: string;
  fromCustomIconSrc?: string;
  fromIconName: string;
  toNodeName: string;
  toCustomIconSrc?: string;
  toIconName: string;
  diffIndicator: DiffIndicator;
  diffKey: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}
export const ConnectionDiffListItem = ({
  fromNodeName,
  fromCustomIconSrc,
  fromIconName,
  toNodeName,
  toCustomIconSrc,
  toIconName,
  diffIndicator,
  onClick,
}: IConnectionDiffListItemProps) => {
  return (
    <ListItem button onClick={onClick}>
      <ListItemIcon>
        {fromCustomIconSrc ? (
          <CustomIconImgContainer>
            <CustomIconImg src={fromCustomIconSrc} />
          </CustomIconImgContainer>
        ) : (
          <PluginIconDiv className={classnames('node-icon fa', fromIconName)} />
        )}
      </ListItemIcon>
      <ListItemText primary={fromNodeName} />
      <ListItemIcon>
        {toCustomIconSrc ? (
          <CustomIconImgContainer>
            <CustomIconImg src={toCustomIconSrc} />
          </CustomIconImgContainer>
        ) : (
          <PluginIconDiv className={classnames('node-icon fa', toIconName)} />
        )}
      </ListItemIcon>
      <ListItemText primary={toNodeName} />
      <IconButton edge="end" size="small">
        <DiffIcon diffIndicator={diffIndicator} />
      </IconButton>
    </ListItem>
  );
};
