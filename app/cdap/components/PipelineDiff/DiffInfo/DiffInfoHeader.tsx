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
import classnames from 'classnames';
import { Typography } from '@material-ui/core';

const DiffInfoHeaderContainer = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 4px;
  padding-left: 4px;
  padding-right: 4px;
  width: 100%;
`;

const PluginIconDiv = styled.div`
  margin: 4px;
`;

const CustomIconImgContainer = styled.div`
  align-items: center;
  display: flex;
  height: 1.25125rem;
  justify-content: center;
  margin: 4px;
`;

const CustomIconImg = styled.img`
  height: 100%;
`;

interface IDiffInfoHeaderProps {
  customIconSrc?: string;
  iconName: string;
  nodeName: string;
}
export const DiffInfoHeader = ({ customIconSrc, iconName, nodeName }: IDiffInfoHeaderProps) => {
  return (
    <DiffInfoHeaderContainer>
      {customIconSrc ? (
        <CustomIconImgContainer>
          <CustomIconImg src={customIconSrc} />
        </CustomIconImgContainer>
      ) : (
        <PluginIconDiv className={classnames('node-icon fa', iconName)} />
      )}
      <Typography variant="h6">{nodeName}</Typography>
    </DiffInfoHeaderContainer>
  );
};
