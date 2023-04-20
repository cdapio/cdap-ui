/*
 * Copyright © 2019 Cask Data, Inc.
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

// jexl library to parse js expression specified in widget json
import {
  CustomOperator,
  IConfigurationGroup,
  IPropertyFilter,
  IPropertyTypedValues,
  IPropertyValues,
  IPropertyValueType,
  IWidgetJson,
  IWidgetProperty,
  PluginProperties,
  PropertyShowConfigTypeEnums,
} from 'components/shared/ConfigurationGroup/types';
import {
  IProcessedConfigurationGroups,
  processConfigurationGroups,
} from 'components/shared/ConfigurationGroup/utilities';
import jexl from 'jexl';
import difference from 'lodash/difference';
import flatten from 'lodash/flatten';
import isPlainObject from 'lodash/isPlainObject';
import { isMacro, objectQuery } from 'services/helpers';

export interface IFilteredWidgetProperty extends IWidgetProperty {
  show?: boolean;
}

export interface IFilteredConfigurationGroup extends IConfigurationGroup {
  show?: boolean;
  properties: IFilteredWidgetProperty[];
}

/**
 * CDAP UI provides some simple operations like @{ICustomOperators}
 * This is to evaluate the condition object for simpler cases.
 */
function evaluateConditionObj(filter: IPropertyFilter, propertyValues: IPropertyValues) {
  const { property, operator } = filter.condition;
  let { value } = filter.condition;
  if (typeof value !== 'undefined' && value !== null) {
    if (isPlainObject(value)) {
      value = JSON.stringify(value);
    } else {
      value = value.toString();
    }
  }
  switch (operator) {
    case CustomOperator.EQUALTO:
      return propertyValues[property] === value;
    case CustomOperator.NOTEQUALTO:
      return propertyValues[property] !== value;
    case CustomOperator.EXISTS:
      return propertyValues[property];
    case CustomOperator.DOESNOTEXISTS:
      return !propertyValues[property];
    default:
      return false;
  }
}

/**
 * Determine if a property filter is true
 * based on the property values.
 * @param filter
 * @param propertyValues
 * @param propertiesFromBackend
 * @returns Result of evaluating the filter.
 * In general, `true` means the property should be shown.
 */
export function evaluateFilter(
  filter: IPropertyFilter,
  propertyValues: IPropertyValues,
  propertiesFromBackend: PluginProperties
) {
  if (!filter.condition.expression) {
    return evaluateConditionObj(filter, propertyValues);
  }

  // Skip filtering condition in which the property in the condition
  // is a macro. We can't decide if the condition will be true or not.
  // So always show the field.
  if (expressionContainMacro(filter, propertyValues)) {
    return true;
  }

  // convert string 'true' to boolean
  const featureFlags = { ...window?.CDAP_CONFIG?.featureFlags };
  for (const key of Object.keys(featureFlags)) {
    featureFlags[key] = featureFlags[key] === 'true';
  }
  const typedPropertyValues = {
    ...getTypedPropertyValues(propertyValues, propertiesFromBackend),
    featureFlags,
  };

  // Some upgrade scenarios leave useConnection as null,
  // which prevents the connection properties from being shown
  // Modify any expression which depends on useConnection equaling false
  const expressionHandleUseConnectionNull = filter.condition.expression.replace(
    'useConnection == false',
    'useConnection != true'
  );
  return jexl.evalSync(expressionHandleUseConnectionNull, typedPropertyValues);
}

/**
 * Parse the expression and find the token literals involved in the expression.
 * This is to check if the literal property has a macro.
 */
function expressionContainMacro(filter: IPropertyFilter, propertyValues: IPropertyValues) {
  const literals = (jexl.expr([])._lexer.tokenize(filter.condition.expression) || [])
    .filter((token) => token.type === 'identifier')
    .map((token) => token.value);
  const literalsWithMacro = literals.filter((literal) => {
    return propertyValues && propertyValues[literal] && isMacro(propertyValues[literal]);
  });
  return literalsWithMacro.length;
}

/**
 * Infers type based on the value. This is only a close approximation
 * Right now infers Boolean, string and number (int, long and float) types.
 */
function inferTypeFromValue(value: string): IPropertyValueType {
  const typedValue = value;
  // Handles both string to float & integer conversions
  if (!isNaN(Number(typedValue))) {
    return Number(typedValue);
  }
  // Handles boolean value
  if (typedValue === 'true' || typedValue === 'false') {
    return typedValue === 'true' ? true : false;
  }
  // If none match fallback to string;
  return typedValue;
}

/**
 * Determines type for the value of a property based on the type
 * provided by the backend.
 */
function getValueFromBackendType(type: string, propertyValue: string): IPropertyValueType {
  if (!type) {
    return inferTypeFromValue(propertyValue);
  }
  switch (type) {
    case 'boolean':
      return propertyValue === 'true' ? true : false;
    case 'int':
    case 'long':
      return isNaN(Number(propertyValue)) ? propertyValue : Number(propertyValue);
    case 'string':
    default:
      // We still infer the type here as a 'string' type from backend
      // sometime may refer to boolean.
      return inferTypeFromValue(propertyValue);
  }
}

/**
 * Converts <string, string> map to <string, int|long|boolean|string> map
 * This is necessary to pass in the right context to jexl to validate
 * the expression.
 *
 * For example,
 * jexl expression: 'property1 == true'
 * context: { property1: 'true', property2: 'string2' }
 * If the context is passed as is to the jexl library the above expression
 * will be false as 'true' !== true. So we need to make a best guess
 * in converting the string to appropriate types for the jexl expression
 * to be parsed correctly.
 *
 * @returns typedValues - properties map with values being appropriate type(Boolean, number or string)
 */
