/*
 * Copyright © 2025 Cask Data, Inc.
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
import { alpha, Button, Paper, TableCell, TableContainer, TableRow } from '@material-ui/core';
import IconSVG from 'components/shared/IconSVG';
import styled, { css } from 'styled-components';

export const StyledTableContainer = styled(TableContainer).attrs(() => ({
  component: Paper,
  elevation: 10,
}))`
  margin-top: 1.3rem;
`;

export const StyledTableCell = styled(TableCell)`
  font-size: 1rem;

  ${(props) => css`
    ${props.defaultStar &&
      `
      cursor: pointer;
    `}

    ${props.profileStatus === 'enabled' &&
      `
        color: ${props.theme.palette.green[100]};
      `}

    ${props.profileStatus === 'disabled' &&
      `
        color: ${props.theme.palette.red[100]};
      `}
  `}
`;

export const StyledStarIcon = styled(IconSVG)`
  color: var(--brand-primary-color);
  ${(props) =>
    !props.profileIsDefault &&
    `
    display: none;
  `}
`;

export const StyledTableRow = styled(TableRow)`
  cursor: pointer;

  ${(props) => css`
    ${props.isNativeProfile &&
      `
    cursor: not-allowed;
  `}

    ${props.isNewProfile &&
      `
    border: 2px solid ${props.theme.palette.green[200]};
    background-color: ${alpha(props.theme.palette.green[200], 0.1)};
  `}

  &:hover {
      ${StyledStarIcon} {
        display: inline-block;
      }
    }
  `}
`;

export const StyledViewAllButton = styled(Button)`
  margin: 10px 0;
`;
