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

const RedSpan = styled.span`
  display: block;
  background-color: #feebe9;
`;

const GreenSpan = styled.span`
  display: block;
  background-color: #e6ffec;
`;

const NormalSpan = styled.span`
  display: block;
`;

const EmptyLineSpan = styled.span`
  display: block;
  background-color: #e8e8e8;
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
  const JsonDiffContent = () => {
    if (!selectedConfig || !latestConfig) {
      return;
    }
    const selectedConfigArray = JSON.stringify(selectedConfig, null, 2).split('\n');
    const latestConfigArray = JSON.stringify(latestConfig, null, 2).split('\n');
    const result = diff(selectedConfigArray, latestConfigArray);
    const coloredSelectedConfig = [];
    const coloredLatestConfig = [];
    const selectedConfigLineNums = [];
    const latestConfigLineNums = [];
    let selectedConfigIdx = 0;
    let latestConfigIdx = 0;
    for (const array of result) {
      if (array.length === 1) {
        // line is same
        coloredSelectedConfig.push(styleSpanNormal(selectedConfigArray[selectedConfigIdx]));
        coloredLatestConfig.push(styleSpanNormal(latestConfigArray[latestConfigIdx]));
        selectedConfigLineNums.push(styleSpanNormal(selectedConfigIdx));
        latestConfigLineNums.push(styleSpanNormal(latestConfigIdx));
        selectedConfigIdx++;
        latestConfigIdx++;
        continue;
      }
      if (array[0] === '+') {
        // left should append empty line
        coloredSelectedConfig.push(<EmptyLineSpan> </EmptyLineSpan>);
        coloredLatestConfig.push(styleSpanStringGreen(latestConfigArray[latestConfigIdx]));
        selectedConfigLineNums.push(styleSpanNormal(' '));
        latestConfigLineNums.push(styleSpanNormal(latestConfigIdx));
        latestConfigIdx++;
        continue;
      }
      if (array[0] === '-') {
        coloredSelectedConfig.push(styleSpanStringRed(selectedConfigArray[selectedConfigIdx]));
        coloredLatestConfig.push(<EmptyLineSpan> </EmptyLineSpan>);
        selectedConfigLineNums.push(styleSpanNormal(selectedConfigIdx));
        latestConfigLineNums.push(styleSpanNormal(' '));
        selectedConfigIdx++;
      }
    }
    return (
      <>
        <div>
          <b>Older Version: </b>
          <pre>
            <div style={{ float: 'left', width: 'auto' }}>
              {selectedConfigLineNums.map((x) => x)}
            </div>
            <div style={{ width: 'auto' }}>{coloredSelectedConfig.map((x) => x)}</div>
          </pre>
        </div>
        <div>
          <b>Latest Version: </b>
          <pre>
            <div style={{ float: 'left', width: 'auto' }}>{latestConfigLineNums.map((x) => x)}</div>
            <div style={{ width: 'auto' }}>{coloredLatestConfig.map((x) => x)}</div>
          </pre>
        </div>
      </>
    );
  };

  const styleSpanStringGreen = (val: string) => {
    return <GreenSpan>{val}</GreenSpan>;
  };

  const styleSpanStringRed = (val: string) => {
    return <RedSpan>{val}</RedSpan>;
  };

  const styleSpanNormal = (val: string | number) => {
    return <NormalSpan>{val}</NormalSpan>;
  };

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
      {!loading && !error && <JsonDiffContainer>{JsonDiffContent()}</JsonDiffContainer>}
    </PipelineModeless>
  );
};

export default JsonDiff;
