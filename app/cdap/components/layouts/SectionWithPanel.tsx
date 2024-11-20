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

import React, { PropsWithChildren, createContext, useContext, useRef, useState } from 'react';
import styled from 'styled-components';
import { sleep } from '../../utils/time';

export type PanelOpeningDirection = 'left' | 'top' | 'right' | 'bottom';

function isHorizontal(direction: PanelOpeningDirection): boolean {
  return ['left', 'right'].includes(direction);
}

function isPanelFirst(direction: PanelOpeningDirection): boolean {
  return ['left', 'top'].includes(direction);
}

export interface ISectionWithPanelProps {
  panel: JSX.Element;
  defaultSize?: number;
  resizable?: boolean;
  collapsedSize?: number;
  isInitiallyCollapsed?: boolean;
  opensFrom: PanelOpeningDirection;
  panelId: string;
}

const DEFAULT_PANEL_SIZE = 200;
const DEFAULT_PANEL_COLLAPSED_SIZE = 48;
const DIVIDER_SIZE = 8;
const DEFAULT_COLLAPSE_DURATION_IN_MS = 100;
const DIVIDER_HIGHLIGHT_COLOR = '#3367d6';

interface IDirectionalPanelProps {
  opensFrom: PanelOpeningDirection;
}

const SectionWithPanelWrapper = styled.div<IDirectionalPanelProps>`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: ${({ opensFrom }) => (isHorizontal(opensFrom) ? 'row' : 'column')};
  align-items: stretch;
  overflow: hidden;
  flex-wrap: nowrap;
`;

interface IPanelSectionsProps extends IDirectionalPanelProps {
  disablePointer?: boolean;
  defaultSize?: number;
}

const PanelWrapper = styled.div<IPanelSectionsProps>`
  overflow: hidden;
  ${({ opensFrom, defaultSize }) =>
    isHorizontal(opensFrom)
      ? `
    width: ${defaultSize || DEFAULT_PANEL_SIZE}px;
    height: 100%;
  `
      : `
    width: 100%;
    height: ${defaultSize || DEFAULT_PANEL_SIZE}px;
  `}

  ${({ disablePointer }) => (disablePointer ? 'pointerEvents: none; user-select: none;' : '')};
`;

interface IPanelDividerProps extends IDirectionalPanelProps {
  isResizable?: boolean;
  defaultCollapsedSize?: number;
  defaultSize?: number;
}

function getDividerRect(
  panelOpensFrom: PanelOpeningDirection,
  defaultCollapsedSize: number,
  defaultSize: number
): string {
  const dividerPosition =
    Math.max(
      defaultCollapsedSize || DEFAULT_PANEL_COLLAPSED_SIZE,
      defaultSize || DEFAULT_PANEL_SIZE
    ) - DIVIDER_SIZE;

  switch (panelOpensFrom) {
    case 'left':
      return `
        top: 0;
        bottom: 0;
        left: ${dividerPosition}px;
        width: ${DIVIDER_SIZE}px;
        padding-left: ${DIVIDER_SIZE - 1}px;
      `;
    case 'top':
      return `
        left: 0;
        right: 0;
        top: ${dividerPosition}px;
        height: ${DIVIDER_SIZE}px;
        padding-top: ${DIVIDER_SIZE - 1}px;
      `;
    case 'right':
      return `
        top: 0;
        bottom: 0;
        right: ${dividerPosition}px;
        width: ${DIVIDER_SIZE}px;
        padding-right: ${DIVIDER_SIZE - 1}px;
      `;
    case 'bottom':
      return `
        left: 0;
        right: 0;
        bottom: ${dividerPosition}px;
        height: ${DIVIDER_SIZE}px;
        padding-bottom: ${DIVIDER_SIZE - 1}px;
      `;
    default:
      return '';
  }
}

function getDividerResizeHandleRect(panelOpensFrom: PanelOpeningDirection): string {
  switch (panelOpensFrom) {
    case 'left':
      return `
        width: 3px;
        height: 22px;
        top: 50%;
        margin-top: -11px;
        left: 1.5px;
      `;
    case 'top':
      return `
        height: 3px;
        width: 22px;
        left: 50%;
        margin-left: -11px;
        top: 1.5px;
      `;
    case 'right':
      return `
        width: 3px;
        height: 22px;
        top: 50%;
        margin-top: -11px;
        right: 1.5px;
      `;
    case 'bottom':
      return `
        height: 3px;
        width: 22px;
        left: 50%;
        margin-left: -11px;
        bottom: 1.5px;
      `;
    default:
      return '';
  }
}

