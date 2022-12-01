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

import { getDirective } from 'components/WranglerGrid/AddTransformationPanel/utils';

describe('It should test getDirective function', () => {
  const mockTransformationComponentValues = {
    copyColumnName: 'body_8',
    columnNames: ['body_0', 'body_1', 'body_2', 'body_3', 'body_4', 'body_5'],
  };

  const mockSelectedColumns = [
    {
      name: 'body_0',
      label: 'body_0',
      type: ['String'],
    },
  ];
  it('should call getDirective() when there is error in function name', () => {
    expect(
      getDirective('', 'body_0', mockTransformationComponentValues, mockSelectedColumns)
    ).toStrictEqual(null);
  });

  it('should call getDirective() when function name is string .', () => {
    expect(
      getDirective('string', 'body_0', mockTransformationComponentValues, mockSelectedColumns)
    ).toStrictEqual(`set-type :body_0 string`);
  });
});
