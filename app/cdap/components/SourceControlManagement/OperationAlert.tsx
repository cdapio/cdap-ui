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

import React, { useState } from 'react';
import styled from 'styled-components';
import T from 'i18n-react';
import { IOperationRun } from './types';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import {
  getOperationRunMessage,
  getOperationRunTime,
  getOperationStartTime,
  getOperationStatusType,
  parseOperationResource,
} from './helpers';
import { Button, CircularProgress } from '@material-ui/core';
import { stopOperation } from './store/ActionCreator';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { OperationStatus } from './OperationStatus';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { AlertErrorView } from './styles';

interface IOperationBannerProps {
  operation: IOperationRun;
}

const StyledDiv = styled.div`
  margin-bottom: 24px;
`;

const ExpandWrapper = styled.div`
  height: 100%;
  padding-top: 12px;
`;

const PREFIX = 'features.SourceControlManagement';

export const OperationAlert = ({ operation }: IOperationBannerProps) => {
  const [viewErrorExpanded, setViewErrorExpanded] = useState(false);

  const getOperationAction = () => {
    if (
      operation.status === OperationStatus.STARTING ||
      operation.status === OperationStatus.RUNNING
    ) {
      return (
        <Button
          color="inherit"
          size="small"
          onClick={stopOperation(getCurrentNamespace(), operation)}
        >
          {T.translate(`${PREFIX}.stopOperation`)}
        </Button>
      );
    }

    if (operation.status === OperationStatus.STOPPING) {
      return (
        <Button color="inherit" size="small" disabled={true} startIcon={<CircularProgress />}>
          {T.translate(`${PREFIX}.stoppingOperation`)}
        </Button>
      );
    }

    if (operation.status === OperationStatus.FAILED) {
      return (
        <ExpandWrapper>
          <Button
            color="inherit"
            size="small"
            onClick={() => setViewErrorExpanded((isExpanded) => !isExpanded)}
          >
            {viewErrorExpanded ? <ExpandLess /> : <ExpandMore />}
          </Button>
        </ExpandWrapper>
      );
    }

    return undefined;
  };

  const renderOperationTime = () => {
    const startTime = getOperationStartTime(operation);
    const timeTaken = getOperationRunTime(operation);
    if (!timeTaken) {
      return T.translate(`${PREFIX}.operationStartedAt`, { startTime }).toString();
    }

    if (operation.done) {
      return T.translate(`${PREFIX}.operationRanFor`, { startTime, timeTaken }).toString();
    }

    return T.translate(`${PREFIX}.operationRunningFor`, { startTime, timeTaken }).toString();
  };

  function renderErrorMessage(message?: string) {
    if (!message) {
      return operation.error?.message;
    }

    const firstColonIndex = message.indexOf(':');
    return message.substring(firstColonIndex + 1);
  }

  return (
    <StyledDiv>
      <Alert
        variant="filled"
        severity={getOperationStatusType(operation)}
        action={getOperationAction()}
        data-testid="latest_operation_banner"
      >
        <AlertTitle>{getOperationRunMessage(operation)}</AlertTitle>
        {renderOperationTime()}
        {operation.status === OperationStatus.FAILED && viewErrorExpanded && (
          <AlertErrorView>
            Operation ID: {operation.id}
            {operation.error?.details[0] && (
              <>
                <br />
                Pipeline Name: {parseOperationResource(operation.error?.details[0]).name}
                <br />
                Error: {renderErrorMessage(operation.error?.details[0]?.message)}
              </>
            )}
          </AlertErrorView>
        )}
      </Alert>
    </StyledDiv>
  );
};
