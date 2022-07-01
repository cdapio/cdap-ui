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
import styled, { css } from 'styled-components';
import ConfirmationModal from 'components/shared/ConfirmationModal';
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
  confirmationTitle: React.ReactNode;
  confirmationText: React.ReactNode;
  onEditClick: () => void;
  onDeleteClick: () => void;
  dataTestIds: { [key: string]: string };
}

const ActionsPopover = ({
  target,
  confirmationTitle,
  confirmationText,
  onDeleteClick,
  onEditClick,
  dataTestIds,
}: IActionsPopoverProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const canEdit = false; // TODO: should update when edit functionality is enabled

  const toggleModalOpen = () => {
    setModalOpen((prevState) => !prevState);
  };

  const confirmDelete = () => {
    toggleModalOpen();
    onDeleteClick();
  };

  const confirmDeleteElem = <div>{confirmationText}</div>;

  return (
    <>
      <StyledPopover
        target={target}
        placement="bottom"
        bubbleEvent={false}
        enableInteractionInPopover={true}
        showPopover={false}
      >
        <ul>
          {canEdit && (
            <>
              <ListItem disabled={!canEdit} onClick={onEditClick} data-testid={dataTestIds.edit}>
                {T.translate(`${PREFIX}.Actions.edit`)}
              </ListItem>
              <hr />
            </>
          )}
          <ListItem red={true} onClick={toggleModalOpen} data-testid={dataTestIds.delete}>
            {T.translate(`${PREFIX}.Actions.delete`)}
          </ListItem>
        </ul>
      </StyledPopover>
      <ConfirmationModal
        isOpen={modalOpen}
        headerTitle={confirmationTitle}
        confirmationElem={confirmDeleteElem}
        confirmButtonText={T.translate(`${PREFIX}.Actions.delete`)}
        confirmFn={confirmDelete}
        cancelFn={toggleModalOpen}
      />
    </>
  );
};

export default ActionsPopover;
