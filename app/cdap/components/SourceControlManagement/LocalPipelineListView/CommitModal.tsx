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

import ConfirmationModal from 'components/shared/ConfirmationModal';
import { LoadingAppLevel } from 'components/shared/LoadingAppLevel';
import React, { useState } from 'react';
import T from 'i18n-react';
import { TextareaAutosize } from '@material-ui/core';
import Alert from 'components/shared/Alert';
import { pushSelectedPipelines } from '../store/ActionCreator';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { SUPPORT } from 'components/StatusButton/constants';
import { IListResponse } from '../types';

const PREFIX = 'features.SourceControlManagement.push';

interface ICommitModalProps {
  isOpen: boolean;
  onToggle: () => void;
  onSubmit?: (commitMessage: string) => void;
  loadingMessage?: string;
  pipelineName?: string;
}

export const CommitModal = ({
  isOpen,
  onToggle,
  onSubmit,
  loadingMessage = null,
  pipelineName,
}: ICommitModalProps) => {
  const [commitMessage, setCommitMessage] = useState(null);
  const [pushError, setPushError] = useState(null);
  const [pushStatus, setPushStatus] = useState(null);
  const [pushLoadingMessage, setPushLoadingMessage] = useState(null);

  const resetPushErrorAndSuccess = () => {
    setPushStatus(null);
    setPushError(null);
  };

  const toggleModal = () => {
    setCommitMessage(null);
    onToggle();
  };

  const getAlertTypeFromStatus = (status: SUPPORT) => {
    switch (status) {
      case SUPPORT.yes:
        return 'success';
      case SUPPORT.no:
        return 'error';
      case SUPPORT.partial:
        return 'warning';
    }
  };

  const handlePipelinePush = () => {
    const selectedPipelines = [pipelineName];
    const payload = {
      commitMessage,
    };
    pushSelectedPipelines(
      getCurrentNamespace(),
      selectedPipelines,
      payload,
      setPushLoadingMessage
    ).subscribe((res: IListResponse) => {
      setPushError(res.message);
      setPushStatus(res.status);
      setPushLoadingMessage(null);
    });
    toggleModal();
  };

  const confirmFn = () => {
    if (!commitMessage) {
      setPushError(T.translate(`${PREFIX}.emptyCommitMessage`));
      setPushStatus(SUPPORT.no);
      return;
    }
    // the submit function of namespace admin is slightly different
    // passing a onSubmit function to override the native onSubmit
    if (typeof onSubmit === 'function') {
      onSubmit(commitMessage);
      return;
    }
    handlePipelinePush();
  };

  return (
    <>
      <Alert
        showAlert={pushStatus !== null}
        message={pushError || T.translate(`${PREFIX}.pushSuccess`, { pipelineName })}
        type={getAlertTypeFromStatus(pushStatus)}
        onClose={resetPushErrorAndSuccess}
      />
      <ConfirmationModal
        cancelFn={toggleModal}
        isOpen={isOpen}
        toggleModal={toggleModal}
        headerTitle={T.translate(`${PREFIX}.commitTitle`)}
        confirmationElem={
          <TextareaAutosize
            minRows={4}
            maxRows={10}
            placeholder={T.translate(`${PREFIX}.commitPlaceHolder`).toString()}
            onChange={(e) => {
              setCommitMessage(e.target.value);
            }}
            style={{ width: '100%' }}
            data-testid="commit-message-input"
            value={commitMessage}
          />
        }
        closeable={true}
        confirmFn={confirmFn}
        disableAction={!commitMessage}
      />
      <LoadingAppLevel
        isopen={loadingMessage !== null || pushLoadingMessage !== null}
        message={loadingMessage ? loadingMessage : pushLoadingMessage}
        style={{ width: '500px' }}
      />
    </>
  );
};
