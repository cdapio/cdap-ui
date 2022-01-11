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

import React from 'react';
import styled, { css } from 'styled-components';
import Popover from 'components/shared/Popover';
import T from 'i18n-react';

const PREFIX = 'features.Administration.Tethering';

const StyledPopover = styled(Popover)`
  cursor: pointer;

  .icon-more {
    fill: black;
    font-size: 20px;
    stroke: black;
  }

  .popper {
    width: 80px;
    min-width: 80px;
    z-index: 1;

    .popper__arrow {
      border-right-color: var(--grey05);
      border-bottom-color: var(--grey05);
    }

    ul {
      hr {
        margin: 8px 0;
      }

      li {
        padding: 0;
        margin: 0;
      }
    }
  }
`;

const ListItem = styled.li`
  ${(styles) =>
    styles.disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.5;
    `}

  ${(styles) =>
    styles.red &&
    css`
      color: ${(props) => props.theme.palette.red[100]};
    `}
`;

interface IActionsPopoverProps {
  target: React.ReactNode | (() => void);
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const ActionsPopover = ({ target, onDeleteClick, onEditClick }: IActionsPopoverProps) => {
  const canEdit = false; // TODO: should update when edit functionality is enabled

  return (
    <StyledPopover
      target={target}
      placement="bottom"
      bubbleEvent={false}
      enableInteractionInPopover={true}
    >
      <ul>
        <ListItem disabled={!canEdit} onClick={onEditClick}>
          {T.translate(`${PREFIX}.Actions.edit`)}
        </ListItem>
        <hr />
        <ListItem red={true} onClick={onDeleteClick}>
          {T.translate(`${PREFIX}.Actions.delete`)}
        </ListItem>
      </ul>
    </StyledPopover>
  );
};

export default ActionsPopover;
