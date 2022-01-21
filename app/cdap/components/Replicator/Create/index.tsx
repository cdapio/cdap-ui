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
import { fetchPluginInfo, constructTablesSelection } from 'components/Replicator/utilities';

import { PluginType } from 'components/Replicator/constants';
import LoadingSVGCentered from 'components/LoadingSVGCentered';
import uuidV4 from 'uuid/v4';
import { MyReplicatorApi } from 'api/replicator';
import { generateTableKey, convertConfigToState } from 'components/Replicator/utilities';
import { Map, Set, fromJS } from 'immutable';
import { Observable } from 'rxjs/Observable';
import {
  DML,
  ITable,
  IPluginConfig,
  IPluginInfo,
  ITablesStore,
  IColumnsStore,
  IDMLStore,
  ITransformation,
  IAddColumnsToTransforms,
} from 'components/Replicator/types';
import { IWidgetJson } from 'components/ConfigurationGroup/types';

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
  setActiveStep: (step: number) => void;
  setNameDescription: (name: string, description?: string) => void;
  setSourcePluginInfo: (sourcePluginInfo: IPluginInfo) => void;
  setSourcePluginWidget: (sourcePluginWidget: IWidgetJson) => void;
  setSourceConfig: (sourceConfig: IPluginConfig) => void;
  setTargetPluginInfo: (targetPluginInfo: IPluginInfo) => void;
  setTargetPluginWidget: (targetPluginWidget: IWidgetJson) => void;
  setTargetConfig: (targetConfig: IPluginConfig) => void;
  setTables: (tables: ITablesStore, columns: IColumnsStore, dmlBlacklist: IDMLStore) => void;
  setAdvanced: (numInstances) => void;
  getReplicatorConfig: () => any;
  saveDraft: () => Observable<any>;
  setColumns: (columns, callback) => void;
  isStateFilled: (stateKeys: string[]) => boolean;
  transformations: { [tableName: string]: ITransformation };
  addColumnsToTransforms: (opts: IAddColumnsToTransforms) => void;
  deleteColumnsFromTransforms: (tableName: string, colTransIndex: number) => void;
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

  public setTables = (tables, columns, dmlBlacklist) => {
    this.setState({ tables, columns, dmlBlacklist });
  };

  public deleteColumnsFromTransforms = (tableName: string, colTransIndex: number) => {
    if (colTransIndex === 0) {
      this.setState({
        transformations: {
          ...this.state.transformations,
          [tableName]: undefined,
        },
      });
    } else {
      const transformationTable = this.state.transformations[tableName];
      const newTransformations = transformationTable.columnTransformations.splice(0, colTransIndex);
      transformationTable.columnTransformations = newTransformations;
      this.setState({
        transformations: {
          ...this.state.transformations,
          [tableName]: transformationTable,
        },
      });
    }
  };

  public addColumnsToTransforms = (opts: IAddColumnsToTransforms) => {
    const { tableName, columnTransformation } = opts;
    const transformationTable = this.state.transformations[tableName];
    if (!transformationTable) {
      this.setState({
        transformations: {
          ...this.state.transformations,
          [tableName]: {
            tableName,
            columnTransformations: [columnTransformation],
          },
        },
      });
    } else {
      transformationTable.columnTransformations.push(columnTransformation);
      this.setState({
        transformations: {
          ...this.state.transformations,
          [tableName]: transformationTable,
        },
      });
    }
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

    parentArtifact: null,
    draftId: null,
    isInvalidSource: false,
    loading: true,
    transformations: {},

    activeStep: 0,

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
    addColumnsToTransforms: this.addColumnsToTransforms,
    deleteColumnsFromTransforms: this.deleteColumnsFromTransforms,
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

          return <Comp {...finalProps} />;
        }}
      </CreateContext.Consumer>
    );
  };
}

const Create = withStyles(styles)(CreateView);
export default Create;
