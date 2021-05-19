/*
 * Copyright © 2021 Cask Data, Inc.
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

import * as React from 'react';
import If from 'components/If';
import Helmet from 'react-helmet';
import T from 'i18n-react';
import { Theme } from 'services/ThemeHelper';
import { ConnectionRoutes } from 'components/Connections/Routes';
import { MemoryRouter } from 'react-router';
import { getCurrentNamespace } from 'services/NamespaceStore';
const PREFIX = 'features.DataPrepConnections';
const DATAPREP_I18N_PREFIX = 'features.DataPrep.pageTitle';

export default function Connections({ enableRouting = true, singleWorkspaceMode }) {
  const featureName = Theme.featureNames.dataPrep;
  const pageTitle = (
    <Helmet
      title={T.translate(DATAPREP_I18N_PREFIX, {
        productName: Theme.productName,
        featureName,
      })}
    />
  );
  return (
    <React.Fragment>
      <If condition={singleWorkspaceMode || enableRouting}>{pageTitle}</If>
      <If condition={enableRouting}>
        <ConnectionRoutes enableRouting={enableRouting} />
      </If>
      <If condition={!enableRouting}>
        <MemoryRouter initialEntries={[`/ns/${getCurrentNamespace()}/connections`]}>
          <ConnectionRoutes enableRouting={enableRouting} />
        </MemoryRouter>
      </If>
    </React.Fragment>
  );
}
