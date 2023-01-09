/*
 * Copyright © 2018 Cask Data, Inc.
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

import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { getTestIdString } from 'components/common/InlayDrawerWidget/index';
import { PREFIX } from 'components/common/InlayDrawerWidget/InlayDrawerWidget.stories';
import T from 'i18n-react';
import React, { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export interface IActionsOptions {
  label: string;
  value: string;
  clickHandler: () => void;
}

const ActionButton = styled(Button)`
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 1.25px;
  text-align: center;
`;

export const FlexContainer = styled.div`
  display: flex;
`;

const StyledMenuItem = styled(MenuItem)`
  &.MuiMenuItem-root {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 0.5px;
    text-align: left;
  }
`;

export default function Menu({ dropdownOptions }: Record<string, IActionsOptions[]>) {
  const [open, setOpen] = useState(false);

  const anchorRef = useRef<HTMLButtonElement>(null);
  const prevOpen = useRef(open);

  const handleClose = (event: MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  // return focus to the button when we transitioned from !open -> open
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <FlexContainer>
      <ActionButton
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        endIcon={<ArrowDropDownIcon />}
        data-testid="inlay-drawer-actions-menu"
      >
        {T.translate(`${PREFIX}.buttonLabels.actions`)}
      </ActionButton>
      <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                  {dropdownOptions.map((eachOption) => {
                    const testId = getTestIdString(eachOption.label);
                    return (
                      <StyledMenuItem
                        onClick={(event: MouseEvent<EventTarget>) => {
                          eachOption.clickHandler();
                          handleClose(event);
                        }}
                        data-testid={`menu-item-${testId}`}
                        key={`menu-item-${testId}`}
                      >
                        {eachOption.label}
                      </StyledMenuItem>
                    );
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </FlexContainer>
  );
}
