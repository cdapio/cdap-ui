/*
 *  Copyright © 2022 Cask Data, Inc.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *  use this file except in compliance with the License. You may obtain a copy of
 *  the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  License for the specific language governing permissions and limitations under
 *  the License.
 */

import { IconButton, SvgIcon } from '@material-ui/core';
import { default as React, useState } from 'react';
import NestedMenu from 'components/WranglerGrid/NestedMenu';
import { ITransformationToolBarProps } from 'components/WranglerGrid/TransformationToolbar/types';
import { Divider, LongDivider } from 'components/WranglerGrid/TransformationToolbar/iconStore';
import { nestedMenuOptions } from 'components/WranglerGrid/TransformationToolbar/utils';
import FunctionToggle from 'components/WranglerGrid/FunctionNameToggle';
import ExpandButton from 'components/WranglerV2/ExpandButton';
import { NormalFont } from 'components/WranglerV2/Label';
import {
  LastDividerBox,
  DividerBox,
  FunctionBoxWrapper,
  SearchBoxWrapper,
  ExpandAndFunctionToggleContainer,
} from 'components/WranglerV2/BoxContainer';
import { ToolBarIconWrapper, ToolBarInnerWrapper } from 'components/WranglerV2/IconContainer';
import CustomTooltip from 'components/ConnectionList/Components/CustomTooltip';
import styled, { css } from 'styled-components';
import { IMenuItem } from 'components/WranglerGrid/NestedMenu/MenuItemComponent';

const StyledSvgIcon = styled(SvgIcon)`
  font-size: 28px;
  ${(props) =>
    props.flipped &&
    css`
      -webkit-transform: scaleX(-1);
      transform: scaleX(-1);
    `}
`;

const StyledIconButton = styled(IconButton)`
  &.MuiButtonBase-root.Mui-disabled {
    opacity: 0.5;
  }
`;

export default function({
  columnType,
  submitMenuOption,
  setShowBreadCrumb,
  showBreadCrumb,
  disableToolbarIcon,
}: ITransformationToolBarProps) {
  const [showName, setShowName] = useState<boolean>(false);
  const [anchorElement, setAnchorElement] = useState<HTMLElement[]>(null);
  const [selectedMenuOptions, setSelectedMenuOptions] = useState<IMenuItem[]>([]);

  const toggleMenu = () => {
    setSelectedMenuOptions([]);
    setAnchorElement(null);
  };

  return (
    <ToolBarIconWrapper data-testid="transformations-toolbar-container" showName={showName}>
      <ToolBarInnerWrapper data-testid="nested-menu-container">
        {nestedMenuOptions?.map((eachOption, optionIndex) => {
          return (
            <>
              <FunctionBoxWrapper
                showName={showName}
                data-testid={`toolbar-icon-${eachOption.title
                  .toLowerCase()
                  .split(' ')
                  .join('-')}`}
              >
                <CustomTooltip
                  title={eachOption.title}
                  arrow
                  data-testid={`toolbar-icon-tooltip-${eachOption.title
                    .toLowerCase()
                    .split(' ')
                    .join('-')}`}
                >
                  <StyledIconButton
                    disabled={disableToolbarIcon}
                    onClick={(clickEvent) => {
                      if (eachOption.options?.length) {
                        clickEvent.preventDefault();
                        clickEvent.stopPropagation();
                        setSelectedMenuOptions(eachOption.options);
                        setAnchorElement([clickEvent.currentTarget]);
                      } else {
                        submitMenuOption(eachOption.action, eachOption.dataType);
                      }
                    }}
                    data-testid="toolbar-icon-button"
                  >
                    {eachOption?.iconSVG ?? (
                      <StyledSvgIcon
                        component={eachOption.icon}
                        flipped={eachOption.action === 'redo'}
                      />
                    )}
                  </StyledIconButton>
                </CustomTooltip>
                {eachOption.options?.length > 0 && (
                  <NestedMenu
                    menuOptions={selectedMenuOptions}
                    columnType={columnType}
                    submitMenuOption={submitMenuOption}
                    title={eachOption.title}
                    setAnchorElement={setAnchorElement}
                    anchorElement={anchorElement}
                    menuToggleHandler={toggleMenu}
                  />
                )}
                {showName && (
                  <NormalFont
                    component="div"
                    data-testid={`toolbar-icon-title-${eachOption.title
                      .toLowerCase()
                      .split(' ')
                      .join('-')}`}
                  >
                    {eachOption.toolName}
                  </NormalFont>
                )}
              </FunctionBoxWrapper>
              {(optionIndex === 3 || optionIndex === 1) && (
                <DividerBox> {showName ? LongDivider : Divider}</DividerBox>
              )}
            </>
          );
        })}
        <LastDividerBox> {showName ? LongDivider : Divider}</LastDividerBox>
        <SearchBoxWrapper>
          {/* TODO Search functionality UI component will be added here */}
        </SearchBoxWrapper>
      </ToolBarInnerWrapper>
      <ExpandAndFunctionToggleContainer>
        <FunctionToggle setShowName={setShowName} showName={showName} />
        <ExpandButton
          open={showBreadCrumb}
          onClick={() => setShowBreadCrumb(!showBreadCrumb)}
          dataTestId="toolbar-header-toggler"
        />
      </ExpandAndFunctionToggleContainer>
    </ToolBarIconWrapper>
  );
}
