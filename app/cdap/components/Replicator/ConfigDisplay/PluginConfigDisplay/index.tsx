/*
 * Copyright © 2020 Cask Data, Inc.
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

import React, { useState, useEffect } from 'react';
import withStyles, { WithStyles, StyleRules } from '@material-ui/core/styles/withStyles';
import { objectQuery } from 'services/helpers';
import difference from 'lodash/difference';
import Heading, { HeadingTypes } from 'components/shared/Heading';
import { IPluginInfo, IPluginConfig } from 'components/Replicator/types';
import { IWidgetJson } from 'components/shared/ConfigurationGroup/types';

const styles = (theme): StyleRules => {
  return {
    configRow: {
      display: 'grid',
      gridTemplateColumns: '30% 60%',
      borderTop: `1px solid ${theme.palette.grey[300]}`,
      padding: '5px 0',
      '&:last-child': {
        borderBottom: `1px solid ${theme.palette.grey[300]}`,
      },
      '& > div': {
        wordBreak: 'break-word',
      },
    },
    label: {
      color: theme.palette.grey[100],
      paddingRight: '5px',
    },
    heading: {
      marginBottom: '15px',
    },
  };
};

interface IPluginConfigProps extends WithStyles<typeof styles> {
  pluginInfo: IPluginInfo;
  pluginWidget: IWidgetJson;
  pluginConfig: IPluginConfig;
}

const ESCAPED_SENSITIVE_FIELDS = ['password', 'serviceAccountKey'];

const PluginConfigDisplayView: React.FC<IPluginConfigProps> = ({
  classes,
  pluginInfo,
  pluginWidget,
  pluginConfig,
}) => {
  const [config, setConfig] = useState([]);

  useEffect(() => {
    const finalConfig = [];
    // get order and label name from widget
    // fill in values from config
    // remove empty
    const widgetProperties = [];
    (objectQuery(pluginWidget, 'configuration-groups') || []).forEach((groups) => {
      groups.properties.forEach((property) => {
        widgetProperties.push({
          name: property.name,
          label: property.label,
          type: property['widget-type'],
        });
      });
    });

    widgetProperties.forEach((property) => {
      if (!pluginConfig[property.name]) {
        return;
      }

      finalConfig.push({
        ...property,
        value: pluginConfig[property.name],
      });
    });

    // add missing config group properties
    const configProperties = Object.keys(pluginConfig || {});
    const widgetNames = widgetProperties.map((property) => property.name);

    difference(configProperties, widgetNames).forEach((propertyName) => {
      finalConfig.push({
        name: propertyName,
        label: propertyName,
        type: 'textbox',
        value: pluginConfig[propertyName],
      });
    });

    setConfig(finalConfig);
  }, [pluginInfo, pluginWidget, pluginConfig]);

  const displayName = objectQuery(pluginWidget, 'display-name') || objectQuery(pluginInfo, 'name');

  return (
    <div>
      <Heading type={HeadingTypes.h4} label={displayName} className={classes.heading} />

      <div className={classes.configContainer}>
        {config.map((property) => {
          if (ESCAPED_SENSITIVE_FIELDS.indexOf(property.name) !== -1) {
            return null;
          }

          return (
            <div key={property.name} className={classes.configRow}>
              <div className={classes.label}>
                <strong>{property.label}</strong>
              </div>
              <div>{property.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PluginConfigDisplay = withStyles(styles)(PluginConfigDisplayView);
export default PluginConfigDisplay;
