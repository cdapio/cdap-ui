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

import React, { useState } from 'react';
import MenuComponent from 'components/WranglerGrid/NestedMenu/MenuComponent';
import MenuItemComponent, { IMenuItem } from 'components/WranglerGrid/NestedMenu/MenuItemComponent';
import { findIndex } from 'lodash';
import { NestedMenuComponent } from 'components/WranglerV2/MenuContainer';

import { Dispatch, SetStateAction } from 'react';
export interface INestedMenuProps {
  submitMenuOption: (value: string, dataType: string[]) => void;
  columnType: string;
  menuOptions: IMenuItem[];
  title: string;
  anchorElement: Element[];
  setAnchorElement: Dispatch<SetStateAction<Element[]>>;
  open?: boolean;
  menuToggleHandler?: (title?: string) => void;
}

export default function({
  menuOptions,
  submitMenuOption,
  columnType,
  title,
  anchorElement,
  setAnchorElement,
  menuToggleHandler,
}: INestedMenuProps) {
  const [menuComponentOptions, setMenuComponentOptions] = useState<IMenuItem[][]>([]);

  const handleMenuClick = (
    event: React.MouseEvent<Element, MouseEvent>,
    menuItem: IMenuItem,
    origin?: string
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (origin === 'parentMenu') {
      // When icon is clicked from toolbar the list appears is parent menu
      if (menuItem.hasOwnProperty('options') && menuItem?.options?.length > 0) {
        const updatedAnchors = anchorElement.splice(1, 0, event.currentTarget); // When item from parent menu list is clicked it's option needs to set next to it
        setAnchorElement((prev) => anchorElement);
        setMenuComponentOptions([menuItem?.options]);
      } else {
        submitMenuOption(menuItem.value, menuItem.supportedDataType); // When item from parent menu list is clicked and it does not have further options then we proceed with closing menu and next functionality
        setAnchorElement(null);
        menuToggleHandler(title);
      }
    } else {
      // When submenu item is clicked and if it has further options we show it's item next to submenu list
      if (menuItem.hasOwnProperty('options') && menuItem?.options?.length > 0) {
        const referenceIndex = menuComponentOptions.findIndex((menuOptions) => {
          const index = menuOptions.findIndex((eachOption) => (eachOption.value = menuItem.value));
          return index >= 0 ? true : false;
        });

        if (referenceIndex >= 0 && !anchorElement.includes(event.currentTarget)) {
          // if array of anchor element does not have the current item clicked then we will insert it
          const insertPosition = referenceIndex + 2; // +2 because 0, when clicked on icon, 1 when clicked on parent menu item, it means now whatever will come at position 2
          anchorElement.splice(insertPosition, 0, event.currentTarget);
          const updatedAnchors = anchorElement.slice(0, insertPosition + 1);
          menuComponentOptions.splice(updatedAnchors.length - 2, 0, menuItem?.options);
          setMenuComponentOptions((prev) =>
            prev.length ? menuComponentOptions : [menuItem?.options]
          );
          setAnchorElement(updatedAnchors);
        } else if (anchorElement.includes(event.currentTarget)) {
          // if array of anchor element have current item then we have to remove it and reposition it to it's parent
          const currentTargetIndex = findIndex(
            anchorElement,
            (anchor) => anchor == event.currentTarget
          );
          menuComponentOptions.splice(currentTargetIndex, 0, menuItem?.options);
          setAnchorElement((prev) => prev.slice(0, currentTargetIndex + 1));
          setMenuComponentOptions((prev) => menuComponentOptions.slice(0, currentTargetIndex + 1));
        } else {
          setAnchorElement((prev) => [...prev, event.currentTarget]);
          setMenuComponentOptions((prev) =>
            prev.length ? [...prev, menuItem?.options] : [menuItem?.options]
          );
        }
      } else {
        submitMenuOption(menuItem.value, menuItem.supportedDataType);
        setAnchorElement(null);
        menuToggleHandler(title);
      }
    }
  };
  return (
    <>
      <NestedMenuComponent
        id="parent-menu"
        data-testid="nested-menu-parent-root"
        keepMounted
        anchorEl={anchorElement?.length ? anchorElement[0] : null}
        open={anchorElement?.length ? true : false}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        onClose={() => menuToggleHandler()}
        onClick={(clickEvent) => {
          clickEvent.preventDefault();
          clickEvent.stopPropagation();
        }}
      >
        {menuOptions?.map((eachOption, optionsIndex) => {
          return (
            <MenuItemComponent
              item={eachOption}
              columnType={columnType.toLowerCase()}
              index={optionsIndex}
              onMenuClick={(onClickEvent, clickedItem) =>
                handleMenuClick(onClickEvent, clickedItem, 'parentMenu')
              }
            />
          );
        })}
        {menuComponentOptions?.length > 0 &&
          menuComponentOptions.map((eachOption, optionsIndex) => {
            return (
              <MenuComponent
                anchorElement={anchorElement?.length > 1 ? anchorElement[optionsIndex + 1] : null}
                columnType={columnType.toLowerCase()}
                menuOptions={eachOption}
                setAnchorElement={setAnchorElement}
                setMenuComponentOptions={setMenuComponentOptions}
                submitOption={(onClickEvent, clickedItem) => {
                  onClickEvent.preventDefault();
                  onClickEvent.stopPropagation();
                  handleMenuClick(onClickEvent, clickedItem);
                }}
              />
            );
          })}
      </NestedMenuComponent>
    </>
  );
}
