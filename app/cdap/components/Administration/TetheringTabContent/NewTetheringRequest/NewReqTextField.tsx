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

import React from 'react';
import styled from 'styled-components';
import { ErrorText } from '../shared.styles';
import WidgetWrapper from 'components/shared/ConfigurationGroup/WidgetWrapper';
import { IErrorObj } from 'components/shared/ConfigurationGroup/utilities';

const WidgetContainer = styled.div`
  margin-top: 40px;
`;

interface ITextboxProps {
  widgetProperty?: any;
  pluginProperty?: any;
  value?: string;
  errors?: IErrorObj[];
  broadcastChange: (target: string, value: string) => void;
}

const Textbox = ({
  widgetProperty,
  pluginProperty,
  value,
  errors,
  broadcastChange,
}: ITextboxProps) => {
  const handleChange = (val) => {
    broadcastChange(widgetProperty.name, val);
  };
  const hasErrors = errors && Boolean(errors.length) && errors[0];

  return (
    <WidgetContainer>
      <WidgetWrapper
        widgetProperty={widgetProperty}
        pluginProperty={pluginProperty}
        value={value}
        errors={errors}
        onChange={handleChange}
      />
      {hasErrors && <ErrorText data-testid="missing-required-field">{errors[0].msg}</ErrorText>}
    </WidgetContainer>
  );
};

export default Textbox;
