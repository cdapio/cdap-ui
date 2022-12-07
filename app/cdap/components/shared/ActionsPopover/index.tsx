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

import * as React from 'react';
import IconSVG from 'components/shared/IconSVG';
import Popover from 'components/shared/Popover';
import classnames from 'classnames';

import './ActionsPopover.scss';

export interface IAction {
  readonly label: string | React.ReactNode | 'separator';
  actionFn?: () => void;
  disabled?: boolean;
  className?: string;
  title?: string;
}

interface IActionsPopoverProps {
  actions: IAction[];
  targetElem?: (props) => React.ReactElement;
  showPopover?: boolean;
  togglePopover?: () => void;
  className?: string;
  modifiers?: any; // Popper modifier
}

const POPPER_MODIFIERS = {
  preventOverflow: {
    enabled: false,
  },
  hide: {
    enabled: false,
  },
};

const ActionsPopover: React.SFC<IActionsPopoverProps> = ({
  actions,
  targetElem,
  showPopover,
  togglePopover,
  className,
  modifiers,
}) => {
  let target = (props) => (
    <IconSVG
      name="icon-more"
      {...props}
      className={`default-target ${props.className}`}
      onClick={togglePopover}
    />
  );
  if (targetElem) {
    target = targetElem;
  }

  const popperModifiers = modifiers ? modifiers : POPPER_MODIFIERS;

  return (
    <Popover
      target={target}
      className={classnames('actions-popover', className)}
      placement="bottom"
      bubbleEvent={false}
      enableInteractionInPopover={true}
      modifiers={popperModifiers}
      showPopover={showPopover}
      dataTestId="actions-popover"
    >
      <ul>
        {actions.map((action, i) => {
          if (action.label === 'separator') {
            return <hr key={`${action.label}${i}`} />;
          }

          const onClick = () => {
            if (action.disabled || !action.actionFn) {
              return;
            }
            action.actionFn();
          };

          return (
            <li
              key={i}
              className={classnames(action.className, { disabled: action.disabled })}
              onClick={onClick}
              title={action.title}
              data-testid={action.label + '-on-popover'}
            >
              {action.label}
            </li>
          );
        })}
      </ul>
    </Popover>
  );
};

export default ActionsPopover;
