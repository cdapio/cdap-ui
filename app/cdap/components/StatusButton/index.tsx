/*
 * Copyright © 2021 Cask Data, Inc.
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

import React, { useEffect, useState } from 'react';
import { Box, ClickAwayListener } from '@material-ui/core';
import ChevronRight from '@material-ui/icons/ChevronRight';
import uuid from 'uuid';
import { SUPPORT } from 'components/Replicator/Create/Content/Assessment/TablesAssessment/Mappings/Supported';

import {
  PositionedIconButton,
  CloseIconScaled,
  StyledButton,
  StyledPopper,
  StyledBox,
  BoldP,
  StyledP,
} from './styles';

import { GreenIconSuccess, RedIconError, YellowIconWarning } from './icons';

interface IStatusButtonProps {
  status: SUPPORT;
  message?: string;
}

const CloseButton: React.FC<{ handleClick: () => void }> = (props) => (
  <PositionedIconButton aria-label="close" onClick={props.handleClick}>
    <CloseIconScaled />
  </PositionedIconButton>
);

/**
 * These props aren't finalized yet - I need to get a little bit more information from the backend
 * as to what is returned etc but for now this component could use review so I'm making it with
 * a couple simple guesses.
 */
export const StatusButton: React.FC<IStatusButtonProps> = (props) => {
  let icon;
  let a11yMessage;
  let allyId;
  let mouseOverDelayTimeoutId;
  const [anchorEl, setAnchorEl] = useState(undefined);
  const [actionState, setActionState] = useState<'hover' | 'click' | undefined>();
  useEffect(() => {
    allyId = uuid();
  }, []);

  if (props.status === SUPPORT.yes) {
    icon = <GreenIconSuccess />;
    a11yMessage = 'Success - no errors';
  } else if (props.status === SUPPORT.no) {
    icon = <RedIconError />;
    a11yMessage = 'Error';
  } else {
    icon = <YellowIconWarning />;
    a11yMessage = 'Warning';
  }

  const handleClick = (event) => {
    if (props.status === SUPPORT.yes) {
      return;
    }
    const newActionState = actionState === 'click' ? undefined : 'click';
    setAnchorEl(newActionState !== undefined ? event.target : undefined);
    setActionState(newActionState);
  };

  const handleMouseOver = (event) => {
    if (props.status === SUPPORT.yes) {
      return;
    }

    if (mouseOverDelayTimeoutId) {
      clearTimeout(mouseOverDelayTimeoutId);
    }

    if (actionState !== 'click') {
      if (!anchorEl) {
        setAnchorEl(event.target);
      }
      setActionState('hover');
    }
  };

  const handleMouseLeave = () => {
    if (actionState === 'click') {
      return;
    }

    mouseOverDelayTimeoutId = setTimeout(() => {
      mouseOverDelayTimeoutId = undefined;
      setActionState(undefined);
      setAnchorEl(undefined);
    }, 200);
  };

  const handleClose = () => {
    setActionState(undefined);
    setAnchorEl(undefined);
  };

  return (
    <>
      <StyledButton
        aria-label={a11yMessage}
        aria-describedby={allyId}
        style={{
          backgroundColor: actionState ? 'rgba(0, 0, 0, 0.04)' : '',
        }}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            handleClick(event);
          }
        }}
        onClick={() => handleClick}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
      >
        {icon}
        {Boolean(props.message) && <ChevronRight />}
      </StyledButton>
      <StyledPopper
        id={allyId}
        open={Boolean(props.message) && Boolean(actionState)}
        placement="right-start"
        anchorEl={anchorEl}
        transition
      >
        <div onMouseEnter={handleMouseOver} onMouseLeave={handleMouseLeave}>
          <ClickAwayListener onClickAway={handleClick}>
            <StyledBox>
              {actionState === 'click' && <CloseButton handleClick={handleClose} />}
              <Box>
                <span>{icon} The column is not supported</span>
              </Box>
              <Box>
                <BoldP>Reason: </BoldP>
                <StyledP>{props.message}</StyledP>
              </Box>
            </StyledBox>
          </ClickAwayListener>
        </div>
      </StyledPopper>
    </>
  );
};

export default StatusButton;
