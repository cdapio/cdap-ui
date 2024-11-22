/*
 * Copyright © 2024 Cask Data, Inc.
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
import styled from 'styled-components';
import { useLocation } from 'react-router';
import SectionWithPanel, { usePanelCollapseController } from '../Layouts/SectionWithPanel';
import { useHideFooterInPage } from 'components/FooterContext';
import { IconButton } from '@material-ui/core';
import KeyboardCapslockIcon from '@material-ui/icons/KeyboardCapslock';

const Paper = styled.div`
  background: white;
`;

const PanelHeader = styled.div`
  height: 48px;
  border-bottom: 1px rgba(0, 0, 0, 0.12) solid;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
`;

const Rotated = styled.div`
  transform: rotate(${({ angle }) => angle}deg);
  transition: transform 0.1s linear;
  flex-grow: 1;
`;

const PanelName = styled.span`
  flex-shrink: 1;
  min-width: 0;
  width: 100px;
`;

function GenericPanelComp({ direction }) {
  const panelCollapseController = usePanelCollapseController();

  function getCollapseAngle() {
    if (direction === 'Left') {
      return 270;
    } else if (direction === 'Top') {
      return 0;
    } else if (direction === 'Right') {
      return 90;
    } else if (direction === 'Bottom') {
      return 180;
    } else {
      return 0;
    }
  }

  function renderCollapseIcon() {
    return (
      <Rotated angle={getCollapseAngle()}>
        <KeyboardCapslockIcon />
      </Rotated>
    );
  }

  function renderExpandIcon() {
    return (
      <Rotated angle={(getCollapseAngle() + 180) % 360}>
        <KeyboardCapslockIcon />
      </Rotated>
    );
  }

  return (
    <Paper>
      <PanelHeader>
        {direction !== 'Right' && <PanelName>{direction} panel</PanelName>}
        <IconButton
          onClick={
            panelCollapseController.isCollapsed()
              ? panelCollapseController.expand
              : panelCollapseController.collapse
          }
        >
          {panelCollapseController.isCollapsed() ? renderExpandIcon() : renderCollapseIcon()}
        </IconButton>
        {direction === 'Right' && <PanelName>{direction} panel</PanelName>}
      </PanelHeader>
    </Paper>
  );
}

export default function PipelineDetailsView() {
  const location = useLocation();
  useHideFooterInPage();

  return (
    <SectionWithPanel opensFrom="left" panel={<GenericPanelComp direction="Left" />} resizable>
      <SectionWithPanel opensFrom="right" panel={<GenericPanelComp direction="Right" />} resizable>
        <SectionWithPanel opensFrom="top" panel={<GenericPanelComp direction="Top" />} resizable>
          <SectionWithPanel
            opensFrom="bottom"
            panel={<GenericPanelComp direction="Bottom" />}
            resizable
          >
            Main
          </SectionWithPanel>
        </SectionWithPanel>
      </SectionWithPanel>
    </SectionWithPanel>
  );
}
