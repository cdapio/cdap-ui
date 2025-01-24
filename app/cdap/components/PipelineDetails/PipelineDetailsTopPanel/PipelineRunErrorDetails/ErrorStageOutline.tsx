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

import React from 'react';
import styled from 'styled-components';
import T from 'i18n-react';
import Button from '@material-ui/core/Button';
import ErrorIcon from '@material-ui/icons/Error';

import { expandErrorDetailsWithHighlightedStage } from './uiStateStore';
import { getDataTestid } from '@cdap-ui/testids/TestidsProvider';
import { PREFIX, TEST_PREFIX } from './constants';

const ErrorStageOuterBorder = styled.fieldset`
  position: absolute;
  top: -30px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border: 2px red solid;
  border-radius: 8px;

  legend {
    display: inline-block;
    width: unset;
    margin-bottom: 0;
    margin-left: 5px;
    border-bottom: none;
    font-size: 12px;
    color: red;
  }
`;

export interface IErrorStageOutlineProps {
  stageName: string;
}

export default function ErrorStageOutline({ stageName }: IErrorStageOutlineProps) {
  function onClickHandler() {
    expandErrorDetailsWithHighlightedStage(stageName);
  }

  return (
    <ErrorStageOuterBorder>
      <legend>
        <Button
          onClick={onClickHandler}
          color="secondary"
          startIcon={<ErrorIcon fontSize="small" />}
          data-testid={getDataTestid(`${TEST_PREFIX}.viewStageErrorButton`, stageName)}
        >
          {T.translate(`${PREFIX}.viewStageErrorButton`)}
        </Button>
      </legend>
    </ErrorStageOuterBorder>
  );
}
