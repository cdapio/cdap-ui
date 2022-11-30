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

import { Box, ClickAwayListener, Grow, Popper } from '@material-ui/core';
import MyDataPrepApi from 'api/dataprep';
import OngoingWorkSpaceListMenu from 'components/OpenWorkspacesList/components/OngoingWorkspaceListMenu/OngoingWorkspaceListMenu';
import {
  DividerContainer,
  OpenWorkspaceContainer,
  StyledMenuItem,
  StyledMenuList,
  StyledPaper,
  ViewAllTypography,
  WorkspaceOpenTypography,
} from 'components/OpenWorkspacesList/StyledComponents';
import T from 'i18n-react';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getCurrentNamespace } from 'services/NamespaceStore';

const PREFIX = 'features.WranglerNewUI.OpenWorkspacesList';

const Divider = (
  <svg width="2" height="21" viewBox="0 0 2 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.511963 0.501953V20.502" stroke="#DADCE0" strokeLinecap="round" />
  </svg>
);

export interface IWorkspaceList {
  workspaceId: string;
  workspaceName: string;
}

export default function() {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [workspaceList, setWorkspaceList] = useState<IWorkspaceList[]>([]);
  const [workspaceCount, setWorkspaceCount] = useState<number>();
  const maxWorkspaceListCount = 4;
  const history = useHistory();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const getWorkspaceList = () => {
    MyDataPrepApi.getWorkspaceList({
      context: 'default',
    }).subscribe((response) => {
      setWorkspaceCount(response.count);
      let updatedValues = [];
      updatedValues = response?.values ?? [];
      updatedValues.sort((a, b) => b.createdTimeMillis - a.createdTimeMillis);
      updatedValues.forEach((workspace) => {
        setWorkspaceList((prev) => [
          ...prev,
          {
            workspaceName: workspace.workspaceName,
            workspaceId: workspace.workspaceId,
          },
        ]);
      });
    });
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    currentWorkspaceId: string
  ) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    history.push(`/ns/${getCurrentNamespace()}/wrangler-grid/${currentWorkspaceId}`);
    setOpen(false);
  };

  const onViewAllClick = () => {
    // TODO: Navigate to View All Ongoing Workspace List Page
  };

  const handleCloseOnAway = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    getWorkspaceList();
  }, []);

  return (
    <OpenWorkspaceContainer>
      <DividerContainer>{Divider}</DividerContainer>
      <Box>
        <WorkspaceOpenTypography
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          role="button"
          data-testid="open-workspaces-list-label"
        >
          {T.translate(`${PREFIX}.workspacesOpen`, { workspaceCount })}
        </WorkspaceOpenTypography>

        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <StyledPaper data-testid="open-workspaces-list">
                <ClickAwayListener onClickAway={handleCloseOnAway}>
                  <StyledMenuList autoFocusItem={open} id="menu-list-grow">
                    {workspaceList.map((workspace, index) => {
                      if (index < maxWorkspaceListCount) {
                        return (
                          <OngoingWorkSpaceListMenu
                            workspace={workspace}
                            index={index}
                            handleMenuClick={handleMenuClick}
                          />
                        );
                      }
                    })}
                    <StyledMenuItem
                      onClick={onViewAllClick}
                      role="button"
                      data-testid="view-all-ongoing-workspaces"
                    >
                      <ViewAllTypography>
                        {T.translate(`${PREFIX}.viewAllOngoingWorkspaces`)}
                      </ViewAllTypography>
                    </StyledMenuItem>
                  </StyledMenuList>
                </ClickAwayListener>
              </StyledPaper>
            </Grow>
          )}
        </Popper>
      </Box>
    </OpenWorkspaceContainer>
  );
}
