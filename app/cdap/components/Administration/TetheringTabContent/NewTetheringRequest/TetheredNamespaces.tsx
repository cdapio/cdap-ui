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
import T from 'i18n-react';
import { INamespace } from '../types';
import {
  NewReqContainer,
  HeaderTitle,
  BodyContainer,
  ErrorText,
  NoDataText,
} from '../shared.styles';
import { I18N_TETHERED_PREFIX } from './constants';
import { IErrorObj } from 'components/shared/ConfigurationGroup/utilities';
import NamespacesTable from './NamespacesTable';

interface ITetheredNamespacesProps {
  namespaces: INamespace[];
  selectedNamespaces: string[];
  validationError: IErrorObj;
  broadcastChange: (ns: string) => void;
}

const TetheredNamespaces = ({
  namespaces,
  selectedNamespaces,
  validationError,
  broadcastChange,
}: ITetheredNamespacesProps) => {
  return (
    <NewReqContainer>
      <HeaderTitle>{T.translate(`${I18N_TETHERED_PREFIX}.title`)}</HeaderTitle>
      <hr />
      <span>{T.translate(`${I18N_TETHERED_PREFIX}.description`)}</span>
      <BodyContainer>
        {namespaces.length > 0 ? (
          <NamespacesTable
            tableData={namespaces}
            selectedNamespaces={selectedNamespaces}
            broadcastChange={broadcastChange}
          />
        ) : (
          <NoDataText>{T.translate(`${I18N_TETHERED_PREFIX}.noNamespaces`)}</NoDataText>
        )}
      </BodyContainer>
      {validationError && <ErrorText data-testid="no-ns-selected">{validationError.msg}</ErrorText>}
    </NewReqContainer>
  );
};

export default TetheredNamespaces;
