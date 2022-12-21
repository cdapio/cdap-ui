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

import { MenuItem } from '@material-ui/core';
import React from 'react';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import { NormalFont, MenuHeadText } from 'components/common/TypographyText';
import { ShortDivider } from 'components/common/Divider';
import { SvgIconTypeMap } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { DATATYPE_OPTIONS } from 'components/WranglerGrid/NestedMenu/menuOptions/datatypeOptions';
import styled from 'styled-components';

const StyledChevronRightRoundedIcon = styled(ChevronRightRoundedIcon)`
  font-size: 24px;
`;

export interface IMenuItem {
  label?: string;
  supportedDataType?: string[];
  value?: string;
  options?: IMenuItem[];
  title?: string;
  action?: string;
  dataType?: string[];
  iconSVG?: JSX.Element | OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
  icon?: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
  toolName?: string;
  open?: boolean;
  infoLink?: string;
}

export interface IMenuItemComponentProps {
  item: IMenuItem;
  index: number;
  onMenuClick: (e: React.MouseEvent<Element, MouseEvent>, item: IMenuItem) => void;
  columnType: string;
}

export default function({ item, index, onMenuClick, columnType }: IMenuItemComponentProps) {
  const includesCheck = !(
    item?.supportedDataType?.includes(columnType) || item?.supportedDataType?.includes('all')
  );
  const filteredDataOptionCheck = DATATYPE_OPTIONS.filter(
    (el) =>
      (el.value === item.value && item.value === columnType.toLowerCase()) ||
      (item.value === 'integer' && columnType.toLowerCase() === 'int')
  ).length;

  const getMenuItemDisablProp = () => {
    if (columnType) {
      return includesCheck || filteredDataOptionCheck;
    }
    return false;
  };

  const menuItemDisableProp = getMenuItemDisablProp();

  if (item?.value === 'divider') {
    return <ShortDivider key={index} data-testid="menu-item-divider" />;
  }
  if (item?.value === 'heading') {
    return (
      <MenuHeadText key={index} data-testid="menu-item-heading">
        {item.label}
      </MenuHeadText>
    );
  } else {
    return (
      <MenuItem
        key={index}
        disabled={menuItemDisableProp as boolean}
        title={item.label}
        onClick={(onClickEvent) => onMenuClick(onClickEvent, item)}
        data-testid="menu-item-parent"
      >
        <NormalFont component="div">{item.label}</NormalFont>
        {item?.options?.length > 0 && <StyledChevronRightRoundedIcon />}
      </MenuItem>
    );
  }
}
