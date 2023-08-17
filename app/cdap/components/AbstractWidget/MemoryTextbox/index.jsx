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

// import { DEFAULT_WIDGET_PROPS } from 'components/AbstractWidget';
import { Input } from 'reactstrap';
import React from 'react';
// import { WIDGET_PROPTYPES } from 'components/AbstractWidget/constants';

require('./MemoryTextbox.scss');

// MemoryTextbox explicitly displays memory in GB even though it gets the value from
// backend in MB. we are "big data". We don't talk in Mb we only start with Gb -_-
export default function MemoryTextbox({ ...props }) {
  const { onChange, widgetProps } = props;
  let value = props.value;
  let min = Number.MIN_SAFE_INTEGER;
  let max = Number.MAX_SAFE_INTEGER;
  if (widgetProps?.min) {
    min = widgetProps.min;
  }
  if (widgetProps?.max) {
    max = widgetProps.max;
  }
  min = Math.floor(min / 1024);
  max = Math.floor(max / 1024);
  const numberValue = parseInt(value, 10);
  value = isNaN(numberValue) ? value : numberValue;
  const memoryInGB = Math.floor(value / 1024);
  return (
    <div className={'memory-textbox-widget'}>
      <Input
        className={'number-textbox-widget'}
        type="number"
        onChange={(e) => {
          const valueInMB = Math.floor(e.target.value * 1024);
          onChange(valueInMB);
        }}
        value={memoryInGB}
        min={min}
        max={max}
      />
      <span>GB</span>
    </div>
  );
}

// MemoryTextbox.propTypes = WIDGET_PROPTYPES;
// MemoryTextbox.defaultProps = DEFAULT_WIDGET_PROPS;
// MemoryTextbox.getWidgetAttributes = () => {
//   return {
//     min: { type: 'number', required: false },
//     max: { type: 'number', required: false },
//   };
// };
