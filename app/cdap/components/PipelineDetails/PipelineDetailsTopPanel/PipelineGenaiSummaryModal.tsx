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

import React from 'react';
import styled from 'styled-components';
import T from 'i18n-react';
import PipelineModeless from 'components/PipelineDetails/PipelineModeless';
import MarkdownWithStyles from 'components/shared/Markdown';
import LoadingSVG from 'components/shared/LoadingSVG';

const PREFIX = 'features.PipelineDetails.TopPanel';

interface IPipelineGenaiSummaryModalProps {
  pipelineName?: string;
  summary: string;
  anchorEl: any;
  onClose: () => void;
  isOpen: boolean;
}

const SummaryContainer = styled.div`
  height: 100%;
  width: 100%;
  max-width: 880px;
  max-height: min(60vh, 800px);
  padding: 0 20px;
  overflow: auto;
`;

const PopperClass = styled.div`
  max-width: 880px;
`;

const LoadingContainer = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PipelineGenaiSummaryModal = ({
  pipelineName,
  summary,
  anchorEl,
  onClose,
  isOpen,
}: IPipelineGenaiSummaryModalProps) => {
  return (
    <PipelineModeless
      open={isOpen}
      onClose={onClose}
      anchorEl={anchorEl}
      popoverClassName={String(PopperClass)}
      title={
        pipelineName
          ? T.translate(`${PREFIX}.genaiSummaryOfPipeline`, { pipelineName })
          : T.translate(`${PREFIX}.genaiSummaryOfUnnamedPipeline`)
      }
    >
      <SummaryContainer>
        {summary ? (
          <MarkdownWithStyles markdown={summary} />
        ) : (
          <LoadingContainer>
            <LoadingSVG />
          </LoadingContainer>
        )}
      </SummaryContainer>
    </PipelineModeless>
  );
};
