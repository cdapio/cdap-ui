/*
 * Copyright © 2023 Cask Data, Inc.
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
import WidgetWrapper from 'components/shared/ConfigurationGroup/WidgetWrapper';
import { objectQuery } from 'services/helpers';
import { IPluginProperty } from 'components/shared/ConfigurationGroup/types';
import { IErrorObj } from 'components/shared/ConfigurationGroup/utilities';
import styled from 'styled-components';

interface IPropertyRowProps {
  value: string;
  property: IPluginProperty;
  onChange: (values, params?: { [key: string]: any }) => void;
  errors?: IErrorObj[];
}

const StyledPropertyRow = styled.div`
  align-items: center;
  margin-bottom: 25px;
`;

const PropertyRow = ({ value, property, onChange, errors }: IPropertyRowProps) => {
  return (
    <StyledPropertyRow>
      <WidgetWrapper
        pluginProperty={{
          name: property.name,
          required: !!property.required,
          description: property.description,
        }}
        widgetProperty={property}
        value={value}
        onChange={onChange}
        size={objectQuery(property, 'widget-attributes', 'size')}
        errors={errors}
      />
      {errors && errors.length > 0 && <div style={{ color: '#a40403' }}>{errors[0].msg}</div>}
    </StyledPropertyRow>
  );
};

export default PropertyRow;
