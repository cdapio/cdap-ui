/*
 * Copyright © 2024 Cask Data, Inc.
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

import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import GraphicEqIcon from '@material-ui/icons/GraphicEq';
import T from 'i18n-react';
import { PrimaryTextLowercaseButton } from 'components/shared/Buttons/PrimaryTextLowercaseButton';
import styled from 'styled-components';
import { PipelineGenaiSummaryModal } from '../PipelineGenaiSummaryModal';
import { MyAppApi } from 'api/app';
import { getCurrentNamespace } from 'services/NamespaceStore';

const PREFIX = 'features.PipelineDetails.TopPanel';

interface IPipelineGenaiSummaryButtonProps {
  pipelineName: string;
}

const StyledSummarizeIcon = styled(GraphicEqIcon)`
  margin-bottom: -4px;
`;

const GenaiButton = styled.div`
  padding: 0;
`;

export const PipelineGenaiSummaryButton = ({ pipelineName }: IPipelineGenaiSummaryButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState('');
  const buttonRef = useRef(null);

  useEffect(() => {
    MyAppApi.summarize({
      namespace: getCurrentNamespace(),
      appId: pipelineName,
    }).subscribe((res) => {
      setSummary(res);
    });
  }, []);

  const toggleButton = () => {
    setIsOpen(!isOpen);
  };

  const renderPipelineGenaiSummaryBtn = () => {
    return (
      <GenaiButton className="btn pipeline-action-btn" ref={buttonRef}>
        <PrimaryTextLowercaseButton
          onClick={toggleButton}
          data-cy="pipeline-genai-summary-btn"
          data-testid="pipeline-genai-summary-btn"
        >
          <div className="btn-container">
            <StyledSummarizeIcon viewBox="1 1 22 22" />
            <div className="button-label">{T.translate(`${PREFIX}.genaiSummarize`)}</div>
          </div>
        </PrimaryTextLowercaseButton>
      </GenaiButton>
    );
  };

  return (
    <div
      className={classnames('pipeline-action-container pipeline-history-container', {
        active: isOpen,
      })}
    >
      {renderPipelineGenaiSummaryBtn()}
      <PipelineGenaiSummaryModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        anchorEl={buttonRef.current}
        pipelineName={pipelineName}
        summary={summary}
      />
    </div>
  );
};
