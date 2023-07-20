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

import React from 'react';
import T from 'i18n-react';

const PREFIX = 'features.DataPrep.DataPrepSidePanel.ColumnsTab.ColumnDetail';
export default function ColumnsTabDetail({ columnInfo }) {
  const { types } = columnInfo;
  if (!types) {
    return null;
  }
  const headers = Object.keys(types);
  return (
    <tr className="column-tab-details">
      <td colSpan="6">
        <table className="table statistics-table">
          <thead>
            <tr>
              <th>{T.translate(`${PREFIX}.Header.inferredType`)}</th>
              <th className="text-right">
                {T.translate(`${PREFIX}.Header.percentageChange`)}
              </th>
            </tr>
          </thead>

          <tbody>
            {headers.map((head) => {
              const chance = Number(Math.round(types[head] + 'e2') + 'e-2');

              return (
                <tr key={head}>
                  <td>{head}</td>
                  <td className="text-right">{chance}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </td>
    </tr>
  );
}

ColumnsTabDetail.propTypes = {
  columnInfo: PropTypes.object,
};
