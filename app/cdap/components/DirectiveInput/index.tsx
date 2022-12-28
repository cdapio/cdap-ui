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
import { grey } from '@material-ui/core/colors';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import DirectiveUsage from 'components/DirectiveInput/Components/DirectiveUsage';
import InputPanel from 'components/DirectiveInput/Components/InputPanel';
import {
  MULTIPLE_COLUMN_DIRECTIVE,
  PREFIX,
  TWO_COLUMN_DIRECTIVE,
} from 'components/DirectiveInput/constants';
import {
  IDirectiveActions,
  initialDirectiveInputState,
  reducer,
} from 'components/DirectiveInput/reducer';
import { IDirectiveInputProps, IDirectiveUsage } from 'components/DirectiveInput/types';
import { formatDirectiveUsageData } from 'components/DirectiveInput/utils';
import T from 'i18n-react';
import React, { useEffect, useReducer, useRef, KeyboardEvent } from 'react';
import styled from 'styled-components';

const CloseIconButton = styled(IconButton)`
  color: #ffffff;
`;

const DirectiveBox = styled(Box)`
  background-color: #ffffff;
  position: fixed;
  bottom: 93px;
  width: 100%;
`;

const DirectiveUsageWrapper = styled(Box)`
  background: ${grey[700]};
`;

const InputParentWrapper = styled(Box)`
  display: block;
  box-shadow: -3px -4px 15px rgba(68, 132, 245, 0.25);
`;

const InputWrapper = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
`;

const SearchBarWrapper = styled(Box)`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 95%;
  margin-left: 5px;
  outline: 0;
  border: 0;
  background: transparent;
  color: #ffffff;
`;

const StyledLabel = styled.label`
  color: #94ec98;
  font-size: 14px;
  margin-bottom: 0;
`;

export default function({
  columnNamesList,
  onDirectiveInputHandler,
  onClose,
}: IDirectiveInputProps) {
  const [directiveInput, dispatch] = useReducer(reducer, initialDirectiveInputState);
  const {
    inputDirective,
    isDirectiveSet,
    directivesList,
    appliedDirective,
    directiveColumnCount,
    isDirectivePaste,
    directiveUsageList,
    directiveColumns,
    enterCount,
  } = directiveInput;
  const directiveRef = useRef();

  const handleDirectiveChange = (value: string) => {
    if (!value) {
      dispatch({
        type: IDirectiveActions.SET_NO_DIRECTIVE,
        payload: {
          inputDirective: false,
          enterCount: 0,
        },
      });
    }
    const inputText = value.split(' ');
    const firstIndexInputTextValue = inputText[0];
    if (
      directivesList.findIndex(
        (el: { directive: string }) => el.directive == firstIndexInputTextValue
      ) !== -1
    ) {
      dispatch({
        type: IDirectiveActions.DIRECTIVES_APPLIED_SET_COUNT,
        payload: {
          directiveColumnCount: getDirectiveColumnCount(firstIndexInputTextValue),
          isDirectiveSet: true,
          appliedDirective: [firstIndexInputTextValue],
        },
      });
    }
    if (isDirectiveSet) {
      columnNamesList.forEach((column) => {
        if (value.indexOf(column.label) !== -1) {
          dispatch({
            type: IDirectiveActions.DIRECTIVES_COLUMNS_LIST,
            payload: {
              directiveColumns: !directiveColumns.includes(column.label)
                ? [...directiveColumns, column.label]
                : directiveColumns,
              enterCount: appliedDirective.length + directiveColumns.length,
            },
          });
        }
      });
    }
    dispatch({
      type: IDirectiveActions.INPUT_DIRECTIVE,
      payload: value,
    });
  };

  const getDirectiveColumnCount = (firstIndexInputTextValue: string) => {
    if (TWO_COLUMN_DIRECTIVE.includes(firstIndexInputTextValue)) {
      return 2;
    } else if (MULTIPLE_COLUMN_DIRECTIVE.includes(firstIndexInputTextValue)) {
      return 0;
    } else {
      return 1;
    }
  };

  useEffect(() => {
    dispatch({
      type: IDirectiveActions.DIRECTIVE_USAGE_LIST,
      payload: formatDirectiveUsageData(inputDirective, directivesList),
    });
  }, [inputDirective]);

  const handleKeyDownEvent = (KeyboardEvent: KeyboardEvent<HTMLInputElement>) => {
    if ((KeyboardEvent.ctrlKey || KeyboardEvent.metaKey) && KeyboardEvent.keyCode == 86) {
      dispatch({
        type: IDirectiveActions.DIRECTIVE_PASTE,
        payload: true,
      });
    } else if (KeyboardEvent.key === 'Enter') {
      dispatch({
        type: IDirectiveActions.SET_ENTER_COUNT,
        payload: onDirectiveComplete(),
      });
    }
  };

  const onDirectiveComplete = () => {
    if (
      (isDirectiveSet &&
        directiveColumns.length >= 1 &&
        directiveColumnCount === 0 &&
        enterCount + 1 > directiveColumns.length + appliedDirective.length) ||
      (isDirectiveSet &&
        directiveColumns.length === 2 &&
        directiveColumnCount === 2 &&
        enterCount + 1 > directiveColumns.length + appliedDirective.length) ||
      enterCount + 1 > directiveColumns.length + appliedDirective.length ||
      isDirectivePaste
    ) {
      onDirectiveInputHandler(inputDirective);
    }
    return enterCount + 1;
  };

  return (
    <DirectiveBox data-testid="directive-input-main-container">
      <InputParentWrapper data-testid="directive-input-parent">
        <InputPanel
          inputDirective={inputDirective}
          onSearchItemClick={(value) => handleDirectiveChange(value)}
          setDirectivesList={(values) =>
            dispatch({
              type: IDirectiveActions.DIRECTIVE_LIST,
              payload: values,
            })
          }
          getDirectiveSyntax={(activeResults: IDirectiveUsage[], isDirectiveSelected) => {
            dispatch({
              type: IDirectiveActions.DIRECTIVES_SYNTAX,
              payload: {
                ...directiveInput,
                isDirectiveSet: isDirectiveSelected,
                directiveUsageList: activeResults,
              },
            });
          }}
          isDirectiveSet={isDirectiveSet}
          columnNamesList={columnNamesList}
        />
        <DirectiveUsageWrapper>
          {directiveUsageList.length === 1 && (
            <DirectiveUsage
              key={directiveUsageList[0].uniqueId}
              directiveUsage={directiveUsageList[0]}
            />
          )}
          <SearchBarWrapper>
            <InputWrapper>
              <StyledLabel
                htmlFor="directive-input-search"
                data-testid="select-directive-input-label"
              >
                $
              </StyledLabel>
              <StyledInput
                id="directive-input-search" // is is needed for catching keyboard events while navigating through search list
                autoComplete="OFF"
                placeholder={T.translate(`${PREFIX}.inputDirective`).toString()}
                value={inputDirective}
                onChange={(event) => handleDirectiveChange(event.target.value)}
                ref={directiveRef}
                onKeyDown={handleKeyDownEvent}
                data-testid="select-directive-input-search"
              />
            </InputWrapper>
            <CloseIconButton data-testid="close-directive-panel" onClick={onClose}>
              <CloseOutlinedIcon data-testid="close-icon" />
            </CloseIconButton>
          </SearchBarWrapper>
        </DirectiveUsageWrapper>
      </InputParentWrapper>
    </DirectiveBox>
  );
}
