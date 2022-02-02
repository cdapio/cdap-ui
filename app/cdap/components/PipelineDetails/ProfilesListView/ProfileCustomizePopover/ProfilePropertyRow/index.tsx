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
import { WrappedWidgetWrapper } from 'components/shared/ConfigurationGroup/WidgetWrapper';
import { IPluginProperty } from 'components/shared/ConfigurationGroup/types';

interface IPropertyRowProps {
  value: any;
  property: IPluginProperty;
  onChange: (values, params?: { [key: string]: any }) => void;
}

const PropertyRowWrapper = ({ property, value, onChange }: IPropertyRowProps) => {
  return (
    <div className="profile-group-content">
      <div>
        <WrappedWidgetWrapper
          pluginProperty={{
            name: property.name,
            description: property.description,
            required: property.required,
          }}
          widgetProperty={property}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

const ProfilePropertyRow = React.memo(PropertyRowWrapper, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.property['widget-type'] === nextProps.property['widget-type']
  );
});

export default ProfilePropertyRow;
