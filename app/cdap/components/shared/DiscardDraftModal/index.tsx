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

import React from 'react';
import ConfirmationModal from '../ConfirmationModal';
import T from 'i18n-react';

const PREFIX = 'features.LifeCycleManagement.discardModal';

interface IDiscardDraftModalProps {
  isOpen: boolean;
  continueFn: () => void;
  toggleModal: () => void;
  discardFn: () => void;
}

export const DiscardDraftModal = ({
  isOpen,
  continueFn,
  toggleModal,
  discardFn,
}: IDiscardDraftModalProps) => {
  return (
    <ConfirmationModal
      headerTitle={T.translate(`${PREFIX}.title`)}
      isOpen={isOpen}
      cancelFn={discardFn}
      cancelButtonText={T.translate(`${PREFIX}.discard`)}
      confirmButtonText={T.translate(`${PREFIX}.continue`)}
      toggleModal={toggleModal}
      confirmationElem={T.translate(`${PREFIX}.text`)}
      confirmFn={continueFn}
      closeable={true}
    />
  );
};
