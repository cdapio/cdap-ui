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

import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import T from 'i18n-react';
import styled from 'styled-components';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import PrimaryTextButton from 'components/shared/Buttons/PrimaryTextButton';
import DataPrepStore from 'components/DataPrep/store';
import PropertyRow from 'components/shared/ConfigurationGroup/PropertyRow';
import { resampleWorkspace } from 'components/DataPrep/store/DataPrepActionCreator';
import DataPrepActions from 'components/DataPrep/store/DataPrepActions';
import { Unsubscribe } from 'redux';
import { getCurrentNamespace } from 'services/NamespaceStore';

const PREFIX = 'features.DataPrep.TopPanel.ResampleModal';

const ContentContainer = styled.div`
  width: 100%;
  min-width: 400px;
  position: relative;
`;

const sampleTypeWidget = {
  label: T.translate(`${PREFIX}.SampleTypes.prompt`) as string,
  name: 'sampleType',
  'widget-type': 'select',
  'widget-attributes': {
    options: [
      { value: 'default', label: T.translate(`${PREFIX}.SampleTypes.default`) },
      { value: 'random', label: T.translate(`${PREFIX}.SampleTypes.random`) },
      { value: 'stratified', label: T.translate(`${PREFIX}.SampleTypes.stratified`) },
    ],
  },
};

const strataWidget = (headers) => {
  return {
    label: T.translate(`${PREFIX}.strataPrompt`) as string,
    name: 'strata',
    'widget-type': 'select',
    'widget-attributes': {
      options: headers.map((header) => ({ value: header, label: header })),
    },
  };
};

const rowsWidget = {
  label: T.translate(`${PREFIX}.numRowsPrompt`) as string,
  name: 'rows',
  'widget-type': 'number',
  'widget-attributes': {
    min: 1,
    max: 3000,
  },
};

const timeoutWidget = {
  label: T.translate(`${PREFIX}.TimeLimit.prompt`) as string,
  name: 'timeoutMs',
  'widget-type': 'select',
  'widget-attributes': {
    options: [
      { value: 'no-limit', label: T.translate(`${PREFIX}.TimeLimit.Options.0`) },
      { value: '10000', label: T.translate(`${PREFIX}.TimeLimit.Options.1`) },
      { value: '30000', label: T.translate(`${PREFIX}.TimeLimit.Options.2`) },
      { value: '60000', label: T.translate(`${PREFIX}.TimeLimit.Options.3`) },
      { value: '600000', label: T.translate(`${PREFIX}.TimeLimit.Options.4`) },
      { value: '1800000', label: T.translate(`${PREFIX}.TimeLimit.Options.5`) },
      { value: '3600000', label: T.translate(`${PREFIX}.TimeLimit.Options.6`) },
    ],
  },
};

export default class ResampleModal extends Component<IResampleModalProps, IResampleModalState> {
  private readonly sub: Unsubscribe;
  constructor(props) {
    super(props);

    const store = DataPrepStore.getState().dataprep;

    this.state = {
      samplingOptions: store.supportedSampleTypes,
      limit: store.sampleLimit,
      sampleType: store.sampleType,
      strata: store.strata || store.headers[0],
      headers: store.headers,
      timeoutMs: store.sampleTimeoutMs,
    };

    this.setLimit = this.setLimit.bind(this);
    this.setSampleType = this.setSampleType.bind(this);
    this.setStrata = this.setStrata.bind(this);
    this.setTimeoutMs = this.setTimeoutMs.bind(this);
    this.sanitizeRowInput = this.sanitizeRowInput.bind(this);

    this.sub = DataPrepStore.subscribe(() => {
      const state = DataPrepStore.getState().dataprep;

      this.setState({
        samplingOptions: state.supportedSampleTypes,
        limit: state.sampleLimit,
        sampleType: state.sampleType,
        strata: state.strata || state.headers[0],
        headers: state.headers,
        timeoutMs: state.sampleTimeoutMs,
      });
    });
  }

