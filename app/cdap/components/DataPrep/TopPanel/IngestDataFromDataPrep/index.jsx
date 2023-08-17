/*
 * Copyright © 2017 Cask Data, Inc.
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
import T from 'i18n-react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ButtonGroup,
  Form,
  FormGroup,
  Label,
  Col,
  Input,
} from 'reactstrap';
import { UncontrolledTooltip } from 'components/UncontrolledComponents';
import classnames from 'classnames';
import IconSVG from 'components/shared/IconSVG';
import { preventPropagation } from 'services/helpers';
import DataPrepStore from 'components/DataPrep/store/';
import getPipelineConfig from 'components/DataPrep/TopPanel/PipelineConfigHelper';
import { MyArtifactApi } from 'api/artifact';
import { MyDatasetApi } from 'api/dataset';
import { MyAppApi } from 'api/app';
import { MyProgramApi } from 'api/program';
import NamespaceStore from 'services/NamespaceStore';
import find from 'lodash/find';
import { objectQuery } from 'services/helpers';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import { Observable } from 'rxjs/Observable';
import CardActionFeedback from 'components/shared/CardActionFeedback';

require('./IngestDataFromDataPrep.scss');

const PREFIX = 'features.DataPrep.TopPanel.copyToCDAPDatasetBtn';
const fieldsetDataType = [
  {
    id: 'TPFSAvro',
    label: T.translate(`${PREFIX}.Formats.avro`),
  },
  {
    id: 'TPFSOrc',
    label: T.translate(`${PREFIX}.Formats.orc`),
  },
  {
    id: 'TPFSParquet',
    label: T.translate(`${PREFIX}.Formats.parquet`),
  },
];
const copyingSteps = [
  {
    message: T.translate(`${PREFIX}.copyingSteps.Step1`),
    error: T.translate(`${PREFIX}.copyingSteps.Step1Error`),
    status: null,
  },
  {
    message: T.translate(`${PREFIX}.copyingSteps.Step2`),
    error: T.translate(`${PREFIX}.copyingSteps.Step2Error`),
    status: null,
  },
];
export default class IngestDataFromDataPrep extends Component {
  static propTypes = {
    className: PropTypes.string,
    disabledState: PropTypes.bool,
    title: PropTypes.string,
  };

  state = this.getDefaultState();

  getDefaultState() {
    const { headers } = DataPrepStore.getState().dataprep;
    return {
      showModal: false,
      inputType: 'fileset',
      rowKey: headers.length ? headers[0] : null,
      format: fieldsetDataType[0].id,
      sinkPluginsForDataset: {},
      batchPipelineConfig: {},
      datasetName: '',
      copyingSteps: [...copyingSteps],
      copyInProgress: false,
      // This is to enable closing the modal on workflow start.
      // Ideally users won't wait till the dataset is created (till pipeline runs successfully and creates the dataset)
      copyTaskStarted: false,
      datasetUrl: null,
      error: null,
    };
  }

  componentWillMount() {
    const { selectedNamespace: namespace } = NamespaceStore.getState();
    let corePlugins;
    MyArtifactApi.list({ namespace }).subscribe((res) => {
      corePlugins = find(res, { name: 'core-plugins' });
      if (corePlugins) {
        corePlugins.version = '[1.7.0, 3.0.0)';
      }

      const getPluginConfig = (pluginName) => {
        return {
          name: pluginName,
          plugin: {
            name: pluginName,
            label: pluginName,
            type: 'batchsink',
            artifact: corePlugins,
            properties: {},
          },
        };
      };
      const sinks = {
        TPFSAvro: getPluginConfig('TPFSAvro'),
        TPFSParquet: getPluginConfig('TPFSParquet'),
        TPFSOrc: getPluginConfig('TPFSOrc'),
        Table: getPluginConfig('Table'),
      };
      this.setState({
        sinkPluginsForDataset: sinks,
      });
    });
  }

  toggleModal = () => {
    const state = Object.assign(this.getDefaultState(), {
      showModal: !this.state.showModal,
      sinkPluginsForDataset: this.state.sinkPluginsForDataset,
      batchPipelineConfig: this.state.batchPipelineConfig,
    });
    this.setState(state);
    if (!this.state.showModal) {
      getPipelineConfig().subscribe(
        (res) => {
          this.setState({
            batchPipelineConfig: res.batchConfig,
          });
        },
        (err) => {
          this.setState({
            error: err,
          });
        }
      );
    }
  };

  handleDatasetNameChange = (e) => {
    this.setState({
      datasetName: e.target.value,
    });
  };

  handleRowkeyChange = (e) => {
    this.setState({
      rowKey: e.target.value,
    });
  };

  handleFormatChange = (e) => {
    this.setState({
      format: e.target.value,
    });
  };

  handleOnSubmit = (e) => {
    preventPropagation(e);
    return false;
  };

  getAppConfigMacros() {
    const {
      workspaceInfo,
      directives,
      headers,
    } = DataPrepStore.getState().dataprep;
    const pipelineConfig = cloneDeep(this.state.batchPipelineConfig);
    const wranglerStage = pipelineConfig.config.stages.find(
      (stage) => stage.name === 'Wrangler'
    );
    const dbStage = pipelineConfig.config.stages.find(
      (stage) => stage.name === 'Database'
    );
    const kafkaStage = pipelineConfig.config.stages.find(
      (stage) => stage.name === 'Kafka'
    );
    let databaseConfig = objectQuery(
      workspaceInfo,
      'properties',
      'databaseConfig'
    );
    const s3Stage = pipelineConfig.config.stages.find(
      (stage) => stage.name === 'S3'
    );
    const gcsStage = pipelineConfig.config.stages.find(
      (stage) => stage.name === 'GCS'
    );
    const bigqueryStage = pipelineConfig.config.stages.find(
      (stage) => stage.name === 'BigQueryTable'
    );
    const spannerStage = pipelineConfig.config.stages.find(
      (stage) => stage.name === 'Spanner'
    );
    const adlsStage = pipelineConfig.config.stages.find(
      (stage) => stage.name === 'ADLS'
    );

    let macroMap = {};
    if (databaseConfig) {
      try {
        databaseConfig = JSON.parse(databaseConfig);
      } catch (e) {
        databaseConfig = {};
      }
      macroMap = Object.assign(macroMap, databaseConfig);
    }
    macroMap = Object.assign({}, macroMap, {
      datasetName: this.state.datasetName,
      filename: objectQuery(workspaceInfo, 'properties', 'path') || '',
      directives: directives.join('\n'),
      schema:
        objectQuery(wranglerStage, 'plugin', 'properties', 'schema') || '',
      schemaRowField: isNil(this.state.rowKey) ? headers[0] : this.state.rowKey,
      query: objectQuery(dbStage, 'plugin', 'properties', 'importQuery') || '',
      connectionString:
        objectQuery(dbStage, 'plugin', 'properties', 'connectionString') || '',
      password: objectQuery(dbStage, 'plugin', 'properties', 'password') || '',
      userName: objectQuery(dbStage, 'plugin', 'properties', 'user') || '',
      topic: objectQuery(kafkaStage, 'plugin', 'properties', 'topic') || '',
      kafkaBrokers:
        objectQuery(kafkaStage, 'plugin', 'properties', 'kafkaBrokers') || '',
      accessID: objectQuery(s3Stage, 'plugin', 'properties', 'accessID') || '',
      path:
        objectQuery(s3Stage, 'plugin', 'properties', 'path') ||
        objectQuery(gcsStage, 'plugin', 'properties', 'path') ||
        '', // This is Goofed
      accessKey:
        objectQuery(s3Stage, 'plugin', 'properties', 'accessKey') || '',
      bucket: objectQuery(gcsStage, 'plugin', 'properties', 'bucket') || '',
      serviceFilePath:
        objectQuery(gcsStage, 'plugin', 'properties', 'serviceFilePath') || '',
      project: objectQuery(gcsStage, 'plugin', 'properties', 'project') || '',
      bqBucket:
        objectQuery(bigqueryStage, 'plugin', 'properties', 'bucket') || '',
      bqServiceFilePath:
        objectQuery(bigqueryStage, 'plugin', 'properties', 'serviceFilePath') ||
        '',
      bqProject:
        objectQuery(bigqueryStage, 'plugin', 'properties', 'project') || '',
      bqDataset:
        objectQuery(bigqueryStage, 'plugin', 'properties', 'dataset') || '',
      bqTable:
        objectQuery(bigqueryStage, 'plugin', 'properties', 'table') || '',
      bqSchema:
        objectQuery(bigqueryStage, 'plugin', 'properties', 'schema') || '',
      spannerServiceFilePath:
        objectQuery(spannerStage, 'plugin', 'properties', 'serviceFilePath') ||
        '',
      spannerProject:
        objectQuery(spannerStage, 'plugin', 'properties', 'project') || '',
      spannerInstance:
        objectQuery(spannerStage, 'plugin', 'properties', 'instance') || '',
      spannerDatabase:
        objectQuery(spannerStage, 'plugin', 'properties', 'database') || '',
      spannerTable:
        objectQuery(spannerStage, 'plugin', 'properties', 'table') || '',
      spannerSchema:
        objectQuery(spannerStage, 'plugin', 'properties', 'schema') || '',
      adlsProject:
        objectQuery(adlsStage, 'plugin', 'properties', 'project') || '',
    });
    const newMacorMap = {};
    // This is to prevent from passing all the empty properties as payload while starting the pipeline.
    Object.keys(macroMap)
      .filter((key) => !isEmpty(macroMap[key]))
      .forEach((key) => (newMacorMap[key] = macroMap[key]));
    return newMacorMap;
  }

  addMacrosToPipelineConfig(pipelineConfig) {
    const { dataprep } = DataPrepStore.getState();
    const workspaceProps = objectQuery(dataprep, 'workspaceInfo', 'properties');

    const macroMap = this.getAppConfigMacros();
    const dataFormatProperties = {
      schema: '${schema}',
      name: '${datasetName}',
    };
    const pluginsMap = {
      Wrangler: {
        directives: '${directives}',
        schema: '${schema}',
        field: workspaceProps.connection === 'file' ? 'body' : '*',
        precondition: 'false',
        threshold: '1',
      },
      File: {
        path: '${filename}',
        referenceName: 'FileNode',
      },
      Table: {
        'schema.row.field': '${schemaRowField}',
        name: '${datasetName}',
        schema: '${schema}',
      },
      Database: {
        connectionString: '${connectionString}',
        user: '${userName}',
        password: '${password}',
        importQuery: '${query}',
      },
      Kafka: {
        referenceName: 'KafkaNode',
        kafkaBrokers: '${kafkaBrokers}',
        topic: '${topic}',
      },
      TPFSOrc: dataFormatProperties,
      TPFSParquet: dataFormatProperties,
      TPFSAvro: dataFormatProperties,
      S3: {
        accessID: '${accessID}',
        path: '${path}',
        accessKey: '${accessKey}',
        authenticationMethod: 'Access Credentials',
        recursive: 'false',
      },
      GCS: {
        bucket: '${bucket}',
        filenameOnly: 'false',
        path: '${path}',
        serviceFilePath: '${serviceFilePath}',
        project: '${project}',
        recursive: 'false',
        ignoreNonExistingFolders: 'false',
      },
      BigQueryTable: {
        project: '${bqProject}',
        serviceFilePath: '${bqServiceFilePath}',
        bucket: '${bqBucket}',
        dataset: '${bqDataset}',
        table: '${bqTable}',
        schema: '${bqSchema}',
      },
      Spanner: {
        project: '${spannerProject}',
        serviceFilePath: '${spannerServiceFilePath}',
        instance: '${spannerInstance}',
        database: '${spannerDatabase}',
        table: '${spannerTable}',
        schema: '${spannerSchema}',
      },
      ADLS: {
        project: '${adlsProject}',
      },
    };
    pipelineConfig.config.stages = pipelineConfig.config.stages.map((stage) => {
      if (!isNil(pluginsMap[stage.name])) {
        stage.plugin.properties = Object.assign(
          {},
          stage.plugin.properties,
          pluginsMap[stage.name]
        );
      }
      return stage;
    });

    return { pipelineConfig, macroMap };
  }

  preparePipelineConfig() {
    let sink;
    const { workspaceInfo } = DataPrepStore.getState().dataprep;
    const { name: pipelineName } = workspaceInfo.properties;
    const pipelineconfig = cloneDeep(this.state.batchPipelineConfig);
    if (this.state.inputType === 'fileset') {
      sink = fieldsetDataType.find(
        (dataType) => dataType.id === this.state.format
      );
      if (sink) {
        sink = this.state.sinkPluginsForDataset[sink.id];
      }
    }
    if (this.state.inputType === 'table') {
      sink = this.state.sinkPluginsForDataset['Table'];
    }
    pipelineconfig.config.stages.push(sink);
    const {
      pipelineConfig: appConfig,
      macroMap,
    } = this.addMacrosToPipelineConfig(pipelineconfig);

    const connections = this.state.batchPipelineConfig.config.connections;
    const sinkConnection = [
      {
        from: connections[0].to,
        to: sink.name,
      },
    ];
    appConfig.config.connections = connections.concat(sinkConnection);
    appConfig.config.schedule = '0 * * * *';
    appConfig.config.engine = 'mapreduce';
    appConfig.description = `Pipeline to create dataset for workspace ${pipelineName} from dataprep`;
    return { appConfig, macroMap };
  }

  submitForm = () => {
    const steps = cloneDeep(copyingSteps);
    const { dataprep } = DataPrepStore.getState();
    const workspaceProps = objectQuery(dataprep, 'workspaceInfo', 'properties');
    steps[0].status = 'running';
    this.setState({
      copyInProgress: true,
      copyingSteps: steps,
    });
    const { selectedNamespace: namespace } = NamespaceStore.getState();
    let pipelineName;
    // FIXME: We need to fix backend to enable adding macro to pluginType and name in database.
    // Right now we don't support it and hence UI creates new pipeline based on jdbc plugin name.
    const dbStage = this.state.batchPipelineConfig.config.stages.find(
      (dataType) => dataType.name === 'Database'
    );
    if (this.state.inputType === 'fileset') {
      pipelineName = `one_time_copy_to_fs_${this.state.format}`;
      if (workspaceProps.connection === 'database') {
        pipelineName = `one_time_copy_to_fs_from_${dbStage.plugin.properties.jdbcPluginName}`;
      } else if (workspaceProps.connection === 'kafka') {
        pipelineName = 'one_time_copy_to_fs_from_kafka';
      } else if (workspaceProps.connection === 's3') {
        pipelineName = 'one_time_copy_to_fs_from_s3';
      } else if (workspaceProps.connection === 'gcs') {
        pipelineName = 'one_time_copy_to_fs_from_gcs';
      } else if (workspaceProps.connection === 'bigquery') {
        pipelineName = 'one_time_copy_to_fs_from_bigquery';
      } else if (workspaceProps.connection === 'spanner') {
        pipelineName = 'one_time_copy_to_fs_from_spanner';
      } else if (workspaceProps.connection === 'adls') {
        pipelineName = 'one_time_copy_to_fs_from_adls';
      }
    } else {
      pipelineName = 'one_time_copy_to_table';
      if (workspaceProps.connection === 'database') {
        pipelineName = `one_time_copy_to_table_from_${dbStage.plugin.properties.jdbcPluginName}`;
      } else if (workspaceProps.connection === 'kafka') {
        pipelineName = 'one_time_copy_to_table_from_kafka';
      } else if (workspaceProps.connection === 's3') {
        pipelineName = 'one_time_copy_to_table_from_s3';
      } else if (workspaceProps.connection === 'gcs') {
        pipelineName = 'one_time_copy_to_table_from_gcs';
      } else if (workspaceProps.connection === 'bigquery') {
        pipelineName = 'one_time_copy_to_table_from_bigquery';
      } else if (workspaceProps.connection === 'spanner') {
        pipelineName = 'one_time_copy_to_table_from_spanner';
      } else if (workspaceProps.connection === 'adls') {
        pipelineName = 'one_time_copy_to_table_from_adls';
      }
    }

    pipelineName = pipelineName.replace('TPFS', '');
    pipelineName = pipelineName.toLowerCase();
    let pipelineconfig, macroMap;

    // Get list of pipelines to check if the pipeline is already published
    MyAppApi.list({ namespace })
      .mergeMap((res) => {
        const appAlreadyDeployed = res.find((app) => app.id === pipelineName);

        if (!appAlreadyDeployed) {
          const appConfigWithMacros = this.preparePipelineConfig();
          pipelineconfig = appConfigWithMacros.appConfig;
          macroMap = appConfigWithMacros.macroMap;
          pipelineconfig.name = pipelineName;
          const params = {
            namespace,
            appId: pipelineName,
          };
          // If it doesn't exist create a new pipeline with macros.
          return MyAppApi.deployApp(params, pipelineconfig);
        }
        // If it already exists just move to next step.
        return Observable.create((observer) => {
          observer.next();
        });
      })
      .mergeMap(() => {
        const copyingSteps = [...this.state.copyingSteps];
        copyingSteps[0].status = 'success';
        copyingSteps[1].status = 'running';
        this.setState({
          copyingSteps,
        });
        if (!macroMap) {
          macroMap = this.getAppConfigMacros();
        }

        // Once the pipeline is published start the workflow. Pass run time arguments for macros.
        return MyProgramApi.action(
          {
            namespace,
            appId: pipelineName,
            programType: 'workflows',
            programId: 'DataPipelineWorkflow',
            action: 'start',
          },
          macroMap
        );
      })
      .mergeMap(() => {
        this.setState({
          copyTaskStarted: true,
        });
        const count = 1;
        const getDataset = (callback, errorCallback, count) => {
          const params = {
            namespace,
            datasetId: this.state.datasetName,
          };
          MyDatasetApi.get(params).subscribe(callback, () => {
            if (count < 120) {
              count += count;
              setTimeout(() => {
                getDataset(callback, errorCallback, count);
              }, count * 1000);
            } else {
              errorCallback();
            }
          });
        };
        return Observable.create((observer) => {
          const successCallback = () => {
            observer.next();
          };
          const errorCallback = () => {
            observer.error(
              'Copy task timed out after 2 mins. Please check logs for more information.'
            );
          };
          getDataset(successCallback, errorCallback, count);
        });
      })
      .subscribe(
        () => {
          // Once workflow started successfully create a link to pipeline datasets tab for user reference.
          const copyingSteps = [...this.state.copyingSteps];
          const { selectedNamespace: namespaceId } = NamespaceStore.getState();
          copyingSteps[1].status = 'success';
          let datasetUrl = window.getAbsUIUrl({
            namespaceId,
            entityType: 'datasets',
            entityId: this.state.datasetName,
          });
          datasetUrl = `${datasetUrl}?modalToOpen=explore`;
          this.setState({
            copyingSteps,
            datasetUrl,
          });
        },
        (err) => {
          console.log('err', err);

          const copyingSteps = this.state.copyingSteps.map((step) => {
            if (step.status === 'running') {
              return Object.assign({}, step, { status: 'failure' });
            }
            return step;
          });
          const state = {
            copyingSteps,
          };
          if (!this.state.error) {
            state.error = typeof err === 'object' ? err.response : err;
          }
          this.setState(state);
        }
      ); // FIXME: Need to handle the failure case here as well.
  };

  setType(type) {
    this.setState({
      inputType: type,
    });
  }

  renderDatasetSpecificContent() {
    if (this.state.inputType === 'table') {
      const { headers } = DataPrepStore.getState().dataprep;
      return (
        <FormGroup row>
          <Label xs="4" className="text-right">
            {T.translate(`${PREFIX}.Form.rowKeyLabel`)}
            <span className="text-danger">*</span>
          </Label>
          <Col xs="6">
            <Input
              type="select"
              onChange={this.handleRowkeyChange}
              value={this.state.rowKey}
            >
              {headers.map((header, index) => {
                return (
                  <option value={header} key={index}>
                    {header}
                  </option>
                );
              })}
            </Input>
            <IconSVG id="row-key-info-icon" name="icon-info-circle" />
            <UncontrolledTooltip
              target="row-key-info-icon"
              delay={{ show: 250, hide: 0 }}
            >
              {T.translate(`${PREFIX}.Form.rowKeyTooltip`)}
            </UncontrolledTooltip>
          </Col>
        </FormGroup>
      );
    }
    if (this.state.inputType === 'fileset') {
      return (
        <FormGroup row>
          <Label xs="4" className="text-right">
            {T.translate(`${PREFIX}.Form.formatLabel`)}
            <span className="text-danger">*</span>
          </Label>
          <Col xs="6">
            <Input
              type="select"
              onChange={this.handleFormatChange}
              value={this.state.format}
            >
              {fieldsetDataType.map((datatype, index) => {
                return (
                  <option value={datatype.id} key={index}>
                    {datatype.label}
                  </option>
                );
              })}
            </Input>
            <IconSVG id="row-key-info-icon" name="icon-info-circle" />
            <UncontrolledTooltip
              target="row-key-info-icon"
              delay={{ show: 250, hide: 0 }}
            >
              {T.translate(`${PREFIX}.Form.formatTooltip`)}
            </UncontrolledTooltip>
          </Col>
        </FormGroup>
      );
    }
  }

  renderSteps() {
    if (!this.state.copyInProgress) {
      return null;
    }
    const statusContainer = (status) => {
      let icon, className;
      if (status === 'running') {
        icon = 'icon-spinner';
        className = 'fa-spin';
      }
      if (status === 'success') {
        icon = 'icon-check-circle';
      }
      if (status === 'failure') {
        icon = 'icon-times-circle';
      }
      return <IconSVG name={icon} className={className} />;
    };
    return (
      <div className="text-left steps-container">
        {this.state.copyingSteps.map((step, index) => {
          return (
            <div
              key={index}
              className={classnames('step-container', {
                'text-success': step.status === 'success',
                'text-danger': step.status === 'failure',
                'text-info': step.status === 'running',
                'text-muted': step.status === null,
              })}
            >
              <span>{statusContainer(step.status)}</span>
              <span>
                {step.status === 'failure' ? step.error : step.message}
              </span>
            </div>
          );
        })}
        {this.state.copyingSteps[1].status === 'success' ? (
          <a className="btn btn-primary" href={`${this.state.datasetUrl}`}>
            {T.translate(`${PREFIX}.monitorBtnLabel`)}
          </a>
        ) : null}
      </div>
    );
  }

  renderForm() {
    const { dataprep } = DataPrepStore.getState();
    const isTableOptionDisabled = objectQuery(
      dataprep,
      'workspaceInfo',
      'properties',
      'databaseConfig'
    );
    return (
      <fieldset disabled={this.state.error ? true : false}>
        <p>{T.translate(`${PREFIX}.description`)}</p>
        <Form onSubmit={this.handleOnSubmit}>
          <FormGroup row>
            <Label xs={4} className="text-right">
              {T.translate(`${PREFIX}.Form.typeLabel`)}
            </Label>
            <Col xs={8}>
              <ButtonGroup className="input-type-group">
                <Button
                  color="secondary"
                  onClick={this.setType.bind(this, 'fileset')}
                  active={this.state.inputType === 'fileset'}
                >
                  {T.translate(`${PREFIX}.Form.fileSetBtnlabel`)}
                </Button>
                <Button
                  color="secondary"
                  onClick={this.setType.bind(this, 'table')}
                  active={this.state.inputType === 'table'}
                  disabled={isNil(isTableOptionDisabled) ? false : true}
                >
                  {T.translate(`${PREFIX}.Form.tableBtnlabel`)}
                </Button>
              </ButtonGroup>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col xs="4" />
            <Col xs="8" />
          </FormGroup>
          <FormGroup row>
            <Label xs="4" className="text-right">
              {T.translate(`${PREFIX}.Form.datasetNameLabel`)}
              <span className="text-danger">*</span>
            </Label>
            <Col xs="6" className="dataset-name-group">
              <p className="required-label">
                {T.translate(`${PREFIX}.Form.requiredLabel`)}
                <span className="text-danger">*</span>
              </p>
              <Input
                value={this.state.datasetName}
                onChange={this.handleDatasetNameChange}
              />
              <IconSVG id="dataset-name-info-icon" name="icon-info-circle" />
              <UncontrolledTooltip
                target="dataset-name-info-icon"
                delay={{ show: 250, hide: 0 }}
              >
                {T.translate(`${PREFIX}.Form.datasetTooltip`)}
              </UncontrolledTooltip>
            </Col>
          </FormGroup>
          {this.renderDatasetSpecificContent()}
        </Form>
      </fieldset>
    );
  }

  renderFooter() {
    if (this.state.error) {
      return (
        <CardActionFeedback
          type="DANGER"
          message={T.translate(`${PREFIX}.ingestFailMessage`)}
          extendedMessage={this.state.error}
        />
      );
    }
    if (!this.state.copyInProgress) {
      return (
        <ModalFooter>
          <button
            className="btn btn-primary"
            onClick={this.submitForm}
            disabled={isEmpty(this.state.datasetName)}
          >
            {T.translate(`${PREFIX}.createBtnLabel`)}
          </button>
          <button className="btn btn-secondary" onClick={this.toggleModal}>
            {T.translate('features.DataPrep.Directives.cancel')}
          </button>
          {this.renderSteps()}
        </ModalFooter>
      );
    }
  }
  render() {
    return (
      <span className="create-dataset-btn" title={this.props.title}>
        <button
          className={classnames('btn btn-link', this.props.className)}
          onClick={this.toggleModal}
          disabled={this.props.disabledState}
        >
          {T.translate(`${PREFIX}.btnLabel`)}
        </button>
        <Modal
          toggle={this.toggleModal}
          isOpen={this.state.showModal}
          size="md"
          backdrop="static"
          zIndex="1061"
          className="cdap-modal dataprep-create-dataset-modal"
        >
          <ModalHeader>
            <span>{T.translate(`${PREFIX}.modalTitle`)}</span>

            <div
              className={classnames('close-section float-right', {
                disabled:
                  this.state.copyInProgress &&
                  !this.state.copyTaskStarted &&
                  !this.state.error,
              })}
              onClick={
                this.state.copyInProgress &&
                !this.state.copyTaskStarted &&
                !this.state.error
                  ? () => {}
                  : this.toggleModal
              }
            >
              <span className="fa fa-times" />
            </div>
          </ModalHeader>
          <ModalBody
            className={classnames({
              'copying-steps-container': this.state.copyInProgress,
            })}
          >
            {this.state.copyInProgress ? this.renderSteps() : this.renderForm()}
          </ModalBody>
          {this.renderFooter()}
        </Modal>
      </span>
    );
  }
}
