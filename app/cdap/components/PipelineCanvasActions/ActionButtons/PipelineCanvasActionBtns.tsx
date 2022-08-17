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

import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import React from 'react';
import PipelineCommentsActionBtn from '../PipelineCommentsActionBtn';
import { ActionButton, ActionButtonGroup, CanvasButtonTooltip } from './styles';

interface IPipelineCanvasActionBtnsProps {
  setPipelineComments: () => void;
  pipelineComments: any;
  isDisabled: boolean;
  selectionBox: any;
  redoStates: any;
  redoActions: () => void;
  undoStates: any;
  undoActions: () => void;
  cleanUpGraph: () => void;
  fitToScreen: () => void;
  disableNodeClick: boolean;
  zoomOut: () => void;
  zoomIn: () => void;
}

export const PipelineCanvasActionBtns = ({
  setPipelineComments,
  pipelineComments,
  isDisabled,
  selectionBox,
  redoStates,
  redoActions,
  undoStates,
  undoActions,
  cleanUpGraph,
  fitToScreen,
  disableNodeClick,
  zoomOut,
  zoomIn,
}: IPipelineCanvasActionBtnsProps) => {
  return (
    <ActionButtonGroup>
      {!disableNodeClick && (
        <>
          <CanvasButtonTooltip title="Zoom In">
            <ActionButton
              onClick={zoomIn}
              data-cy="pipeline-zoom-in-control"
              data-testid="pipeline-zoom-in-control"
            >
              <ZoomInIcon />
            </ActionButton>
          </CanvasButtonTooltip>
          <CanvasButtonTooltip title="Zoom Out">
            <ActionButton
              onClick={zoomOut}
              data-cy="pipeline-zoom-out-control"
              data-testid="pipeline-zoom-out-control"
            >
              <ZoomOutIcon />
            </ActionButton>
          </CanvasButtonTooltip>
          <CanvasButtonTooltip title="Fit to screen">
            <ActionButton
              onClick={fitToScreen}
              data-cy="pipeline-fit-to-screen-control"
              data-testid="pipeline-fit-to-screen-control"
            >
              <AspectRatioIcon fontSize="small" />
            </ActionButton>
          </CanvasButtonTooltip>
        </>
      )}
      {!isDisabled && (
        <>
          <CanvasButtonTooltip title="Align">
            <ActionButton
              onClick={cleanUpGraph}
              data-cy="pipeline-clean-up-graph-control"
              data-testid="pipeline-clean-up-graph-control"
            >
              <DragIndicatorIcon />
            </ActionButton>
          </CanvasButtonTooltip>
          {/* Undo Nodes Action */}
          <CanvasButtonTooltip title="Undo (Ctrl/Cmd + Z)">
            <ActionButton
              onClick={undoActions}
              data-cy="pipeline-undo-action-btn"
              data-testid="pipeline-undo-action-btn"
              disabled={undoStates.length === 0}
            >
              <UndoIcon fontSize="small" />
            </ActionButton>
          </CanvasButtonTooltip>
          {/* Redo Nodes Action */}
          <CanvasButtonTooltip title="Redo (Ctrl/Cmd + Shift + Z)">
            <ActionButton
              onClick={redoActions}
              data-cy="pipeline-redo-action-btn"
              data-testid="pipeline-redo-action-btn"
              disabled={redoStates.length === 0}
            >
              <RedoIcon fontSize="small" />
            </ActionButton>
          </CanvasButtonTooltip>
          <CanvasButtonTooltip title="Move">
            <ActionButton
              active={!selectionBox.toggle}
              onClick={() => selectionBox.toggleSelectionMode()}
              data-cy="pipeline-move-mode-action-btn"
              data-testid="pipeline-move-mode-action-btn"
            >
              <OpenWithIcon fontSize="small" />
            </ActionButton>
          </CanvasButtonTooltip>
        </>
      )}
      <PipelineCommentsActionBtn
        tooltip="Show/Hide Pipeline Comments"
        comments={pipelineComments}
        onChange={setPipelineComments}
        disabled={isDisabled}
      ></PipelineCommentsActionBtn>
    </ActionButtonGroup>
  );
};
