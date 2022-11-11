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

import React, { useEffect, useReducer, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import T from 'i18n-react';
import DescriptionTooltip from 'components/shared/ConfigurationGroup/PropertyRow/DescriptionTooltip';
import styled from 'styled-components';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Alert from '@material-ui/lab/Alert';
import PrimaryTextButton from 'components/shared/Buttons/PrimaryTextButton';
import { getCurrentNamespace } from 'services/NamespaceStore';
import LoadingSVG from 'components/shared/LoadingSVG';
import PropertyRow from 'components/shared/ConfigurationGroup/PropertyRow';
import ImportFileButton from './ImportFileButton';
import { parseImportedSchemas } from 'components/AbstractWidget/SchemaEditor/SchemaHelpers';
import {
  reducer,
  performInitialLoad,
  unsubscribe,
  INITIAL_STATE,
  SET_PROPERTIES_ACTION,
  STATE_AVAILABLE,
  STATE_INITIAL_ERROR,
  STATE_INITIAL_LOADING,
  STATE_CONFIG_CONFIRMED,
  SET_STATUS_ACTION,
  SET_SCHEMA_ACTION,
} from './store';

const I18N_PREFIX = 'features.DataPrepConnections.ConnectionManagement.SourceParsing';

const ContentContainer = styled.div`
  width: 100%;
  min-width: 400px;
  position: relative;
`;

const InitialLoadingIconContainer = styled.div`
  text-align: center;
`;

const ConfirmedLoadingIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  opacity: 0.5;
  background: white;
  position: absolute;
  top: 0;
  width: 100%;
`;

const StyledAlert = styled(Alert)`
  font-size: inherit;
`;

const SchemaButtonRow = styled.div`
  padding: 15px 10px 10px;
`;

const SchemaButtonContainer = styled.span`
  padding-right: 10px;
`;

export default function ParsingConfigModal({
  connection,
  entity,
  sampleProperties,
  onCancel,
  onConfirm,
  errorMessage,
}) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [parsingErrorMessage, setParsingErrorMessage] = useState(null);

  useEffect(() => {
    performInitialLoad(connection, sampleProperties, entity, dispatch);

    return () => {
      unsubscribe(state);
    };
  }, []);

  useEffect(() => {
    if (errorMessage && state.status === STATE_CONFIG_CONFIRMED) {
      dispatch({
        type: SET_STATUS_ACTION,
        value: STATE_AVAILABLE,
      });
    }
  }, [errorMessage]);

  const handleChange = (key, properties) => {
    dispatch({
      type: SET_PROPERTIES_ACTION,
      value: properties,
    });
  };

  const extraConfig = {
    namespace: getCurrentNamespace(),
    properties: state.selectedProperties,
  };

  const handleConfirm = () => {
    dispatch({
      type: SET_STATUS_ACTION,
      value: STATE_CONFIG_CONFIRMED,
    });
    const confirmedProperties = {};
    // Filter out hidden properties before submitting
    Object.keys(state.selectedProperties).forEach((propertyKey) => {
      if (!state.hiddenProperties[propertyKey]) {
        confirmedProperties[propertyKey] = state.selectedProperties[propertyKey];
      }
    });
    onConfirm({
      ...confirmedProperties,
      schema: state.schema && JSON.stringify(state.schema),
    });
  };

  const handleSchemaUpload = (schemaFile) => {
    const reader = new FileReader();
    reader.readAsText(schemaFile, 'UTF-8');

    reader.onload = (evt) => {
      try {
        const fileContents = JSON.parse(evt.target.result.toString());
        const importedSchemas = parseImportedSchemas(fileContents);
        const schema = importedSchemas[0] && importedSchemas[0].schema;
        dispatch({
          type: SET_SCHEMA_ACTION,
          value: schema,
        });
      } catch (e) {
        setParsingErrorMessage('Imported schema is not a valid Avro schema');
      }
    };
  };

  const widgets = state.widgets.filter((widget) => {
    return !state.hiddenProperties[widget.name];
  });

  return (
    <Dialog open={true} maxWidth="sm" fullWidth={true}>
      <DialogTitle>Parsing Options</DialogTitle>
      <DialogContent>
        <ContentContainer>
          {(state.status === STATE_AVAILABLE || state.status === STATE_CONFIG_CONFIRMED) && (
            <>
              {errorMessage && <StyledAlert severity="error">{errorMessage}</StyledAlert>}
              {parsingErrorMessage && (
                <StyledAlert severity="error">{parsingErrorMessage}</StyledAlert>
              )}
              {widgets.map((widget) => (
                <PropertyRow
                  key={widget.name}
                  widgetProperty={widget}
                  value={state.selectedProperties[widget.name]}
                  onChange={handleChange.bind(null, widget.name)}
                  extraConfig={extraConfig}
                  disabled={false}
                  pluginProperty={state.pluginProperties[widget.name]}
                  macrosDisabled={true}
                />
              ))}
              {state.allowSchemaUpload && (
                <SchemaButtonRow>
                  {state.schema && (
                    <StyledAlert severity="success">
                      A schema has been imported for this file
                    </StyledAlert>
                  )}
                  <SchemaButtonContainer>
                    <ImportFileButton onFileSelect={handleSchemaUpload} />
                  </SchemaButtonContainer>
                  <DescriptionTooltip
                    description={`${T.translate(`${I18N_PREFIX}.ImportSchema.description`)}`}
                    placement="right"
                  />
                </SchemaButtonRow>
              )}
              {state.status === STATE_CONFIG_CONFIRMED && (
                <ConfirmedLoadingIconContainer>
                  <LoadingSVG />
                </ConfirmedLoadingIconContainer>
              )}
            </>
          )}
          {state.status === STATE_INITIAL_LOADING && (
            <InitialLoadingIconContainer>
              <LoadingSVG />
            </InitialLoadingIconContainer>
          )}
          {state.status === STATE_INITIAL_ERROR && (
            <StyledAlert severity="error">
              An error occurred when preparing to parse this file.
            </StyledAlert>
          )}
        </ContentContainer>
      </DialogContent>
      <DialogActions>
        <PrimaryTextButton onClick={onCancel}>Cancel</PrimaryTextButton>
        <PrimaryTextButton
          onClick={handleConfirm}
          disabled={state.status !== STATE_AVAILABLE}
          data-cy="parsing-config-confirm"
          data-testid="parsing-config-confirm"
        >
          Confirm
        </PrimaryTextButton>
      </DialogActions>
    </Dialog>
  );
}
