/*
 * Copyright © 2019 Cask Data, Inc.
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

import * as React from 'react';

import AbstractMultiRowWidget, {
  IMultiRowProps,
  IMultiRowWidgetProps,
} from 'components/AbstractWidget/AbstractMultiRowWidget';
import KeyValueDropdownRow, {
  IDropdownOption,
} from 'components/AbstractWidget/KeyValueDropdownWidget/KeyValueDropdownRow';

import ThemeWrapper from 'components/ThemeWrapper';
import { WIDGET_PROPTYPES } from 'components/AbstractWidget/constants';
import { objectQuery } from 'services/helpers';

interface IKeyValueDropdownWidgetProps extends IMultiRowWidgetProps {
  'key-placeholder'?: string;
  'kv-delimiter'?: string;
  'kv-pair-limit'?: number;
  dropdownOptions: IDropdownOption[];
  delimiter?: string;
  showDelimiter?: boolean;
}

type IKeyValueDropdownProps = IMultiRowProps<IKeyValueDropdownWidgetProps>;

class KeyValueDropdownWidgetView extends AbstractMultiRowWidget<IKeyValueDropdownProps> {
  public renderRow = (id, index) => {
    const keyPlaceholder = objectQuery(this.props, 'widgetProps', 'key-placeholder');
    const kvDelimiter = objectQuery(this.props, 'widgetProps', 'kv-delimiter');
    const dropdownOptions = objectQuery(this.props, 'widgetProps', 'dropdownOptions');
    const rowLimit = objectQuery(this.props, 'widgetProps', 'kv-pair-limit');
    const addRowDisabled = !!rowLimit && Object.keys(this.values).length >= rowLimit;

    return (
      <KeyValueDropdownRow
        key={id}
        value={this.values[id].value}
        id={id}
        index={index}
        onChange={this.editRow}
        addRow={this.addRow.bind(this, index)}
        removeRow={this.removeRow.bind(this, index)}
        autofocus={this.state.autofocus === id}
        changeFocus={this.changeFocus}
        addRowDisabled={addRowDisabled}
        disabled={this.props.disabled}
        keyPlaceholder={keyPlaceholder}
        kvDelimiter={kvDelimiter}
        dropdownOptions={dropdownOptions}
        forwardedRef={this.values[id].ref}
        errors={this.props.errors}
      />
    );
  };
}

export default function KeyValueDropdownWidget(props) {
  return (
    <ThemeWrapper>
      <KeyValueDropdownWidgetView {...props} />
    </ThemeWrapper>
  );
}

(KeyValueDropdownWidget as any).propTypes = WIDGET_PROPTYPES;
(KeyValueDropdownWidget as any).getWidgetAttributes = () => {
  return {
    'key-placeholder': { type: 'string', required: false },
    'kv-delimiter': { type: 'string', required: false },
    delimiter: { type: 'string', required: false },
    dropdownOptions: { type: 'IDropdownOption[]', required: true },
    showDelimiter: { type: 'boolean', required: false },
  };
};
