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
  it('should call getDirective() when there is error in function name', () => {
    expect(
      getDirective('', 'body_0', {
        variableName: '',
        customInput: '',
        selectedColumnForDefineVariable: '',
        filterCondition: 'TEXTEXACTLY',
        selectedColumn: '',
      })
    ).toStrictEqual(null);
  });

  it('should call getDirective() when function name is define-variable and filterCondition is TEXTEXACTLY .', () => {
    expect(
      getDirective('define-variable', 'body_0', {
        variableName: 'testing',
        customInput: 'features',
        selectedColumnForDefineVariable: 'body_1',
        filterCondition: 'TEXTEXACTLY',
        selectedColumn: 'body_1',
      })
    ).toStrictEqual('set-variable testing body_0 == "features" ? body_1 : testing');
  });

  it('should call getDirective() when function name is define-variable and filterCondition is TEXTSTARTSWITH .', () => {
    expect(
      getDirective('define-variable', 'body_0', {
        variableName: 'testing',
        customInput: 'features',
        selectedColumnForDefineVariable: 'body_1',
        filterCondition: 'TEXTSTARTSWITH',
        selectedColumn: 'body_1',
      })
    ).toStrictEqual('set-variable testing body_0 =^ "features" ? body_1 : testing');
  });

  it('should call getDirective() when function name is define-variable and filterCondition is TEXTENDSWITH .', () => {
    expect(
      getDirective('define-variable', 'body_0', {
        variableName: 'testing',
        customInput: 'features',
        selectedColumnForDefineVariable: 'body_1',
        filterCondition: 'TEXTENDSWITH',
        selectedColumn: 'body_1',
      })
    ).toStrictEqual('set-variable testing body_0 =$ "features" ? body_1 : testing');
  });

  it('should call getDirective() when function name is define-variable and filterCondition is TEXTREGEX .', () => {
    expect(
      getDirective('define-variable', 'body_0', {
        variableName: 'testing',
        customInput: 'features',
        selectedColumnForDefineVariable: 'body_1',
        filterCondition: 'TEXTREGEX',
        selectedColumn: 'body_1',
      })
    ).toStrictEqual('set-variable testing body_0 =~ features ? body_1 : testing');
  });

  it('should call getDirective() when function name is define-variable and filterCondition is CUSTOMCONDITION .', () => {
    expect(
      getDirective('define-variable', 'body_0', {
        variableName: 'testing',
        customInput: 'features',
        selectedColumnForDefineVariable: 'body_1',
        filterCondition: 'CUSTOMCONDITION',
        selectedColumn: 'body_1',
      })
    ).toStrictEqual('set-variable testing features ? body_1 : testing');
  });
});
