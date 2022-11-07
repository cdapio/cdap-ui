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

import { Button, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { createWorkspace } from 'components/Connections/Browser/GenericBrowser/apiHelpers';
import { ConnectionsContext } from 'components/Connections/ConnectionsContext';
import DataPrepStore from 'components/DataPrep/store';
import DrawerWidget from 'components/DrawerWidget';
import ParsingPopupBody from 'components/ParsingDrawer/Components/ParsingPopupBody';
import {
  defaultConnectionPayload,
  defaultErrorOnTransformations,
  defaultProperties,
} from 'components/ParsingDrawer/defaultValues';
import { useStyles } from 'components/ParsingDrawer/styles';
import {
  IConnectionPayload,
  IDefaultErrorOnTransformations,
  IDefaultProperties,
  IParsingDrawer,
} from 'components/ParsingDrawer/types';
import PositionedSnackbar from 'components/SnackbarComponent/index';
import T from 'i18n-react';
import React, { useContext, useEffect, useState } from 'react';

export default function({ setLoading, updateDataTranformation }: IParsingDrawer) {
  const [drawerStatus, setDrawerStatus] = useState<boolean>(true);
  const [properties, setProperties] = useState<IDefaultProperties>(defaultProperties);
  const { onWorkspaceCreate } = useContext(ConnectionsContext);
  const [errorOnTransformation, setErrorOnTransformation] = useState<
    IDefaultErrorOnTransformations
  >(defaultErrorOnTransformations);
  const [connectionPayload, setConnectionPayload] = useState<IConnectionPayload>(
    defaultConnectionPayload
  );
  const classes = useStyles();
  const { dataprep } = DataPrepStore.getState();

  useEffect(() => {
    setConnectionPayload({
      path: dataprep.insights.path,
      connection: dataprep.insights.name,
      sampleRequest: {
        properties: {
          ...properties,
          schema: null,
          _pluginName: null,
        },
        limit: 1000,
      },
    });
    setDrawerStatus(true);
  }, [dataprep, properties]);

  const createWorkspaceInternal = async (entity: IConnectionPayload, parseConfig: {}) => {
    let snackbar: IDefaultErrorOnTransformations = {};
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
      snackbar = {
        open: true,
        message: 'success',
      };
    } catch (err) {
      snackbar = {
        open: true,
        message: 'Failed to retrive sample',
      };
    }
    setErrorOnTransformation(snackbar);
    setLoading(false);
  };

  const onConfirm = async (parseConfig) => {
    try {
      await createWorkspaceInternal(connectionPayload, parseConfig);
    } catch (e) {
      setLoading(false);
    }
  };

  const handleChange = (value: string | boolean, property: string) => {
    value &&
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
      closeClickHandler={() => setDrawerStatus(false)}
    >
      <Box className={classes.bodyContainerStyles}>
        <ParsingPopupBody values={properties} changeEventListener={handleChange} />

        <Box className={classes.bottomSectionStyles}>
          <Box className={classes.infoWrapperStyles}>
            <InfoOutlinedIcon />
            <Typography className={classes.infoTextStyles}>
              {T.translate('features.WranglerNewUI.WranglerNewParsingDrawer.parsingInfoText')}
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            classes={{ containedPrimary: classes.buttonStyles }}
            className={classes.applyButtonStyles}
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => onConfirm(connectionPayload)}
            data-testid="parsing-apply-button"
          >
            {T.translate('features.WranglerNewUI.WranglerNewParsingDrawer.apply')}
          </Button>
        </Box>
      </Box>

      {errorOnTransformation.open && (
        <PositionedSnackbar
          handleCloseError={() => {}}
          messageToDisplay={errorOnTransformation.message}
        />
      )}
    </DrawerWidget>
  );

  return drawerStatus && componentToRender;
}
