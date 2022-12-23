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
import { grey } from '@material-ui/core/colors';
import MyDataPrepApi from 'api/dataprep';
import SearchListItem from 'components/DirectiveInput/Components/SearchListItem';
import { defaultFuseOptions } from 'components/DirectiveInput/constants';
import { IDirectiveUsage } from 'components/DirectiveInput/types';
import { getFormattedSyntax, getLastWordOfSearchItem } from 'components/DirectiveInput/utils';
import { IHeaderNamesList } from 'components/GridTable/types';
import ee from 'event-emitter';
import Fuse from 'fuse.js';
import reverse from 'lodash/reverse';
import Mousetrap from 'mousetrap';
import React, { Dispatch, SetStateAction, useEffect, useState, KeyboardEvent } from 'react';
import globalEvents from 'services/global-events';
import NamespaceStore from 'services/NamespaceStore';
import styled from 'styled-components';
import uuidV4 from 'uuid/v4';

interface IInputPanelProps {
  setDirectivesList: Dispatch<SetStateAction<[]>>;
  isDirectiveSet: boolean;
  columnNamesList: IHeaderNamesList[];
  onSearchItemClick: (value: string) => void;
  getDirectiveSyntax: (results: IDirectiveUsage[], value: boolean) => void;
  inputDirective: string;
}

const SearchWrapper = styled(Box)`
  display: block;
`;

const ResultRow = styled(Box)`
  padding: 10px;
  border-bottom: 1px solid ${grey[300]};
  background-color: #ffffff;
  &:hover {
    background: #eff0f2;
    cursor: pointer;
  }
`;

const ActiveResultRow = styled(ResultRow)`
  background-color: #eff0f2;
`;

export default function({
  setDirectivesList,
  isDirectiveSet,
  columnNamesList,
  onSearchItemClick,
  getDirectiveSyntax,
  inputDirective,
}: IInputPanelProps) {
  const [searchResults, setSearchResults] = useState<IDirectiveUsage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const eventEmitter = ee(ee);
  const [fuse, setFuse] = useState(new Fuse([], { ...defaultFuseOptions }));

  const getUsage = () => {
    if (!isDirectiveSet) {
      // If Directive name is not yet entered in input then the search list will be directive list else will be column list
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
  }, [isDirectiveSet]);

  useEffect(() => {
    eventEmitter.on(globalEvents.DIRECTIVEUPLOAD, getUsage);

    const directiveInput = document.getElementById('directive-input-search');
    const mousetrap = new Mousetrap(directiveInput);

    mousetrap.bind('up', handleUpArrow); // Binding this event for navigating up in the search list
    mousetrap.bind('down', handleDownArrow); // Binding this event for navigating bottom in the search list
    mousetrap.bind('enter', handleEnterKey); // Binding this event for selecting item by pressing enter on active item in the search list
    mousetrap.bind('tab', handleTabKey); // Binding this event on tab click so active item on list will be filled on input tag

    // Unbinding above events.
    return () => {
      mousetrap.unbind('up');
      mousetrap.unbind('down');
      mousetrap.unbind('enter');
      mousetrap.unbind('tab');
      eventEmitter.off(globalEvents.DIRECTIVEUPLOAD, getUsage);
    };
  });

  // Used for navigating above in search list
  const handleUpArrow = (event: KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (selectedIndex !== 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  // Used for navigating below in search list
  const handleDownArrow = (event: KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (selectedIndex !== searchResults.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  // Used for selecting item in search list
  const handleEnterKey = () => {
    if (inputText.length > 0) {
      if (searchResults[selectedIndex]) {
        handleListItemClick(searchResults[selectedIndex]);
      } else {
        onSearchItemClick(inputText);
      }
    }
  };

  // Used for filling input with active item in search list
  const handleTabKey = (event: KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (inputText.length === 0 || inputText.split(' ').length !== 1) {
      return;
    }
    handleEnterKey();
  };

  useEffect(() => {
    searchMatch(inputDirective);
    setInputText(inputDirective);
  }, [inputDirective]);

  // Function called on every change in input to change search list to most appropriate matched list
  const searchMatch = (searchString: string) => {
    let searchList = [];
    const spaceIndex = searchString.includes(' '); // As soon as directive is entered, we need column list to appear hence we are checking if space is present in it,
    if (fuse && searchString.length > 0) {
      if (!isDirectiveSet) {
        searchList = fuse
          .search(searchString)
          .slice(0, 3)
          .map((searchItem) => {
            searchItem.uniqueId = uuidV4();
            return searchItem;
          });
        reverse(searchList);
      } else {
        const characterToSearch = getLastWordOfSearchItem(searchString);
        searchList = fuse.search(characterToSearch).map((searchItem) => {
          searchItem.uniqueId = uuidV4();
          return searchItem;
        });
        reverse(searchList);
      }
    }
    setSearchResults(searchList);
    setInputText(searchString);
    setSelectedIndex(searchList.length - 1);
    if (!isDirectiveSet) {
      getDirectiveSyntax(searchList, spaceIndex);
    }
  };

  // Function called when item is clicked in search list
  const handleListItemClick = (listItem: IDirectiveUsage) => {
    if (!isDirectiveSet) {
      onSearchItemClick(listItem.item.directive);
      getDirectiveSyntax([listItem], true);
    } else {
      const formattedString = getFormattedSyntax(inputText, listItem.item.label);
      setInputText(formattedString);
      onSearchItemClick(formattedString);
    }
  };

  const getResultRow = (searchItem: IDirectiveUsage, searchItemIndex: number) => {
    if (searchItemIndex === selectedIndex) {
      return (
        <ActiveResultRow
          key={searchItem.uniqueId}
          onClick={() => handleListItemClick(searchItem)}
          data-testid={`select-directive-list-option-${searchItemIndex}`}
          role="button"
        >
          <SearchListItem searchItem={searchItem} />
        </ActiveResultRow>
      );
    }
    return (
      <ResultRow
        key={searchItem.uniqueId}
        onClick={() => handleListItemClick(searchItem)}
        data-testid={`select-directive-list-option-${searchItemIndex}`}
      >
        <SearchListItem searchItem={searchItem} />
      </ResultRow>
    );
  };

  return (
    <SearchWrapper data-testid="input-panel-wraper">
      {searchResults.map((searchItem, searchItemIndex) =>
        getResultRow(searchItem, searchItemIndex)
      )}
    </SearchWrapper>
  );
}
