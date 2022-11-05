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
import {
  ButtonsContainer,
  CustomTooltip,
  DescriptionTextField,
  EditStatus,
  ErrorTooltip,
  HydratorMetadata,
  MetadataLeft,
  NameTextField,
  PipelineDescription,
  PipelineName,
  PipelineType,
  StyledIconSVG,
} from './styles';
import PrimaryContainedButton from 'components/shared/Buttons/PrimaryContainedButton';
import { IGlobalObj, INameState } from '../TopPanel';

interface INameAndDescriptionProps {
  metadataExpanded?: boolean;
  globals?: IGlobalObj;
  state?: INameState;
  invalidName?: string;
  parsedDescription?: string;
  saveMetadata?: (event: MouseEvent | KeyboardEvent) => void;
  resetMetadata?: (event: MouseEvent | KeyboardEvent) => void;
  openMetadata?: () => void;
  isEdit?: boolean;
  editStatus?: string;
}

export const NameAndDescription = ({
  metadataExpanded,
  globals,
  state,
  invalidName,
  parsedDescription,
  saveMetadata,
  resetMetadata,
  openMetadata,
  isEdit,
  editStatus,
}: INameAndDescriptionProps) => {
  const [name, setName] = useState(state.metadata.name);
  const [description, setDescription] = useState(state.metadata.description);
  const handleNameChange = (e) => {
    setName(e.target.value);
    state.metadata.name = e.target.value;
  };
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    state.metadata.description = e.target.value;
  };
  const onEnterOnMetadata = (event: KeyboardEvent) => {
    // Save when user hits ENTER key.
    if (event.key === 'Enter') {
      saveMetadata(event);
    } else if (event.key === 'Escape') {
      // Reset if the user hits ESC key.
      resetMetadata(event);
    }
  };

  const eTLBatch = globals.etlBatchPipelines.includes(state.artifact.name);
  const eTLRealtime = state.artifact.name === globals.etlRealtime;
  const sparkstreaming = state.artifact.name === globals.etlDataStreams;

  const NameToolTip = invalidName ? ErrorTooltip : CustomTooltip;

  return (
    <>
      <HydratorMetadata expanded={metadataExpanded} disabled={isEdit}>
        <PipelineType>
          {eTLBatch && <StyledIconSVG name="icon-ETLBatch"></StyledIconSVG>}
          {eTLRealtime && <StyledIconSVG name="icon-ETLRealtime"></StyledIconSVG>}
          {sparkstreaming && <StyledIconSVG name="icon-sparkstreaming"></StyledIconSVG>}
        </PipelineType>
        <MetadataLeft expanded={metadataExpanded}>
          {metadataExpanded ? (
            <>
              <NameTextField
                autoComplete="off"
                id="pipeline-name-input"
                variant="outlined"
                placeholder="Name your pipeline"
                onKeyUp={onEnterOnMetadata}
                onChange={handleNameChange}
                value={name}
              />
              <DescriptionTextField
                autoComplete="off"
                multiline
                variant="outlined"
                rows={2}
                value={description}
                placeholder="Enter a description for your pipeline."
                data-cy="pipeline-description-input"
                data-testid="pipeline-description-input"
                onChange={handleDescriptionChange}
              />
              <ButtonsContainer>
                <PrimaryContainedButton
                  onClick={saveMetadata}
                  data-cy="pipeline-metadata-ok-btn"
                  data-testid="pipeline-metadata-ok-btn"
                >
                  Save
                </PrimaryContainedButton>
                <PrimaryContainedButton
                  color="default"
                  onClick={resetMetadata}
                  data-cy="pipeline-metadata-cancel-btn"
                  data-testid="pipeline-metadata-cancel-btn"
                >
                  Cancel
                </PrimaryContainedButton>
              </ButtonsContainer>
            </>
          ) : (
            <div
              onClick={openMetadata}
              role="button"
              data-cy="pipeline-metadata"
              data-testid="pipeline-metadata"
            >
              <NameToolTip
                title={invalidName ? 'Invalid Name' : name}
                arrow
                open={!!invalidName}
                placement="bottom-start"
              >
                <PipelineName errorName={!!invalidName}>
                  {name || 'Name your pipeline'}
                </PipelineName>
              </NameToolTip>
              <CustomTooltip title={parsedDescription} arrow placement="bottom-start">
                <PipelineDescription>
                  {parsedDescription || 'Enter a description for your pipeline'}
                </PipelineDescription>
              </CustomTooltip>
            </div>
          )}
        </MetadataLeft>
      </HydratorMetadata>
      <EditStatus>{editStatus}</EditStatus>
    </>
  );
};
