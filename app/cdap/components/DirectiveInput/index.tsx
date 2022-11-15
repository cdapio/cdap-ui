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
import UsageDirective from 'components/DirectiveInput/Components/UsageDirective';
import { CrossIcon } from 'components/DirectiveInput/IconStore/CrossIcon';
import {
  IDirectiveInputProps,
  IDirectivesList,
  IOnRowClickValue,
  IUsageDirective,
} from 'components/DirectiveInput/types';
import { formatUsageDirectiveData, handlePasteDirective } from 'components/DirectiveInput/utils';
import T from 'i18n-react';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const SimpleBox = styled(Box)`
  display: block;
`;

const SearchBarWrapper = styled(Box)`
  padding: 10px;
  display: flex;
  justify-content: space-between;
`;

const InputWrapper = styled(Box)`
  width: 100%;
`;

const UsageDirectiveWrapper = styled(Box)`
  background: #616161;
  box-shadow: -3px -4px 15px rgba(68, 132, 245, 0.25);
`;

const InputComponent = styled.input`
  width: 95%;
  margin-left: 5;
  outline: 0;
  border: 0;
  background: transparent;
  color: #ffffff;
`;

const LabelComponent = styled.label`
  color: #94ec98;
  font-size: 14px;
`;

export default function({
  columnNamesList,
  onDirectiveInputHandler,
  onClose,
  openDirectivePanel,
}: IDirectiveInputProps) {
  const [inputBoxValue, setInputBoxValue] = useState<string>('');
  const [isColumnSelected, setIsColumnSelected] = useState<boolean>(false);
  const [isDirectiveSelected, setIsDirectiveSelected] = useState<boolean>(false);
  const [usageDirective, setUsageDirective] = useState<IUsageDirective[]>([]);
  const [directivesList, setDirectivesList] = useState<IDirectivesList[]>([]);
  const directiveRef = useRef();

  const handleDirectiveChange = (event: IOnRowClickValue | React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      setIsDirectiveSelected(false);
    }
    setInputBoxValue(event.target.value);
  };

  useEffect(() => {
    setUsageDirective(formatUsageDirectiveData(inputBoxValue, directivesList));
  }, [inputBoxValue]);

  const handleKeyDownEvent = (event: React.KeyboardEvent<HTMLInputElement>) => {
    {
      const usageArraySplit =
        usageDirective.length > 0 ? usageDirective[0]?.item?.usage.split(' ') : [];
      const inputSplit = inputBoxValue.replace(/^\s+/g, '').split(' ');
      if (event.key === 'Enter' && handlePasteDirective(inputBoxValue, directivesList)) {
        onDirectiveInputHandler(inputBoxValue);
      } else if (
        event.key === 'Enter' &&
        isColumnSelected &&
        isDirectiveSelected &&
        (usageArraySplit.length === inputSplit.length || inputSplit.length > usageArraySplit.length)
      ) {
        onDirectiveInputHandler(inputBoxValue);
      }
    }
  };

  return (
    <>
      {openDirectivePanel && (
        <SimpleBox data-testid="directive-input-parent">
          <InputPanel
            inputBoxValue={inputBoxValue}
            onSearchItemClicked={(eventObject) => handleDirectiveChange(eventObject)}
            setDirectivesList={setDirectivesList}
            getDirectiveSyntax={(activeResults: IUsageDirective[], value) => {
              setIsDirectiveSelected(value);
              setUsageDirective(activeResults);
            }}
            onColumnSelected={() => {
              setIsColumnSelected(true);
            }}
            isDirectiveSelected={isDirectiveSelected}
            columnNamesList={columnNamesList}
          />
          <UsageDirectiveWrapper>
            {usageDirective.length === 1 &&
              usageDirective.map((eachDirective: IUsageDirective) => (
                <UsageDirective key={eachDirective.uniqueId} eachDirective={eachDirective} />
              ))}
            <SearchBarWrapper>
              <InputWrapper>
                <LabelComponent
                  htmlFor="directive-input-search"
                  data-testid="select-directive-input-label"
                >
                  {T.translate('features.WranglerNewUI.GridPage.directivePanel.dollar')}
                </LabelComponent>
                <InputComponent
                  id="directive-input-search"
                  autoComplete="OFF"
                  placeholder={T.translate(
                    'features.WranglerNewUI.GridPage.directivePanel.inputDirective'
                  ).toString()}
                  value={inputBoxValue}
                  onChange={handleDirectiveChange}
                  ref={directiveRef}
                  onKeyDown={handleKeyDownEvent}
                  data-testid="select-directive-input-search"
                />
              </InputWrapper>
              <IconButton data-testid="close-directive-panel" onClick={() => onClose()}>
                {CrossIcon}
              </IconButton>
            </SearchBarWrapper>
          </UsageDirectiveWrapper>
        </SimpleBox>
      )}
    </>
  );
}
