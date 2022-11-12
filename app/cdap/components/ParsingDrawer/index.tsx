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

import { Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { createWorkspace } from 'components/Connections/Browser/GenericBrowser/apiHelpers';
import { ConnectionsContext } from 'components/Connections/ConnectionsContext';
import DataPrepStore from 'components/DataPrep/store';
import DrawerWidget from 'components/DrawerWidget';
import ParsingHeaderActionTemplate from 'components/ParsingDrawer/Components/ParsingHeaderActionTemplate';
import PositionedSnackbar from 'components/Snackbar';
import T from 'i18n-react';
import React, { useContext, useEffect, useState } from 'react';
import ParsingPopupBody from 'components/ParsingDrawer/Components/ParsingPopupBody';
import {
  defaultConnectionPayload,
  defaultErrorOnTransformations,
  defaultProperties,
} from 'components/ParsingDrawer/defaultValues';
import { useStyles } from 'components/ParsingDrawer/styles';
import {
  IParsingDrawer,
  IDefaultProperties,
  IDefaultErrorOnTransformations,
  IConnectionPayload,
  ISchemaValue,
} from 'components/ParsingDrawer/types';
import Alert from '@material-ui/lab/Alert';

export default function({ setLoading, updateDataTranformation }: IParsingDrawer) {
  const [drawerStatus, setDrawerStatus] = useState<boolean>(true);
  const [properties, setProperties] = useState<IDefaultProperties>(defaultProperties);
  const [schemaValue, setSchemaValue] = useState<ISchemaValue>(null);
  const { onWorkspaceCreate } = useContext(ConnectionsContext);
  const [errorOnTransformation, setErrorOnTransformation] = useState<
    IDefaultErrorOnTransformations
  >(defaultErrorOnTransformations);
  const [successUpload, setSuccessUpload] = useState({ open: false, message: '' });
  const [connectionPayload, setConnectionPayload] = useState<IConnectionPayload>(
    defaultConnectionPayload
  );
  const [failureSchema, setFailureSchemaStatus] = useState<boolean>(false);
  const [toaster, setToaster] = useState({ lastValue: null });

  const classes = useStyles();
  const { dataprep } = DataPrepStore.getState();

  useEffect(() => {
    if (failureSchema && toaster.lastValue !== 'fail') {
      setToaster({ lastValue: 'fail' });
    } else if (successUpload.open && toaster.lastValue !== 'success') {
      setToaster({ lastValue: 'success' });
    }
  }, [failureSchema, successUpload.open]);

  useEffect(() => {
    if (errorOnTransformation.open) {
      setFailureSchemaStatus(true);
      setSuccessUpload({ open: false, message: '' });
    }
    if (successUpload.open) {
      setFailureSchemaStatus(false);
    }
  }, [errorOnTransformation, successUpload.open]);

  useEffect(() => {
    setConnectionPayload({
      path: dataprep.insights.path,

      connection: dataprep.insights.name,
      sampleRequest: {
        properties: {
          ...properties,
          schema: schemaValue != null ? JSON.stringify(schemaValue) : null,
          _pluginName: null,
        },
        limit: 1000,
      },
    });
    setDrawerStatus(true);
  }, [dataprep, properties, schemaValue]);

  const createWorkspaceInternal = async (entity, parseConfig = {}) => {
    try {
      setLoading(true);
      const wid = await createWorkspace({
        entity,
        connection: dataprep.insights.name,
        properties: connectionPayload.sampleRequest.properties,
      });
      if (onWorkspaceCreate) {
        return onWorkspaceCreate(wid);
      }
      setDrawerStatus(false);
      updateDataTranformation(wid);
    } catch (err) {
      setErrorOnTransformation({
        open: true,
        message: T.translate(
          'features.WranglerNewUI.WranglerNewParsingDrawer.transformationErrorMessage1'
        ).toString(),
      });
      setLoading(false);
    }
  };

  const onConfirm = async (parseConfig) => {
    try {
      await createWorkspaceInternal(connectionPayload, parseConfig);
    } catch (e) {
      setLoading(false);
    }
  };

  const handleChange = (value: string | boolean, property: string) => {
    setProperties((prev) => ({
      ...prev,
      [property]: property === 'format' ? (value as string).toLowerCase() : value,
    }));
  };

  const componentToRender = (
    <DrawerWidget
      headingText={T.translate('features.WranglerNewUI.WranglerNewParsingDrawer.parsing')}
      openDrawer={drawerStatus}
      showDivider={true}
      headerActionTemplate={
        <ParsingHeaderActionTemplate
          setSuccessUpload={setSuccessUpload}
          handleSchemaUpload={(schema: unknown) => setSchemaValue(schema)}
          setErrorOnTransformation={setErrorOnTransformation}
        />
      }
      closeClickHandler={() => setDrawerStatus(false)}
    >
      <Box className={classes.bodyContainerStyles}>
        <ParsingPopupBody values={properties} changeEventListener={handleChange} />

        {toaster.lastValue &&
          (toaster.lastValue === 'fail' ? (
            <Alert severity="error">
              {T.translate(
                'features.WranglerNewUI.WranglerNewParsingDrawer.importSchemaErrorMessage'
              )}
            </Alert>
          ) : (
            <Alert severity="success">
              {T.translate(
                'features.WranglerNewUI.WranglerNewParsingDrawer.importSchemaSuccessMessage'
              )}
            </Alert>
          ))}

        <Box className={classes.bottomSectionStyles}>
          <Box className={classes.infoWrapperStyles} data-testid="parsing-panel-info-wrapper">
            <InfoOutlinedIcon data-testid="parsing-panel-info-icon" />
            <span className={classes.infoTextStyles} data-testid="parsing-panel-info-text">
              {T.translate('features.WranglerNewUI.WranglerNewParsingDrawer.parsingInfoText')}
            </span>
          </Box>

          <Button
            variant="contained"
            color="primary"
            classes={{ containedPrimary: classes.buttonStyles }}
            className={classes.applyButtonStyles}
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => onConfirm(connectionPayload)}
            data-testid="parsing-apply-button"
          >
            {T.translate('features.WranglerNewUI.WranglerNewParsingDrawer.apply').toString()}
          </Button>
        </Box>
      </Box>

      {errorOnTransformation.open && (
        <PositionedSnackbar
          handleCloseError={() =>
            setErrorOnTransformation({
              open: false,
              message: T.translate(
                'features.WranglerNewUI.WranglerNewParsingDrawer.transformationErrorMessage2'
              ).toString(),
            })
          }
          description={errorOnTransformation.message}
          isSuccess={false}
          snackbarAction="failure"
        />
      )}
      {successUpload.open && (
        <PositionedSnackbar
          handleCloseError={() =>
            setErrorOnTransformation({
              open: false,
              message: '',
            })
          }
          description={successUpload.message}
          isSuccess={true}
          snackbarAction="success"
        />
      )}
    </DrawerWidget>
  );

  return drawerStatus && componentToRender;
}
