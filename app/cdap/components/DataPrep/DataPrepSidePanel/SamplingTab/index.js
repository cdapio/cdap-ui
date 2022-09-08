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

import React, { Component } from 'react';
import DataPrepStore from 'components/DataPrep/store';
import { resampleWorkspace } from 'components/DataPrep/store/DataPrepActionCreator';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import T from 'i18n-react';
import DataPrepActions from 'components/DataPrep/store/DataPrepActions';
import DescriptionTooltip from 'components/shared/ConfigurationGroup/PropertyRow/DescriptionTooltip';

require('./SamplingTab.scss');
const PREFIX = 'features.DataPrep.DataPrepSidePanel.SamplingTab';
export default class SamplingTab extends Component {
  constructor(props) {
    super(props);

    const store = DataPrepStore.getState().dataprep;

    this.state = {
      deleteHover: null,
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
    this.validateLimit = this.validateLimit.bind(this);

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

  componentWillUnmount() {
    this.sub();
  }

  onMouseEnter(index) {
    this.setState({ deleteHover: index });
  }
  onMouseLeave() {
    this.setState({ deleteHover: null });
  }

  resample = () => {
    resampleWorkspace(
      this.state.limit,
      this.state.sampleType,
      this.state.strata,
      this.state.timeoutMs === -1 ? null : this.state.timeoutMs
    ).subscribe(
      () => {},
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

  validateLimit(event) {
    const { value, max, min } = event.target;
    const limit = Math.max(Number(min), Math.min(Number(max), Number(value)));
    this.setState({ limit });
  }

  setLimit(event) {
    this.setState({ limit: event.target.value });
  }

  setSampleType(event) {
    this.setState({ sampleType: event.target.value });
  }

  setStrata(event) {
    this.setState({ strata: event.target.value });
  }

  setTimeoutMs(event) {
    this.setState({ timeoutMs: parseInt(event.target.value) });
  }

  render() {
    return (
      <div className="sampling-tab">
        <Form>
          <FormGroup tag="fieldset" onChange={this.setSampleType}>
            <legend className="col-form-label">
              {T.translate(`${PREFIX}.SampleTypes.prompt`)}
            </legend>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="sampling-options"
                  value="default"
                  defaultChecked={this.state.sampleType === 'default'}
                />
                {T.translate(`${PREFIX}.SampleTypes.default`)}
              </Label>
              <DescriptionTooltip
                description={T.translate(`${PREFIX}.SampleTypes.defaultTooltip`)}
                placement="right"
              />
            </FormGroup>
            {this.state.samplingOptions.includes('random') && (
              <FormGroup check>
                <Label check>
                  <Input
                    type="radio"
                    name="sampling-options"
                    value="random"
                    defaultChecked={this.state.sampleType === 'random'}
                  />
                  {T.translate(`${PREFIX}.SampleTypes.random`)}
                </Label>
                <DescriptionTooltip
                  description={T.translate(`${PREFIX}.SampleTypes.randomTooltip`)}
                  placement="right"
                />
              </FormGroup>
            )}
            {this.state.samplingOptions.includes('stratified') && (
              <FormGroup check>
                <Label check>
                  <Input
                    type="radio"
                    name="sampling-options"
                    value="stratified"
                    defaultChecked={this.state.sampleType === 'stratified'}
                  />
                  {T.translate(`${PREFIX}.SampleTypes.stratified`)}
                </Label>
                <DescriptionTooltip
                  description={T.translate(`${PREFIX}.SampleTypes.stratifiedTooltip`)}
                  placement="right"
                />
              </FormGroup>
            )}
          </FormGroup>
          {this.state.sampleType === 'stratified' && (
            <FormGroup onChange={this.setStrata}>
              <Label for="strata-col-select">{T.translate(`${PREFIX}.strataPrompt`)}</Label>
              <Input type="select" id="strata-col-select" defaultValue={this.state.strata}>
                {this.state.headers.map((header) => {
                  return (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  );
                })}
              </Input>
            </FormGroup>
          )}
          <FormGroup>
            <Label for="limit">{T.translate(`${PREFIX}.numRowsPrompt`)}</Label>
            <Input
              id="limit"
              value={this.state.limit}
              onChange={this.setLimit}
              onBlur={this.validateLimit}
              type="number"
              onKeyPress={(event) => {
                // Only allow users to input whole integers
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              min={1}
              max={3000}
            />
          </FormGroup>
          <FormGroup onChange={this.setTimeoutMs}>
            <Label for="timeout-select">{T.translate(`${PREFIX}.TimeLimit.prompt`)}</Label>
            <Input type="select" id="timeout-select" defaultValue={this.state.timeoutMs}>
              <option value={-1}>{T.translate(`${PREFIX}.TimeLimit.Options.0`)}</option>
              <option value={10000}>{T.translate(`${PREFIX}.TimeLimit.Options.1`)}</option>
              <option value={30000}>{T.translate(`${PREFIX}.TimeLimit.Options.2`)}</option>
              <option value={60000}>{T.translate(`${PREFIX}.TimeLimit.Options.3`)}</option>
              <option value={600000}>{T.translate(`${PREFIX}.TimeLimit.Options.4`)}</option>
              <option value={1800000}>{T.translate(`${PREFIX}.TimeLimit.Options.5`)}</option>
              <option value={3600000}>{T.translate(`${PREFIX}.TimeLimit.Options.6`)}</option>
            </Input>
          </FormGroup>
        </Form>
        <div className="btn-container">
          <button className="btn btn-primary" onClick={this.resample}>
            {T.translate(`${PREFIX}.resampleButton`)}
          </button>
        </div>
      </div>
    );
  }
}
