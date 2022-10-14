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

import { fireEvent, render } from "@testing-library/react";
import React from "react";
import MenuItemComponent from "..";
import { MENU_OPTIONS } from "../../NestedMenu/constants";

describe("It should test MenuItemComponent", () => {
  it("Should render the MenuItemComponent", () => {
    const onMenuClick = jest.fn();
    const container = render(
      <MenuItemComponent
        item={MENU_OPTIONS}
        index={3}
        onMenuClick={onMenuClick}
      />
    );
    expect(container).toBeDefined();
    
  });
  it("Should render the MenuItemComponent and cover branches", () => {
    const item = {
      key: "divider",
    };
    const onMenuClick = jest.fn();
    const container = render(
      <MenuItemComponent item={item} index={0} onMenuClick={onMenuClick} />
    );
    expect(container).toBeDefined();
  });
  it("Should render the MenuItemComponent  and cover branches", () => {
    const item = {
      key: "heading",
    };
    const onMenuClick = jest.fn();
    const container = render(
      <MenuItemComponent item={item} index={0} onMenuClick={onMenuClick} />
    );
    expect(container).toBeDefined();
  });
  it("Should render the MenuItemComponent ,cover branches and trigger onMenuClick Function", () => {
    const item = {
      key: "text",
      label: "Text",
      options: [
        { key: "heading", label: "Remove" },
        { key: "letters", label: "Letters" },
      ],
    };
    const onMenuClick = jest.fn();
    const container = render(
      <MenuItemComponent item={item} index={0} onMenuClick={onMenuClick} />
    );
    const menuItemElement = container.getByTestId("menu-item-component-0");
    fireEvent.click(menuItemElement);
  });

  it("Should render the MenuItemComponent ,cover branches and trigger onMenuClick Function", () => {
    const item = {
      key: "",

    };
    const onMenuClick = jest.fn();
    const container = render(
      <MenuItemComponent item={item} index={0} onMenuClick={onMenuClick} />
    );
    const menuItemElement = container.getByTestId("menu-item-component-0");
    fireEvent.click(menuItemElement);
  });
});
