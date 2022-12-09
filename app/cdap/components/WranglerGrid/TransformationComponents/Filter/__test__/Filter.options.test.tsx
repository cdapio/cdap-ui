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

import { FILTER_OPTIONS } from '../options';

describe('Testing functions in options.ts file', () => {
  it('Should test FILTER_OPTIONS[0].directive() when value is EMPTY', () => {
    expect(
      FILTER_OPTIONS[0].directive('filter-rows-on condition-true', 'feature_id', false, '')
    ).toStrictEqual('filter-rows-on condition-true feature_id == null || feature_id =~ "^\\W*$"');
  });

  it('Should test FILTER_OPTIONS[1].directive() when value is TEXTEXACTLY', () => {
    expect(
      FILTER_OPTIONS[1].directive('filter-rows-on condition-true', 'feature_id', false, '')
    ).toStrictEqual('filter-rows-on condition-true feature_id ^$');
    expect(
      FILTER_OPTIONS[1].directive('filter-rows-on condition-true', 'feature_id', true, '')
    ).toStrictEqual('filter-rows-on condition-true feature_id ^(?i)$');
  });

  it('Should test FILTER_OPTIONS[2].directive() when value is TEXTCONTAINS', () => {
    expect(
      FILTER_OPTIONS[2].directive('filter-rows-on condition-true', 'feature_id', false, '')
    ).toStrictEqual('filter-rows-on condition-true feature_id .*.*');
    expect(
      FILTER_OPTIONS[2].directive('filter-rows-on condition-true', 'feature_id', true, '')
    ).toStrictEqual('filter-rows-on condition-true feature_id .*(?i).*');
  });

  it('Should test FILTER_OPTIONS[3].directive() when value is TEXTSTARTSWITH', () => {
    expect(
      FILTER_OPTIONS[3].directive('filter-rows-on condition-true', 'feature_id', false, '')
    ).toStrictEqual('filter-rows-on condition-true feature_id =^ ""');
    expect(
      FILTER_OPTIONS[3].directive('filter-rows-on condition-true', 'feature_id', true, '')
    ).toStrictEqual('filter-rows-on condition-true feature_id.toLowerCase() =^ "".toLowerCase()');
  });

  it('Should test FILTER_OPTIONS[4].directive() when value is TEXTENDSWITH', () => {
    expect(
      FILTER_OPTIONS[4].directive('filter-rows-on condition-true', 'feature_id', false, '')
    ).toStrictEqual('filter-rows-on condition-true feature_id =$ ""');
    expect(
      FILTER_OPTIONS[4].directive('filter-rows-on condition-true', 'feature_id', true, '')
    ).toStrictEqual('filter-rows-on condition-true feature_id.toLowerCase() =$ "".toLowerCase()');
  });

  it('Should test FILTER_OPTIONS[5].directive() when value is TEXTREGEX', () => {
    expect(
      FILTER_OPTIONS[5].directive('filter-rows-on condition-true', 'feature_id', false, '')
    ).toStrictEqual('filter-rows-on condition-true feature_id ');
  });

  it('Should test FILTER_OPTIONS[6].directive() when value is CUSTOMCONDITION', () => {
    expect(
      FILTER_OPTIONS[6].directive('filter-rows-on condition-true', 'feature_id', false, '')
    ).toStrictEqual('filter-rows-on condition-true feature_id ');
  });
});
