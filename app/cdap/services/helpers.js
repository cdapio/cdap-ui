/*
 * Copyright © 2016-2018 Cask Data, Inc.
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

import isObject from 'lodash/isObject';
import numeral from 'numeral';
import moment from 'moment';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import T from 'i18n-react';
import { compose } from 'redux';
import uuidV4 from 'uuid/v4';
import round from 'lodash/round';
import React from 'react';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import transform from 'lodash/transform';
import isArray from 'lodash/isArray';
// We don't use webpack alias here because this is used in Footer which is used in login app
// And for login 'components/Lab/..' aliases to components folder inside login app.
import experimentsList from '../components/Lab/experiment-list.tsx';
/*
  Purpose: Query a json object or an array of json objects
  Return: Returns undefined if property is not defined(never set) and
          and a valid value (including null) if defined.
  Usage:
    var obj1 = [
      {
        p1: 'something',
        p2: {
          p21: 'angular',
          p22: 21,
          p23: {
            p231: 'ember',
            p232: null
          }
        },
        p3: 1296,
        p4: [1, 2, 3],
        p5: null
      },
      {
        p101: 'somethingelse'
      }
    ]
    1. query(obj1, 0, 'p1') => 'something'
    2. query(obj1, 0, 'p2', 'p22') => 21
    3. query(obj1, 0, 'p2', 'p32') => { p231: 'ember'}
    4. query(obj1, 0, 'notaproperty') => undefined
    5. query(obj1, 0, 'p2', 'p32', 'somethingelse') => undefined
    6. query(obj1, 1, 'p2', 'p32') => undefined
    7. query(obj1, 0, 'p2', 'p23', 'p232') => null
    8. query(obj1, 0, 'p5') => null
 */

function objectQuery(obj) {
  if (!isObject(obj)) {
    return null;
  }
  for (var i = 1; i < arguments.length; i++) {
    if (!isObject(obj)) {
      return undefined;
    }
    obj = obj[arguments[i]];
  }
  return obj;
}
export const HUMANREADABLESTORAGE = 'STORAGE';
export const HUMANREADABLESTORAGE_NODECIMAL = 'NODECIMAL';
export const HUMANREADABLE_DECIMAL = 'DECIMAL';
function humanReadableNumber(num, type) {
  if (typeof num !== 'number') {
    return num;
  }

  switch (type) {
    case HUMANREADABLESTORAGE:
      return convertBytesToHumanReadable(num);
    case HUMANREADABLESTORAGE_NODECIMAL:
      return convertBytesToHumanReadable(num, HUMANREADABLESTORAGE_NODECIMAL);
    case HUMANREADABLE_DECIMAL:
      return numeral(num).format('0,0[.]0000');
    default:
      return numeral(num).format('0,0');
  }
}

function truncateNumber(num, precision = 0) {
  if (typeof num !== 'number') {
    return num;
  }

  let format = '0';
  if (precision === 0) {
    return numeral(num).format(`${format}a`).toUpperCase();
  }

  format = format.concat('.');

  for (let i = 0; i < precision; i++) {
    format = `${format}0`;
  }

  format = `${format}a`;

  return numeral(num).format(format).toUpperCase();
}

// FIXME: humanReadableDate(date, options = {isMilliseconds: false, shortForm: false}) would have been\
// more readable api. We should think about changing the function signature.
function humanReadableDate(date, isMilliseconds, shortForm = false, customFormat = '') {
  if (!date) {
    return '--';
  }

  const format = customFormat ? customFormat : (shortForm ? 'MM-DD-YYYY' : 'MM-DD-YYYY hh:mm:ss A');
  if (isMilliseconds) {
    return moment(date).format(format);
  }
  return moment(date * 1000).format(format);
}

const ONE_SECOND_MS = 1000;
const ONE_MIN_SECONDS = 60;
const ONE_HOUR_SECONDS = ONE_MIN_SECONDS * 60;
const ONE_DAY_SECONDS = ONE_HOUR_SECONDS * 24;
const ONE_WEEK_SECONDS = ONE_DAY_SECONDS * 7;
const ONE_MONTH_SECONDS = ONE_DAY_SECONDS * 30;
const ONE_YEAR_SECONDS = ONE_MONTH_SECONDS * 12;

