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
import minBy from 'lodash/minBy';
import maxBy from 'lodash/maxBy';
import moment from 'moment';

function getTimeUnits(data) {
  let unit = 'year';
  const minDate = minBy(data, 'fieldName').fieldName;
  const maxDate = maxBy(data, 'fieldName').fieldName;
  const duration = moment.duration(moment.utc(maxDate).diff(moment.utc(minDate)));
  if (duration.months() > 1) {
    unit = 'yearmonth';
  }
  if (duration.days() > 1 && duration.months() < 4) {
    unit = 'yearmonthdate';
  }
  if (duration.hours() > 1 && duration.days() < 5) {
    unit = 'yearmonthdatehours';
  }
  if (duration.minutes() > 1 && duration.hours() < 3) {
    unit = 'yearmonthdatehoursminutes';
  }
  console.log(`${minDate} - ${maxDate}: ${unit}`);
  return unit;
}

export default function DateTimeStatistics({ values, fieldName, dataType }) {
  const id = `chart-${fieldName}`;
  // const elRef = createRef();

  useEffect(() => {
    // let parseFn = Number.parseFloat;
    const data = values.map((d) => {
      return {
        fieldName: d[fieldName].slice(0, -6),
      };
    });

    const timeUnit = getTimeUnits(data);

    const spec: VisualizationSpec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 225,
      height: 150,
      data: { values: data },
      mark: 'bar',
      encoding: {
        x: {
          field: 'fieldName',
          timeUnit: {
            // maxbins: 12,
            unit: timeUnit,
            utc: true,
          },
          axis: null,
        },
        y: {
          aggregate: 'count',
          axis: null,
        },
        tooltip: {
          field: 'fieldName',
          timeUnit: {
            // maxbins: 12,
            unit: timeUnit,
            utc: true,
          },
        },
      },
    };
    embed(`#${id}`, spec, { actions: false });
  }, [values]);

  return <div id={id}></div>;
}
