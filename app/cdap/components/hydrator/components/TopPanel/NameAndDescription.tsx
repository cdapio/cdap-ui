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

import { Button, Tooltip, withStyles } from '@material-ui/core';
import React, { useState } from 'react';
import styled from 'styled-components';

interface INameAndDescriptionProps {
  metadataExpanded?: boolean;
  state?: any;
  invalidName?: string;
  parsedDescription?: string;
  saveMetadata?: (event: any) => void;
  resetMetadata?: (event: any) => void;
}

const PipelineName = styled.div`
  font-size: 14px;
  margin-top: 5px;
  line-height: 17px;

  ${({ errorName }) =>
    errorName &&
    `
    color: #d15668;
  `}
`;

const PipelineDescription = styled.div`
  color: gray;
  font-size: 12px;
`;

const CustomTooltip = withStyles(() => {
  return {
    tooltip: {
      fontSize: '13px',
    },
  };
})(Tooltip);

const ErrorTooltip = withStyles(() => {
  return {
    arrow: {
      color: '#d15668',
    },
    tooltip: {
      background: '#d15668',
    },
  };
})(CustomTooltip);

const SaveButton = styled(Button)`
  background-color: #5a84e4;
  margin-right: 10px;
  text-transform: none;
`;

const CancelButton = styled(Button)`
  background-color: white;
  text-transform: none;
`;

const ButtonsContainer = styled.div`
  float: left !important;
`;

export const NameAndDescription = ({
  metadataExpanded,
  state,
  invalidName,
  parsedDescription,
  saveMetadata,
  resetMetadata,
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
  const onEnterOnMetadata = (event) => {
    // Save when user hits ENTER key.
    if (event.nativeEvent.keyCode === 13) {
      saveMetadata(event);
    } else if (event.nativeEvent.keyCode === 27) {
      // Reset if the user hits ESC key.
      resetMetadata(event);
    }
  };

  return (
    <div>
      {metadataExpanded ? (
        <div>
          <input
            type="text"
            id="pipeline-name-input"
            placeholder="Name your pipeline"
            onKeyUp={onEnterOnMetadata}
            onChange={handleNameChange}
            value={name}
          />
          <textarea
            value={description}
            placeholder="Enter a description for your pipeline."
            data-cy="pipeline-description-input"
            onChange={handleDescriptionChange}
          ></textarea>
          <ButtonsContainer>
            <SaveButton variant="contained" color="primary" onClick={saveMetadata}>
              Save
            </SaveButton>
            <CancelButton variant="contained" onClick={resetMetadata}>
              Cancel
            </CancelButton>
          </ButtonsContainer>
        </div>
      ) : (
        <div>
          {invalidName ? (
            <ErrorTooltip title={'Invalid Name'} arrow open placement="bottom-start">
              <PipelineName errorName={true}>{name || 'Name your pipeline'}</PipelineName>
            </ErrorTooltip>
          ) : (
            <CustomTooltip title={name} arrow placement="bottom-start">
              <PipelineName errorName={false}>{name || 'Name your pipeline'}</PipelineName>
            </CustomTooltip>
          )}
          <CustomTooltip title={parsedDescription} arrow placement="bottom-start">
            <PipelineDescription>
              {parsedDescription || 'Enter a description for your pipeline'}
            </PipelineDescription>
          </CustomTooltip>
        </div>
      )}
    </div>
  );
};

export default NameAndDescription;
