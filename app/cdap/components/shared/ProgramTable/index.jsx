/*
 * Copyright © 2017-2018 Cask Data, Inc.
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
import FastActions from 'components/EntityCard/FastActions';
import SortableTable from 'components/shared/SortableTable';
import IconSVG from 'components/shared/IconSVG';
import uuidV4 from 'uuid/v4';
import { humanReadableDate } from 'services/helpers';
import EntityIconMap from 'services/entity-icon-map';
import T from 'i18n-react';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import StatusMapper from 'services/StatusMapper';
require('./ProgramTable.scss');

const tableHeaders = [
  {
    property: 'name',
    label: T.translate('features.ViewSwitch.nameLabel'),
  },
  {
    property: 'programType',
    label: T.translate('features.ViewSwitch.typeLabel'),
  },
  // have to convert latestRun back from string to seconds from epoch
  {
    property: 'latestRun',
    label: T.translate('features.ViewSwitch.ProgramTable.lastStartedLabel'),
    sortFunc: (entity) => {
      return moment(entity.latestRun.starting).valueOf();
    },
  },
  {
    property: 'status',
    label: T.translate('features.ViewSwitch.ProgramTable.statusLabel'),
  },
  // empty header label for Actions column
  {
    label: '',
  },
];

export default class ProgramTable extends Component {
  static propTypes = {
    programs: PropTypes.arrayOf(PropTypes.object),
  };

  state = {
    entities: [],
  };

  componentWillMount() {
    const entities = this.updateEntities(this.props.programs);
    this.setState({
      entities,
    });
  }

  componentWillReceiveProps(nextProps) {
    const entities = this.updateEntities(nextProps.programs);
    this.setState({
      entities,
    });
  }

  updateEntities(programs) {
    return programs.map((prog) => {
      return Object.assign({}, prog, {
        latestRun: prog.latestRun || {},
        applicationId: prog.app,
        programType: prog.type,
        type: 'program',
        id: prog.name,
        uniqueId: `program-${uuidV4()}`,
      });
    });
  }

  renderTableBody = (entities) => {
    return (
      <tbody>
        {entities.map((program) => {
          const icon = EntityIconMap[program.programType];
          const statusClass =
            program.status === 'RUNNING' ? 'text-success' : '';
          return (
            <tr key={program.uniqueId}>
              <td>
                <span title={program.name}>{program.name}</span>
              </td>
              <td>
                <IconSVG name={icon} className="program-type-icon" />
                {program.programType}
              </td>
              <td>
                {!isEmpty(program.latestRun)
                  ? humanReadableDate(program.latestRun.starting)
                  : 'n/a'}
              </td>
              <td className={statusClass}>
                {!isEmpty(program.status)
                  ? StatusMapper.lookupDisplayStatus(program.status)
                  : 'n/a'}
              </td>
              <td>
                <div className="fast-actions-container text-center">
                  <FastActions
                    className="text-left btn-group"
                    entity={program}
                  />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  };

  render() {
    if (this.state.entities && Array.isArray(this.state.entities)) {
      if (this.state.entities.length) {
        return (
          <div className="program-table">
            <SortableTable
              entities={this.state.entities}
              tableHeaders={tableHeaders}
              renderTableBody={this.renderTableBody}
            />
          </div>
        );
      } else {
        return (
          <div className="history-tab">
            <i>{T.translate('features.Overview.ProgramTab.emptyMessage')}</i>
          </div>
        );
      }
    }
    return (
      <div className="program-table">
        <h3 className="text-center">
          <span className="fa fa-spinner fa-spin fa-2x loading-spinner" />
        </h3>
      </div>
    );
  }
}
