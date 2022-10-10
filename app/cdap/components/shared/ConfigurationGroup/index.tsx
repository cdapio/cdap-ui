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

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import withStyles, { WithStyles, StyleRules } from '@material-ui/core/styles/withStyles';
import { IWidgetJson, PluginProperties } from './types';
import {
  addCurrentValueToShownProperty,
  processConfigurationGroups,
  removeFilteredProperties,
  replaceDifferenceInObjects,
} from './utilities';
import { objectQuery } from 'services/helpers';
import { useOnUnmount } from 'services/react/customHooks/useOnUnmount';
import defaults from 'lodash/defaults';
import PropertyRow from './PropertyRow';
import { getCurrentNamespace } from 'services/NamespaceStore';
import ThemeWrapper from 'components/ThemeWrapper';
import {
  filterByCondition,
  IFilteredConfigurationGroup,
} from 'components/shared/ConfigurationGroup/utilities/DynamicPluginFilters';
import { IErrorObj } from 'components/shared/ConfigurationGroup/utilities';
import { h2Styles } from 'components/shared/Markdown/MarkdownHeading';
import AccordionWrapper from './AccordionWrapper';

const styles = (theme): StyleRules => {
  return {
    group: {
      marginBottom: '20px',
    },
    groupTitle: {
      marginBottom: '15px',
      marginLeft: '10px',
      marginRight: '15px',
    },
    h2Title: {
      ...h2Styles(theme).root,
      marginBottom: '5px',
    },
    groupSubTitle: {
      color: theme.palette.grey[200],
    },
  };
};

export interface IConfigurationGroupProps extends WithStyles<typeof styles> {
  widgetJson?: IWidgetJson;
  pluginProperties: PluginProperties;
  values: Record<string, string>;
  inputSchema?: any;
  disabled?: boolean;
  onChange?: (values: Record<string, string>) => void;
  errors: {
    [property: string]: IErrorObj[];
  };
  validateProperties?: () => void;
  lockedProperties?: Record<string, boolean>;
}

