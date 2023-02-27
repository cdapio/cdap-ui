/*
 * Copyright © 2023 Cask Data, Inc.
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

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import {
  Container,
  Divider,
  IconWrapper,
  Label,
  LeftContainer,
  MenuButton,
  StyledHeader,
  StyledIconButton,
  StyledMenu,
  StyledMenuItem,
} from 'components/WranglerV2/InlayDrawerWidget/styles';
import T from 'i18n-react';
import React, { PropsWithChildren } from 'react';

export interface IMenuItem {
  clickHandler: () => void;
  label: string;
  value: string;
}

interface IRecipeStepWidgetProps {
  actionsOptions: IMenuItem[];
  headingText: string;
  onClose: () => void;
  position: 'left' | 'right';
  disableActionsButton?: boolean;
  showDivider?: boolean;
}

const getContainerComponent = (position: 'left' | 'right') => {
  if (position === 'left') {
    return LeftContainer;
  }
  return Container;
};

/**
 * this function accepts a space-seprated string and coversts it to a lowercase hyphenated string
 * @param label - any space-separated string
 * @returns - a lowercase hyphenated string
 */
export const getTestIdString = (label: string) =>
  label
    .trim()
    .split(' ')
    .join('-')
    .toLowerCase();

export const PREFIX = 'features.WranglerNewUI.Drawer';

export default function InlayDrawerWidget({
  actionsOptions,
  children,
  disableActionsButton,
  headingText,
  onClose,
  position = 'right',
  showDivider,
}: PropsWithChildren<IRecipeStepWidgetProps>) {
  const PanelContainer = getContainerComponent(position);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <PanelContainer data-testid="inlay-drawer-widget-parent" role="presentation">
      <StyledHeader>
        <Label data-testid="drawer-widget-heading">{headingText}</Label>
        <IconWrapper>
          {Boolean(actionsOptions.length) && (
            <div>
              <MenuButton
                aria-controls="inlay-drawer-widget-menu"
                aria-haspopup="true"
                data-testid="inlay-drawer-actions-menu"
                disabled={disableActionsButton}
                endIcon={<ArrowDropDownIcon />}
                onClick={handleClick}
              >
                {T.translate(`${PREFIX}.buttonLabels.actions`)}
              </MenuButton>
              <StyledMenu
                anchorEl={anchorEl}
                anchorOrigin={{ horizontal: 20, vertical: 32 }}
                getContentAnchorEl={null}
                id="inlay-drawer-widget-menu"
                keepMounted
                onClose={handleClose}
                open={Boolean(anchorEl)}
                transformOrigin={{ horizontal: 'center', vertical: 'top' }}
              >
                {actionsOptions.map((eachOption) => {
                  const testId = getTestIdString(eachOption.label);
                  return (
                    <StyledMenuItem
                      data-testid={`menu-item-${testId}`}
                      key={`menu-item-${testId}`}
                      onClick={() => {
                        eachOption.clickHandler();
                        handleClose();
                      }}
                    >
                      {eachOption.label}
                    </StyledMenuItem>
                  );
                })}
              </StyledMenu>
            </div>
          )}
          {showDivider && <Divider />}
          <StyledIconButton
            aria-label="inlay drawer widget close icon"
            data-testid="inlay-drawer-widget-close-icon"
            onClick={onClose}
          >
            <CloseRoundedIcon color="action" />
          </StyledIconButton>
        </IconWrapper>
      </StyledHeader>
      {children}
    </PanelContainer>
  );
}
