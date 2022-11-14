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

import { Box } from '@material-ui/core';
import AutoCompleteList from 'components/DirectiveInput/Components/AutoComplete';
import UsageDirective from 'components/DirectiveInput/Components/UsageDirective';
import { CrossIcon } from 'components/DirectiveInput/IconStore/CrossIcon';
import { useStyles } from 'components/DirectiveInput/styles';
import {
  IDirectiveInputProps,
  IDirectivesList,
  IOnRowClickValue,
  IUsageDirectives,
} from 'components/DirectiveInput/types';
import { formatUsageDirectiveData, handlePasteDirective } from 'components/DirectiveInput/utils';
import T from 'i18n-react';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

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

export default function({
  columnNamesList,
  onDirectiveInputHandler,
  onClose,
  openDirectivePanel,
}: IDirectiveInputProps) {
  const [directiveInput, setDirectiveInput] = useState<string>('');
  const [isColumnSelected, setIsColumnSelected] = useState<boolean>(false);
  const [isDirectiveSelected, setIsDirectiveSelected] = useState<boolean>(false);
  const [usageDirective, setUsageDirective] = useState<IUsageDirectives[]>([]);
  const [directivesList, setDirectivesList] = useState<IDirectivesList[]>([]);
  const directiveRef = useRef();
  const classes = useStyles();

  const handleDirectiveChange = (event: IOnRowClickValue | React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      setIsDirectiveSelected(false);
    }
    setDirectiveInput(event.target.value);
  };

  useEffect(() => {
    setUsageDirective(formatUsageDirectiveData(directiveInput, directivesList));
  }, [directiveInput]);

  const onEnterClick = (event: React.KeyboardEvent<HTMLInputElement>) => {
    {
      const usageArraySplit =
        usageDirective.length > 0 ? usageDirective[0]?.item?.usage.split(' ') : [];
      const inputSplit = directiveInput.replace(/^\s+/g, '').split(' ');
      if (event.key === 'Enter' && handlePasteDirective(directiveInput, directivesList)) {
        onDirectiveInputHandler(directiveInput);
      } else if (
        event.key === 'Enter' &&
        isColumnSelected &&
        isDirectiveSelected &&
        (usageArraySplit.length === inputSplit.length || inputSplit.length > usageArraySplit.length)
      ) {
        onDirectiveInputHandler(directiveInput);
      }
    }
  };

  return (
    <>
      {openDirectivePanel && (
        <Box data-testid="directive-input-parent">
          <AutoCompleteList
            directiveInput={directiveInput}
            onRowClick={(eventObject) => handleDirectiveChange(eventObject)}
            setDirectivesList={setDirectivesList}
            getDirectiveUsage={(activeResults: IUsageDirectives[], value) => {
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
            {Array.isArray(usageDirective) && usageDirective.length === 1 ? (
              usageDirective.map((row: IUsageDirectives) => {
                return <UsageDirective row={row} />;
              })
            ) : (
              <></>
            )}
            <SearchBarWrapper>
              <InputWrapper>
                <label
                  htmlFor="directive-input-search"
                  data-testid="select-directive-input-label"
                  className={classes.label}
                >
                  {T.translate('features.WranglerNewUI.GridPage.directivePanel.dollar')}
                </label>
                <input
                  id="directive-input-search"
                  autoComplete="OFF"
                  className={classes.inputSearch}
                  placeholder={'Input a directive'}
                  value={directiveInput}
                  onChange={handleDirectiveChange}
                  ref={directiveRef}
                  onKeyDown={onEnterClick}
                  data-testid="select-directive-input-search"
                />
              </InputWrapper>
              <Box
                className={classes.crossIcon}
                data-testid="close-directive-panel"
                onClick={() => onClose()}
              >
                {CrossIcon}
              </Box>
            </SearchBarWrapper>
          </UsageDirectiveWrapper>
        </Box>
      )}
    </>
  );
}
