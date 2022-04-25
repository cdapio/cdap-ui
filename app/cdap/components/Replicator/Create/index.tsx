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
import LeftPanel from 'components/Replicator/Create/LeftPanel';
import TopPanel from 'components/Replicator/Create/TopPanel';
import Content from 'components/Replicator/Create/Content';
import { Redirect } from 'react-router-dom';
import { objectQuery } from 'services/helpers';
import { getCurrentNamespace } from 'services/NamespaceStore';
import {
  constructTablesSelection,
  convertConfigToState,
  generateTableKey,
  getTableInfoFromImmutable,
  parseErrorMessageForTransformations,
} from 'components/Replicator/utilities';

import LoadingSVGCentered from 'components/shared/LoadingSVGCentered';
import uuidV4 from 'uuid/v4';
import { MyReplicatorApi } from 'api/replicator';
import { Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
import {
  IPluginConfig,
  IPluginInfo,
  ITablesStore,
  IColumnsStore,
  IDMLStore,
  ITransformation,
  ITableInfo,
  ITableAssessmentColumn,
  ISelectedList,
  IColumnTransformation,
  IColumnsList,
} from 'components/Replicator/types';
import { IWidgetJson } from 'components/shared/ConfigurationGroup/types';
import ErrorBanner from 'components/shared/ErrorBanner';
import { FeatureProvider } from 'services/react/providers/featureFlagProvider';
import { ITransAssessmentRes } from './Content/SelectColumnsWithTransforms/types';
import { SUPPORT } from './Content/Assessment/TablesAssessment/Mappings/Supported';
import { MyArtifactApi } from 'api/artifact';

export const CreateContext = React.createContext({});
export const LEFT_PANEL_WIDTH = 275;

const styles = (): StyleRules => {
  return {
    root: {
      height: '100%',
    },
    content: {
      height: 'calc(100% - 50px)',
      display: 'grid',
      gridTemplateColumns: `${LEFT_PANEL_WIDTH}px 1fr`,

      '& > div': {
        overflowY: 'auto',
      },
    },
  };
};

interface ICreateProps extends WithStyles<typeof styles> {
  match: {
    params: {
      artifactName: string;
      artifactVersion: string;
      artifactScope: string;
      pluginNam: string;
    };
  };
  history;
}

export interface ICreateState {
  name: string;
  description: string;
  sourcePluginInfo: IPluginInfo;
  sourcePluginWidget: IWidgetJson;
  targetPluginInfo: IPluginInfo;
  targetPluginWidget: IWidgetJson;
  sourceConfig: IPluginConfig;
  targetConfig: IPluginConfig;
  tables: ITablesStore;
  columns: IColumnsStore;
  dmlBlacklist: IDMLStore;
  offsetBasePath: string;
  numInstances: number;
  parentArtifact: {
    name: string;
    version: string;
    scope: string;
  };
  draftId: string;
  isInvalidSource: boolean;
  loading: boolean;
  activeStep: number;
  assessmentLoading: boolean;
  tinkEnabled: boolean;
  setActiveStep: (step: number) => void;
  setNameDescription: (name: string, description?: string) => void;
  setSourcePluginInfo: (sourcePluginInfo: IPluginInfo) => void;
  setSourcePluginWidget: (sourcePluginWidget: IWidgetJson) => void;
  setSourceConfig: (sourceConfig: IPluginConfig) => void;
  setTargetPluginInfo: (targetPluginInfo: IPluginInfo) => void;
  setTargetPluginWidget: (targetPluginWidget: IWidgetJson) => void;
  setTargetConfig: (targetConfig: IPluginConfig) => void;
  setTables: (
    tables: ITablesStore,
    columns: IColumnsStore,
    dmlBlacklist: IDMLStore,
    checkTransformations?: boolean
  ) => void;
  setAdvanced: (numInstances) => void;
  checkIfTinkEnabled: () => void;
  getReplicatorConfig: () => any;
  saveDraft: () => Observable<any>;
  setColumns: (columns, callback) => void;
  isStateFilled: (stateKeys: string[]) => boolean;
  transformations: { [tableName: string]: ITransformation };

  saveTransformationsAndColumns: (
    table: ITableInfo,
    transformations?: ITransformation,
    columns?: ISelectedList
  ) => void;
  handleAssessTable: (
    table: ITableInfo,
    trasnformations: IColumnTransformation[],
    columns?: ISelectedList
  ) => void;
  tableAssessments: {
    [tableName: string]: {
      [colName: string]: ITableAssessmentColumn;
    };
  };
  error: object | string | null;
}

export type ICreateContext = Partial<ICreateState>;
export const CLONE_ID = 'cloneId';

class CreateView extends React.PureComponent<ICreateProps, ICreateContext> {
  public setActiveStep = (step: number) => {
    if (!this.state.sourcePluginInfo) {
      this.setState({ activeStep: step });
      return;
    }

    setTimeout(() => {
      this.saveDraft().subscribe(
        () => {
          this.setState({ activeStep: step });
        },
        (err) => {
          // tslint:disable-next-line: no-console
          console.log('Failed to save draft', err);
        }
      );
    }, 100);
  };

  public setNameDescription = (name, description) => {
    this.setState({ name, description });
  };

  public setSourcePluginWidget = (sourcePluginWidget) => {
    this.setState({ sourcePluginWidget });
  };

  public setSourceConfig = (sourceConfig) => {
    this.setState({ sourceConfig }, () => {
      this.props.history.replace(
        `/ns/${getCurrentNamespace()}/replication/drafts/${this.state.draftId}`
      );
    });
  };

  public setSourcePluginInfo = (sourcePluginInfo) => {
    this.setState({ sourcePluginInfo });
  };

  public setTargetPluginInfo = (targetPluginInfo) => {
    this.setState({ targetPluginInfo });
  };

  public setTargetPluginWidget = (targetPluginWidget) => {
    this.setState({ targetPluginWidget });
  };

  public setTargetConfig = (targetConfig) => {
    this.setState({ targetConfig });
  };

  public setTables = (tables, columns, dmlBlacklist, checkTransformations = false) => {
    if (checkTransformations) {
      // if you remove a table from the selected tables, also remove its transformations
      const transformations = {};
      tables.forEach((table) => {
        const tableInfo = getTableInfoFromImmutable(table);
        if (this.state.transformations[tableInfo.table]) {
          transformations[tableInfo.table] = this.state.transformations[tableInfo.table];
        }
      });

      this.setState({ tables, columns, dmlBlacklist, transformations });
    } else {
      this.setState({ tables, columns, dmlBlacklist });
    }
  };

  public saveTransformationsAndColumns = (
    table: ITableInfo,
    transformations?: ITransformation,
    columns?: ISelectedList
  ) => {
    const tableKey = generateTableKey(table);
    const setValues: {
      tables: ITablesStore;
      transformations?: { [tableName: string]: ITransformation };
      columns?: IColumnsStore;
    } = {
      tables: this.state.tables,
    };

    if (!this.state.tables.get(tableKey)) {
      setValues.tables.set(tableKey, Map(table));
    }

    if (transformations) {
      const stateTransformations = { ...this.state.transformations };
      stateTransformations[table.table] = transformations;
      setValues.transformations = stateTransformations;
    }
    const prevColumns = this.state.columns;
    let newColumns = prevColumns.set(tableKey, columns);
    if (!columns || columns.size === 0) {
      newColumns = newColumns.delete(tableKey);
    }

    setValues.columns = newColumns;

    this.setState(setValues);
  };

  public handleError = (err: object | string | null) => {
    this.setState({
      error: err,
    });
  };

  public handleAssessTable = (
    table: ITableInfo,
    transformations: IColumnTransformation[],
    columns?: ISelectedList
  ) => {
    this.setState(
      {
        assessmentLoading: true,
      },
      () => {
        const params = {
          namespace: getCurrentNamespace(),
        };
        // create replicator config for request
        // this is a temporary representation of the replication state
        // we don't want to add to replication state until this assessment
        // comes back without errors
        const replicatorConfig = this.getReplicatorConfig();
        const existingTable = replicatorConfig.tables.find((tbl) => {
          return tbl.table === table.table;
        });
        // add columns
        const columnArr = [];
        if (columns && columns.size > 0) {
          columns.forEach((column) => {
            const columnObj: any = {
              name: column.get('name'),
              type: column.get('type'),
            };

            if (column.get('suppressWarning')) {
              columnObj.suppressWarning = true;
            }

            columnArr.push(columnObj);
          });
        }

        if (existingTable) {
          existingTable.columns = columnArr;
        } else {
          replicatorConfig.tables.push({ ...table, columns: columnArr });
        }

        if (transformations) {
          // add transformations
          let removeIndex;
          const existingTrans = replicatorConfig.tableTransformations.find(
            (tr: ITransformation, i) => {
              if (tr.tableName === table.table) {
                removeIndex = i;
                return true;
              }
            }
          );

          if (existingTrans) {
            replicatorConfig.tableTransformations.splice(removeIndex, 1);
          }

          replicatorConfig.tableTransformations.push({
            tableName:
              replicatorConfig.connections[0].from === 'Microsoft SQLServer'
                ? table.schema + '.' + table.table
                : table.table,
            columnTransformations: transformations,
          });
        }

        MyReplicatorApi.validatePipeline(params, replicatorConfig).subscribe(
          (res: ITransAssessmentRes) => {
            let allErrors = '';
            const tableAssessments = { [table.table]: {} };
            if (res.features.length) {
              for (const feature of res.features) {
                if (feature.severity === 'ERROR') {
                  const descSplit = feature.description.split(' ');
                  const err = `${feature.name} - ${feature.description} - ${feature.suggestion}`;
                  if (descSplit[0] === 'Table') {
                    // tableName follows Table with quotes like 'ORDERS'
                    const tableName = descSplit[1].split("'")[1];
                    tableAssessments[tableName] = {
                      FEATURE_ERROR_FROM_ASSESSMENT: {
                        err,
                        // hide from column filtering
                        support: SUPPORT.yes,
                      },
                    };
                  }

                  if (allErrors === '') {
                    allErrors += err;
                  } else {
                    allErrors += '\n';
                    allErrors += err;
                  }
                }
              }

              this.handleError({ error: { response: allErrors } });
            }

            if (res.transformationIssues.length) {
              res.transformationIssues.forEach((issue) => {
                const assessments = {};
                const [resTable, column, errorMessage] = parseErrorMessageForTransformations(issue);

                assessments[column] = {
                  support: SUPPORT.no,
                  suggestion: errorMessage,
                  sourceName: column,
                };

                tableAssessments[resTable] = {
                  ...tableAssessments[resTable],
                  ...assessments,
                };
              });
            }

            this.setState({
              tableAssessments,
              assessmentLoading: false,
            });
          },
          (err) => {
            this.setState(
              {
                assessmentLoading: false,
              },
              () => {
                this.handleError({
                  error: err,
                });
              }
            );
          }
        );
      }
    );
  };

  public setAdvanced = (numInstances) => {
    this.setState({ numInstances });
  };

  // for use in Assessment Table Mapping
  public setColumns = (columns, callback) => {
    this.setState({ columns }, () => {
      callback();
    });
  };

  private saveDraft = () => {
    if (!this.state.name) {
      return;
    }

    const params = {
      namespace: getCurrentNamespace(),
      draftId: this.state.draftId,
    };

    const body = {
      label: this.state.name,
      config: this.getReplicatorConfig(),
    };
    return MyReplicatorApi.putDraft(params, body);
  };

  // TODO: Refactor
  private getReplicatorConfig = () => {
    const source = this.constructStageSpec('source');
    const target = this.constructStageSpec('target');

    const stages = [];
    if (source) {
      stages.push(source);
    }

    if (target) {
      stages.push(target);
    }

    const connections = [];

    if (source && target) {
      connections.push({
        from: source.name,
        to: target.name,
      });
    }

    const config = {
      description: this.state.description,
      connections,
      stages,
      tables: constructTablesSelection(
        this.state.tables,
        this.state.columns,
        this.state.dmlBlacklist
      ),
      offsetBasePath: this.state.offsetBasePath,
      parallelism: {
        numInstances: this.state.numInstances,
      },
      tableTransformations: Object.values(this.state.transformations),
    };

    return config;
  };

  private isStateFilled = (stateKeys: string[]) => {
    for (const stateKey of stateKeys) {
      const stateObj = this.state[stateKey];
      if (
        !stateObj ||
        (typeof stateObj === 'object' && Object.keys(stateObj).length === 0) ||
        (Map.isMap(stateObj) && stateObj.size === 0)
      ) {
        return false;
      }
    }

    return true;
  };

  /**
   * If the tink plugin is in the list of artifacts,
   * enable the tink option for transformations
   */
  private checkIfTinkEnabled = () => {
    const namespace = getCurrentNamespace();
    MyArtifactApi.fetchArtifactVersion({
      namespace,
      artifactName: 'delta-app',
      scope: 'system',
    }).subscribe((res) => {
      let version;
      if (res.length) {
        version = res.sort((a, b) => {
          // check the newest version of delta app
          if (a.version > b.version) {
            return -1;
          } else {
            return 1;
          }
        })[0].version;
      } else {
        return;
      }

      const systemParams = {
        namespace,
        artifactId: 'delta-app',
        version,
        scope: 'system',
        extensionType: 'transform',
      };

      MyArtifactApi.fetchPluginTypes(systemParams).subscribe((types: Array<{ name: string }>) => {
        for (const plugin of types) {
          if (plugin.name === 'tink') {
            this.setState({
              tinkEnabled: true,
            });
            break;
          }
        }
      });
    });
  };

  public state = {
    name: '',
    description: '',
    sourcePluginInfo: null,
    sourcePluginWidget: null,
    targetPluginInfo: null,
    targetPluginWidget: null,
    sourceConfig: null,
    targetConfig: null,
    tables: Map() as ITablesStore,
    columns: Map() as IColumnsStore,
    dmlBlacklist: Map() as IDMLStore,
    offsetBasePath: window.CDAP_CONFIG.delta.defaultCheckpointDir || '',
    numInstances: null,
    assessmentLoading: false,

    parentArtifact: null,
    draftId: null,
    isInvalidSource: false,
    loading: true,
    transformations: {},

    activeStep: 0,
    tinkEnabled: false,

    setActiveStep: this.setActiveStep,
    setNameDescription: this.setNameDescription,
    setSourcePluginWidget: this.setSourcePluginWidget,
    setSourceConfig: this.setSourceConfig,
    setSourcePluginInfo: this.setSourcePluginInfo,
    setTargetPluginInfo: this.setTargetPluginInfo,
    setTargetPluginWidget: this.setTargetPluginWidget,
    setTargetConfig: this.setTargetConfig,
    setTables: this.setTables,
    setAdvanced: this.setAdvanced,
    getReplicatorConfig: this.getReplicatorConfig,
    saveDraft: this.saveDraft,
    setColumns: this.setColumns,
    isStateFilled: this.isStateFilled,
    saveTransformationsAndColumns: this.saveTransformationsAndColumns,
    tableAssessments: {},
    handleAssessTable: this.handleAssessTable,
    error: null,
  };

  public componentDidMount() {
    MyReplicatorApi.getDeltaApp().subscribe((appInfo) => {
      this.setState({
        parentArtifact: appInfo.artifact,
      });

      const queryParams = new URLSearchParams(location.search);
      const cloneId = queryParams.get(CLONE_ID);
      if (cloneId) {
        this.initClone(cloneId);
        return;
      }

      const draftId = objectQuery(this.props, 'match', 'params', 'draftId');
      if (!draftId) {
        this.initCreate();
        return;
      }

      this.initDraft(draftId);
    });

    this.checkIfTinkEnabled();
  }

  private initCreate = () => {
    this.setState({ draftId: uuidV4(), loading: false });
  };

  private initClone = async (cloneId) => {
    const pipelineConfigStr = window.localStorage.getItem(cloneId);
    window.localStorage.removeItem(cloneId);

    try {
      const pipelineConfig = JSON.parse(pipelineConfigStr);
      const stateObj = await convertConfigToState(pipelineConfig, this.state.parentArtifact);
      const newState = {
        ...stateObj,
        draftId: uuidV4(),
        activeStep: 0,
      };

      this.setState(newState);
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.log('Failed to parse replication config');
      this.initCreate();
    }
  };

  private initDraft = (draftId) => {
    const params = {
      namespace: getCurrentNamespace(),
      draftId,
    };

    MyReplicatorApi.getDraft(params).subscribe(async (res) => {
      const stateObj = await convertConfigToState(res, this.state.parentArtifact);

      const newState = {
        draftId,
        ...stateObj,
      };

      this.setState(newState);
    });
  };

  private constructStageSpec = (type) => {
    const pluginKey = `${type}PluginInfo`;
    const pluginWidget = `${type}PluginWidget`;
    const configKey = `${type}Config`;

    if (!this.state[pluginKey]) {
      return null;
    }

    const plugin = this.state[pluginKey];
    const displayName =
      objectQuery(this.state, pluginWidget, 'display-name') || objectQuery(plugin, 'name');

    const stage = {
      name: displayName,
      plugin: {
        name: plugin.name,
        type: plugin.type,
        artifact: {
          ...plugin.artifact,
        },
        properties: {},
      },
    };

    const pluginProperties = this.state[configKey];
    if (pluginProperties) {
      stage.plugin.properties = { ...pluginProperties };
    }

    return stage;
  };

  private redirectToListView = () => {
    return <Redirect to={`/ns/${getCurrentNamespace()}/replication`} />;
  };

  public render() {
    if (this.state.isInvalidSource) {
      return this.redirectToListView();
    }

    if (this.state.loading) {
      return <LoadingSVGCentered />;
    }
    return (
      <CreateContext.Provider value={this.state}>
        <div className={this.props.classes.root}>
          <TopPanel />
          <div className={this.props.classes.content}>
            <LeftPanel />
            <Content />
          </div>
          {!!this.state.error && (
            <ErrorBanner
              error={this.state.error.error.response}
              canEditPageWhileOpen={true}
              onClose={() => this.handleError(null)}
            />
          )}
        </div>
      </CreateContext.Provider>
    );
  }
}

export function createContextConnect(Comp) {
  return (extraProps) => {
    return (
      <CreateContext.Consumer>
        {(props) => {
          const finalProps = {
            ...props,
            ...extraProps,
          };

          return (
            <FeatureProvider>
              <Comp {...finalProps} />
            </FeatureProvider>
          );
        }}
      </CreateContext.Consumer>
    );
  };
}

const Create = withStyles(styles)(CreateView);
export default Create;
