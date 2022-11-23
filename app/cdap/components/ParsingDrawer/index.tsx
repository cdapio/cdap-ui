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

import { Button, Container, Drawer, IconButton, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { createWorkspace } from 'components/Connections/Browser/GenericBrowser/apiHelpers';
import { ConnectionsContext } from 'components/Connections/ConnectionsContext';
import DataPrepStore from 'components/DataPrep/store';
import ParsingPopupBody from 'components/ParsingDrawer/Components/ParsingPopupBody';
import { useStyles } from 'components/ParsingDrawer/styles';
import {
  IConnectionPayload,
  IDefaultErrorOnTransformations,
  IDefaultProperties,
  IParsingDrawer,
} from 'components/ParsingDrawer/types';
import PositionedSnackbar from 'components/SnackbarComponent/index';
import T from 'i18n-react';
import React, { MouseEvent, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

const ImportIcon = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19 13V18C19 18.55 18.55 19 18 19H6C5.45 19 5 18.55 5 18V13C5 12.45 4.55 12 4 12C3.45 12 3 12.45 3 13V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13C21 12.45 20.55 12 20 12C19.45 12 19 12.45 19 13ZM13 12.67L14.88 10.79C15.27 10.4 15.9 10.4 16.29 10.79C16.68 11.18 16.68 11.81 16.29 12.2L12.7 15.79C12.31 16.18 11.68 16.18 11.29 15.79L7.7 12.2C7.31 11.81 7.31 11.18 7.7 10.79C8.09 10.4 8.72 10.4 9.11 10.79L11 12.67V4C11 3.45 11.45 3 12 3C12.55 3 13 3.45 13 4V12.67Z"
        fill="#757575"
      />
    </svg>
  );
};

const UnderLineSVG = () => {
  return (
    <svg width="67" height="3" viewBox="0 0 67 3" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0.530273H50L53 2.5318H3L0 0.530273Z" fill="#2196F3" />
      <path d="M54 0.530273H63.5L66.5 2.5318H57L54 0.530273Z" fill="#2196F3" />
    </svg>
  );
};

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

const DrawerHeader = styled.header`
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 30px;
  padding-right: 20px;
  margin-bottom: 5px;
`;

const CloseIcon = styled(CloseRoundedIcon)`
  font-size: 30px;
  cursor: pointer;
  margin: 5px;
`;

const StyledDrawer = styled(Drawer)`
  & .MuiDrawer-paper {
    top: 46px;
    height: calc(100vh - 47px);
    width: 500px;
  }
`;

const StyledIconButton = styled(IconButton)`
  padding: 0px;
`;

const ParsingDrawerContainer = styled(Container)`
  width: 460px;
  height: 100%;
  overflow: hidden;
  padding-left: 30px;
  border-left: 1px solid #e0e0e0;
`;

const TextIconWrapper = styled(Box)`
  display: flex;
  alignitems: center;
`;

const ParsingPopUpBodyContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: calc(100% - 90px);
  padding: 0px 30px;
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

const DrawerHeaderContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const DrawerHeadingWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const DrawerHeading = styled(Typography)`
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 150%;
  letter-spacing: 0.15;
  color: #000000;
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

  return (
    <ParsingDrawerContainer role="presentation">
      <StyledDrawer open={drawerStatus} anchor="right">
        <DrawerHeader>
          <TextIconWrapper>
            <DrawerHeaderContainer>
              <DrawerHeadingWrapper>
                <DrawerHeading component="span">Parsing</DrawerHeading>
                <UnderLineSVG />
              </DrawerHeadingWrapper>
            </DrawerHeaderContainer>
          </TextIconWrapper>

          <TextIconWrapper>
            <StyledIconButton
              aria-label="close-icon"
              data-testid="drawer-widget-close-round-icon"
              onClick={closeParsingDrawer}
            >
              <CloseIcon color="action" />
            </StyledIconButton>
          </TextIconWrapper>
        </DrawerHeader>
        <ParsingPopUpBodyContainer>
          <ParsingPopupBody values={properties} changeEventListener={handleChange} />

          <ParsingPopUpBottomSection>
            <TextIconWrapper>
              <InfoOutlinedIcon />
              <Label>{T.translate('features.WranglerNewUI.ParsingDrawer.parsingInfoText')}</Label>
            </TextIconWrapper>

            <Button
              variant="contained"
              color="primary"
              onClick={(event: MouseEvent<HTMLButtonElement>) => onConfirm(connectionPayload)}
              data-testid="parsing-apply-button"
            >
              {T.translate('features.WranglerNewUI.ParsingDrawer.apply')}
            </Button>
          </ParsingPopUpBottomSection>
        </ParsingPopUpBodyContainer>
      </StyledDrawer>

      {errorOnTransformation.open && (
        <PositionedSnackbar
          handleCloseError={() => {}}
          messageToDisplay={errorOnTransformation.message}
        />
      )}
    </ParsingDrawerContainer>
  );
}
