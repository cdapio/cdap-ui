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

export const initialDirectiveInputState = {
  inputDirective: '',
  isDirectiveSet: false,
  appliedDirective: [],
  directiveColumnCount: 1,
  directiveUsageList: [],
  directivesList: [],
  isDirectivePaste: false,
};

enum IDirectiveActions {
  INPUT_DIRECTIVE,
  DIRECTIVE_SET,
  APPLIED_DIRECTIVE,
  DIRECTIVE_COLUMN_COUNT,
  DIRECTIVE_USAGE_LIST,
  DIRECTIVE_LIST,
  DIRECTIVE_PASTE,
}

export const reducer = (state, action) => {
  switch (action.type) {
    case IDirectiveActions.INPUT_DIRECTIVE:
      return {
        ...state,
        inputDirective: action.payload,
      };
    case IDirectiveActions.DIRECTIVE_SET:
      return {
        ...state,
        isDirectiveSet: action.payload,
      };
    case IDirectiveActions.APPLIED_DIRECTIVE:
      return {
        ...state,
        appliedDirective: action.payload,
      };
    case IDirectiveActions.DIRECTIVE_COLUMN_COUNT:
      return {
        ...state,
        directiveColumnCount: action.payload,
      };
    case IDirectiveActions.DIRECTIVE_USAGE_LIST:
      return {
        ...state,
        directiveUsageList: action.payload,
      };
    case IDirectiveActions.DIRECTIVE_LIST:
      return {
        ...state,
        directivesList: action.payload,
      };

    case IDirectiveActions.DIRECTIVE_PASTE:
      return {
        ...state,
        isDirectivePaste: action.payload,
      };

    default:
      return state;
  }
};
