/*
 * Copyright © 2016 Cask Data, Inc.
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
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Page404 from 'components/404';
import Loadable from 'react-loadable';
import NamespaceStore, { validateNamespace } from 'services/NamespaceStore';
import NamespaceActions from 'services/NamespaceStore/NamespaceActions';
import LoadingSVGCentered from 'components/LoadingSVGCentered';
import ConfigurationGroupKitchenSync from 'components/ConfigurationGroup/KitchenSync';
import HomeActions from 'components/Home/HomeActions';
import ToggleExperiment from 'components/Lab/ToggleExperiment';
import ee from 'event-emitter';
require('./Home.scss');

const EntityListView = Loadable({
  loader: () => import(/* webpackChunkName: "EntityListView" */ 'components/EntityListView'),
  loading: LoadingSVGCentered,
});
const Connections = Loadable({
  loader: () => import(/* webpackChunkName: "Connections" */ 'components/Connections'),
  loading: LoadingSVGCentered,
});
const DataPrepHome = Loadable({
  loader: () => import(/* webpackChunkName: "DataPrepHome" */ 'components/DataPrepHome'),
  loading: LoadingSVGCentered,
});
const RulesEngineHome = Loadable({
  loader: () => import(/* webpackChunkName: "RulesEngineHome" */ 'components/RulesEngineHome'),
  loading: LoadingSVGCentered,
});
const DatasetDetailedView = Loadable({
  loader: () =>
    import(/* webpackChunkName: "DatasetDetailedView" */ 'components/DatasetDetailedView'),
  loading: LoadingSVGCentered,
});
const Experiments = Loadable({
  loader: () => import(/* webpackChunkName: "Experiments" */ 'components/Experiments'),
  loading: LoadingSVGCentered,
});
const NamespaceDetails = Loadable({
  loader: () => import(/* webpackChunkName: "NamespaceDetails" */ 'components/NamespaceDetails'),
  loading: LoadingSVGCentered,
});
const NamespaceAdmin = Loadable({
  loader: () => import(/* webpackChunkName: "NamespaceAdmin" */ 'components/NamespaceAdmin'),
  loading: LoadingSVGCentered,
});
const ProfileCreateView = Loadable({
  loader: () =>
    import(/* webpackChunkName: "ProfileCreateView" */ 'components/Cloud/Profiles/CreateView'),
  loading: LoadingSVGCentered,
});
const ProfileCreateProvisionerSelection = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "ProfileCreateProvisionerSelection" */ 'components/Cloud/Profiles/CreateView/ProvisionerSelection'
    ),
  loading: LoadingSVGCentered,
});
const ProfileDetailView = Loadable({
  loader: () =>
    import(/* webpackChunkName: "ProfileDetailView" */ 'components/Cloud/Profiles/DetailView'),
  loading: LoadingSVGCentered,
});
const Reports = Loadable({
  loader: () => import(/* webpackChunkName: "Reports" */ 'components/Reports'),
  loading: LoadingSVGCentered,
});
const Operations = Loadable({
  loader: () => import(/* webpackChunkName: "Operations" */ 'components/Operations'),
  loading: LoadingSVGCentered,
});
const PipelineList = Loadable({
  loader: () => import(/* webpackChunkName: "PipelineList" */ 'components/PipelineList'),
  loading: LoadingSVGCentered,
});
const SecureKeys = Loadable({
  loader: () => import(/* webpackChunkName: "SecureKeys" */ 'components/SecureKeys'),
  loading: LoadingSVGCentered,
});

const FieldLevelLineage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "FieldLevelLineage" */ 'components/FieldLevelLineage/v2'),
  loading: LoadingSVGCentered,
});

const Replicator = Loadable({
  loader: () => import(/* webpackChunkName: "Replicator" */ 'components/Replicator'),
  loading: LoadingSVGCentered,
});