function getTypedPropertyValues(
  propertyValues: IPropertyValues,
  propertiesFromBackend: PluginProperties
): IPropertyTypedValues {
  const typedValues = {};
  if (propertyValues && typeof propertyValues === 'object') {
    Object.keys(propertyValues).forEach((property) => {
      const propertyConfigFromBackend = propertiesFromBackend[property];
      if (!propertyConfigFromBackend) {
        return;
      }
      const type = propertyConfigFromBackend.type;
      const value = propertyValues[property];
      if (isMacro(value)) {
        return value;
      }
      typedValues[property] = getValueFromBackendType(type, value);
    });
  }
  return typedValues;
}

/**
 * Filter properties based on filtering condition. Will hide all the
 * properties by default that are part of each filter. If the condition is true
 * then show all the properties as part of the filter's show.
 *
 * Will skip all required properties from being hidden.
 *
 * If the property involved in the condition is a macro skip checking for condition
 */
export function filterByCondition(
  filteredGroupConfiguration: IConfigurationGroup[],
  widgetJSON: IWidgetJson,
  propertiesFromBackend: PluginProperties,
  propertyValues: IPropertyValues
): IFilteredConfigurationGroup[] {
  // By default every property will be shown
  let propertiesToShow: string[] = flatten(
    filteredGroupConfiguration.map((group) => {
      return group.properties.map((prop) => prop.name);
    })
  );
  const filters: IPropertyFilter[] = widgetJSON ? widgetJSON.filters : [];
  // Iterate through all filters and hide those properties whose filter
  // condition is not true.
  const propertiesToHide = !filters
    ? []
    : flatten(
        filters.map((filter) => {
          const mapPropertyToShow = (propertyFilter: IPropertyFilter) => {
            return flatten(
              propertyFilter.show.map((showConfig) => {
                if (showConfig.type === PropertyShowConfigTypeEnums.GROUP) {
                  const configuationGroups = widgetJSON['configuration-groups'];
                  return configuationGroups
                    .filter((group) => group.label === showConfig.name)
                    .map((group) =>
                      group.properties
                        .filter((property) => property['widget-category'] !== 'plugin')
                        .map((property) => ({
                          property: property.name,
                          filterName: propertyFilter.name,
                        }))
                    );
                }
                return [
                  {
                    property: showConfig.name,
                    filterName: propertyFilter.name,
                  },
                ];
              })
            );
          };
          if (!evaluateFilter(filter, propertyValues, propertiesFromBackend)) {
            return flatten(mapPropertyToShow(filter));
          }
          return [];
        })
      );
  propertiesToShow = difference(
    propertiesToShow,
    propertiesToHide.map((p) => p.property)
  );
  const propertiesToFilterMap = propertiesToHide.reduce(
    (prev, curr) => ({ ...prev, [curr.property]: curr.filterName }),
    {}
  );
  return filteredGroupConfiguration
    .map((group) => {
      return {
        ...group,
        properties: group.properties.map((property) => {
          const shouldShowProperty = propertiesToShow.indexOf(property.name) !== -1;
          // We add the filter name for debugging purposes.
          const filter = propertiesToFilterMap[property.name];
          return {
            ...property,
            show: shouldShowProperty,
            filterName: filter || null,
          };
        }),
      };
    })
    .map((group) => {
      // If all the properties in the group are hidden just hide the group as well.
      const hiddenProperties = group.properties.filter((property) => !property.show);
      return {
        ...group,
        show: hiddenProperties.length !== group.properties.length,
      };
    });
}

export function getPluginPropertiesForValidation(nodeInfo: any, widgetJson: IWidgetJson) {
  const availableProps = new Set();
  const pluginInfo = Object.assign({}, nodeInfo.plugin);
  pluginInfo.type = nodeInfo.type;
  const pluginProperties: PluginProperties = objectQuery(nodeInfo, '_backendProperties');
  const widgetConfigurationGroup: IConfigurationGroup[] = objectQuery(
    widgetJson,
    'configuration-groups'
  );
  const widgetOutputs: IWidgetProperty[] = objectQuery(widgetJson, 'outputs');
  const values: IPropertyValues = objectQuery(nodeInfo, 'plugin', 'properties');
  const processedConfigurationGroup: IProcessedConfigurationGroups = processConfigurationGroups(
    pluginProperties,
    widgetConfigurationGroup,
    widgetOutputs
  );
  const filteredConfigurationGroups: IFilteredConfigurationGroup[] = filterByCondition(
    processedConfigurationGroup.configurationGroups,
    widgetJson,
    pluginProperties,
    values
  );
  filteredConfigurationGroups.forEach((group: IFilteredConfigurationGroup) => {
    // If the group and properties in that group are set to show
    // mark them available.
    if (group.show) {
      group.properties.forEach((property) => {
        if (property.show) {
          availableProps.add(property.name);
        }
      });
    }
  });
  // adding properties specified on outputs
  if (widgetOutputs) {
    widgetOutputs.forEach((prop) => {
      if (prop.name) {
        availableProps.add(prop.name);
      }
    });
  }
  Object.keys(pluginInfo.properties).forEach((propertyName) => {
    // If a property is not avaialble i.e hidden, delete it from plugin's props.
    if (!availableProps.has(propertyName)) {
      delete pluginInfo.properties[propertyName];
    }
  });
  return pluginInfo;
}