const ConfigurationGroupView: React.FC<IConfigurationGroupProps> = ({
  widgetJson,
  pluginProperties,
  values,
  inputSchema,
  onChange,
  disabled,
  classes,
  errors,
  validateProperties,
  lockedProperties,
}) => {
  const [configurationGroups, setConfigurationGroups] = useState([]);
  const referenceValueForUnMount = useRef<{
    configurationGroups?: IFilteredConfigurationGroup[];
    values?: Record<string, string>;
  }>({});
  const [filteredConfigurationGroups, setFilteredConfigurationGroups] = useState([]);
  const [orphanErrors, setOrphanErrors] = useState([]);
  // a state to remember the properties values after each user interaction
  const [currentValues, setCurrentValues] = useState(values);

  // Initialize the configurationGroups based on widgetJson and pluginProperties obtained from backend
  useEffect(() => {
    if (!pluginProperties) {
      return;
    }

    const widgetConfigurationGroup = objectQuery(widgetJson, 'configuration-groups');
    const widgetOutputs = objectQuery(widgetJson, 'outputs');
    const processedConfigurationGroup = processConfigurationGroups(
      pluginProperties,
      widgetConfigurationGroup,
      widgetOutputs
    );
    setConfigurationGroups(processedConfigurationGroup.configurationGroups);

    // We don't need to add default values for plugins in published pipeline
    // as they should already have all the properties they are configured with.
    let initialValues = values;
    if (!disabled) {
      // Only add default values for plugin properties that are not already configured
      // by user.
      initialValues = defaults(values, processedConfigurationGroup.defaultValues);
      changeParentHandler(initialValues);
    }
    updateFilteredConfigurationGroup(
      processedConfigurationGroup.configurationGroups,
      initialValues
    );
  }, [widgetJson, pluginProperties]);

  function updateFilteredConfigurationGroup(configGroup, newValues) {
    let newFilteredConfigurationGroup;

    try {
      newFilteredConfigurationGroup = filterByCondition(
        configGroup,
        widgetJson,
        pluginProperties,
        // pass currentValues instead of newValues for conditions like this:
        // {useConnection === false && serviceAccountType === 'filePath'}
        currentValues
      );
    } catch (e) {
      newFilteredConfigurationGroup = configGroup;
      // tslint:disable:no-console
      console.log('Issue with applying filters: ', e);
    }
    // update the properties that are shown in newValues with currentValues
    addCurrentValueToShownProperty(newValues, currentValues, newFilteredConfigurationGroup);
    referenceValueForUnMount.current = {
      configurationGroups: newFilteredConfigurationGroup,
      values: newValues,
    };
    setFilteredConfigurationGroups(newFilteredConfigurationGroup);
    getOrphanedErrors();
  }

  // Watch for changes in values to determine dynamic widget
  useEffect(() => {
    if (!configurationGroups || configurationGroups.length === 0) {
      return;
    }
    updateFilteredConfigurationGroup(configurationGroups, values);
  }, [values]);

  function handleValueChanges(changedValues, params: { [key: string]: boolean } = {}) {
    let fcg = filteredConfigurationGroups;
    if (params.updateFilteredConfigurationGroups) {
      fcg = filterByCondition(configurationGroups, widgetJson, pluginProperties, changedValues);
    }
    // update currentValues state with whatever changed
    setCurrentValues((newValues) => {
      return replaceDifferenceInObjects(newValues, changedValues);
    });
    const updatedFilteredValues = removeFilteredProperties(changedValues, fcg);
    changeParentHandler(updatedFilteredValues);
  }

  function changeParentHandler(updatedValues) {
    if (!onChange || typeof onChange !== 'function') {
      return;
    }

    onChange(updatedValues);
  }

  // This onUnMount is to make sure we clear out all properties that are hidden.
  useOnUnmount(() => {
    const newValues = referenceValueForUnMount.current.values;
    const configGroups = referenceValueForUnMount.current.configurationGroups;
    const updatedFilteredValues = removeFilteredProperties(newValues, configGroups);
    changeParentHandler(updatedFilteredValues);
  });

  useEffect(getOrphanedErrors, [errors]);

  const extraConfig = {
    namespace: getCurrentNamespace(),
    properties: values,
    inputSchema,
    validateProperties,
  };

  function getPropertyError(propertyName) {
    return errors && errors.hasOwnProperty(propertyName) ? errors[propertyName] : null;
  }

  function getOrphanedErrors() {
    if (!errors) {
      setOrphanErrors([]);
      return;
    }

    const orphanedErrors = new Set();
    const shownErrors = new Set();

    filteredConfigurationGroups.forEach((group) => {
      if (group.show === false) {
        return;
      }
      group.properties.forEach((property) => {
        if (property.show === false) {
          return;
        }

        const propertyError = getPropertyError(property.name);
        if (propertyError) {
          propertyError.forEach((error) => {
            shownErrors.add(error.msg);
          });
        }
      });
    });

    Object.values(errors).forEach((errorArr) => {
      errorArr.forEach((error) => {
        if (!shownErrors.has(error.msg)) {
          orphanedErrors.add(error.msg);
        }
      });
    });

    setOrphanErrors(Array.from(orphanedErrors));
  }

  function renderConfigurationGroupHeader(group) {
    return (
      <div className={classes.groupTitle}>
        <h2 className={classes.h2Title}>{group.label}</h2>
        {group.description && group.description.length > 0 && (
          <small className={classes.groupSubTitle}>{group.description}</small>
        )}
      </div>
    );
  }

  function renderConfigurationGroupDetails(group) {
    return (
      <div>
        {group.properties.map((property, j) => {
          if (property.show === false) {
            return null;
          }
          // Hiding all plugin functions if pipeline is deployed
          if (
            disabled &&
            property.hasOwnProperty('widget-category') &&
            property['widget-category'] === 'plugin'
          ) {
            return null;
          }

          const errorObjs = getPropertyError(property.name);

          return (
            <PropertyRow
              key={`${property.name}-${j}`}
              widgetProperty={property}
              pluginProperty={pluginProperties[property.name]}
              value={values[property.name]}
              onChange={handleValueChanges}
              extraConfig={extraConfig}
              disabled={disabled}
              locked={lockedProperties && lockedProperties[property.name]}
              errors={errorObjs}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div data-cy="configuration-group" data-testid="configuration-group">
      {orphanErrors.length > 0 && (
        <div>
          <h2>Errors</h2>
          <div className="text-danger">
            {orphanErrors.map((error: string) => (
              <li>{error}</li>
            ))}
          </div>
        </div>
      )}
      {filteredConfigurationGroups.map((group, i) => {
        if (group.show === false) {
          return null;
        }

        return (
          <div key={`${group.label}-${i}`} className={classes.group}>
            {group.hideByDefault ? (
              <AccordionWrapper
                header={renderConfigurationGroupHeader(group)}
                details={renderConfigurationGroupDetails(group)}
              />
            ) : (
              <>
                {renderConfigurationGroupHeader(group)}
                {renderConfigurationGroupDetails(group)}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

const StyledConfigurationGroup = withStyles(styles)(ConfigurationGroupView);

function ConfigurationGroup(props) {
  return (
    <ThemeWrapper>
      <StyledConfigurationGroup {...props} />
    </ThemeWrapper>
  );
}
export default ConfigurationGroup;

(ConfigurationGroup as any).propTypes = {
  widgetJson: PropTypes.object,
  pluginProperties: PropTypes.object,
  values: PropTypes.object,
  inputSchema: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  errors: PropTypes.object,
  validateProperties: PropTypes.func,
  lockedProperties: PropTypes.object,
};
