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

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Divider, Box, Typography } from '@material-ui/core';
import { BatchIcon } from 'components/GridTable/IconStore/BatchIcon';
import { RealtimePipelineIcon } from 'components/GridTable/IconStore/RealtimePipelineIcon';
import { CrossIcon } from 'components/GridTable/IconStore/CrossIcon';
import DataPrepStore from 'components/DataPrep/store';
import { getCurrentNamespace } from 'services/NamespaceStore';
import getPipelineConfig from 'components/DataPrep/TopPanel/PipelineConfigHelper';
import styled from 'styled-components';
import T from 'i18n-react';

interface ICreatePipelineModalProps {
  setOpenPipeline: React.Dispatch<React.SetStateAction<boolean>>;
}

const CommonBatchPipelineBoxStyle = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10;
  border: 1px solid #dadce0;
  border-radius: 4px;
  margin-right: 20px;
  cursor: pointer;
  width: 250px;
  height: 125px;
`;

const SelectedBatchPipelineBoxStyle = styled(CommonBatchPipelineBoxStyle)`
  background: #4681f4;
  opacity: 0.1;
  box-shadow: 0px 2px 4px #4681f4;
`;

const HeaderWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTextStyle = styled(Typography)`
  color: #212121;
  font-size: 16px;
  margin-top: 20px;
`;

const HeaderTitle = styled(Typography)`
  color: #212121;
  font-size: 20px;
`;

const CloseIconStyle = styled(Typography)`
  cursor: pointer;
`;

const ModalActionGroup = styled(Box)`
  display: grid;
  justify-content: center;
  align-item: center;
  grid-template-columns: 50% 50%;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const ModalTitle = styled(DialogTitle)`
  padding-bottom: 5px;
`;

const MuiDialogPaper = styled(Dialog)`
  &.MuiPaper-root {
    width: 600px;
    padding-bottom: 24px;
  }
`;

const getWrapperComponent = (isSelected) => {
  return isSelected ? SelectedBatchPipelineBoxStyle : CommonBatchPipelineBoxStyle;
};

export default function({ setOpenPipeline }: ICreatePipelineModalProps) {
  const [open, setOpen] = useState(true);
  const [batchPipelineSelected, setBatchPipelineSelected] = useState(false);
  const [realTimePipelineSelected, setRealTimePipelineSelected] = useState(false);
  const BatchPipelineComponent = getWrapperComponent(batchPipelineSelected);
  const RealTimePipelineComponent = getWrapperComponent(realTimePipelineSelected);

  const handleClose = () => {
    setOpen(false);
    setOpenPipeline(false);
  };

  const generateLinks = () => {
    setBatchPipelineSelected(true);
    const state = DataPrepStore.getState().dataprep;
    const workspaceId = state.workspaceId;
    const namespace = getCurrentNamespace();

    getPipelineConfig().subscribe(
      (res) => {
        let realtimeUrl;

        if (!res.realtimeConfig) {
          realtimeUrl = null;
        } else {
          realtimeUrl = window.getHydratorUrl({
            stateName: 'hydrator.create',
            stateParams: {
              namespace,
              workspaceId,
              artifactType: 'cdap-data-streams',
            },
          });
        }

        const batchUrl = window.getHydratorUrl({
          stateName: 'hydrator.create',
          stateParams: {
            namespace,
            workspaceId,
            artifactType: 'cdap-data-pipeline',
          },
        });
        window.open(`${batchUrl}`, '_self');
      },
      (err) => {}
    );
  };

  return (
    <MuiDialogPaper
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <ModalTitle id="alert-dialog-title">
        <HeaderWrapper>
          <HeaderTitle component="span">
            {T.translate('features.WranglerNewUI.CreatePipeline.labels.title')}
          </HeaderTitle>
          <CloseIconStyle role="button" tabIndex={0} onClick={handleClose} component="span">
            {CrossIcon}
          </CloseIconStyle>
        </HeaderWrapper>
      </ModalTitle>
      <DialogContent>
        <Divider />
        <ModalTextStyle>
          {T.translate('features.WranglerNewUI.CreatePipeline.labels.subTitle')}
        </ModalTextStyle>
        <ModalActionGroup>
          <BatchPipelineComponent onClick={() => generateLinks()}>
            {BatchIcon}
            <ModalTextStyle>
              {T.translate('features.WranglerNewUI.CreatePipeline.labels.batchPipeline')}
            </ModalTextStyle>
          </BatchPipelineComponent>
          <RealTimePipelineComponent>
            {RealtimePipelineIcon}
            <ModalTextStyle>
              {T.translate('features.WranglerNewUI.CreatePipeline.labels.realTimePipeline')}
            </ModalTextStyle>
          </RealTimePipelineComponent>
        </ModalActionGroup>
      </DialogContent>
    </MuiDialogPaper>
  );
}
