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
  const [pushSuccess, setPushSuccess] = useState(null);
  const [pushLoadingMessage, setPushLoadingMessage] = useState(null);

  const resetPushErrorAndSuccess = () => {
    setPushError(null);
    setPushSuccess(null);
  };

  const handlePipelinePush = () => {
    const selectedPipelines = [pipelineName];
    const payload = {
      commitMessage,
    };
    onToggle();
    pushSelectedPipelines(
      getCurrentNamespace(),
      selectedPipelines,
      payload,
      setPushLoadingMessage
    ).subscribe((res: any) => {
      // TODO: no changes made will also be 200, need to give different warning
      if (res.status !== SUPPORT.yes) {
        setPushError(res.message);
        setPushSuccess(false);
      } else {
        setPushSuccess(true);
      }
      setPushLoadingMessage(null);
    });
  };

  const confirmFn = () => {
    if (!commitMessage) {
      setPushError(T.translate(`${PREFIX}.emptyCommitMessage`));
      setPushSuccess(false);
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
        showAlert={pushSuccess !== null}
        message={pushSuccess ? T.translate(`${PREFIX}.pushSuccess`, { pipelineName }) : pushError}
        type={pushSuccess ? 'success' : 'error'}
        onClose={resetPushErrorAndSuccess}
      />
      <ConfirmationModal
        cancelFn={onToggle}
        isOpen={isOpen}
        toggleModal={onToggle}
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
          />
        }
        closeable={true}
        confirmFn={confirmFn}
      />
      <LoadingAppLevel
        isopen={loadingMessage !== null || pushLoadingMessage !== null}
        message={loadingMessage ? loadingMessage : pushLoadingMessage}
        style={{ width: '500px' }}
      />
    </>
  );
};
