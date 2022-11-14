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
import {
  IAutoCompleteProps,
  IOnRowClickValue,
} from 'components/DirectiveInput/Components/AutoComplete/types';
import { defaultFuseOptions } from 'components/DirectiveInput/constants';
import { IUsageDirectives } from 'components/DirectiveInput/types';
import ee from 'event-emitter';
import Fuse from 'fuse.js';
import reverse from 'lodash/reverse';
import Mousetrap from 'mousetrap';
import React, { useEffect, useState } from 'react';
import globalEvents from 'services/global-events';
import NamespaceStore from 'services/NamespaceStore';
import styled from 'styled-components';
import uuidV4 from 'uuid/v4';

const DirectiveLabel = styled(Typography)`
  font-style: normal;
  font-weight: 600;
  font-size: ${(props) => (props.isDescription ? '14px' : '16px')};
  letter-spacing: 0.15;
  color: #616161;
`;

const DirectiveResultRow = styled(Box)`
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
  background-color: ${(props) => (props.isActive ? '#EFF0F2' : '#FFFFFF')};
  &:hover {
    background: #eff0f2;
    cursor: pointer;
  }
`;

export default function({
  setDirectivesList,
  isDirectiveSelected,
  columnNamesList,
  onRowClick,
  getDirectiveUsage,
  onColumnSelected,
  directiveInput,
}: IAutoCompleteProps) {
  const [activeResults, setActiveResults] = useState<IUsageDirectives[]>([]);
  const [input, setInput] = useState<string>('');
  const [activeSelectionIndex, setActiveSelectionIndex] = useState<number | null>(null);
  const eventEmitter = ee(ee);
  const [fuse, setFuse] = useState(null);

  const getUsage = () => {
    if (!isDirectiveSelected) {
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
  }, [isDirectiveSelected]);

  useEffect(() => {
    eventEmitter.on(globalEvents.DIRECTIVEUPLOAD, getUsage);
    const directiveInput = document.getElementById('directive-input-search');
    const mousetrap = new Mousetrap(directiveInput);
    mousetrap.bind('up', handleUpArrow);
    mousetrap.bind('down', handleDownArrow);
    mousetrap.bind('enter', handleEnterKey);
    mousetrap.bind('tab', handleTabKey);

    // returned function will be called on component unmount
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
    if (activeSelectionIndex !== 0) {
      setActiveSelectionIndex(activeSelectionIndex - 1);
    }
  };

  const handleDownArrow = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (activeSelectionIndex !== activeResults.length - 1) {
      setActiveSelectionIndex(activeSelectionIndex + 1);
    }
  };

  const handleEnterKey = () => {
    if (input.length > 0) {
      if (activeResults[activeSelectionIndex]) {
        handleRowClick(activeResults[activeSelectionIndex]);
      } else {
        onRowClick({
          target: { value: `${input}` },
        });
      }
    }
  };

  const handleTabKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (input.length === 0 || input.split(' ').length !== 1) {
      return;
    }
    event.preventDefault();
    handleEnterKey();
  };

  useEffect(() => {
    if (isDirectiveSelected) {
      setFuse(new Fuse(columnNamesList, { ...defaultFuseOptions, keys: ['label'] }));
    }
    searchMatch(directiveInput);
    setInput(directiveInput);
  }, [directiveInput]);

  const searchMatch = (query: string) => {
    let results = [];
    const input: string = query;
    const spaceIndex: number = input.indexOf(' ');
    if (fuse && input.length > 0) {
      if (!isDirectiveSelected) {
        results = fuse
          .search(input)
          .slice(0, 3)
          .filter((row, index) => {
            if (spaceIndex === -1) {
              return true;
            }
            return row.score === 0 && index === 0;
          })
          .map((row) => {
            row.uniqueId = uuidV4();
            return row;
          });
        reverse(results);
      } else {
        results = fuse.search(input.split(':')[1]).map((row) => {
          row.uniqueId = uuidV4();
          return row;
        });
        reverse(results);
      }
    }
    setActiveResults(results);
    setInput(query);
    setActiveSelectionIndex(results.length - 1);
    if (!isDirectiveSelected) {
      if ((spaceIndex !== -1) === true) {
        getDirectiveUsage(results, true);
      } else {
        getDirectiveUsage(results, false);
      }
    }
  };

  const handleRowClick = (row) => {
    if (typeof onRowClick !== 'function') {
      return;
    }
    let eventObject = {} as IOnRowClickValue;
    if (!isDirectiveSelected) {
      eventObject = {
        target: { value: `${row.item.directive}` },
      };
      onRowClick(eventObject);
      getDirectiveUsage([row], true);
    } else {
      const splitData = input.split(/(?=[:])|(?<=[:])/g);
      eventObject = {
        target: { value: `${splitData[0]}${splitData[1]}${row.item.label}` },
      };
      setInput(`${splitData[0]}${splitData[1]}${row.item.label}`);
      onRowClick(eventObject);
      onColumnSelected(true);
    }
  };

  return (
    <Box>
      {Array.isArray(activeResults) &&
        activeResults.length > 0 &&
        activeResults.map((row, index) => {
          return (
            <DirectiveResultRow
              isActive={index === activeSelectionIndex}
              key={row.uniqueId}
              onClick={() => handleRowClick(row)}
              data-testid="select-directive-list-option"
            >
              <Box>
                <DirectiveLabel data-testid="select-directive-list-label" variant="body1">
                  {row?.item?.directive || row?.item?.label}
                </DirectiveLabel>
                <DirectiveLabel
                  isDescription={true}
                  data-testid="select-directive-list-description"
                  variant="body1"
                >
                  {row?.item?.description}
                </DirectiveLabel>
              </Box>
            </DirectiveResultRow>
          );
        })}
    </Box>
  );
}
