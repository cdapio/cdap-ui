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
import ScheduleRuntimeArgsStore, {
  DEFAULTSTAGEMESSAGE,
  DEFAULTPROPERTYMESSAGE,
  DEFAULTTRIGGEREDMACROMESSAGE,
} from 'components/PipelineTriggers/ScheduleRuntimeArgs/ScheduleRuntimeArgsStore';
import { setArgMapping } from 'components/PipelineTriggers/ScheduleRuntimeArgs/ScheduleRuntimeArgsActions';
import { Row, Col } from 'reactstrap';
import T from 'i18n-react';

export default class StagePropertiesRow extends Component {
  static propTypes = {
    pipelineName: PropTypes.string,
    pipelineStage: PropTypes.string,
    stageProperty: PropTypes.string,
    triggeredPipelineMacro: PropTypes.string,
    id: PropTypes.string,
  };

  getConstructedKey = ({ stage, property }) => {
    const { triggeringPipelineInfo } = ScheduleRuntimeArgsStore.getState().args;
    if (stage && property) {
      return `${this.props.pipelineName ||
        triggeringPipelineInfo.id}:${stage}:${property}`;
    }
    return null;
  };

  state = {
    key: this.getConstructedKey({
      stage: this.props.pipelineStage,
      property: this.props.stageProperty,
    }),
    stage: this.props.pipelineStage,
    property: this.props.stageProperty,
    triggeredPipelineMacro: this.props.triggeredPipelineMacro,
  };

  onPropertyChange = (e) => {
    this.setState(
      {
        property: e.target.value,
        triggeredPipelineMacro: null,
      },
      this.updateStore.bind(this, this.state.triggeredPipelineMacro)
    );
  };

  onPipelineStageChange = (e) => {
    const oldValue = this.state.triggeredPipelineMacro;
    this.setState(
      {
        stage: e.target.value,
        property: null,
        triggeredPipelineMacro: null,
      },
      this.updateStore.bind(this, oldValue)
    );
  };

  onTriggeredMacroChange = (e) => {
    const oldValue = this.state.triggeredPipelineMacro;
    this.setState(
      {
        triggeredPipelineMacro: e.target.value,
      },
      this.updateStore.bind(this, oldValue)
    );
  };

  updateStore = (oldValue) => {
    const constructedKey = this.getConstructedKey(this.state);
    setArgMapping(
      constructedKey,
      this.state.triggeredPipelineMacro,
      'properties',
      oldValue
    );
  };

  getDisplayForTriggeredPipelineMacro = () => {
    if (!this.state.triggeredPipelineMacro) {
      return [DEFAULTTRIGGEREDMACROMESSAGE];
    }
    return [this.state.triggeredPipelineMacro, DEFAULTTRIGGEREDMACROMESSAGE];
  };

  getPropertyLabel = (property) => {
    if (property === DEFAULTPROPERTYMESSAGE) {
      return DEFAULTPROPERTYMESSAGE;
    }
    const { args } = ScheduleRuntimeArgsStore.getState();
    const { stageWidgetJsonMap } = args;
    let properties = [];
    const configurationGroups =
      stageWidgetJsonMap[this.state.stage]?.['configuration-groups'];
    if (!configurationGroups) {
      return property;
    }
    configurationGroups.map((group) => {
      properties = properties.concat(group.properties);
    });
    const matchProperty = properties.filter((prop) => prop.name === property);
    return !matchProperty.length ? property : matchProperty[0].label;
  };

  render() {
    const {
      triggeringPipelineInfo,
      triggeredPipelineInfo,
      stageWidgetJsonMap,
    } = ScheduleRuntimeArgsStore.getState().args;
    const configurableStages = triggeringPipelineInfo.configStages.filter(
      (stage) => !!stageWidgetJsonMap[stage.id]
    );
    const stage = triggeringPipelineInfo.configStagesMap[this.state.stage];
    let properties = [];
    if (stage) {
      properties = stage.properties;
    }
    properties = [DEFAULTPROPERTYMESSAGE].concat(properties);
    properties = properties.map((prop) => {
      return {
        id: prop,
        label: this.getPropertyLabel(prop),
      };
    });
    return (
      <Row>
        <Col xs={3}>
          <div className="select-dropdown">
            <select
              value={this.state.stage}
              onChange={this.onPipelineStageChange}
            >
              {[{ id: DEFAULTSTAGEMESSAGE }]
                .concat(configurableStages)
                .map((stage) => {
                  return (
                    <option key={stage.id} value={stage.id}>
                      {stage.id}
                    </option>
                  );
                })}
            </select>
          </div>
        </Col>
        <Col xs={4}>
          <div className="select-dropdown">
            <select
              onChange={this.onPropertyChange}
              value={this.state.property}
            >
              {properties.map((prop, i) => {
                return (
                  <option
                    key={i}
                    value={prop.id}
                    selected={prop.id === this.state.property}
                  >
                    {prop.label}
                  </option>
                );
              })}
            </select>
          </div>
        </Col>
        <Col xs={1}>
          <span>{T.translate('commons.as')}</span>
        </Col>
        <Col xs={4}>
          <div className="select-dropdown">
            <select
              value={this.state.triggeredPipelineMacro}
              onChange={this.onTriggeredMacroChange}
            >
              {this.getDisplayForTriggeredPipelineMacro()
                .concat(triggeredPipelineInfo.unMappedMacros)
                .map((prop, i) => {
                  return <option key={i}>{prop}</option>;
                })}
            </select>
          </div>
        </Col>
      </Row>
    );
  }
}