  public componentWillUnmount() {
    this.sub();
  }

  public resample = () => {
    this.props.toggle();
    resampleWorkspace(
      this.state.limit,
      this.state.sampleType,
      this.state.strata,
      this.state.timeoutMs === -1 ? null : this.state.timeoutMs
    ).subscribe(
      () => undefined,
      (err) => {
        DataPrepStore.dispatch({
          type: DataPrepActions.setError,
          payload: {
            message: err.message || err.response.message,
          },
        });
      }
    );
  };

  // Removes any decimal places, and brings within the desired range (1-3000)
  private sanitizeRowInput(rowsStr) {
    const sanitizedRowsStr = rowsStr.replace(/[^0-9]/, '');
    let rows = parseInt(sanitizedRowsStr, 10);
    if (!rows) {
      rows = 1;
    }
    return Math.max(1, Math.min(3000, rows));
  }

  public setLimit(event) {
    this.setState({ limit: this.sanitizeRowInput(event.rows) });
  }

  public setSampleType(event) {
    this.setState({ sampleType: event.sampleType });
  }

  public setStrata(event) {
    this.setState({ strata: event.strata });
  }

  public setTimeoutMs(event) {
    if (event.timeoutMs === 'no-limit') {
      this.setState({ timeoutMs: null });
    } else {
      this.setState({ timeoutMs: parseInt(event.timeoutMs, 10) });
    }
  }

  public render() {
    return (
      <Dialog open={true} maxWidth="sm" fullWidth={true}>
        <DialogTitle>{T.translate(`${PREFIX}.title`)}</DialogTitle>
        <DialogContent>
          <ContentContainer>
            <PropertyRow
              key={sampleTypeWidget.name}
              widgetProperty={sampleTypeWidget}
              value={this.state.sampleType}
              onChange={this.setSampleType}
              extraConfig={{ namespace: getCurrentNamespace() }}
              disabled={false}
              pluginProperty={{
                description: T.translate(`${PREFIX}.SampleTypes.description`) as string,
              }}
            />
            {this.state.sampleType === 'stratified' && (
              <PropertyRow
                key={strataWidget(this.state.headers).name}
                widgetProperty={strataWidget(this.state.headers)}
                value={this.state.strata}
                onChange={this.setStrata}
                extraConfig={{ namespace: getCurrentNamespace() }}
                disabled={false}
              />
            )}
            <PropertyRow
              key={rowsWidget.name}
              widgetProperty={rowsWidget}
              value={String(this.state.limit)}
              onChange={this.setLimit}
              extraConfig={{ namespace: getCurrentNamespace() }}
              disabled={false}
            />
            <PropertyRow
              key={timeoutWidget.name}
              widgetProperty={timeoutWidget}
              value={
                this.state.timeoutMs === null || this.state.timeoutMs === undefined
                  ? 'no-limit'
                  : String(this.state.timeoutMs)
              }
              onChange={this.setTimeoutMs}
              extraConfig={{ namespace: getCurrentNamespace() }}
              disabled={false}
              pluginProperty={{
                description: T.translate(`${PREFIX}.TimeLimit.description`) as string,
              }}
            />
          </ContentContainer>
        </DialogContent>
        <DialogActions>
          <PrimaryTextButton onClick={this.props.toggle}>
            {T.translate(`${PREFIX}.cancel`)}
          </PrimaryTextButton>
          <PrimaryTextButton onClick={this.resample}>
            {T.translate(`${PREFIX}.confirm`)}
          </PrimaryTextButton>
        </DialogActions>
      </Dialog>
    );
  }
}

interface IResampleModalState {
  samplingOptions: string[];
  limit: number;
  sampleType: string;
  strata: string;
  headers: string[];
  timeoutMs: number;
}

interface IResampleModalProps {
  toggle: () => void;
}
