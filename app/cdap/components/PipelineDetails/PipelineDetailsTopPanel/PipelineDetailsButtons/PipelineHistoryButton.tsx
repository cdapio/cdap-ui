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

import React, { useRef, useState } from 'react';
import classnames from 'classnames';
import PipelineHistoryOuter from 'components/PipelineHistory';
import HistoryIcon from '@material-ui/icons/History';
import T from 'i18n-react';
import { PrimaryTextLowercaseButton } from 'components/shared/Buttons/PrimaryTextLowercaseButton';
import styled from 'styled-components';

const PREFIX = 'features.PipelineDetails.TopPanel';

interface IPipelineHistoryButtonProps {
  pipelineName: string;
}

const StyledHistoryIcon = styled(HistoryIcon)`
  margin-bottom: -4px;
`;

export const PipelineHistoryButton = ({ pipelineName }: IPipelineHistoryButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);

  const toggleButton = () => {
    setIsOpen(!isOpen);
  };

  const renderPipelineHistoryBtn = () => {
    return (
      <div className="btn pipeline-action-btn" ref={buttonRef}>
        <PrimaryTextLowercaseButton
          onClick={toggleButton}
          data-cy="pipeline-history-btn"
          data-testid="pipeline-history-btn"
        >
          <div className="btn-container">
            <StyledHistoryIcon viewBox="1 1 22 22" />
            <div className="button-label">{T.translate(`${PREFIX}.history`)}</div>
          </div>
        </PrimaryTextLowercaseButton>
      </div>
    );
  };

  return (
    <div
      className={classnames('pipeline-action-container pipeline-history-container', {
        active: isOpen,
      })}
    >
      {renderPipelineHistoryBtn()}
      <PipelineHistoryOuter
        isOpen={isOpen}
        toggle={() => setIsOpen(false)}
        anchorEl={buttonRef.current}
        pipelineName={pipelineName}
      />
    </div>
  );
};
