/*
 * Copyright © 2021 Cask Data, Inc.
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

import React, { createRef, useEffect } from 'react';
import embed, { VisualizationSpec } from 'vega-embed';

export default function NumericStatistics({ values, fieldName, dataType }) {
  const id = `chart-${fieldName}`;
  // const elRef = createRef();

  useEffect(() => {
    let parseFn = Number.parseFloat;
    if (['Integer', 'Int', 'Long', 'Short'].includes(dataType)) {
      parseFn = Number.parseInt;
    }
    const data = values.map((d) => {
      return {
        fieldName: parseFn(d[fieldName]),
      };
    });
    const spec: VisualizationSpec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 225,
      height: 150,
      data: { values: data },
      mark: 'bar',
      encoding: {
        x: {
          field: 'fieldName',
          bin: {
            maxbins: 20,
          },
          axis: null,
        },
        y: {
          aggregate: 'count',
          axis: null,
        },
      },
    };
    embed(`#${id}`, spec, { actions: false });
  }, [values]);

  return <div id={id}></div>;
}
