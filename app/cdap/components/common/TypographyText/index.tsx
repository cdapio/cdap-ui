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

import { Typography } from '@material-ui/core';
import { grey, green, red } from '@material-ui/core/colors';
import styled from 'styled-components';

export const NormalFont = styled(Typography)`
  color: ${grey[600]};
  font-size: 14px;
  font-weight: 400;
`;

export const SubHeadNormalFont = styled(Typography)`
  color: ${grey[700]};
  font-size: 16px;
  font-weight: 400;
`;

export const SubHeadBoldFont = styled(Typography)`
  color: ${grey[700]};
  font-size: 16px;
  font-weight: 600;
`;

export const HeadFont = styled(Typography)`
  color: ${grey[900]};
  font-size: 20px;
`;

export const ErrorFont = styled(Typography)`
  color: ${red[600]};
  font-size: 14px;
`;

export const SuccessText = styled(Typography)`
  color: ${green[600]};
  font-size: 14px;
`;

export const MenuHeadText = styled(Typography)`
  color: ${grey[600]};
  font-size: 14px;
  font-weight: 600;
  padding: 10px 20px;
`;

export const TableCellText = styled(Typography)`
  font-weight: 400;
  max-width: 190px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  margin-bottom: 5px;
  text-transform: capitalize;
`;
