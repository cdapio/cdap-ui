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
import React from 'react';
import SelectWithOptions from 'components/shared/SelectWithOptions';
// import { WIDGET_PROPTYPES } from 'components/AbstractWidget/constants';
import { objectQuery } from 'services/helpers';
require('./MemorySelectWidget.scss');

export default function MemorySelectWidget({ ...props }) {
  const size = objectQuery(props, 'widgetProps', 'size') || 'large';
  return (
    <div className={`memory-select-widget ${size}`}>
      <SelectWithOptions
        options={props.widgetProps.values}
        value={props.value}
        className="form-control"
        onChange={props.onChange}
      />
      <span>GB</span>
    </div>
  );
}

// MemorySelectWidget.propTypes = WIDGET_PROPTYPES;
// MemorySelectWidget.defaultProps = DEFAULT_WIDGET_PROPS;
// MemorySelectWidget.getWidgetAttributes = () => {
//   return {
//     size: { type: 'Size', required: false },
//   };
// };
