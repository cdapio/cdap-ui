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

import { Typography, Popover, Button, Box } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import NewColumnInput from 'components/common/TransformationInputComponents/NewColumnInput';
import T from 'i18n-react';
import styled from 'styled-components';
import { blue } from '@material-ui/core/colors';
import { HeadFont } from 'components/common/TypographyText';

const PREFIX = 'features.WranglerNewUI.GridPage.transformationUI.extract.extractUsingPosition';

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

const PositionWrapper = styled(Box)`
  padding: 10px;
`;

export default function({
  anchorEl,
  setAnchorEl,
  textSelectionRange,
  columnSelected,
  applyTransformation,
  headers,
  open,
  handleClose,
}) {
  const [column, setColumnName] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (headers?.filter((el) => el === column)?.length) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  }, [column]);

  const applyMaskTransformation = () => {
    if (!Boolean(column)) {
      return;
    }
    const directive = `cut-character :${columnSelected} :${column} ${textSelectionRange.start}-${textSelectionRange.end}`;
    applyTransformation(directive);
    handleClose();
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
      <PositionWrapper data-testid="position-extract-wrapper">
        <HeadFont data-testid="position-extract-head-font">
          {T.translate(`${PREFIX}.extractPosition`)}
        </HeadFont>
        <SubTitleWrapper>
          {`${T.translate(`${PREFIX}.extractCharacter`)} ${textSelectionRange.start}-${
            textSelectionRange.end
          } ${T.translate(`${PREFIX}.fromThisColumnToNew`)}`}
        </SubTitleWrapper>
        <NewColumnInput column={column} setColumnName={setColumnName} isError={isError} />
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
      </PositionWrapper>
    </Popover>
  );
}
