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
import { sleep } from '../utils/time';

export interface ISectionWithLeftPanelProps {
  panel: JSX.Element;
  defaultWidth?: number;
  resizable?: boolean;
  collapsedWidth?: number;
  isInitiallyCollapsed?: boolean;
}

const DEFAULT_PANEL_WIDTH = 200;
const DEFAULT_PANEL_COLLAPSED_WIDTH = 64;
const DIVIDER_WIDTH = 8;
const DEFAULT_COLLAPSE_DURATION_IN_MS = 100;

const SectionWithLeftPanelWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  align-items: stretch;
  overflow: hidden;
  flex-wrap: nowrap;
`;

interface IPanelSectionsProps {
  disablePointer?: boolean;
}

const PanelWrapper = styled.div<IPanelSectionsProps>`
  width: ${DEFAULT_PANEL_WIDTH}px;
  height: 100%;
  ${({ disablePointer }) => (disablePointer ? 'pointerEvents: none; user-select: none;' : '')};
`;

interface IPanelDividerProps {
  isResizable?: boolean;
  defaultCollapsedWidth?: number;
  defaultWidth?: number;
}

const PanelDivider = styled.div<IPanelDividerProps>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${(props) =>
    Math.max(
      props.defaultCollapsedWidth || DEFAULT_PANEL_COLLAPSED_WIDTH,
      props.defaultWidth || DEFAULT_PANEL_WIDTH
    ) - DIVIDER_WIDTH}px;

  box-sizing: border-box;
  width: ${DIVIDER_WIDTH}px;
  padding-left: ${DIVIDER_WIDTH - 1}px;
  background: transparent;
  touch-action: none;

  ${({ isResizable }) =>
    isResizable
      ? `
    &::before {
      position: absolute;
      content: ' ';
      
      width: 3px;
      height: 22px;
      top: 50%;
      margin-top: -11px;
      left: 1.5px;
      background: rgb(128, 134, 139);
      border-radius: 1.5px;
    }

    &:hover, &:focus, &:active {
      &::before {
        background: var(--cm-sys-color-primary, #3367d6);
      }
      cursor: ew-resize;

      & > div {
        background: var(--cm-sys-color-primary, #3367d6);
        cursor: ew-resize;
      }
    }
  `
      : ''};
`;

const DividerLine = styled.div`
  width: 1px;
  height: 100%;
  background: var(--cm-sys-color-hairline, rgba(0, 0, 0, 0.12));
`;

const MainWrapper = styled.div<IPanelSectionsProps>`
  flex-grow: 1;
  ${({ disablePointer }) => (disablePointer ? 'pointer-events: none; user-select: none;' : '')}
`;

interface ILeftPanelController {
  isCollapsed(): boolean;
  collapse(): void;
  expand(): void;
}

const defaultLeftPanelController: ILeftPanelController = {
  isCollapsed() {
    return false;
  },
  collapse() {},
  expand() {},
};

const LeftPanelControllerContext = createContext<ILeftPanelController>(defaultLeftPanelController);

export default function SectionWithLeftPanel({
  panel,
  defaultWidth = DEFAULT_PANEL_WIDTH,
  resizable = false,
  collapsedWidth = DEFAULT_PANEL_COLLAPSED_WIDTH,
  isInitiallyCollapsed = false,
  children,
}: PropsWithChildren<ISectionWithLeftPanelProps>) {
  const [collapsed, setCollapsed] = useState<boolean>(isInitiallyCollapsed);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const panelWrapperRef = useRef<HTMLElement>(null);
  const dividerRef = useRef<HTMLElement>(null);

  function canResize() {
    return resizable && panelWrapperRef.current && dividerRef.current && !collapsed;
  }

  function handlePanelResize(event: React.MouseEvent<HTMLElement>): void {
    if (!canResize() || !isResizing) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const boundingRect = panelWrapperRef.current.getBoundingClientRect();
    const { width } = boundingRect;
    const diff = event.clientX - width;
    const newPanelWidth = Math.max(width + diff, collapsedWidth);
    resizePanelTo(newPanelWidth);
  }

  async function resizePanelTo(newWidth: number, durationInMs: number = 0): Promise<void> {
    if (!panelWrapperRef.current || !dividerRef.current) {
      return;
    }

    const oldPanelWrapperTransition = panelWrapperRef.current.style.transition;
    const oldDividerTransition = dividerRef.current.style.transition;

    if (durationInMs) {
      panelWrapperRef.current.style.transition = `width ${durationInMs / 1000}s linear`;
      dividerRef.current.style.transition = `left ${durationInMs / 1000}s linear`;
    }
    panelWrapperRef.current.style.width = `${newWidth}px`;
    dividerRef.current.style.left = `${newWidth - DIVIDER_WIDTH}px`;

    if (durationInMs) {
      await sleep(durationInMs);
      panelWrapperRef.current.style.transition = oldPanelWrapperTransition;
      dividerRef.current.style.transition = oldDividerTransition;
    }
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
    resizePanelTo(collapsedWidth, DEFAULT_COLLAPSE_DURATION_IN_MS);
  }

  function expand() {
    setCollapsed(false);
    resizePanelTo(defaultWidth, DEFAULT_COLLAPSE_DURATION_IN_MS);
  }

  function isCollapsed() {
    return collapsed;
  }

  const leftPanelController: ILeftPanelController = {
    collapse,
    expand,
    isCollapsed,
  };

  return (
    <LeftPanelControllerContext.Provider value={leftPanelController}>
      <SectionWithLeftPanelWrapper
        onMouseUp={isResizing ? unsetResizingState : undefined}
        onMouseMove={isResizing ? handlePanelResize : undefined}
      >
        <PanelWrapper ref={panelWrapperRef} disablePointer={isResizing}>
          {panel}
        </PanelWrapper>
        <PanelDivider
          onMouseDown={setResizingState}
          isResizable={canResize()}
          defaultCollapsedWidth={collapsedWidth}
          defaultWidth={defaultWidth}
          ref={dividerRef}
        >
          <DividerLine />
        </PanelDivider>
        <MainWrapper disablePointer={isResizing}>{children}</MainWrapper>
      </SectionWithLeftPanelWrapper>
    </LeftPanelControllerContext.Provider>
  );
}

export function useLeftPanelCollapseController() {
  return useContext(LeftPanelControllerContext);
}
