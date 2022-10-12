/*
 *  Copyright © 2022 Cask Data, Inc.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *  use this file except in compliance with the License. You may obtain a copy of
 *  the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  License for the specific language governing permissions and limitations under
 *  the License.
 */

import { checkFrequentlyOccuredValues, convertNonNullPercent } from '../utils';
import { mock, mockUtilResult } from '../mock/mockDataForGrid';

describe('Test util Function checkFrequentlyOccuredValues', () => {
  it('Should return expected output', () => {
    const key = 'body_4';
    expect(checkFrequentlyOccuredValues(mock, key)).toStrictEqual(mockUtilResult);
  });

  it('should be undefined and trigger 0', () => {
    convertNonNullPercent(
      {
        headers: [],
        types: undefined,
        values: [],
        summary: undefined,
        message: '',
      },
      undefined
    );
  });
});
