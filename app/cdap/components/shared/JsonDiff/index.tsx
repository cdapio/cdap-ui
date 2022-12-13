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
import { diffString, diff } from 'json-diff';
import T from 'i18n-react';
import PipelineModeless from 'components/PipelineDetails/PipelineModeless';
import styled from 'styled-components';
import LoadingSVGCentered from '../LoadingSVGCentered';

const PREFIX = 'features.PipelineHistory.table';

const JsonDiffContainer = styled.div`
  display: block;
  width: 100%;
  height: calc(80vh - 50px);
  overflow: auto;
  div {
    width: 45%;
    display: inline-block;
    vertical-align: top;
    margin-left: 1em;
    margin-top: 0.5em;
  }
`;

interface IJsonDiffProps {
  anchorEl: any;
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  error: string;
  latestConfig: object;
  selectedConfig: object;
}

const JsonDiff = ({
  anchorEl,
  isOpen,
  onClose,
  loading,
  error,
  latestConfig,
  selectedConfig,
}: IJsonDiffProps) => {
  const result = diff(selectedConfig, latestConfig);
  console.log(result);
  return (
    <PipelineModeless
      title={T.translate(`${PREFIX}.viewDiffTitle`)}
      open={isOpen}
      onClose={onClose}
      placement="bottom-end"
      anchorEl={anchorEl}
      style={{ width: '100%', top: '100px' }}
    >
      {loading && <LoadingSVGCentered />}
      {error && <h2>{error}</h2>}
      {!loading && !error && (
        <JsonDiffContainer>
          <div>
            <b>Older Version: </b>
            <pre>{JSON.stringify(selectedConfig, null, 2)}</pre>
          </div>
          <div>
            <b>Latest Version: </b>
            <pre>{JSON.stringify(latestConfig, null, 2)}</pre>
          </div>
        </JsonDiffContainer>
      )}
    </PipelineModeless>
  );
};

export default JsonDiff;