function humanReadableDuration(timeInSeconds, shortForm = false) {
  if (typeof timeInSeconds !== 'number') {
    return timeInSeconds;
  }
  const pluralize = (number, label) => (number > 1 ? `${label}s` : label);
  if (timeInSeconds < 60) {
    return `${Math.floor(timeInSeconds)} ${pluralize(
      timeInSeconds,
      T.translate('commons.secShortLabel')
    )}`;
  }
  if (timeInSeconds < ONE_HOUR_SECONDS) {
    let mins = Math.floor(timeInSeconds / ONE_MIN_SECONDS);
    let secs = Math.floor(timeInSeconds % ONE_MIN_SECONDS);
    return `${mins} ${pluralize(mins, 'min')} ${secs} secs`;
  }
  if (timeInSeconds < ONE_DAY_SECONDS) {
    let hours = Math.floor(timeInSeconds / ONE_HOUR_SECONDS);
    return shortForm
      ? `${hours} ${pluralize(hours, 'hour')}`
      : `${hours} ${pluralize(hours, 'hour')} ${humanReadableDuration(
          timeInSeconds - ONE_HOUR_SECONDS * hours
        )}`;
  }
  if (timeInSeconds < ONE_WEEK_SECONDS) {
    let days = Math.floor(timeInSeconds / ONE_DAY_SECONDS);
    return shortForm
      ? `${days} ${pluralize(days, 'day')}`
      : `${days} ${pluralize(days, 'day')} ${humanReadableDuration(
          timeInSeconds - ONE_DAY_SECONDS * days
        )}`;
  }
  // Hopefully we don't reach beyond this point.
  if (timeInSeconds < ONE_MONTH_SECONDS) {
    let weeks = Math.floor(timeInSeconds / ONE_WEEK_SECONDS);
    return shortForm
      ? `${weeks} ${pluralize(weeks, 'week')}`
      : `${weeks} ${pluralize(weeks, 'week')} ${humanReadableDuration(
          timeInSeconds - ONE_WEEK_SECONDS * weeks
        )}`;
  }
  if (timeInSeconds < ONE_YEAR_SECONDS) {
    let months = Math.floor(timeInSeconds / ONE_MONTH_SECONDS);
    return shortForm
      ? `${months} ${pluralize(months, 'month')}`
      : `${months} ${pluralize(months, 'month')} ${humanReadableDuration(
          timeInSeconds - ONE_MONTH_SECONDS * months
        )}`;
  }
}

function timeSinceCreated(timeInSeconds, shortForm) {
  if (isNaN(timeInSeconds)) {
    return '--';
  }
  return `${humanReadableDuration(timeInSeconds, shortForm)} ago`;
}

function convertBytesToHumanReadable(bytes, type, includeSpace) {
  if (!bytes || typeof bytes !== 'number') {
    return bytes;
  }
  let format = includeSpace ? '0.00 b' : '0.00b';

  if (type === HUMANREADABLESTORAGE_NODECIMAL) {
    format = includeSpace ? '0 b' : '0b';
  }

  return numeral(bytes).format(format);
}
/**
 * Check if child is a descendant of the parent. This is
 * usually used when checking if the (click) event target is
 * within a specific element or is outside.
 *
 * We usually use this utility for a popover'ish behavior where
 * clicking on anywhere outside of the popover should trigger a close.
 *
 * @param parent parent container to check
 * @param child child where the (click) event originated.
 *
 * @deprecated Try to use containerRef.contains(DOM_NODE_FROM_EVENT) as this is native.
 * containerRef being the ref (html) element handed to us by react.
 */
