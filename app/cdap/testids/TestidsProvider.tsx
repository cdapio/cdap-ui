/*
 * Copyright © 2024 Cask Data, Inc.
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

import React, { useContext } from 'react';
import _get from 'lodash/get';
import testids from './testids.yaml';
import { DataTestIdGetter, TestidContext } from './TestidContext';

interface ITestidProviderProps {
  children: React.ReactNode;
}

function getDataTestidInternal(prefixPath: string, siblingKey?: string | number): string {
  // testids is the JS object created from testids.yaml
  // This object represents a prefix tree (the logical heirarchy of UI components/elements in cdap-ui)
  // The values at the leaf nodes of this tree can be null or strings (strings when we are referencing
  // previously hardcoded testid values), for all newly added data-testids the value at the leaf node
  // should be null.

  const actualTestidPrefix = _get(testids, prefixPath);

  // actualTestidPrefix is the value at the node of the prefix tree pointed by the prefixPath provided.
  // We need to ensure that the prefix path provided points to a leaf node. This can be ensured by checking
  // the value of actualTestidPrefix. For leaf nodes this value will always be a string or null.
  if (actualTestidPrefix !== null && typeof actualTestidPrefix !== 'string') {
    return '';
  }

  let actualTestid = actualTestidPrefix;
  if (actualTestidPrefix === null) {
    actualTestid = prefixPath.replace(/\./g, '-');
  }

  if (siblingKey) {
    return `${actualTestid}-${siblingKey}`;
  }

  return actualTestid;
}

/**
 * This function takes a prefix path (from the data-testid heirarchy specified in testids.yaml) and
 * optionally an unique key (string or numeric) to identify elements of same type and returns a string
 * that can be used as the data-testid attribute of the UI element.
 *
 * In development mode this function also checks for the existence of the prefix path in testids.yaml
 *
 * @param prefixPath (string) prefix path from the data-testid heirarchy specified in testids.yaml
 *                   for example 'features.entityListView.entity.named'
 * @param siblingKey (string | number) to uniquely identify elements of the same type at the same heirarchial level
 * @returns (string) an unique string that can be used as the data-testid attribute of the UI element
 */
export function getDataTestid(prefixPath: string, siblingKey?: string | number): string {
  const testidValue = getDataTestidInternal(prefixPath, siblingKey);

  // runs only in development
  if (window.CDAP_CONFIG.uiValidateTestids) {
    if (!testidValue) {
      throw new Error(
        `Using a data-testid that is not defined in testids.yaml: 
        prefixPath = ${prefixPath}, siblingIndex = ${siblingKey} .`
      );
    }
  }

  return testidValue;
}

export function TestidProvider({ children }: ITestidProviderProps): JSX.Element {
  return <TestidContext.Provider value={getDataTestid}>{children}</TestidContext.Provider>;
}

export function useTestid(): DataTestIdGetter {
  return useContext(TestidContext);
}
