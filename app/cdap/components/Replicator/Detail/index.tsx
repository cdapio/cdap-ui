/*
 * Copyright © 2020 Cask Data, Inc.
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
import withStyles, { WithStyles, StyleRules } from '@material-ui/core/styles/withStyles';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { MyReplicatorApi } from 'api/replicator';
import { List, Map, fromJS } from 'immutable';
import { Redirect } from 'react-router-dom';
import TopPanel from 'components/Replicator/Detail/TopPanel';
import { objectQuery } from 'services/helpers';
import { PROGRAM_STATUSES } from 'services/global-constants';
import { Observable } from 'rxjs/Observable';
import { PluginType } from 'components/Replicator/constants';
import { fetchPluginInfo, generateTableKey } from 'components/Replicator/utilities';
import { fetchPluginWidget } from 'services/PluginUtilities';
import DetailContent from 'components/Replicator/Detail/DetailContent';
import LoadingSVGCentered from 'components/shared/LoadingSVGCentered';
import ContentHeading from 'components/Replicator/Detail/ContentHeading';
import { ITableInfo, IArtifactInfo } from '../types';
import DownloadFile from 'services/download-file';
import ErrorBanner from 'components/shared/ErrorBanner';

export const DetailContext = React.createContext<Partial<IDetailState>>({});

const styles = (theme): StyleRules => {
  return {
    root: {
      height: '100%',
    },
    buttonContainer: {
      '& > *': {
        marginRight: '15px',
      },
    },
    config: {
      border: `1px solid ${theme.palette.grey[300]}`,
      borderRadius: '4px',
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
      padding: '15px',
    },
    body: {
      padding: '0 40px 15px 40px',
      height: 'calc(100% - 70px)',
    },
  };
};

interface IDetailProps extends WithStyles<typeof styles> {
  match: {
    params: {
      replicatorId: string;
    };
  };
}

interface IColumn {
  name: string;
  type: string;
}

interface IDetailState {
  name: string;
  parentArtifact: IArtifactInfo;
  description: string;
  status: string;
  redirect: string;
  rawAppConfig: Map<string, any>;
  runId: string;
  sourcePluginInfo: any;
  sourcePluginWidget: any;
  targetPluginInfo: any;
  targetPluginWidget: any;
  sourceConfig: Record<string, string>;
  targetConfig: Record<string, string>;
  tables: Map<string, Map<string, string>>;
  columns: Map<string, List<IColumn>>;
  offsetBasePath: string;
  activeTable: ITableInfo;
  timeRange: string;
  loading: boolean;
  lastUpdated: number;
  startTime: number;
  endTime: number;
  numInstances: number;

  start: () => void;
  stop: () => void;
  deleteReplicator: () => void;
  setActiveTable: (table: ITableInfo) => void;
  setTimeRange: (timeRange: string) => void;
  exportPipeline: () => void;
  duplicatePipeline: () => void;
  error: object | string | null;
}

export type IDetailContext = Partial<IDetailState>;

class DetailView extends React.PureComponent<IDetailProps, IDetailContext> {
  private statusPoll$ = null;

  private start = () => {
    const params = {
      ...this.getBaseParams(),
      action: 'start',
    };

    MyReplicatorApi.action(params).subscribe(
      () => {
        this.setState({
          status: PROGRAM_STATUSES.STARTING,
          startTime: null,
          endTime: null,
        });
      },
      (err) => {
        this.handleError(err);
      }
    );
  };

  private stop = () => {
    const currentStatus = this.state.status;

    this.setState({
      status: PROGRAM_STATUSES.STOPPING,
    });

    const params = {
      ...this.getBaseParams(),
      action: 'stop',
    };

    MyReplicatorApi.action(params).subscribe(
      () => {
        this.setState({
          status: PROGRAM_STATUSES.STOPPING,
        });
      },
      (err) => {
        // tslint:disable-next-line: no-console
        this.handleError(err);
        this.setState({
          status: currentStatus,
        });
      }
    );
  };

  private deleteReplicator = () => {
    MyReplicatorApi.delete(this.getBaseParams()).subscribe(
      () => {
        const listViewLink = `/ns/${getCurrentNamespace()}/replication`;
        this.setState({ redirect: listViewLink });
      },
      (err) => {
        // tslint:disable-next-line: no-console
        this.handleError(err);
      }
    );
  };

  private setActiveTable = (tableInfo: ITableInfo) => {
    this.setState({
      activeTable: tableInfo,
    });
  };

  private setTimeRange = (timeRange: string) => {
    this.setState({
      timeRange,
      lastUpdated: Date.now(),
    });
  };

  private getPipelineConfig = () => {
    const config = this.state.rawAppConfig.toJS();

    const pipelineConfig = {
      name: this.state.name,
      artifact: this.state.parentArtifact,
      config,
    };

    return pipelineConfig;
  };

  private duplicatePipeline = () => {
    const pipelineConfig = this.getPipelineConfig();
    const cloneId = pipelineConfig.name;
    pipelineConfig.name = '';

    window.localStorage.setItem(cloneId, JSON.stringify(pipelineConfig));
    const createViewLink = `/ns/${getCurrentNamespace()}/replication/create?cloneId=${cloneId}`;
    this.setState({
      redirect: createViewLink,
    });
  };

  private exportPipeline = () => {
    const pipelineConfig = this.getPipelineConfig();
    DownloadFile(pipelineConfig);
  };

  public state = {
    name: objectQuery(this.props, 'match', 'params', 'replicatorId'),
    parentArtifact: null,
    description: null,
    status: null,
    runId: null,
    redirect: null,
    rawAppConfig: null,
    sourcePluginInfo: null,
    sourcePluginWidget: null,
    targetPluginInfo: null,
    targetPluginWidget: null,
    sourceConfig: {},
    targetConfig: {},
    tables: Map<string, Map<string, string>>(),
    columns: Map<string, List<IColumn>>(),
    offsetBasePath: '',
    activeTable: null,
    timeRange: '24h',
    loading: true,
    lastUpdated: Date.now(),
    startTime: null,
    end: null,
    error: null,
    numInstances: null,

    start: this.start,
    stop: this.stop,
    deleteReplicator: this.deleteReplicator,
    setActiveTable: this.setActiveTable,
    setTimeRange: this.setTimeRange,
    exportPipeline: this.exportPipeline,
    duplicatePipeline: this.duplicatePipeline,
  };

  public componentDidMount() {
    this.init();
  }

  public componentWillUnmount() {
    if (this.statusPoll$) {
      this.statusPoll$.unsubscribe();
    }
  }

  // TODO: refactor to unify with Draft init
  private init = () => {
    MyReplicatorApi.getReplicator(this.getBaseParams()).subscribe((app) => {
      const parentArtifact = { ...app.artifact };

      let config;
      try {
        config = JSON.parse(app.configuration);
      } catch (e) {
        this.handleError(`error parsing app config ${e}`);
      }

      let sourcePlugin$;
      let targetPlugin$;
      let sourceWidget$;
      let targetWidget$;
      let sourceConfig;
      let targetConfig;

      config.stages.forEach((stage) => {
        const artifactName = stage.plugin.artifact.name;
        const artifactVersion = stage.plugin.artifact.version;
        const artifactScope = stage.plugin.artifact.scope;
        const pluginName = stage.plugin.name;
        const pluginType = stage.plugin.type;
        const pluginConfig = stage.plugin.properties;

        if (pluginType === PluginType.source) {
          sourcePlugin$ = fetchPluginInfo(
            parentArtifact,
            artifactName,
            artifactScope,
            pluginName,
            pluginType
          );
          sourceWidget$ = fetchPluginWidget(
            artifactName,
            artifactVersion,
            artifactScope,
            pluginName,
            pluginType
          );
          sourceConfig = pluginConfig;
        } else {
          targetPlugin$ = fetchPluginInfo(
            parentArtifact,
            artifactName,
            artifactScope,
            pluginName,
            pluginType
          );
          targetWidget$ = fetchPluginWidget(
            artifactName,
            artifactVersion,
            artifactScope,
            pluginName,
            pluginType
          );
          targetConfig = pluginConfig;
        }
      });

      // fetch plugins
      Observable.combineLatest(
        sourcePlugin$,
        sourceWidget$,
        targetPlugin$,
        targetWidget$
      ).subscribe(
        ([sourcePluginInfo, sourcePluginWidget, targetPluginInfo, targetPluginWidget]: any) => {
          this.setState({
            sourcePluginInfo,
            sourcePluginWidget,
            sourceConfig,
            targetPluginInfo,
            targetPluginWidget,
            targetConfig,
          });
        },
        (err) => {
          this.handleError(`error fetching plugins ${err}`);
        }
      );

      let selectedTables = Map<string, Map<string, string>>();
      const tables = objectQuery(config, 'tables') || [];
      let columns = Map<string, List<IColumn>>();

      tables.forEach((table) => {
        const tableKey = generateTableKey(table);

        const tableInfo: ITableInfo = {
          database: table.database,
          table: table.table,
        };

        if (table.schema) {
          tableInfo.schema = table.schema;
        }

        selectedTables = selectedTables.set(tableKey, fromJS(tableInfo));

        const tableColumns = objectQuery(table, 'columns') || [];
        const columnList = fromJS(tableColumns);

        columns = columns.set(tableKey, columnList);
      });

      this.setState({
        parentArtifact,
        rawAppConfig: fromJS(config),
        name: objectQuery(this.props, 'match', 'params', 'replicatorId'),
        description: app.description,
        tables: selectedTables,
        columns,
        offsetBasePath: config.offsetBasePath,
        loading: false,
        lastUpdated: Date.now(),
        numInstances: objectQuery(config, 'parallelism', 'numInstances') || 1,
      });
    });

    this.getStatus();
  };

  private getStatus = () => {
    this.statusPoll$ = MyReplicatorApi.pollStatus(this.getBaseParams()).subscribe((runsInfo) => {
      if (runsInfo.length === 0) {
        this.setState({
          status: PROGRAM_STATUSES.DEPLOYED,
        });
        return;
      }

      const latestRun = runsInfo[0];

      this.setState({
        status: latestRun.status,
        runId: latestRun.runid,
        startTime: latestRun.starting,
        endTime: latestRun.end,
      });
    });
  };

  private getBaseParams = () => {
    return {
      namespace: getCurrentNamespace(),
      appName: this.props.match.params.replicatorId,
    };
  };

  private redirect = () => {
    return <Redirect to={this.state.redirect} />;
  };

  public handleError = (err: string | object | null) => {
    this.setState({
      error: err,
    });
  };

  public render() {
    if (this.state.redirect) {
      return this.redirect();
    }

    if (this.state.loading) {
      return <LoadingSVGCentered />;
    }

    const classes = this.props.classes;

    return (
      <DetailContext.Provider value={this.state}>
        <div className={classes.root}>
          <TopPanel />

          <div className={classes.body}>
            <ContentHeading />
            <DetailContent />
          </div>

          {!!this.state.error && (
            <ErrorBanner
              error={this.state.error}
              canEditPageWhileOpen={true}
              onClose={() => this.handleError(null)}
            />
          )}
        </div>
      </DetailContext.Provider>
    );
  }
}

export function detailContextConnect(Comp) {
  return (extraProps) => {
    return (
      <DetailContext.Consumer>
        {(props) => {
          const finalProps = {
            ...props,
            ...extraProps,
          };

          return <Comp {...finalProps} />;
        }}
      </DetailContext.Consumer>
    );
  };
}

const Detail = withStyles(styles)(DetailView);
export default Detail;