const PanelDivider = styled.div<IPanelDividerProps>`
  position: absolute;
  box-sizing: border-box;
  background: transparent;
  touch-action: none;

  ${(props) => getDividerRect(props.opensFrom, props.defaultCollapsedSize, props.defaultSize)}

  ${(props) =>
    props.isResizable
      ? `
    &::before {
      position: absolute;
      content: ' ';
      background: rgb(128, 134, 139);
      border-radius: 1.5px;
      ${getDividerResizeHandleRect(props.opensFrom)}
    }

    &:hover, &:focus, &:active {
      &::before {
        background: var(--cm-sys-color-primary, ${DIVIDER_HIGHLIGHT_COLOR});
      }
      cursor: ${isHorizontal(props.opensFrom) ? 'ew-resize' : 'ns-resize'};

      & > div {
        background: var(--cm-sys-color-primary, ${DIVIDER_HIGHLIGHT_COLOR});
        cursor: ${isHorizontal(props.opensFrom) ? 'ew-resize' : 'ns-resize'};
      }
    }
  `
      : ''};
`;

const DividerLine = styled.div<IDirectionalPanelProps>`
  ${({ opensFrom }) =>
    isHorizontal(opensFrom) ? 'width: 1px; height: 100%;' : 'height: 1px; width: 100%;'}

  background: var(--cm-sys-color-hairline, rgba(0, 0, 0, 0.12));
`;

const MainWrapper = styled.div<IPanelSectionsProps>`
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  ${({ disablePointer }) => (disablePointer ? 'pointer-events: none; user-select: none;' : '')}
`;

interface IPanelCollapseController {
  isCollapsed(): boolean;
  collapse(): void;
  expand(): void;
}

interface IPanelCollapseControllerContext {
  [panelId: string]: IPanelCollapseController;
}

const PanelCollapseControllerContext = createContext<IPanelCollapseControllerContext | null>(null);

function getUpdatedPanelSize(
  panelOpensFrom: PanelOpeningDirection,
  minPanelSize: number,
  panelWrapperEl: HTMLElement,
  resizingEvent: React.PointerEvent<HTMLElement>
): number {
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

  const boundingRect = panelWrapperEl.getBoundingClientRect();
  const { width, height, left, top, right, bottom } = boundingRect;

  let distFromEdge = 0;
  let currentPanelSize = 0;
  let currentResizingEdgePos = 0;

  switch (panelOpensFrom) {
    case 'left':
      distFromEdge = resizingEvent.clientX;
      currentPanelSize = width;
      currentResizingEdgePos = right;
      break;
    case 'top':
      distFromEdge = resizingEvent.clientY;
      currentPanelSize = height;
      currentResizingEdgePos = bottom;
      break;
    case 'right':
      distFromEdge = vw - resizingEvent.clientX;
      currentPanelSize = width;
      currentResizingEdgePos = vw - left;
      break;
    case 'bottom':
      distFromEdge = vh - resizingEvent.clientY;
      currentPanelSize = height;
      currentResizingEdgePos = vh - top;
      break;
    default:
      return 0;
  }

  const diff = distFromEdge - currentResizingEdgePos;
  return Math.max(currentPanelSize + diff, minPanelSize);
}

