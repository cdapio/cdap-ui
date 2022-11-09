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

import { Box } from '@material-ui/core';
import { ITabWrapperProps } from 'components/FooterPanel/Components/common/TabWrapper/types';
import React from 'react';
import styled from 'styled-components';

const SmallBox = styled(Box)`
  &&& {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 8px 32px;
    gap: 8px;
    width: 88px;
    height: 40px;
    border-left: 1px solid #3994ff66;
    flex: none;
    order: 0;
    flex-grow: 0;
    background: linear-gradient(180deg, #4681f400 0.85%, #4681f433 118.78%);
    border-right: 1px solid #3994ff66;
    cursor: pointer;
  }
`;

const MediumBox = styled(Box)`
  &&& {
    text-align: center;
    padding: 9.5px 12px;
    gap: 8px;
    width: ${(props) => props.width}%;
    height: 40px;
    background: linear-gradient(180deg, #4681f400 0.85%, #4681f433 118.78%);
    border-left: 1px solid rgba(57, 148, 255, 0.4);
    cursor: pointer;
  }
`;

const LargeBox = styled(Box)`
  &&& {
    width: 65%;
    padding: 9.5px 32px;
  }
`;

/**
 *
 * @param size small or medium or large, 3 variants of footer tabs
 * @param clickEventListener callback to handle click events on the tabs
 * @param children children to be rendered inside the variants of TabWrapper
 * @param width width in percentage for the medium size variant of TabWrapper
 * @returns TabWrapper with appropriate variations according to props
 */
export default function({
  size,
  clickEventListener,
  children,
  width,
  dataTestID,
}: ITabWrapperProps) {
  return (
    <>
      {size === 'small' && (
        <SmallBox onClick={clickEventListener} data-testid={dataTestID}>
          {children}
        </SmallBox>
      )}
      {size === 'medium' && (
        <MediumBox onClick={clickEventListener} width={width} data-testid={dataTestID}>
          {children}
        </MediumBox>
      )}
      {size === 'large' && (
        <LargeBox onClick={clickEventListener} data-testid={dataTestID}>
          {children}
        </LargeBox>
      )}
    </>
  );
}
