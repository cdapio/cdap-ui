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

import { prepareDataQualtiy } from 'components/ColumnView/SelectColumnsList/utils';
import {
  mockColumnData,
  mockDataQuality,
  mockResult,
} from 'components/ColumnView/mock/mockDataForColumnView';

describe('It Should test the utils function prepareDataQualtiy', () => {
  it('should test whether the utils function return the expected Value', () => {
    expect(prepareDataQualtiy(mockDataQuality, mockColumnData)).toStrictEqual(mockResult);
  });
});
