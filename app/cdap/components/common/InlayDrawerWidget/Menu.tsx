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
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export interface IActionsOptions {
  label: string;
  value: string;
  clickHandler: () => void;
}

const StyledContainer = styled.div`
  display: flex;
`;

const ActionButton = styled(Button)`
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 1.25px;
  text-align: center;
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

export default function MenuListComposition({
  dropdownOptions,
}: Record<string, IActionsOptions[]>) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <StyledContainer>
      <ActionButton
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        endIcon={<ArrowDropDownIcon />}
        data-testid="inlay-drawer-actions-menu"
      >
        {T.translate(`${PREFIX}.actionsButtonLabel`)}
      </ActionButton>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                  {dropdownOptions.map((eachOption) => {
                    const testId = getTestIdString(eachOption.label);
                    return (
                      <StyledMenuItem
                        onClick={(event) => {
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
    </StyledContainer>
  );
}
