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

import React, { useEffect } from 'react';
import embed, { VisualizationSpec } from 'vega-embed';
import { CHART_WIDTH, CHART_HEIGHT } from 'components/DataPrep/DataPrepStatistics/constants';

export default function StringChart({ values, fieldName }) {
  const id = `chart-${fieldName}`;

  useEffect(() => {
    const data = values.map((d) => {
      return {
        fieldName: d[fieldName],
      };
    });
    const spec: VisualizationSpec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: CHART_WIDTH,
      height: CHART_HEIGHT,
      data: { values: data },
      transform: [
        {
          aggregate: [{ op: 'count', field: 'fieldName', as: 'count_field' }],
          groupby: ['fieldName'],
        },
        {
          window: [{ op: 'row_number', as: 'row_number' }],
          sort: [{ field: 'count_field', order: 'descending' }],
        },
        {
          filter: 'datum.row_number < 10',
        },
      ],
      mark: 'bar',
      encoding: {
        y: {
          field: 'fieldName',
          type: 'nominal',
          axis: null,
          sort: { field: 'row_number', order: 'ascending' },
        },
        x: {
          field: 'count_field',
          type: 'quantitative',
          axis: null,
        },
        tooltip: {
          field: 'fieldName',
        },
      },
    };
    embed(`#${id}`, spec, { actions: false });
  }, [values]);

  return <div id={id}></div>;
}
