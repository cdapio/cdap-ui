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

import { Button } from '@material-ui/core';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { PipelineHistory } from 'components/PipelineHistory/PipelineHistory';
import HistoryIcon from '@material-ui/icons/History';
import T from 'i18n-react';

const PREFIX = 'features.PipelineDetails.TopPanel';

interface IPipelineHistoryButtonProps {
  pipelineName: string;
}

export const PipelineHistoryButton = ({ pipelineName }: IPipelineHistoryButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);

  const toggleButton = () => {
    setIsOpen(!isOpen);
  };

  const renderPipelineHistoryBtn = () => {
    return (
      <div onClick={toggleButton} className="btn pipeline-action-btn" ref={buttonRef}>
        <div className="btn-container">
          <HistoryIcon />
          <div className="button-label">{T.translate(`${PREFIX}.history`)}</div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={classnames('pipeline-action-container pipeline-history-container', {
        active: isOpen,
      })}
      data-cy="pipeline-history-btn"
    >
      {renderPipelineHistoryBtn()}
      <PipelineHistory
        isOpen={isOpen}
        toggle={() => setIsOpen(false)}
        anchorEl={buttonRef.current}
        pipelineName={pipelineName}
      />
    </div>
  );
};
