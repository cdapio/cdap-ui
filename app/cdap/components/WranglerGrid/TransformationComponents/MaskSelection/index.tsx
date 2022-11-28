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

import { Popover, Button, Box } from '@material-ui/core';
import React from 'react';
import T from 'i18n-react';
import styled from 'styled-components';
import { HeadFont, NormalFont } from 'components/common/TypographyText';
import { blue } from '@material-ui/core/colors';

const MaskWrapper = styled(Box)`
  display: block;
  padding: 10px;
`;

const ApplyButtonWidget = styled(Button)`
  background: ${blue[500]};
  color: #ffffff;
  margin-right: 10px;
`;

const ExitModeButton = styled(Button)`
  font-weight: 700;
`;

const SubTitleWrapper = styled(Box)`
  margin: 10px 0;
`;

const PREFIX = 'features.WranglerNewUI.GridPage.transformationUI.mask';

export default function GridTextCell({
  anchorEl,
  setAnchorEl,
  textSelectionRange,
  columnSelected,
  applyTransformation,
  open,
  handleClose,
  rowNumber,
}) {
  const getPattern = (textSelectionRange, rowNumber, columnSelected) => {
    const { start, end } = textSelectionRange;
    const getMaskPattern = (N) =>
      Array.apply(null, { length: N })
        .map(() => 'x')
        .join('');
    const getAllowPattern = (N) =>
      Array.apply(null, { length: N })
        .map(() => '#')
        .join('');
    const length = columnSelected.length;
    if (start === 0) {
      return getMaskPattern(end) + getAllowPattern(length - end);
    }
    return getAllowPattern(start) + getMaskPattern(end - start) + getAllowPattern(length - end);
  };

  const applyMaskTransformation = () => {
    const pattern = getPattern(textSelectionRange, rowNumber, columnSelected);
    const directive = `mask-number :${columnSelected} ${pattern}`;
    applyTransformation(directive);
    setAnchorEl(null);
  };

  const id = open ? 'simple-popover' : undefined;

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <MaskWrapper data-testid="mask-selection-parent">
        <HeadFont data-testid="mask-selection-head-font">
          {T.translate(`${PREFIX}.maskHead`)}
        </HeadFont>
        <SubTitleWrapper data-testid="mask-selection-sub-title">
          <NormalFont>{T.translate(`${PREFIX}.maskAcrossRow`)}</NormalFont>
        </SubTitleWrapper>

        <ApplyButtonWidget
          onClick={applyMaskTransformation}
          variant="contained"
          disabled={false}
          data-testid="apply-mask-button"
        >
          {T.translate(`${PREFIX}.applyMask`)}
        </ApplyButtonWidget>
        <ExitModeButton
          onClick={handleClose}
          variant="text"
          disabled={false}
          data-testid="exit-mask-mode-button"
        >
          {T.translate(`${PREFIX}.exitMaskMode`)}
        </ExitModeButton>
      </MaskWrapper>
    </Popover>
  );
}
