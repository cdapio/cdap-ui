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

import { ct1, ct2, ct3 } from '../mock/connectorTypes';
import { mock1, mock2, mock3 } from '../mock/addVersionInfo';
import { getCategoriesToConnectorsMap, addVersionInfo } from '../utils';

describe('Test Utility function - getCategoriesToConnectorsMap', () => {
  it('should return as expected when connectTypes are present', () => {
    const result = getCategoriesToConnectorsMap(ct1);
    expect(result).toStrictEqual(mock1);
  });

  it('should return as expected when connectorTypes are not present', () => {
    const result = getCategoriesToConnectorsMap([]);
    expect(result).toStrictEqual(new Map());
  });

  it('should return as expected when caregory in a connecrType are not present', () => {
    const result = getCategoriesToConnectorsMap(ct2);
    expect(result).toStrictEqual(mock2);
  });

  it('should return as expected when caregory in a connecrType are not present', () => {
    const result = getCategoriesToConnectorsMap(ct3);
    expect(result).toStrictEqual(mock3);
  });
});
