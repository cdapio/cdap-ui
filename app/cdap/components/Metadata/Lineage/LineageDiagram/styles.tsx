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

import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NODE_HEIGHT = 55;
const NODE_WIDTH = 175;
const nodeThemes = {
  data: {
    bgColor: `var(--white)`,
    color: 'initial',
    titleColor: `initial`,
    typeColor: `var(--grey03)`,
  },
  program: {
    bgColor: `var(--grey03)`,
    color: 'var(--white)',
    titleColor: `var(--white)`,
    typeColor: `var(--white)`,
  },
};
export const DIAGRAM_WIDTH = 920;

export const NoContentMsg = styled.p`
  margin-top: 150px;
  text-align: center;
  font-size: 1.39em;
  color: var(--grey02);
`;

export const LineageContainer = styled.div`
  position: relative;
  height: 270px;
  width: ${DIAGRAM_WIDTH}px;
  transform: scale(1);
  left: 0;
  top: 0;
`;

export const Node = styled.div`
  width: ${NODE_WIDTH}px;
  height: ${NODE_HEIGHT}px;
  position: absolute;
  padding: 10px 15px;
  cursor: pointer;
  background-color: ${(props) => nodeThemes[props.nodeType].bgColor};
  color: ${(props) => nodeThemes[props.nodeType].color};
`;

export const EntityName = styled.h4`
  line-height: 20px;
  margin: 0;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 1.08em !important;
  color: ${(props) => nodeThemes[props.nodeType].titleColor};
`;

export const EntityType = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  color: ${(props) => nodeThemes[props.nodeType].typeColor};
`;

export const EntityIcon = styled.span`
  font-size: 1em;
  vertical-align: middle;
  margin-right: 5px;
`;

export const EntityLink = styled(Link)`
  text-decoration: none;
  user-select: none;
  &:hover {
    text-decoration: none;
  }
`;

const Navigation = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  line-height: ${NODE_HEIGHT}px;
`;

export const LeftNavigation = styled(Navigation)`
  right: ${NODE_WIDTH + 5}px;
`;

export const RightNavigation = styled(Navigation)`
  left: ${NODE_WIDTH + 5}px;
`;

export const NavigationLink = styled.span`
  font-size: 3.46em;
  color: var(--grey02);
  vertical-align: middle;
`;
