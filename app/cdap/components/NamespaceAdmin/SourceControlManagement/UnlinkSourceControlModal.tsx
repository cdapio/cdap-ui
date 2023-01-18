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
import T from 'i18n-react';
import ConfirmationModal from 'components/shared/ConfirmationModal';
import { deleteSourceControlManagement } from '../store/ActionCreator';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { ISourceControlManagementConfig } from './types';

const PREFIX = 'features.SourceControlManagement';

interface IUnlinkSourceControlModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  sourceControlManagementConfig: ISourceControlManagementConfig;
}

export const UnlinkSourceControlModal = ({
  isOpen,
  toggleModal,
  sourceControlManagementConfig,
}: IUnlinkSourceControlModalProps) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const onDelete = () => {
    deleteSourceControlManagement(getCurrentNamespace(), sourceControlManagementConfig).subscribe(
      () => {
        toggleModal();
      },
      (err) => {
        setErrorMessage(err.message);
      }
    );
  };
  return (
    <ConfirmationModal
      isOpen={isOpen}
      toggleModal={toggleModal}
      headerTitle={T.translate(`${PREFIX}.unlinkTitle`)}
      confirmationElem={T.translate(`${PREFIX}.unlinkText`)}
      closeable={true}
      confirmButtonText={T.translate(`${PREFIX}.unlinkConfirm`)}
      confirmFn={onDelete}
      cancelFn={toggleModal}
      errorMessage={errorMessage}
    />
  );
};
