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
import T from 'i18n-react';
import ConfigurationGroup from 'components/shared/ConfigurationGroup';
import makeStyle from '@material-ui/core/styles/makeStyles';
import PropertyRow from 'components/shared/ConfigurationGroup/PropertyRow';
import Alert from '@material-ui/lab/Alert';
import PrimaryContainedButton from 'components/shared/Buttons/PrimaryContainedButton';
import PrimaryOutlinedButton from 'components/shared/Buttons/PrimaryOutlinedButton';
import ButtonLoadingHoc from 'components/shared/Buttons/ButtonLoadingHoc';
import { ConnectionConfigurationMode } from 'components/Connections/types';

const I18NPREFIX = 'features.Administration.Tethering.CreateRequest';
const PrimaryOutlinedLoadingButton = ButtonLoadingHoc(PrimaryOutlinedButton);

const useStyle = makeStyle((theme) => {
  return {
    formStyles: {
      display: 'flex',
      gap: '10px',
      paddingLeft: '10px',
    },
    connectionTestMessage: {
      display: 'flex',
      padding: '0 10px',
      marginBottom: '1rem',
    },
    alert: {
      fontSize: 'inherit',
    },
  };
});

interface IValueProp {
  required?: boolean;
}

export function ConnectionConfigForm({
  connectorWidgetJSON,
  connectorProperties,
  onConnectionCreate,
  onConnectionTest,
  initProperties = {},
  initName = '',
  initDescription = '',
  mode,
  testResults,
}) {
  const [values, setValues] = React.useState<Record<string, string>>(initProperties);
  const [name, setName] = React.useState(initName);
  const [description, setDescription] = React.useState(initDescription);
  const classes = useStyle();
  const [configurationErrors, setConfigurationErrors] = React.useState(
    testResults.configurationErrors
  );

  const onCreate = () => {
    const fieldErrors = {};
    for (const [fieldName, value] of Object.entries(connectorProperties)) {
      if (
        !!(value as IValueProp).required &&
        (!values.hasOwnProperty(fieldName) || values[fieldName] === '' || values[fieldName] == null)
      ) {
        fieldErrors[fieldName] = [
          { msg: T.translate(`${I18NPREFIX}.inputValidationError`, { fieldName }) },
        ];
      }
    }
    if (Object.keys(fieldErrors).length) {
      setConfigurationErrors(fieldErrors);
    } else {
      onConnectionCreate({
        name,
        description,
        properties: values,
      });
      setConfigurationErrors(testResults.configurationErrors);
    }
  };

  return (
    <div>
      <div>
        {mode === ConnectionConfigurationMode.CREATE && (
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
              required: true,
            }}
            value={name}
            onChange={(v) => setName(v.name)}
            disabled={false}
            extraConfig={{ properties: {} }}
          />
        )}

        <PropertyRow
          widgetProperty={{
            'widget-type': 'textarea',
            'widget-attributes': {
              placeholder:
                mode !== ConnectionConfigurationMode.VIEW
                  ? 'Specify a description to identify the connection'
                  : '',
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
          disabled={mode === ConnectionConfigurationMode.VIEW}
          extraConfig={{ properties: {} }}
        />
      </div>
      <ConfigurationGroup
        widgetJson={connectorWidgetJSON}
        pluginProperties={connectorProperties}
        values={values}
        onChange={setValues}
        disabled={mode === ConnectionConfigurationMode.VIEW}
        errors={configurationErrors}
      />
      <div className={classes.connectionTestMessage}>
        {testResults.succeeded && (
          <Alert
            severity="success"
            className={classes.alert}
            data-cy="connection-test-success"
            data-testid="connection-test-success"
          >
            Successfully connected.
          </Alert>
        )}
        {!testResults.succeeded &&
          testResults.messages &&
          testResults.messages.map((message, i) => (
            <Alert
              severity="error"
              key={i}
              className={classes.alert}
              data-cy="connection-test-failure"
              data-testid="connection-test-failure"
            >
              {message.message} {message.correctiveAction}
            </Alert>
          ))}
      </div>
      {mode !== ConnectionConfigurationMode.VIEW && (
        <div className={classes.formStyles}>
          <PrimaryOutlinedLoadingButton
            loading={testResults.inProgress}
            onClick={() => onConnectionTest({ properties: values })}
            disabled={testResults.inProgress}
            data-cy="connection-test-button"
            data-testid="connection-test-button"
          >
            Test Connection
          </PrimaryOutlinedLoadingButton>
          <PrimaryContainedButton
            variant="contained"
            color="primary"
            onClick={onCreate}
            data-cy="connection-submit-button"
            data-testid="connection-submit-button"
          >
            {mode === ConnectionConfigurationMode.EDIT ? 'Save' : 'Create'}
          </PrimaryContainedButton>
        </div>
      )}
    </div>
  );
}