function isDescendant(parent, child) {
  var node = child;
  while (node != null) {
    if (node == parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

function getArtifactNameAndVersion(nameWithVersion) {
  // core-plugins-3.4.0-SNAPSHOT.jar
  // extracts version from the jar file name. We then get the name of the artifact (that is from the beginning up to version beginning)
  // Fixed it to use a suffix pattern. Added `\\-` to detect versions from names such as `redshifttos3-action-plugin-1.0.0.json`
  if (isNil(nameWithVersion) || isEmpty(nameWithVersion)) {
    return { name: nameWithVersion, version: undefined };
  }
  let regExpRule = new RegExp('\\-(\\d+)(?:\\.(\\d+))?(?:\\.(\\d+))?(?:[.\\-](.*))?$');
  let version = regExpRule.exec(nameWithVersion);
  if (version && Array.isArray(version)) {
    version = version[0].slice(1);
  } else {
    // when version is the filename i.e 1.2.3.jar or ojdbc8.jar
    let nameIsVersionRegEx = new RegExp('(\\d+)(?:\\.(\\d+))?(?:\\.(\\d+))?(?:[.\\-](.*))?$');
    let validVersion = nameIsVersionRegEx.exec(nameWithVersion);
    if (validVersion && Array.isArray(validVersion)) {
      return { name: nameWithVersion, version: validVersion[0] };
    }
  }
  let name = version
    ? nameWithVersion.substr(0, nameWithVersion.indexOf(version) - 1)
    : nameWithVersion;
  // if version is not present, default it to 1.0.0
  if (!version) {
    version = '1.0.0';
  }
  return { version, name };
}

function insertAt(arr, index, element) {
  return [...arr.slice(0, index + 1), element, ...arr.slice(index + 1, arr.length)];
}

function removeAt(arr, index) {
  return [...arr.slice(0, index), ...arr.slice(index + 1, arr.length)];
}

function getIcon(entity) {
  switch (entity) {
    case 'application':
    case 'app':
      return 'icon-fist';
    case 'dataset':
      return 'icon-datasets';
    default:
      return 'fa-exclamation-triangle';
  }
}

const defaultEventObject = {
  stopPropagation: () => {},
  nativeEvent: {
    stopImmediatePropagation: () => {},
  },
  preventDefault: () => {},
};

function preventPropagation(e = defaultEventObject) {
  e.stopPropagation();
  e.nativeEvent ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
  e.preventDefault();
}

function isNilOrEmptyString(value) {
  return isNil(value) || value === '';
}

function isNilOrEmpty(value) {
  return isNil(value) || isEmpty(value);
}

function isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

function wholeArrayIsNumeric(values) {
  return values.reduce((prev, curr) => {
    return prev && isNumeric(curr);
  }, isNumeric(values[0]));
}

function requiredFieldsCompleted(state, requiredFields) {
  for (let i = 0; i < requiredFields.length; i++) {
    let requiredField = requiredFields[i];
    if (isNilOrEmptyString(state[requiredField])) {
      return false;
    }
  }

  return true;
}

const defaultAction = {
  action: '',
  payload: {},
};

const difference = (first, second) => {
  return first > second ? first - second : second - first;
};

const isPluginSink = (pluginType) => {
  return ['batchsink', 'realtimesink', 'sparksink'].indexOf(pluginType) !== -1;
};

const isPluginSource = (pluginType) => {
  return ['batchsource', 'realtimesource', 'streamingsource'].indexOf(pluginType) !== -1;
};

const isBatchPipeline = (pipelineType) => {
  return ['cdap-data-pipeline'].indexOf(pipelineType) !== -1;
};

const composeEnhancers = (storeTitle) =>
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        name: storeTitle,
      })
    : compose;

const reverseArrayWithoutMutating = (array) => {
  if (isNil(array)) {
    return [];
  }

  let newArray = [];
  for (let i = array.length - 1; i >= 0; i--) {
    newArray.push(array[i]);
  }
  return newArray;
};

const convertMapToKeyValuePairs = (map, addUniqueId = true) => {
  if (addUniqueId) {
    return Object.entries(map).map(([key, value]) => {
      return {
        key,
        value,
        uniqueId: 'id-' + uuidV4(),
      };
    });
  }
  return Object.entries(map).map(([key, value]) => {
    return {
      key,
      value,
    };
  });
};

const convertKeyValuePairsToMap = (keyValuePairs, ignoreNonNilValues = false) => {
  let map = {};
  keyValuePairs.forEach((currentPair) => {
    let isValidValue = ignoreNonNilValues || !isNilOrEmpty(currentPair.value);
    if (!isNilOrEmpty(currentPair.key) && isValidValue) {
      map[currentPair.key] = currentPair.value;
    }
  });
  return map;
};

const roundDecimalToNDigits = (num, digits = 2) => {
  let newNum = num;
  if (typeof num !== 'number') {
    newNum = parseFloat(num, 10);
  }
  if (isNaN(num)) {
    return num;
  }
  return round(newNum, digits);
};

/*
 *  This function is used to turn query parameters in the URL into a key-value object
 *  eg:
 *    URL: localhost:11011/some/path?key1=value1&key2=value2
 *
 *    returns:
 *    {
 *      key1: value1,
 *      key2: value2
 *    }
 */
const parseQueryString = () => {
  const queryStr = location.search.slice(1);

  if (queryStr.length === 0) {
    return null;
  }

  let queryObj = {};

  queryStr.split('&').forEach((pair) => {
    const index = pair.indexOf('=');
    const key = pair.slice(0, index);
    const value = pair.slice(index + 1);

    queryObj[key] = value;
  });

  return queryObj;
};

/**
 * Check if a plugin value is a macro.
 */
const isMacro = (value) => {
  if (!value || !value.length) {
    return false;
  }

  const beginChar = value.indexOf('${') === 0;
  const endingChar = value.charAt(value.length - 1) === '}';

  return beginChar && endingChar;
}


/**
 * This function will remove any empty string values from the JSON object.
 *
 * ie.
 * input = {
 *    a: 'test',
 *    b: ''
 * }
 *
 * response:
 * {
 *    a: 'test'
 * }
 *
 * @param {*} obj
 */
function removeEmptyJsonValues(obj) {
  const newValues = { ...obj };
  // remove empty string values
  Object.keys(newValues).forEach((propertyName) => {
    if (typeof newValues[propertyName] === 'string' && newValues[propertyName].length === 0) {
      delete newValues[propertyName];
    }
  });

  return newValues;
}

function handlePageLevelError(error) {
  // This function parses receiveing error messages and converts it to a
  // format that page level error supports
  let message = null;
  let errorCode = null;
  if (error.data) {
    message = error.data;
  } else if (typeof error.response === 'string') {
    message = error.response;
  }

  if (error.statusCode) {
    errorCode = error.statusCode;
  } else {
    // If we don't know about the error type, showing a 500 level error
    errorCode = 500;
  }
  return {errorCode, message};
}

function extractErrorMessage(errObj) {
  if (typeof errObj === 'string') {
    return errObj;
  }

  return objectQuery(errObj, 'response', 'message') || objectQuery(errObj, 'response');
}

/**
 * Returns true if the error message indicates unknown database error
 * @param err the error message
 * @returns boolean
 */
function isUnknownDatabaseError(err) {
  return typeof err === 'string' && err.toLowerCase().startsWith('unknown database');
}

function connectWithStore(store, WrappedComponent, ...args) {
  const ConnectedWrappedComponent = connect(...args)(WrappedComponent);
  // eslint-disable-next-line react/display-name
  return function(props) {
    return <ConnectedWrappedComponent {...props} store={store} />;
  };
}
/**
 * This function formats the graphQl errors by error type
 * { errorType: ['message1', 'message2'] ....} will be
 * the format of categorized errors.
 */
function categorizeGraphQlErrors(error) {
  const GENERIC_ERROR_ORIGIN = 'generic';
  const graphQLErrors = objectQuery(error, 'graphQLErrors') || [];
  const networkErrors = objectQuery(error, 'networkError') || [];
  const errorsByOrigin = {};
  if (graphQLErrors.length === 0 && networkErrors.length === 0 && error) {
    errorsByOrigin[GENERIC_ERROR_ORIGIN] = error.message;
  }
  /* 
    TODO: These array checks are guarding against the page crashing when graphQL errors
    or network errors aren't an array - we haven't been able to repro this locally so
    we don't know how to handle it properly. When are these not an array?
  */ 
  if (Array.isArray(graphQLErrors)) {
    graphQLErrors.forEach(error => {
      const errorOrigin = objectQuery(error, 'extensions', 'exception', 'errorOrigin') || GENERIC_ERROR_ORIGIN;
      if (errorsByOrigin.hasOwnProperty(errorOrigin)) {
        errorsByOrigin[errorOrigin].push(error.message);
      }
      else {
        errorsByOrigin[errorOrigin] = [error.message];
      }
    });
  } else {
    console.log(graphQLErrors);
  }

  // Categorize all graphQL network errors with type 'network'
  if (Array.isArray(networkErrors)) {
    networkErrors.forEach(error => {
      if (errorsByOrigin.hasOwnProperty('network')) {
        errorsByOrigin['network'].push(error.message);
      } else {
        errorsByOrigin['network'] = [error.message];
      }
    });
  } else {
    console.log(networkErrors);
  }

  return errorsByOrigin;
}

function dumbestClone(jsonObj) {
  let result;
  try {
    result = JSON.parse(JSON.stringify(jsonObj));
  } catch (e) {
    return jsonObj;
  }
  return result;
}

function getExperimentValue(experimentID) {
  return window.localStorage.getItem(`${experimentID}-value`);
}

function isExperimentEnabled(experimentID) {
  return window.localStorage.getItem(`${experimentID}`) === 'true';
}

/**
 *
 * @param nodes - List of plugins being pasted
 * @param availablePlugins - List of available plugins for which UI already has widget json
 * @param oldNameToNewNameMap - Map of old plugin names to new name the plugins are renamed to
 *
 * TL;DR- CDAP-17252: Fix copy/pasting nodes/connections in pipeline studio
 *
 * When we copy/paste nodes/connections in plugin studio we need to make sure the new nodes
 * pasted are unique (different name) and the corresponding connections have new names.
 *
 * Renaming nodes will lead to incosistent states in plugins where names of previous stages are used.
 * Plugins like joiner needs to use the stage name in some of its properties and chaning the name
 * will cause the state of the plugin to be broken.
 *
 * This function targets widgets that uses input stage names in plugin properties.
 *
 * We cycle through the node widget json and modify those properties that use specific widgets
 * (reference node names) and replace the old node names with new names that we UI generated.
 *
 * This is only for those subset of nodes that are being copy/pasted.
 *
 */
function sanitizeNodeNamesInPluginProperties(nodes, availablePlugins, oldNameToNewNameMap) {
  const widgetsToWatch = ['join-types', 'sql-conditions', 'sql-select-fields', 'multiple-input-stage-selector'];
  const widgetToMapperFn = {
    'join-types': (propertyValue, oldNameToNewNameMap) => {
      const stageNames = propertyValue.split(',').map(input => input.trim());
      const newStageNames = stageNames.map(stage => {
        if (stage in oldNameToNewNameMap) {
          return oldNameToNewNameMap[stage];
        }
        return stage;
      });
      return newStageNames.join(',');
    },
    'sql-select-fields': (propertyValue, oldNameToNewNameMap, nodes) => {
      const entries = propertyValue.split(',');
      const newEntries = entries.map(entry => {
        const split = entry.split(' as ');
        const fieldInfo = split[0].split('.');
        if (fieldInfo.length > 1) {
          const stageName = fieldInfo[0];
          const fieldName = fieldInfo[1];
          if (stageName in oldNameToNewNameMap) {
            return `${oldNameToNewNameMap[stageName]}.${fieldName} as ${split[1]}`;
          }
        }
        return entry;
      });
      return newEntries.join(',');
    },
    'sql-conditions': (propertyValue, oldNameToNewNameMap) => {
      const conditions = propertyValue.split('&').map(condition => condition.trim());
      const newConditions = conditions.map(condition => {
        const newCondition = condition.split('=').map(field => {
          const splitField = field.trim().split('.');
          const stageName = splitField[0];
          if (stageName in oldNameToNewNameMap) {
            return [oldNameToNewNameMap[stageName], splitField[1]].join('.');
          }
          return field;
        });
        return newCondition.join('=');
      });
      return newConditions.join('&');
    },
    'multiple-input-stage-selector': (propertyValue, oldNameToNewNameMap) => {
      const stages = propertyValue.split(',');
      const newStages = stages.map(stage => {
        if (stage in oldNameToNewNameMap) {
          return oldNameToNewNameMap[stage];
        }
        return stage;
      });
      return newStages.join(',');
    },
  };
  const newNodes = nodes.map(node => {
    const { type, plugin } = node;
    const pluginKey = `${plugin.name}-${type}`;
    const { name, version, scope } = plugin.artifact;
    const artifactKey = `${name}-${version}-${scope}`;
    const key = `${pluginKey}-${artifactKey}`;
    if (key in availablePlugins.plugins.pluginsMap) {
      const pluginObj = availablePlugins.plugins.pluginsMap[key];
      if (!pluginObj) {
        return node;
      }
      const widgets = availablePlugins.plugins.pluginsMap[key].widgets;
      if (!widgets) {
        return node;
      }
      widgets['configuration-groups'].forEach(group => {
        group.properties.forEach(property => {
          const widget = property['widget-type'];
          const propertyValue = plugin.properties[property.name];
          if (
            widgetsToWatch.indexOf(widget) !== -1 &&
            !isNilOrEmpty(propertyValue)
          ) {
            plugin.properties[property.name] = widgetToMapperFn[widget](propertyValue, oldNameToNewNameMap);
          }
        });
      });
    }
    return node;
  });
  return newNodes;
}

function isValidEntityName(name) {
  if (!name) {
    return false;
  }

  const pattern = /^[\w-]+$/;

  return pattern.test(name);
}
function setupExperiments() {
  return experimentsList.map((experiment) => {
    // If the experiment is forcefully disabled do not check
    // the localStorage. Update localStorage with disabled state.
    if (experiment.force && !experiment.enabled) {
      window.localStorage.setItem(experiment.experimentId, experiment.enabled.toString());
      return;
    }
    // If experiment preference is present in storage, use it.
    // If not, use the default value and set it in storage and use it.
    const experimentStatusFromStorage = window.localStorage.getItem(experiment.experimentId);
    if (experimentStatusFromStorage === null) {
      window.localStorage.setItem(experiment.experimentId, experiment.enabled.toString());
    } else {
      experiment.enabled = experimentStatusFromStorage === 'true';
    }
    return experiment;
  });
};

function isAuthSetToProxyMode() {
  return window.CDAP_CONFIG.securityEnabled &&  window.CDAP_CONFIG.securityMode === 'PROXY';
}

function isAuthSetToManagedMode() {
  return (
    window.CDAP_CONFIG.securityEnabled
    && ['', undefined, 'MANAGED'].indexOf(window.CDAP_CONFIG.securityMode) !== -1
  );
}

function santizeStringForHTMLID(str) {
  if (typeof str !== 'string') {
    return str;
  }
  return str.replace(/[ \/]/g, '-');
}

/**
 * Method to open link with a new tab
 * @param link - the link to route to.
 */
function openLinkInNewTab(link) {
  window.open(link, '_blank');
};

/**
 * Find difference between two objects
 * @param  {object} origObj - Source object to compare newObj against
 * @param  {object} newObj  - New object with potential changes
 * @return {object} differences
 */
const differenceBetweenObjects = (origObj, newObj) => {
  function changes(newObj, origObj) {
    let arrayIndexCounter = 0;
    return transform(newObj, function(result, value, key) {
      if (!isEqual(value, origObj[key])) {
        const resultKey = isArray(origObj) ? arrayIndexCounter++ : key;
        result[resultKey] =
          isObject(value) && isObject(origObj[key]) ? changes(value, origObj[key]) : value;
      }
    });
  }
  return changes(newObj, origObj);
};

/**
 * remove undefined fields from object recursively
 * @param  {object} obj - Object to cleanse
 */
function cleanseObject(obj) {
  Object.keys(obj).forEach(function(key) {
    // Get this value and its type
    var value = obj[key];
    if (isObject(value)) {
      // Recurse...
      cleanseObject(value);
      if (!Object.keys(value).length) {
        delete obj[key];
      }
    } else if (value === undefined) {
      // Undefined, remove it
      delete obj[key];
    }
  });
}

/**
 * Compare if two objects are the same
 * @param  {object} obj1 - Object 1
 * @param  {object} obj2 - Object 2
 * @return {boolean} if they are the same
 */
const cleanseAndCompareTwoObjects = (obj1, obj2) => {
  cleanseObject(obj1)
  cleanseObject(obj2)
  return isEqual(obj1, obj2)
}

/**
 * 
 * @param {object} ob - object to be flattened
 * @returns {object} a flattened object with keys concatenated with '.'
 */
const flattenObj = (ob) => {
 
  // The object which contains the
  // final result
  let result = {};

  // loop through the object "ob"
  for (const i in ob) {

      // We check the type of the i using
      // typeof() function and recursively
      // call the function again
      if ((typeof ob[i]) === 'object' && !Array.isArray(ob[i])) {
          const temp = flattenObj(ob[i]);
          for (const j in temp) {

              // Store temp in result
              result[i + '.' + j] = temp[j];
          }
      }

      // Else store ob[i] in result directly
      else {
          result[i] = ob[i];
      }
  }
  return result;
};

/**
 * 
 * @param {string[]} arr - a string array to search
 * @param {string} target - target string
 * @returns 
 */
const arrayOfStringsMatchTargetPrefix = (arr, target) => {
  if (!target) {
    return false
  }
  for (let x of arr) {
    if (target.startsWith(x)) {
      return true
    }
  }
  return false
}

const PIPELINE_ARTIFACTS = [
  'cdap-data-pipeline',
  'cdap-data-streams',
];

export {
  openLinkInNewTab,
  objectQuery,
  convertBytesToHumanReadable,
  humanReadableNumber,
  truncateNumber,
  humanReadableDuration,
  timeSinceCreated,
  isDescendant,
  getArtifactNameAndVersion,
  insertAt,
  removeAt,
  humanReadableDate,
  getIcon,
  preventPropagation,
  requiredFieldsCompleted,
  defaultAction,
  difference,
  isPluginSource,
  isPluginSink,
  isBatchPipeline,
  composeEnhancers,
  ONE_SECOND_MS,
  ONE_MIN_SECONDS,
  ONE_HOUR_SECONDS,
  ONE_DAY_SECONDS,
  ONE_WEEK_SECONDS,
  ONE_MONTH_SECONDS,
  ONE_YEAR_SECONDS,
  isNumeric,
  wholeArrayIsNumeric,
  reverseArrayWithoutMutating,
  convertMapToKeyValuePairs,
  convertKeyValuePairsToMap,
  isNilOrEmpty,
  isNilOrEmptyString,
  roundDecimalToNDigits,
  parseQueryString,
  isMacro,
  removeEmptyJsonValues,
  handlePageLevelError,
  extractErrorMessage,
  isUnknownDatabaseError,
  connectWithStore,
  dumbestClone,
  categorizeGraphQlErrors,
  getExperimentValue,
  isExperimentEnabled,
  sanitizeNodeNamesInPluginProperties,
  isValidEntityName,
  setupExperiments,
  defaultEventObject,
  isAuthSetToProxyMode,
  isAuthSetToManagedMode,
  santizeStringForHTMLID,
  differenceBetweenObjects,
  cleanseObject,
  cleanseAndCompareTwoObjects,
  flattenObj,
  arrayOfStringsMatchTargetPrefix,
  PIPELINE_ARTIFACTS,
};
