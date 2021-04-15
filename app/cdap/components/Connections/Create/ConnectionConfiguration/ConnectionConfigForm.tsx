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

import * as React from 'react';
import ConfigurationGroup from 'components/ConfigurationGroup';
import { Button } from '@material-ui/core';
import makeStyle from '@material-ui/core/styles/makeStyles';
import PropertyRow from 'components/ConfigurationGroup/PropertyRow';

const useStyle = makeStyle(() => {
  return {
    formStyles: {
      display: 'flex',
      gap: '10px',
      paddingLeft: '10px',
    },
  };
});

export function ConnectionConfigForm({
  connectorWidgetJSON,
  connectorProperties,
  onConnectionCreate,
}) {
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const classes = useStyle();
  return (
    <div>
      <div>
        <PropertyRow
          widgetProperty={{
            'widget-type': 'textbox',
            'widget-attributes': {
              placeholder: 'Specify a name to identify the connection',
            },
            label: 'Name',
            name: 'name',
          }}
          pluginProperty={{
            name: 'name',
            macroSupported: false,
            required: false,
          }}
          value={name}
          onChange={(v) => setName(v.name)}
          disabled={false}
          extraConfig={{ properties: {} }}
        />
        <PropertyRow
          widgetProperty={{
            'widget-type': 'textarea',
            'widget-attributes': {
              placeholder: 'Specify a description to identify the connection',
            },
            label: 'Description',
            name: 'description',
          }}
          pluginProperty={{
            name: 'description',
            macroSupported: false,
            required: false,
          }}
          value={description}
          onChange={(v) => setDescription(v.description)}
          disabled={false}
          extraConfig={{ properties: {} }}
        />
      </div>
      <ConfigurationGroup
        widgetJson={connectorWidgetJSON}
        pluginProperties={connectorProperties}
        values={values}
        onChange={setValues}
      />
      <div className={classes.formStyles}>
        <Button variant="contained">Test Connection</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            onConnectionCreate({
              name,
              description,
              properties: values,
            })
          }
        >
          Create
        </Button>
      </div>
    </div>
  );
}
