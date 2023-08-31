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

import React, { ReactNode, useState } from 'react';
import T from 'i18n-react';
import { ConfirmDialog, SeverityType, IExtendedMessage } from 'components/shared/ConfirmDialog';
import { deleteServiceAccount } from 'components/NamespaceAdmin/store/ActionCreator';

const PREFIX = 'features.ServiceAccounts';

interface IDeleteConfirmDialogProps {
  selectedServiceAcccount: string;
  isShow: boolean;
  closeFn: () => void;
}

export const DeleteConfirmDialog = ({
  selectedServiceAcccount,
  isShow,
  closeFn,
}: IDeleteConfirmDialogProps) => {
  const [deleteErrorMsg, setDeleteErrorMsg] = useState<string | ReactNode>(null);
  const [extendedErrorMsg, setExtendedErrorMsg] = useState<IExtendedMessage | string>(null);

  const deleteHanlder = () => {
    deleteServiceAccount().subscribe(closeFn, (err) => {
      setDeleteErrorMsg(T.translate(`${PREFIX}.failedToDelete`));
      if (err.response) {
        setExtendedErrorMsg({ response: err.response });
      }
    });
  };

  return (
    <ConfirmDialog
      headerTitle={T.translate(`${PREFIX}.deleteTitle`)}
      confirmationElem={T.translate(`${PREFIX}.deleteConfirmation`, {
        serviceaccount: selectedServiceAcccount,
      })}
      cancelButtonText={T.translate(`${PREFIX}.cancelButtonText`)}
      confirmButtonText={T.translate(`${PREFIX}.deleteButtonText`)}
      confirmFn={deleteHanlder}
      cancelFn={closeFn}
      isOpen={isShow}
      severity={SeverityType.ERROR}
      statusMessage={deleteErrorMsg}
      extendedMessage={extendedErrorMsg}
    ></ConfirmDialog>
  );
};