export default function SectionWithPanel({
  panel,
  opensFrom,
  defaultSize = DEFAULT_PANEL_SIZE,
  resizable = false,
  collapsedSize = DEFAULT_PANEL_COLLAPSED_SIZE,
  isInitiallyCollapsed = false,
  children,
  panelId,
}: PropsWithChildren<ISectionWithPanelProps>) {
  const [collapsed, setCollapsed] = useState<boolean>(isInitiallyCollapsed);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const panelWrapperRef = useRef<HTMLElement>(null);
  const dividerRef = useRef<HTMLElement>(null);
  const currentDividerPositionRef = useRef<number>(0);

  function canResize() {
    return resizable && panelWrapperRef.current && dividerRef.current && !collapsed;
  }

  function handlePanelResize(event: React.PointerEvent<HTMLElement>): void {
    if (!canResize() || !isResizing) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const newPanelSize = getUpdatedPanelSize(
      opensFrom,
      collapsedSize,
      panelWrapperRef.current,
      event
    );
    resizePanelTo(opensFrom, newPanelSize);
  }

  async function resizePanelTo(
    opensFrom: PanelOpeningDirection,
    newSize: number,
    durationInMs: number = 0
  ): Promise<void> {
    if (!panelWrapperRef.current || !dividerRef.current) {
      return;
    }

    const oldPanelWrapperTransition = panelWrapperRef.current.style.transition;
    const oldDividerTransition = dividerRef.current.style.transition;

    const transitioningDimension = isHorizontal(opensFrom) ? 'width' : 'height';

    if (durationInMs) {
      panelWrapperRef.current.style.transition = `${transitioningDimension} ${durationInMs /
        1000}s linear`;
      dividerRef.current.style.transition = `${opensFrom} ${durationInMs / 1000}s linear`;
    }
    panelWrapperRef.current.style[transitioningDimension] = `${newSize}px`;
    dividerRef.current.style[opensFrom] = `${newSize - DIVIDER_SIZE}px`;

    if (durationInMs) {
      await sleep(durationInMs);
      panelWrapperRef.current.style.transition = oldPanelWrapperTransition;
      dividerRef.current.style.transition = oldDividerTransition;
    }

    currentDividerPositionRef.current = newSize - DIVIDER_SIZE;
  }

  function setResizingState() {
    if (!canResize()) {
      return;
    }
    setIsResizing(true);
  }

  function unsetResizingState() {
    if (!canResize()) {
      return;
    }
    setIsResizing(false);
  }

  function collapse() {
    setCollapsed(true);
    resizePanelTo(opensFrom, collapsedSize, DEFAULT_COLLAPSE_DURATION_IN_MS);
  }

  function expand() {
    setCollapsed(false);
    resizePanelTo(opensFrom, defaultSize, DEFAULT_COLLAPSE_DURATION_IN_MS);
  }

  function isCollapsed() {
    return collapsed;
  }

  const panelCollapseController: IPanelCollapseController = {
    collapse,
    expand,
    isCollapsed,
  };

  function renderPanel() {
    return (
      <PanelWrapper
        ref={panelWrapperRef}
        disablePointer={isResizing}
        opensFrom={opensFrom}
        defaultSize={collapsed ? collapsedSize : defaultSize}
      >
        {panel}
      </PanelWrapper>
    );
  }

  function renderDivider() {
    return (
      <PanelDivider
        onMouseDown={setResizingState}
        isResizable={canResize()}
        defaultCollapsedSize={collapsedSize}
        defaultSize={collapsed ? collapsedSize : defaultSize}
        opensFrom={opensFrom}
        ref={dividerRef}
        aria-orientation={isHorizontal(opensFrom) ? 'horizontal' : 'vertical'}
        aria-valuenow={currentDividerPositionRef.current}
        aria-valuemin={collapsedSize}
      >
        <DividerLine opensFrom={opensFrom} />
      </PanelDivider>
    );
  }

  function renderMain() {
    return (
      <MainWrapper disablePointer={isResizing} opensFrom={opensFrom}>
        {children}
      </MainWrapper>
    );
  }

  function renderPanelAndMainInOrder() {
    if (isPanelFirst(opensFrom)) {
      return (
        <>
          {renderPanel()}
          {renderDivider()}
          {renderMain()}
        </>
      );
    }

    return (
      <>
        {renderMain()}
        {renderDivider()}
        {renderPanel()}
      </>
    );
  }

  const parentContextValue = useContext(PanelCollapseControllerContext);
  const panelCollapseControllerValue =
    parentContextValue === null
      ? {
          [panelId]: panelCollapseController,
        }
      : {
          ...parentContextValue,
          [panelId]: panelCollapseController,
        };

  return (
    <PanelCollapseControllerContext.Provider value={panelCollapseControllerValue}>
      <SectionWithPanelWrapper
        onMouseUp={isResizing ? unsetResizingState : undefined}
        onMouseMove={isResizing ? handlePanelResize : undefined}
        opensFrom={opensFrom}
      >
        {renderPanelAndMainInOrder()}
      </SectionWithPanelWrapper>
    </PanelCollapseControllerContext.Provider>
  );
}

export function usePanelCollapseController(panelId: string): IPanelCollapseController {
  const controllersObject = useContext(PanelCollapseControllerContext);
  if (controllersObject === null) {
    throw new Error(
      'usePanelCollapseController hook can only be used in components rendered within a SectionWithPanel.'
    );
  }

  if (!controllersObject[panelId]) {
    throw new Error(`Panel with panelId = ${panelId} was not found in the current context.`);
  }

  return controllersObject[panelId];
}
