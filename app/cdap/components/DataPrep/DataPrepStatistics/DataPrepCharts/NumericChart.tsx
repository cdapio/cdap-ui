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
import { isIntegral } from 'components/DataPrep/DataPrepStatistics/DataPrepStatisticsUtils';

export default function NumericChart({ values, fieldName, dataType }) {
  const id = `chart-${fieldName}`;
  const fieldData = values.map((row) => row[fieldName]);

  useEffect(() => {
    let parseFn = Number.parseFloat;
    if (isIntegral(dataType)) {
      parseFn = Number.parseInt;
    }
    const data = fieldData.map((d) => {
      return {
        fieldName: parseFn(d),
      };
    });

    const spec: VisualizationSpec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: CHART_WIDTH,
      height: CHART_HEIGHT,
      data: { values: data },
      mark: 'bar',
      encoding: {
        x: {
          field: 'fieldName',
          ...(new Set(fieldData).size > 20 && { bin: { maxbins: 20 } }),
          axis: null,
        },
        y: {
          aggregate: 'count',
          axis: null,
        },
        tooltip: { field: 'fieldName', type: 'quantitative' },
        // tooltip: [
        //   { field: 'fieldName', type: 'quantitative', title: 'Value' },
        //   { field: 'fieldName', aggregate: 'count', type: 'quantitative', title: 'Count' },
        // ],
      },
    };
    embed(`#${id}`, spec, { actions: false });
  }, [values]);

  return <div id={id}></div>;
}