const Ingestion = Loadable({
  loader: () => import(/* webpackChunkName: "Ingestion" */ 'components/Ingestion'),
  loading: LoadingSVGCentered,
});
const PluginJSONCreator = Loadable({
  loader: () => import(/* webpackChunkName: "PluginJSONCreator" */ 'components/PluginJSONCreator'),
  loading: LoadingSVGCentered,
});

const LogViewerPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "LogViewerPage" */ 'components/LogViewer/LogViewerPage'),
  loading: LoadingSVGCentered,
});

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.eventEmitter = ee(ee);
    NamespaceStore.dispatch({
      type: NamespaceActions.selectNamespace,
      payload: {
        selectedNamespace: this.props.match.params.namespace,
      },
    });
    validateNamespace(this.props.match.params.namespace);
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/ns/:namespace" component={HomeActions} />
          <Route exact path="/ns/:namespace/control" component={EntityListView} />
          <Route
            exact
            path="/ns/:namespace/datasets/:datasetId/fields"
            render={(props) => {
              return <FieldLevelLineage {...props} />;
            }}
          />
          <Route path="/ns/:namespace/datasets/:datasetId" component={DatasetDetailedView} />
          <Route exact path="/ns/:namespace/rulesengine" component={RulesEngineHome} />
          <Route exact path="/ns/:namespace/wrangler" component={DataPrepHome} />
          <Route exact path="/ns/:namespace/wrangler/:workspaceId" component={DataPrepHome} />
          <Route path="/ns/:namespace/connections" component={Connections} />
          <Route path="/ns/:namespace/experiments" component={Experiments} />
          <Route exact path="/ns/:namespace/operations" component={Operations} />
          <Route exact path="/ns/:namespace/details" component={NamespaceDetails} />
          <Route path="/ns/:namespace/admin" component={NamespaceAdmin} />
          <Route path="/ns/:namespace/reports" component={Reports} />
          <Route
            exact
            path="/ns/:namespace/profiles/create"
            component={ProfileCreateProvisionerSelection}
          />
          <Route
            exact
            path="/ns/:namespace/profiles/create/:provisionerId"
            component={ProfileCreateView}
          />
          <Route
            exact
            path="/ns/:namespace/profiles/details/:profileId"
            component={ProfileDetailView}
          />
          <Route path="/ns/:namespace/pipelines" component={PipelineList} />
          <Route path="/ns/:namespace/securekeys" component={SecureKeys} />
          <Route path="/ns/:namespace/kitchen" component={ConfigurationGroupKitchenSync} />
          <Route path="/ns/:namespace/replication" component={Replicator} />
          <Route
            exact
            path="/ns/:namespace/vs"
            render={(props) => {
              const VirtualScrollDemo = Loadable({
                loader: () =>
                  import(
                    /* webpackChunkName: "VirtualScrollDemo" */ 'components/VirtualScroll/demo'
                  ),
                loading: LoadingSVGCentered,
              });
              return (
                <ToggleExperiment
                  experimentId="virtual-scroll-demo"
                  defaultComponent={<Page404 {...props} />}
                  experimentalComponent={<VirtualScrollDemo />}
                />
              );
            }}
          />
          <Route
            exact
            path="/ns/:namespace/logs/program/:appId/:programType/:programId/:runId"
            component={LogViewerPage}
          />
          <Route
            path="/ns/:namespace/ingestion"
            component={Ingestion}
            // render={(props) => {
            //   return (
            //     <ToggleExperiment
            //       experimentId="data-ingestion"
            //       defaultComponent={<Page404 {...props} />}
            //       experimentalComponent={<Ingestion />}
            //     />
            //   );
            // }}
          />
          <Route path="/ns/:namespace/plugincreation" component={PluginJSONCreator} />
          <Route component={Page404} />
        </Switch>
      </div>
    );
  }
}

Home.propTypes = {
  params: PropTypes.shape({
    namespace: PropTypes.string,
  }),
  match: PropTypes.object,
};
