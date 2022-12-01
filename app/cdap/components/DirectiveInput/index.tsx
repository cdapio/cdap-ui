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
import { formatDirectiveUsageData } from 'components/DirectiveInput/utils';
import T from 'i18n-react';
import React, { useEffect, useRef, useState, useReducer } from 'react';
import styled from 'styled-components';
import {
  PREFIX,
  TWO_COLUMN_DIRECTIVE,
  MULTIPLE_COLUMN_DIRECTIVE,
} from 'components/DirectiveInput/constants';
import { grey } from '@material-ui/core/colors';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import { reducer, initialDirectiveInputState } from 'components/DirectiveInput/reducer';

const InputParentWrapper = styled(Box)`
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
  bottom: 93px;
  width: 100%;
`;

const CloseIconButton = styled(IconButton)`
  color: #ffffff;
`;

export default function({
  columnNamesList,
  onDirectiveInputHandler,
  onClose,
  openDirectivePanel,
}: IDirectiveInputProps) {
  const [directiveInput, dispatch] = useReducer(reducer, initialDirectiveInputState);
  enum IDirectiveActions {
    INPUT_DIRECTIVE,
    DIRECTIVE_SET,
    APPLIED_DIRECTIVE,
    DIRECTIVE_COLUMN_COUNT,
    DIRECTIVE_USAGE_LIST,
    DIRECTIVE_LIST,
    DIRECTIVE_PASTE,
  }
  const {
    inputDirective,
    isDirectiveSet,
    directivesList,
    appliedDirective,
    directiveColumnCount,
    isDirectivePaste,
    directiveUsageList,
  } = directiveInput;
  const [directiveColumns, setDirectiveColumns] = useState([]);
  const [enterCount, setEnterCount] = useState(0);
  const directiveRef = useRef();

  const handleDirectiveChange = (value) => {
    if (!value) {
      setEnterCount(0);
      dispatch({
        type: IDirectiveActions.INPUT_DIRECTIVE,
        payload: false,
      });
    }
    const inputText = value.split(' ');
    if (directivesList.filter((el) => el.directive == inputText[0]).length) {
      if (TWO_COLUMN_DIRECTIVE.includes(inputText[0])) {
        dispatch({
          type: IDirectiveActions.DIRECTIVE_COLUMN_COUNT,
          payload: 2,
        });
      } else if (MULTIPLE_COLUMN_DIRECTIVE.includes(inputText[0])) {
        dispatch({
          type: IDirectiveActions.DIRECTIVE_COLUMN_COUNT,
          payload: 0,
        });
      }
      dispatch({
        type: IDirectiveActions.DIRECTIVE_SET,
        payload: true,
      });
      dispatch({
        type: IDirectiveActions.APPLIED_DIRECTIVE,
        payload: [inputText[0]],
      });
    }
    if (isDirectiveSet) {
      columnNamesList.forEach((column) => {
        if (value.indexOf(column.label) !== -1) {
          setDirectiveColumns((prev) =>
            !prev.includes(column.label) ? [...prev, column.label] : prev
          );
        } else {
          setDirectiveColumns((prev) => prev.filter((el) => el != column.label));
          setEnterCount(appliedDirective.length + directiveColumns.length);
        }
      });
    }
    dispatch({
      type: IDirectiveActions.INPUT_DIRECTIVE,
      payload: value,
    });
  };

  useEffect(() => {
    dispatch({
      type: IDirectiveActions.DIRECTIVE_USAGE_LIST,
      payload: formatDirectiveUsageData(inputDirective, directivesList),
    });
  }, [inputDirective]);

  const handleKeyDownEvent = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 86) {
      dispatch({
        type: IDirectiveActions.DIRECTIVE_PASTE,
        payload: true,
      });
    } else if (event.key === 'Enter') {
      setEnterCount((prev) => {
        if (
          isDirectiveSet &&
          directiveColumns.length >= 1 &&
          directiveColumnCount === 0 &&
          prev + 1 > directiveColumns.length + appliedDirective.length
        ) {
          // This condition means if we can select multiple column for directive
          onDirectiveInputHandler(inputDirective);
        } else if (
          isDirectiveSet &&
          directiveColumns.length === 2 &&
          directiveColumnCount === 2 &&
          prev + 1 > directiveColumns.length + appliedDirective.length
        ) {
          // This condition means if we can select atleast two column for directive
          onDirectiveInputHandler(inputDirective);
        } else if (prev + 1 > directiveColumns.length + appliedDirective.length) {
          // This condition means if we can select single column from list and any number of postfix can be entered
          onDirectiveInputHandler(inputDirective);
        } else if (isDirectivePaste) {
          // If we are copy pasting directive this condition is executed
          onDirectiveInputHandler(inputDirective);
        }
        return prev + 1;
      });
    }
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
              type: IDirectiveActions.DIRECTIVE_SET,
              payload: isDirectiveSelected,
            });
            dispatch({
              type: IDirectiveActions.DIRECTIVE_USAGE_LIST,
              payload: activeResults,
            });
          }}
          isDirectiveSet={isDirectiveSet}
          columnNamesList={columnNamesList}
        />
        <DirectiveUsageWrapper>
          {directiveUsageList.length === 1 &&
            directiveUsageList.map((directiveUsage: IDirectiveUsage) => (
              <DirectiveUsage key={directiveUsage.uniqueId} directiveUsage={directiveUsage} />
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
