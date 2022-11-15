/*
 * Copyright © 2017 Cask Data, Inc.
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

import { Box, Typography } from '@material-ui/core';
import MyDataPrepApi from 'api/dataprep';
import { defaultFuseOptions } from 'components/DirectiveInput/constants';
import { IDirectiveUsage, IObject, IHeaderNamesList } from 'components/DirectiveInput/types';
import ee from 'event-emitter';
import Fuse from 'fuse.js';
import reverse from 'lodash/reverse';
import Mousetrap from 'mousetrap';
import React, { useEffect, useState } from 'react';
import globalEvents from 'services/global-events';
import NamespaceStore from 'services/NamespaceStore';
import styled from 'styled-components';
import uuidV4 from 'uuid/v4';
import { grey } from '@material-ui/core/colors';

interface IInputPanelProps {
  setDirectivesList: React.Dispatch<React.SetStateAction<[]>>;
  directiveSelected: boolean;
  columnNamesList: IHeaderNamesList[];
  onSearchItemClicked: (value: string) => void;
  getDirectiveSyntax: (results: IDirectiveUsage[], value: boolean) => void;
  onColumnSelected: (value: boolean) => void;
  inputBoxValue: string;
}

const SimpleWrapper = styled(Box)`
  display: block;
`;

const SmallLabel = styled(Typography)`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  letter-spacing: 0.15;
  color: ${grey[700]};
`;

const LargeLabel = styled(SmallLabel)`
  font-weight: 600;
  font-size: 16px;
`;

const ResultRow = styled(Box)`
  padding: 10px;
  border-bottom: 1px solid ${grey[300]};
  background-color: ${(props) => (props.isActive ? '#EFF0F2' : '#FFFFFF')};
  &:hover {
    background: #eff0f2;
    cursor: pointer;
  }
`;

export default function({
  setDirectivesList,
  directiveSelected,
  columnNamesList,
  onSearchItemClicked,
  getDirectiveSyntax,
  onColumnSelected,
  inputBoxValue,
}: IInputPanelProps) {
  const [searchResults, setSearchResults] = useState<IDirectiveUsage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const eventEmitter = ee(ee);
  const [fuse, setFuse] = useState(new Fuse([], { ...defaultFuseOptions }));

  const getUsage = () => {
    if (!directiveSelected) {
      MyDataPrepApi.getUsage({ context: NamespaceStore.getState().selectedNamespace }).subscribe(
        (res) => {
          setDirectivesList(res.values);
          setFuse(new Fuse(res.values, { ...defaultFuseOptions }));
        }
      );
    } else {
      setFuse(new Fuse(columnNamesList, { ...defaultFuseOptions, keys: ['label'] }));
    }
  };

  useEffect(() => {
    getUsage();
  }, [directiveSelected]);

  useEffect(() => {
    eventEmitter.on(globalEvents.DIRECTIVEUPLOAD, getUsage);
    const directiveInput = document.getElementById('directive-input-search');
    const mousetrap = new Mousetrap(directiveInput);
    mousetrap.bind('up', handleUpArrow);
    mousetrap.bind('down', handleDownArrow);
    mousetrap.bind('enter', handleEnterKey);
    mousetrap.bind('tab', handleTabKey);

    // unbind a single keyboard event or an array of keyboard events.
    return () => {
      mousetrap.unbind('up');
      mousetrap.unbind('down');
      mousetrap.unbind('enter');
      mousetrap.unbind('tab');
      eventEmitter.off(globalEvents.DIRECTIVEUPLOAD, getUsage);
    };
  });

  const handleUpArrow = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (selectedIndex !== 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleDownArrow = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (selectedIndex !== searchResults.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handleEnterKey = () => {
    if (inputText.length > 0) {
      if (searchResults[selectedIndex]) {
        handleListItemClick(searchResults[selectedIndex]);
      } else {
        onSearchItemClicked(inputText);
      }
    }
  };

  const handleTabKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (inputText.length === 0 || inputText.split(' ').length !== 1) {
      return;
    }
    handleEnterKey();
  };

  useEffect(() => {
    if (directiveSelected) {
      setFuse(new Fuse(columnNamesList, { ...defaultFuseOptions, keys: ['label'] }));
    }
    searchMatch(inputBoxValue);
    setInputText(inputBoxValue);
  }, [inputBoxValue]);

  const searchMatch = (searchString: string) => {
    let searchList = [];
    const spaceIndex: boolean = searchString.includes(' ');
    if (fuse && searchString.length > 0) {
      if (!directiveSelected) {
        searchList = fuse
          .search(searchString)
          .slice(0, 3)
          .map((searchItem) => {
            searchItem.uniqueId = uuidV4();
            return searchItem;
          });
        reverse(searchList);
      } else {
        searchList = fuse.search(searchString.split(':')[1]).map((searchItem) => {
          searchItem.uniqueId = uuidV4();
          return searchItem;
        });
        reverse(searchList);
      }
    }
    setSearchResults(searchList);
    setInputText(searchString);
    setSelectedIndex(searchList.length - 1);
    if (!directiveSelected) {
      getDirectiveSyntax(searchList, spaceIndex);
    }
  };

  const handleListItemClick = (listItem) => {
    if (!directiveSelected) {
      onSearchItemClicked(listItem.item.directive);
      getDirectiveSyntax([listItem], true);
    } else {
      const splitData = inputText.split(/(?=[:])|(?<=[:])/g);
      const eventObject: Record<string, IObject> = {
        target: { value: `${splitData[0]}${splitData[1]}${listItem.item.label}` },
      };
      setInputText(`${splitData[0]}${splitData[1]}${listItem.item.label}`);
      onSearchItemClicked(eventObject.target.value);
      onColumnSelected(true);
    }
  };

  return (
    <SimpleWrapper>
      {searchResults.map((searchItem, searchItemIndex) => {
        return (
          <ResultRow
            isActive={searchItemIndex === selectedIndex}
            key={searchItem.uniqueId}
            onClick={() => handleListItemClick(searchItem)}
            data-testid="select-directive-list-option"
          >
            <SimpleWrapper>
              <LargeLabel data-testid="select-directive-list-label" variant="body1">
                {searchItem?.item?.directive || searchItem?.item?.label}
              </LargeLabel>
              <SmallLabel data-testid="select-directive-list-description" variant="body1">
                {searchItem?.item?.description}
              </SmallLabel>
            </SimpleWrapper>
          </ResultRow>
        );
      })}
    </SimpleWrapper>
  );
}
