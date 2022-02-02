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
import PropertyLock from 'components/Cloud/Profiles/CreateView/PropertyLock';
import WidgetWrapper from 'components/shared/ConfigurationGroup/WidgetWrapper';
import { isEmpty, isEqual, xorWith } from 'lodash';
import { objectQuery } from 'services/helpers';
import { IPluginProperty } from 'components/shared/ConfigurationGroup/types';
import { IErrorObj } from 'components/shared/ConfigurationGroup/utilities';

interface IPropertyRowProps {
  properties: { [key: string]: any };
  property: IPluginProperty;
  onChange: (values, params?: { [key: string]: any }) => void;
  extraConfig: any;
  errors?: IErrorObj[];
}

const PropertyRowWrapper = ({ properties, property, onChange, extraConfig }: IPropertyRowProps) => {
  return (
    <div className="property-row">
      <WidgetWrapper
        pluginProperty={{
          name: property.name,
          required: !!property.required,
          description: property.description,
        }}
        widgetProperty={property}
        value={objectQuery(properties, property.name, 'value')}
        onChange={onChange}
        extraConfig={extraConfig}
        size={objectQuery(property, 'widget-attributes', 'size')}
      />
      <PropertyLock propertyName={property.name} />
    </div>
  );
};

const PropertyRow = React.memo(PropertyRowWrapper, (prevProps, nextProps) => {
  const prevVal = objectQuery(prevProps.properties, prevProps.property.name, 'value');
  const curVal = objectQuery(nextProps.properties, nextProps.property.name, 'value');
  const rule =
    prevVal === curVal &&
    nextProps.property['widget-type'] === prevProps.property['widget-type'] &&
    prevProps.extraConfig.properties === nextProps.extraConfig.properties;
  // Comparison of array of objects
  const isArrayEqual = (x: IErrorObj[], y: IErrorObj[]) => isEmpty(xorWith(x, y, isEqual));
  const errorChange = isArrayEqual(nextProps.errors, prevProps.errors);
  return rule && errorChange;
});

export default PropertyRow;
