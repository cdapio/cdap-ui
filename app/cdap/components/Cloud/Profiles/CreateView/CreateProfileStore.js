/*
 * Copyright © 2018 Cask Data, Inc.
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

import { createStore } from 'redux';
import { defaultAction, composeEnhancers } from 'services/helpers';

const ACTIONS = {
  updateProfileLabel: 'UPDATE_PROFILE_LABEL',
  updateProfileDescription: 'UPDATE_PROFILE_DESCRIPTION',
  initializeProperties: 'INITIALIZE_PROPERTIES',
  updateProperty: 'UPDATE_PROPERTIES',
  togglePropertyLock: 'TOGGLE_PROPERTY_LOCK',
  reset: 'RESET',
};
const STORE_DEFAULT = {
  label: '',
  name: '',
  description: '',
  properties: {},
  values: {},
};
const createProfileStore = (state = STORE_DEFAULT, action = defaultAction) => {
  switch (action.type) {
    case ACTIONS.updateProfileLabel: {
      let { label = '' } = action.payload;
      return {
        ...state,
        name: label.replace(/\ +/g, '_').toLowerCase(),
        label,
      };
    }
    case ACTIONS.updateProfileDescription:
      return {
        ...state,
        description: action.payload.description,
      };
    case ACTIONS.initializeProperties:
      return {
        ...state,
        properties: action.payload.properties,
        values: action.payload.values,
      };
    case ACTIONS.updateProperty:
      return {
        ...state,
        properties: {
          ...state.properties,
          [action.payload.propName]: {
            ...state.properties[action.payload.propName],
            value: action.payload.propValue,
          },
        },
        values: {
          ...state.values,
          [action.payload.propName]: action.payload.propValue,
        },
      };
    case ACTIONS.togglePropertyLock:
      return {
        ...state,
        properties: {
          ...state.properties,
          [action.payload.propName]: {
            ...state.properties[action.payload.propName],
            isEditable: !state.properties[action.payload.propName].isEditable,
          },
        },
      };
    case ACTIONS.reset:
      return STORE_DEFAULT;
    default:
      return state;
  }
};

const CreateProfilePropertiesStore = createStore(
  createProfileStore,
  STORE_DEFAULT,
  composeEnhancers('CreateProfilePropertiesStore')()
);

export default CreateProfilePropertiesStore;
export { ACTIONS };
