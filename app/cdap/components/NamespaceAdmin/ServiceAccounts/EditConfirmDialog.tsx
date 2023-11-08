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
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import { ConfirmDialog, SeverityType, IExtendedMessage } from 'components/shared/ConfirmDialog';
import {
  validateServiceAccount,
  addServiceAccount,
} from 'components/NamespaceAdmin/store/ActionCreator';

const PREFIX = 'features.ServiceAccounts';

interface IEditConfirmDialogProps {
  selectedServiceAcccount: string;
  isShow: boolean;
  closeFn: () => void;
  namespaceIdentity: string;
  k8snamespace?: string;
}

const StyledTextField = styled(TextField)`
  & .MuiInputLabel-shrink {
    font-size: 17px;
  }
  & .MuiOutlinedInput-notchedOutline {
    font-size: 16px;
    border-color: #80868b;
  }
  & .MuiFormHelperText-root {
    margin-left: 0px;
    font-size: 12px;
  }
`;

/**
 * Generates the gcloud cli command to add an IAM policy binding. If any of the
 * parameters for the command is not provided when the command is generated, then
 * the user should be able to provide them as environment variables in their shell.
 *
 * @param  tenantProjectId string, defaults to "${TENANT_PROJECT_ID}" so it can be
 *         provided as the environment variable TENANT_PROJECT_ID when
 *         the command is run
 * @param  identity string, defaults to "${IDENTITY}" so that it can be provided as the
 *         environment variable IDENTITY when the command is run
 * @param  gsaEmail string, defaults to "${GSA_EMAIL}" so that it can be provided as the
 *         environment variable GSA_EMAIL when the command is run
 * @return string, the gcloud cli command to run
 */
const getGcloudCommand = ({
  tenantProjectId = '${TENANT_PROJECT_ID}',
  identity = '${IDENTITY}',
  gsaEmail = '${GSA_EMAIL}',
  gsaProjectId = '${GSA_PROJECT_ID}',
  k8snamespace = 'default',
}): string =>
  `gcloud iam service-accounts add-iam-policy-binding --role roles/iam.workloadIdentityUser --member "serviceAccount:${tenantProjectId}.svc.id.goog[${k8snamespace}/${identity}]" ${gsaEmail} --project ${gsaProjectId}`;

export const EditConfirmDialog = ({
  selectedServiceAcccount,
  isShow,
  closeFn,
  namespaceIdentity,
  k8snamespace,
}: IEditConfirmDialogProps) => {
  const namespacedCreationHookEnabled = window.CDAP_CONFIG.cdap.namespaceCreationHookEnabled;
  const [serviceAccountInputValue, setServiceAccountInputValue] = useState<string>(
    selectedServiceAcccount
  );
  const [saveStatusMsg, setSaveStatusMsg] = useState<string | ReactNode>(
    T.translate(`${PREFIX}.helpTitle`)
  );
  const [saveStatusDetails, setSaveStatusDetails] = useState<IExtendedMessage | string>(
    T.translate(`${PREFIX}.helpContent`).toString()
  );
  const [saveStatus, setSaveStatus] = useState<SeverityType>(SeverityType.INFO);

  const gcloudCommandParams = {
    identity: namespaceIdentity || undefined,
    gsaEmail: serviceAccountInputValue || undefined,
    k8snamespace: (namespacedCreationHookEnabled && k8snamespace) || undefined,
  };

  const copyableExtendedMessage =
    saveStatus === SeverityType.INFO ? getGcloudCommand(gcloudCommandParams) : null;

  // validates and then saves
  const handleSave = () => {
    const reqObj = { serviceAccount: serviceAccountInputValue };
    validateServiceAccount(reqObj).subscribe(
      (res) => {
        // validation success, so proceed for save
        addServiceAccount(reqObj).subscribe(closeFn, (err) => {
          // save failed
          showErrorMessage('failedToSave', err);
        });
      },
      (validationError) => {
        // validation failed
        showErrorMessage('failedToValidate', validationError);
      }
    );
  };

  const showErrorMessage = (failedStage, errorObj) => {
    setSaveStatus(SeverityType.ERROR);
    setSaveStatusMsg(T.translate(`${PREFIX}.${failedStage}`));
    if (errorObj.response) {
      setSaveStatusDetails({
        response: errorObj.response,
      });
    }
  };

  const showHelp = () => {
    setSaveStatus(SeverityType.INFO);
    setSaveStatusMsg(T.translate(`${PREFIX}.helpTitle`));
    setSaveStatusDetails(T.translate(`${PREFIX}.helpContent`).toString());
  };

  const getEditDialogContent = () => {
    return (
      <StyledTextField
        label={T.translate(`${PREFIX}.editInputLabel`)}
        defaultValue={serviceAccountInputValue}
        helperText={T.translate(`${PREFIX}.inputHelperText`)}
        variant="outlined"
        margin="dense"
        fullWidth
        color="primary"
        onChange={(ev) => {
          setServiceAccountInputValue(ev.target.value);
          // this check is to show help again when user changes the input after getting error.
          if (saveStatus !== SeverityType.INFO) {
            showHelp();
          }
        }}
      />
    );
  };

  return (
    <ConfirmDialog
      headerTitle={T.translate(`${PREFIX}.serviceAccount`)}
      confirmationElem={getEditDialogContent()}
      cancelButtonText={T.translate('commons.cancel')}
      confirmButtonText={T.translate('commons.save')}
      confirmFn={handleSave}
      cancelFn={closeFn}
      disableAction={!serviceAccountInputValue}
      isOpen={isShow}
      severity={saveStatus}
      statusMessage={saveStatusMsg}
      extendedMessage={saveStatusDetails}
      copyableExtendedMessage={copyableExtendedMessage}
    ></ConfirmDialog>
  );
};
