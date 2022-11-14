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
import minBy from 'lodash/minBy';
import maxBy from 'lodash/maxBy';
import moment from 'moment';
import StringChart from 'components/DataPrep/DataPrepStatistics/DataPrepCharts/StringChart';

function getTimeUnits(data, dataType) {
  const minDate = moment.utc(minBy(data, 'fieldName').fieldName);
  const maxDate = moment.utc(maxBy(data, 'fieldName').fieldName);
  if (!minDate.isValid() || !maxDate.isValid()) {
    return null;
  }
  const duration = moment.duration(maxDate.diff(minDate));
  let unit = 'year';
  unit = 'year';
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
  return unit;
}

export default function DateTimeChart({ values, fieldName, dataType }) {
  const id = `chart-${fieldName}`;
  let timeUnit = null;

  useEffect(() => {
    let data;
    // Remove suffix (looks like "Z[UTC]") from Timestamp_micros
    if (dataType === 'Timestamp_micros') {
      data = values.map((d) => {
        return {
          fieldName: d[fieldName].slice(0, -6),
        };
      });
    } else {
      data = values.map((d) => {
        return {
          fieldName: moment.utc(d[fieldName], 'H:m:S').toDate(),
        };
      });
    }

    timeUnit = getTimeUnits(data, dataType);
    if (timeUnit !== null) {
      const spec: VisualizationSpec = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        width: CHART_WIDTH,
        height: CHART_HEIGHT,
        data: { values: data },
        mark: 'bar',
        encoding: {
          x: {
            field: 'fieldName',
            timeUnit,
            axis: null,
          },
          y: {
            aggregate: 'count',
            axis: null,
          },
          // tooltip: [
          //   {
          //     field: 'fieldName',
          //     type: 'quantitative',
          //     title: 'Value',
          //     timeUnit: {
          //       // @ts-ignore
          //       unit: timeUnit,
          //       utc: true,
          //     },
          //   },
          //   { field: 'fieldName', aggregate: 'count', type: 'quantitative', title: 'Count' },
          // ],
          tooltip: {
            field: 'fieldName',
            timeUnit: {
              // @ts-ignore
              unit: timeUnit,
              utc: true,
            },
          },
        },
      };
      embed(`#${id}`, spec, { actions: false });
    }
  }, [values]);

  return timeUnit !== null ? (
    <div id={id}></div>
  ) : (
    <StringChart values={values} fieldName={fieldName} />
  );
}
