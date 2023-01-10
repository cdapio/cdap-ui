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
import { Redirect, Route, Switch } from 'react-router-dom';
import Helmet from 'react-helmet';
import MetadataHome from 'components/Metadata/Home';
import SearchResults from 'components/Metadata/SearchResults';
import SearchSummary from 'components/Metadata/SearchSummary';
import Lineage from 'components/Metadata/Lineage';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { Theme } from 'services/ThemeHelper';
import { useParams } from 'react-router';

export const basepath = '/ns/:namespace/metadata';

const Metadata: React.FC = () => {
  const pageTitle = `${Theme.productName} | Search`;
  const namespace = getCurrentNamespace();
  const params = useParams() as any;
  const query = params.query || '';
  const entity = params.entity || '';

  return (
    <>
      <Helmet title={pageTitle} />
      <Switch>
        <Route exact path={basepath} render={() => <MetadataHome />} />
        <Route path={`${basepath}/search/:query/result`} render={() => <SearchResults />} />
        <Route
          path={`${basepath}/:entityType/:entityId/summary`}
          render={() => <SearchSummary />}
        />
        <Route path={`${basepath}/:entityType/:entityId/lineage`} render={() => <Lineage />} />
        <Route
          render={() => {
            return <Redirect to={`/ns/${namespace}/metadata`} />;
          }}
        />
      </Switch>
    </>
  );
};

export default Metadata;
