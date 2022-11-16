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

import { Box, IconButton } from '@material-ui/core';
import InputPanel from 'components/DirectiveInput/Components/InputPanel';
import DirectiveUsage from 'components/DirectiveInput/Components/DirectiveUsage';
import {
  IDirectiveInputProps,
  IDirectivesList,
  IDirectiveUsage,
} from 'components/DirectiveInput/types';
import { formatDirectiveUsageData, handlePasteDirective } from 'components/DirectiveInput/utils';
import T from 'i18n-react';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { PREFIX } from 'components/DirectiveInput/constants';
import { grey } from '@material-ui/core/colors';

const SimpleBox = styled(Box)`
  display: block;
  box-shadow: -3px -4px 15px rgba(68, 132, 245, 0.25);
`;

const SearchBarWrapper = styled(Box)`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InputWrapper = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
`;

const DirectiveUsageWrapper = styled(Box)`
  background: ${grey[700]};
`;

const InputComponent = styled.input`
  width: 95%;
  margin-left: 5px;
  outline: 0;
  border: 0;
  background: transparent;
  color: #ffffff;
`;

const LabelComponent = styled.label`
  color: #94ec98;
  font-size: 14px;
  margin-bottom: 0;
`;

const DirectiveBox = styled(Box)`
  background-color: #ffffff;
  position: fixed;
  bottom: 94px;
  width: 100%;
`;

export default function({
  columnNamesList,
  onDirectiveInputHandler,
  onClose,
  openDirectivePanel,
}: IDirectiveInputProps) {
  const [inputBoxValue, setInputBoxValue] = useState<string>('');
  const [columnSelected, setColumnSelected] = useState<boolean>(false);
  const [selectedDirective, setSelectedDirective] = useState<boolean>(false);
  const [directiveUsage, setDirectiveUsage] = useState<IDirectiveUsage[]>([]);
  const [directivesList, setDirectivesList] = useState<IDirectivesList[]>([]);
  const directiveRef = useRef();

  const handleDirectiveChange = (value: string) => {
    !value && setSelectedDirective(false);
    setInputBoxValue(value);
  };

  useEffect(() => {
    setDirectiveUsage(formatDirectiveUsageData(inputBoxValue, directivesList));
  }, [inputBoxValue]);

  const handleKeyDownEvent = (event: React.KeyboardEvent<HTMLInputElement>) => {
    {
      const directiveSyntax =
        directiveUsage.length > 0 ? directiveUsage[0]?.item?.usage.split(' ') : [];
      const inputSplit = inputBoxValue.replace(/^\s+/g, '').split(' ');
      if (event.key === 'Enter' && handlePasteDirective(inputBoxValue, directivesList)) {
        onDirectiveInputHandler(inputBoxValue);
        setInputBoxValue('');
      } else if (
        event.key === 'Enter' &&
        columnSelected &&
        selectedDirective &&
        (directiveSyntax.length === inputSplit.length || inputSplit.length > directiveSyntax.length)
      ) {
        onDirectiveInputHandler(inputBoxValue);
        setInputBoxValue('');
      }
    }
  };

  return (
    <DirectiveBox data-testid="directive-input-main-container">
      {openDirectivePanel && (
        <SimpleBox data-testid="directive-input-parent">
          <InputPanel
            inputBoxValue={inputBoxValue}
            onSearchItemClick={(value) => handleDirectiveChange(value)}
            setDirectivesList={setDirectivesList}
            getDirectiveSyntax={(activeResults: IDirectiveUsage[], value) => {
              setSelectedDirective(value);
              setDirectiveUsage(activeResults);
            }}
            onColumnSelection={() => {
              setColumnSelected(true);
            }}
            selectedDirective={selectedDirective}
            columnNamesList={columnNamesList}
          />
          <DirectiveUsageWrapper>
            {directiveUsage.length === 1 &&
              directiveUsage.map((eachDirective: IDirectiveUsage) => (
                <DirectiveUsage key={eachDirective.uniqueId} eachDirective={eachDirective} />
              ))}
            <SearchBarWrapper>
              <InputWrapper>
                <LabelComponent
                  htmlFor="directive-input-search"
                  data-testid="select-directive-input-label"
                >
                  $
                </LabelComponent>
                <InputComponent
                  id="directive-input-search" // is is needed for catching keyboard events while navigating through search list
                  autoComplete="OFF"
                  placeholder={T.translate(`${PREFIX}.inputDirective`).toString()}
                  value={inputBoxValue}
                  onChange={(event) => handleDirectiveChange(event.target.value)}
                  ref={directiveRef}
                  onKeyDown={handleKeyDownEvent}
                  data-testid="select-directive-input-search"
                />
              </InputWrapper>
            </SearchBarWrapper>
          </DirectiveUsageWrapper>
        </SimpleBox>
      )}
    </DirectiveBox>
  );
}
