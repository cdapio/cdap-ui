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

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { MyPipelineApi } from 'api/pipeline';
import { fetchPluginWidget } from 'services/PluginUtilities';
import ConfigurationGroup from 'components/ConfigurationGroup';
import { objectQuery } from 'services/helpers';
import ToggleSwitch from 'components/ToggleSwitch';
import LoadingSVG from 'components/LoadingSVG';
import VersionStore from 'services/VersionStore';

const useStyles = makeStyles({
  container: {
    left: 0,
    maxWidth: '100%',
    width: '100%',
    height: '100%',
    paddingBottom: '50px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'stretch',
  },
  toggleContainer: {
    maxWidth: '25%',
    paddingTop: '10px',
    paddingBottom: '10px',
  },
  inner: {
    overflowY: 'scroll',
  },
});

function defaultPushdown(version) {
  return {
    // TODO(lahwran): when more pushdown plugins are supported, will need to allow user to select which one to use and use its info here
    plugin: {
      name: 'BigQueryPushdownEngine',
      label: 'BigQueryPushdown',
      type: 'sqlengine',
      artifact: {
        name: 'google-cloud',
        version,
        scope: 'SYSTEM',
      },
      properties: {},
    },
  };
}

function fetchPluginInfo() {
  const version = VersionStore.getState().version;
  const defaults = defaultPushdown(null);
  const pluginParams = {
    namespace: getCurrentNamespace(),
    parentArtifact: 'cdap-data-pipeline',
    version,
    extension: defaults.plugin.type,
    pluginName: defaults.plugin.name,
    scope: 'SYSTEM',
    artifactName: defaults.plugin.artifact.name,
    artifactScope: defaults.plugin.artifact.scope,
    limit: 1,
    order: 'DESC',
  };

  return MyPipelineApi.getPluginProperties(pluginParams).map(([res]) => {
    return res;
  });
}
interface IPushdownConfig {
  enabled: boolean;
  transformationPushdown?: {
    plugin?: {
      name: string;
      label: string;
      type: string;
      artifact: {
        name: string;
        version: string;
        scope: string;
      };
      properties: object;
    };
  };
}

interface IPushdownProps {
  value: IPushdownConfig;
  onValueChange: (value: IPushdownConfig) => void;
}

export default function PushdownConfig({ value, onValueChange }: IPushdownProps) {
  const [loading, setLoading] = useState(true);
  const [pluginInfo, setPluginInfo] = useState(null);
  const [pluginWidget, setPluginWidget] = useState(null);
  const pluginProperties = objectQuery(pluginInfo, 'properties') || {};
  const { enabled, transformationPushdown } = value;

  const plugin = transformationPushdown?.plugin;
  const valueProperties = plugin?.properties || {};

  const classes = useStyles();
  const onChange = (properties) => {
    const newTransformationPushdown = {
      plugin: {
        ...plugin,
        properties,
      },
    };
    onValueChange({ enabled, transformationPushdown: newTransformationPushdown });
  };

  const toggleEnabled = () => {
    onValueChange({ enabled: !enabled, transformationPushdown });
  };

  useEffect(() => {
    fetchPluginInfo().subscribe(
      (res) => {
        const defaults = defaultPushdown(res.artifact.version);
        fetchPluginWidget(
          defaults.plugin.artifact.name,
          res.artifact.version,
          res.artifact.scope,
          defaults.plugin.name,
          defaults.plugin.type
        ).subscribe(
          (widget) => {
            if (plugin === null || plugin === undefined) {
              onValueChange({
                enabled,
                transformationPushdown: defaults,
              });
            }
            setPluginInfo(res);
            setPluginWidget(widget);
          },
          null,
          () => {
            setLoading(false);
          }
        );
      },
      (err) => {
        // tslint:disable-next-line: no-console
        console.error('Error fetching plugin', err);

        // TODO: error handling
      }
    );
    // pass etc
  }, []);

  if (loading) {
    return <LoadingSVG />;
  }

  return (
    <div className={classes.container}>
      <div className={classes.inner}>
        ELT Pushdown lets you push transformations to an SQL-compatible engine, enabling an ELT
        pattern.
        <div className="label-with-toggle row">
          <span className="toggle-label col-xs-4">Enable ELT Pushdown</span>
          <div className="col-xs-7 toggle-container">
            <ToggleSwitch isOn={enabled} onToggle={toggleEnabled} />
          </div>
        </div>
        <ConfigurationGroup
          widgetJson={pluginWidget}
          pluginProperties={pluginProperties}
          values={valueProperties}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

PushdownConfig.propTypes = {
  value: PropTypes.object,
  onValueChange: PropTypes.func,
};
