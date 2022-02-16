/*
 * Copyright © 2022 Cask Data, Inc.
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
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Button, Checkbox } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import IconSVG from 'components/shared/IconSVG';

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 0 30px;
  background-color: var(--grey08);
`;

export const HeaderTitle = styled.h5`
  margin-top: 5px;
  font-weight: bold;
`;

export const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
  width: 100%;
`;

export const NoDataText = styled.span`
  margin: 15px 0;
  font-weight: bold;
  font-size: 1rem;
`;

export const Grid = styled.div`
  width: 100%;
  margin-top: 30px;
  margin-bottom: 30px;
  max-height: none;
`;

export const GridHeader = styled.div`
  padding-top: 2px;
  font-weight: 600;
  background-color: var(--grey08);
  border-bottom: 1px solid var(--grey11);
`;

export const GridBody = styled.div`
  border-bottom: 1px solid var(--grey11);
`;

export const GridRow = styled(({ border, highlighted, columnTemplate, ...props }) => (
  <div {...props} />
))`
  display: grid;
  height: 30px;
  padding: 5px 5px 5px 20px;
  grid-template-columns: ${(props) => props.columnTemplate};

  ${(props) =>
    props.border &&
    css`
      border-bottom: 1px solid var(--grey11);
    `}

  ${(props) =>
    props.highlighted &&
    css`
      border: 1px solid ${(p) => p.theme.palette.green[200]};
      background-color: rgba(138, 243, 2, 0.1);
    `}
`;

export const GridCell = styled(({ border, lastCol, ...props }) => <div {...props} />)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 20px;

  ${(props) =>
    props.border &&
    css`
      margin-bottom: -5px;
      border-bottom: 1px solid var(--grey11);
    `}

  ${(props) =>
    props.lastCol &&
    css`
      display: flex;
      justify-content: flex-end;
      padding-right: 0;
    `}
`;

export const StyledButton = styled(Button)`
  margin: 0 0 20px 30px;
  background-color: var(--white);
  color: var(--primary);
  height: 30px;
  width: 190px;
  font-size: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: var(--primary);
    color: var(--white);
  }
`;

export const StyledLinkBtn = styled(Link)`
  padding: 5px 20px;
  background-color: var(--white);
  color: var(--primary);
  height: 30px;
  font-size: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: var(--primary);
    color: var(--white);
    text-decoration: none;
  }
`;

export const NewReqContainer = styled.div`
  width: 50vw;
  max-width: 800px;
  min-width: 500px;
  margin-bottom: 40px;

  hr {
    border-width: 0;
    color: var(--grey07);
    background-color: var(--grey07);
    height: 2px;
  }
`;

export const StyledIcon = styled(IconSVG)`
  fill: ${(props) => props.color};
  font-size: ${(props) => props.size};
`;

export const LinedSpan = styled.span`
  display: flex;
  flex-direction: row;
  margin-right: -20px;

  &:before,
  &:after {
    content: '';
    flex: 1 1;
    border-bottom: 2px solid var(--grey11);
    margin: auto;
  }

  &:before {
    margin-right: 15px;
  }

  &:after {
    margin-left: 15px;
  }
`;

export const StyledCheckbox = styled(Checkbox)`
  padding: 0;
  margin-top: -2px;
`;

export const ErrorText = styled.span`
  color: ${(props) => props.theme.palette.red[50]};
`;

export const StyledAlert = styled(Alert)`
  font-size: inherit;
  margin-bottom: 20px;
`;
