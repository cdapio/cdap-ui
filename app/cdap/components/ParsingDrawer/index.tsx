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

import { Button, Container, Typography, IconButton } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { createWorkspace } from 'components/Connections/Browser/GenericBrowser/apiHelpers';
import { ConnectionsContext } from 'components/Connections/ConnectionsContext';
import DataPrepStore from 'components/DataPrep/store';
import ParsingPopupBody from 'components/ParsingDrawer/Components/ParsingPopupBody';
import {
  IConnectionPayload,
  IDefaultErrorOnTransformations,
  IDefaultProperties,
  IParsingDrawer,
} from 'components/ParsingDrawer/types';
import PositionedSnackbar from 'components/SnackbarComponent/index';
import T from 'i18n-react';
import React, { useContext, useEffect, useState } from 'react';
import { MouseEvent } from 'react';
import DrawerWidgetHeading from 'components/DrawerWidget/DrawerWidgetHeader';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import styled from 'styled-components';

const CloseIcon = styled(CloseRoundedIcon)`
  font-size: 30px;
  cursor: pointer;
  margin: 5px;
`;

const CustomizedIconButton = styled(IconButton)`
  padding: 0px;
`;

const Divider = styled.div`
  width: 1px;
  height: 28px;
  background-color: #dadce0;
  margin: 5px 15px;
`;

const DrawerHeader = styled.header`
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0px;
  padding-right: 0px;
  margin-bottom: 5px;
`;

const Label = styled(Typography)`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: 0.15px;
  color: #5f6368; /* Mui Colors not available */
  opacity: 0.8;
  margin-left: 10px;
`;

const ParsingDrawerContainer = styled(Container)`
  width: 460px;
  height: 100%;
  overflow: hidden;
  padding-left: 30px;
  border-left: 1px solid #e0e0e0;
`;

const ParsingPopUpBodyContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: calc(100% - 120px);
`;

const ParsingPopUpBottomSection = styled(Box)`
& .MuiButton-containedPrimary {
  '&:hover': {
    background-color: #3994FF;
  },
}
& .MuiButton-root {
  width: 162px;
  height: 36px;
  background: #3994FF;
  box-shadow: 0px 2px 4px rgba(70, 129, 244, 0.15);
  border-radius: 4px;
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  color: #FFFFFF;
  align-self: flex-end;
  margin-top: 30px;
  text-transform: none;
  float: right;
}
& .MuiSvgIcon-root {
  margin-top: 2px;
}
`;

const TextIconWrapper = styled(Box)`
  display: flex;
  alignitems: center;
`;

export default function({
  setLoading,
  updateDataTranformation,
  closeParsingDrawer,
}: IParsingDrawer) {
  const defaultConnectionPayload = {
    path: '',
    connection: '',
    sampleRequest: {
      properties: {
        format: '',
        fileEncoding: '',
        skipHeader: false,
        enableQuotedValues: false,
        schema: null,
        _pluginName: null,
      },
      limit: 1000,
    },
  };

  const defaultErrorOnTransformations = {
    open: false,
    message: '',
  };

  const defaultProperties = {
    format: 'csv',
    fileEncoding: 'UTF-8',
    enableQuotedValues: false,
    skipHeader: false,
  };

  const [drawerStatus, setDrawerStatus] = useState<boolean>(true);
  const [properties, setProperties] = useState<IDefaultProperties>(defaultProperties);
  const { onWorkspaceCreate } = useContext(ConnectionsContext);
  const [errorOnTransformation, setErrorOnTransformation] = useState<
    IDefaultErrorOnTransformations
  >(defaultErrorOnTransformations);
  const [connectionPayload, setConnectionPayload] = useState<IConnectionPayload>(
    defaultConnectionPayload
  );
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
    setProperties((prev) => ({
      ...prev,
      [property]: property === 'format' ? (value as string).toLowerCase() : value,
    }));
  };

  const componentToRender = (
    <ParsingDrawerContainer role="presentation">
      <DrawerHeader>
        <TextIconWrapper>
          <DrawerWidgetHeading
            headingText={T.translate('features.WranglerNewUI.WranglerNewParsingDrawer.parsing')}
          />
        </TextIconWrapper>

        <TextIconWrapper>
          <Divider />
          <CustomizedIconButton
            aria-label="close-icon"
            data-testid="drawer-widget-close-round-icon"
            onClick={closeParsingDrawer}
          >
            <CloseIcon color="action" />
          </CustomizedIconButton>
        </TextIconWrapper>
      </DrawerHeader>
      <ParsingPopUpBodyContainer>
        <ParsingPopupBody values={properties} changeEventListener={handleChange} />
        <ParsingPopUpBottomSection>
          <TextIconWrapper>
            <InfoOutlinedIcon />
            <Label>
              {T.translate('features.WranglerNewUI.WranglerNewParsingDrawer.parsingInfoText')}
            </Label>
          </TextIconWrapper>
          <Button
            variant="contained"
            color="primary"
            onClick={(event: MouseEvent<HTMLButtonElement>) => onConfirm(connectionPayload)}
            data-testid="parsing-apply-button"
          >
            {T.translate('features.WranglerNewUI.WranglerNewParsingDrawer.apply')}
          </Button>
        </ParsingPopUpBottomSection>
      </ParsingPopUpBodyContainer>

      {errorOnTransformation.open && (
        <PositionedSnackbar
          handleCloseError={() => {}}
          messageToDisplay={errorOnTransformation.message}
        />
      )}
    </ParsingDrawerContainer>
  );

  return drawerStatus && componentToRender;
}
