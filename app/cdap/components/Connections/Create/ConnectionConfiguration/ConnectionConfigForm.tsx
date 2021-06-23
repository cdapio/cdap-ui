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
import If from 'components/If';
import LoadingSVG from 'components/LoadingSVG';

const useStyle = makeStyle((theme) => {
  return {
    formStyles: {
      display: 'flex',
      gap: '10px',
      paddingLeft: '10px',
    },
    connectionTestMessage: {
      display: 'flex',
      height: '2rem',
      padding: '0 10px',
    },
    connectionTestSuccess: {
      color: theme.palette.green[500],
    },
    connectionTestFailure: {
      color: theme.palette.red[200],
    },
  };
});

export function ConnectionConfigForm({
  connectorWidgetJSON,
  connectorProperties,
  onConnectionCreate,
  onConnectionTest,
  initProperties = {},
  initName = '',
  initDescription = '',
  isEdit,
  testResults,
}) {
  const [values, setValues] = React.useState<Record<string, string>>(initProperties);
  const [name, setName] = React.useState(initName);
  const [description, setDescription] = React.useState(initDescription);
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
      <div className={classes.connectionTestMessage}>
        <If condition={testResults.inProgress}>
          <LoadingSVG height="1rem" />
        </If>

        <If condition={testResults.succeeded}>
          <div className={classes.connectionTestSuccess}>Successfuly connected.</div>
        </If>
        {!testResults.succeeded &&
          testResults.messages &&
          testResults.messages.map((message, i) => (
            <div key={i} className={classes.connectionTestFailure}>
              {message.message} {message.correctiveAction}
            </div>
          ))}
      </div>
      <div className={classes.formStyles}>
        <Button
          variant="contained"
          onClick={() => onConnectionTest({ properties: values })}
          disabled={testResults.inProgress}
        >
          Test Connection
        </Button>
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
          {isEdit ? 'Save' : 'Create'}
        </Button>
      </div>
    </div>
  );
}
