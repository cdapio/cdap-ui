/*
 * Copyright © 2019 Cask Data, Inc.
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

import React, { useCallback, useEffect, useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import MenuItemContentWrapper from 'components/shared/ContextMenu/MenuItemContentWrapper';
import Divider from '@material-ui/core/Divider';

export interface IContextMenuOption {
  name?: string;
  label?: (() => string) | string;
  onClick?: (event: React.SyntheticEvent) => void;
  disabled?: boolean;
  icon?: React.ReactElement;
  type?: 'divider';
}

interface IContextMenuProps {
  element?: HTMLElement;
  selector?: string;
  options?: IContextMenuOption[];
  onOpen?: () => void; // to update disabled flags
}

const initialMousePosition = {
  mouseX: null,
  mouseY: null,
};

const StyledMenuItem = withStyles(() => ({
  root: {
    minHeight: 'auto',
  },
  gutters: {
    padding: '5px 15px',
  },
}))(MenuItem);

const StyledDisabledMenuItem = withStyles((theme) => ({
  root: {
    minHeight: 'auto',
    color: theme.palette.grey[500],
    cursor: 'not-allowed',
  },
  gutters: {
    padding: '2px 12px',
  },
}))(MenuItem);

export const ContextMenu = ({ selector, element, options, onOpen }: IContextMenuProps) => {
  const [mousePosition, setMousePosition] = useState<any>(initialMousePosition);

  const toggleMenu = (e: MouseEvent) => {
    setMousePosition({
      mouseX: e.clientX - 2,
      mouseY: e.clientY - 4,
    });
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (onOpen) {
      onOpen();
    }
  };
  const defaultEventHandler = (e) => e.preventDefault();

  // state to capture children of context menu to disable right click on them.
  const [children, setChildren] = useState<any>(null);
  // we don't use 'useRef' but a 'useCallback' is because 'ref.current' state is not
  // tracked. So a useEffect(() => {...}, [ref.current]) won't get called back if
  // the dom node changes.
  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setChildren([...Array.prototype.slice.call(node.children), node]);
    }
  }, []);

  useEffect(() => {
    if (children) {
      children.forEach((child) => {
        child.removeEventListener('contextmenu', defaultEventHandler);
        child.addEventListener('contextmenu', defaultEventHandler);
      });
    }
    return () => {
      if (children) {
        children.forEach((child) => child.removeEventListener('contextmenu', defaultEventHandler));
      }
    };
  }, [children]);

  // on mount determine the position of the mouse pointer and place the menu right there.
  useEffect(() => {
    let el: HTMLElement | null = null;
    if (selector) {
      el = document.querySelector(selector);
    }
    if (element) {
      el = element;
    }
    if (!el) {
      throw new Error("Context Menu either needs a 'selector' or 'element' props to be passed");
    }

    el.addEventListener('contextmenu', toggleMenu);
    return () => el?.removeEventListener('contextmenu', toggleMenu);
  }, []);

  const handleClose = (option: IContextMenuOption, e: React.SyntheticEvent) => {
    setMousePosition(initialMousePosition);
    if (typeof option.onClick === 'function') {
      option.onClick(e);
    }
  };

  return (
    <Menu
      keepMounted={true}
      open={mousePosition.mouseY !== null}
      onClose={() => setMousePosition(initialMousePosition)}
      anchorReference="anchorPosition"
      anchorPosition={
        mousePosition.mouseY !== null && mousePosition.mouseX !== null
          ? { top: mousePosition.mouseY, left: mousePosition.mouseX }
          : undefined
      }
      ref={measuredRef}
    >
      {Array.isArray(options) &&
        options.map((option) => {
          const { name, disabled, type } = option;
          if (type === 'divider') {
            return <Divider />;
          }
          const MenuItemComp = disabled ? StyledDisabledMenuItem : StyledMenuItem;
          return (
            <MenuItemComp
              key={name}
              onClick={disabled === true ? undefined : handleClose.bind(null, option)}
              data-cy={`menu-item-${name}`}
              data-testid={`menu-item-${name}`}
              disabled={disabled ? true : false}
            >
              <MenuItemContentWrapper option={option} />
            </MenuItemComp>
          );
        })}
    </Menu>
  );
};

export default function ContextMenuWrapper() {
  const options: IContextMenuOption[] = [
    {
      name: 'option1',
      label: 'Option One',
      onClick: () => ({}),
    },
    {
      name: 'option2',
      label: 'Option Two',
      onClick: () => ({}),
    },
    {
      name: 'option3',
      label: 'Option Three',
      onClick: () => ({}),
    },
  ];
  return (
    <>
      <h1 id="right-click-item">Right click here</h1>
      <ContextMenu selector="#right-click-item" options={options} />
    </>
  );
}
