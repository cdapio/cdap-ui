/*
 * Copyright © 2018 Cask Data, Inc.
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
import PropTypes from 'prop-types';
import Popover from 'components/shared/Popover';
import { MyReportsApi } from 'api/reports';
import { listReports } from 'components/Reports/store/ActionCreator';
import IconSVG from 'components/shared/IconSVG';
import { DefaultSelection } from 'components/Reports/store/ActionCreator';
import difference from 'lodash/difference';
import ReportsStore, {
  ReportsActions,
} from 'components/Reports/store/ReportsStore';
import { getCurrentNamespace } from 'services/NamespaceStore';
import T from 'i18n-react';

const PREFIX = 'features.Reports.ReportsList';

export default class ActionPopover extends Component {
  static propTypes = {
    report: PropTypes.object,
  };

  delete = () => {
    const params = {
      reportId: this.props.report.id,
    };

    MyReportsApi.deleteReport(params).subscribe(listReports, (err) => {
      console.log('Error', err);
    });
  };

  cloneCriteria = () => {
    const params = {
      'report-id': this.props.report.id,
    };

    MyReportsApi.getReport(params).subscribe((res) => {
      // Has to clear current selections, otherwise current selections in the
      // store will union with the cloned selections
      ReportsStore.dispatch({
        type: ReportsActions.clearSelection,
      });

      const { request } = res;

      const selectedFields = difference(request.fields, DefaultSelection);

      const selections = {};
      selectedFields.forEach((selection) => {
        selections[selection] = true;
      });

      const timeRange = {
        selection: 'custom',
        start: request.start * 1000,
        end: request.end * 1000,
      };

      const payload = {
        selections,
        timeRange,
      };

      let hasArtifactFilter = false;

      if (request.filters && request.filters.length > 0) {
        request.filters.forEach((filter) => {
          if (filter.fieldName === 'status') {
            // collapse status STOPPED and KILLED to STOPPED
            const statusSelections = filter.whitelist;
            const killedIndex = statusSelections.indexOf('KILLED');

            if (killedIndex !== -1) {
              statusSelections.splice(killedIndex, 1);

              if (statusSelections.indexOf('STOPPED') === -1) {
                statusSelections.push('STOPPED');
              }
            }

            payload.statusSelections = statusSelections;
          } else if (filter.fieldName === 'artifactName') {
            if (filter.whitelist) {
              payload.selections.pipelines = true;
            } else if (filter.blacklist) {
              payload.selections.customApps = true;
            }

            hasArtifactFilter = true;
          } else if (filter.fieldName === 'namespace') {
            const namespaces = filter.whitelist;
            namespaces.splice(namespaces.indexOf(getCurrentNamespace()), 1);

            payload.namespacesPick = namespaces;
          }
        });
      }

      if (!hasArtifactFilter) {
        payload.selections.pipelines = true;
        payload.selections.customApps = true;
      }

      ReportsStore.dispatch({
        type: ReportsActions.setSelections,
        payload,
      });

      // to close popover
      document.body.click();
    });
  };

  render() {
    return (
      <span>
        <Popover
          target={() => <IconSVG name="icon-cog" />}
          className="reports-list-action-popover"
          placement="bottom"
          bubbleEvent={false}
          injectOnToggle={true}
        >
          <div className="option" onClick={this.cloneCriteria}>
            {T.translate(`${PREFIX}.cloneCriteria`)}
          </div>

          <hr />

          <div className="option text-danger" onClick={this.delete}>
            {T.translate('commons.delete')}
          </div>
        </Popover>
      </span>
    );
  }
}
