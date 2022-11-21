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
import ConfigurationGroup from 'components/shared/ConfigurationGroup';
import { objectQuery } from 'services/helpers';
import LoadingSVG from 'components/shared/LoadingSVG';
import VersionStore from 'services/VersionStore';
import { catchError } from 'rxjs/operators';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles({
  toggleRow: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  container: {
    left: 0,
    maxWidth: '100%',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'stretch',
  },
  inner: {
    overflowY: 'scroll',
    overflowX: 'hidden',
  },
  blockShown: {},
  blockHidden: {
    display: 'none',
  },
});

const PLUGIN_NAME = 'BigQueryPushdownEngine';
const PLUGIN_TYPE = 'sqlengine';
const PLUGIN_LABEL = 'BigQueryPushdown';
const ARTIFACT_DEFAULT = {
  name: 'google-cloud',
  version: null,
};

function fetchPluginInfo(artifact: ICloudArtifact) {
  const version = VersionStore.getState().version;
  const pluginParams = {
    namespace: getCurrentNamespace(),
    parentArtifact: 'cdap-data-pipeline',
    version,
    extension: PLUGIN_TYPE,
    pluginName: PLUGIN_NAME,
    scope: 'SYSTEM',
    artifactName: artifact.name,
    artifactScope: artifact.scope,
    limit: 1,
    order: 'DESC',
  };

  return MyPipelineApi.getPluginProperties(pluginParams).map(([res]) => {
    return res;
  });
}
interface ICloudArtifact {
  name: string;
  version: string;
  scope: string;
}
interface IPushdownPlugin {
  name: string;
  label: string;
  type: string;
  artifact: ICloudArtifact;
  properties: object;
}
interface IPushdownConfig {
  pushdownEnabled: boolean;
  transformationPushdown?: {
    plugin?: IPushdownPlugin;
  };
}

interface IPushdownProps {
  value: IPushdownConfig;
  onValueChange: (value: IPushdownConfig) => void;
  cloudArtifact?: ICloudArtifact;
}

export default function PushdownConfig({ value, onValueChange, cloudArtifact }: IPushdownProps) {
  const [loading, setLoading] = useState(true);
  const [pluginInfo, setPluginInfo] = useState(null);
  const [pluginWidget, setPluginWidget] = useState(null);
  const pluginProperties = objectQuery(pluginInfo, 'properties') || {};
  const { pushdownEnabled, transformationPushdown } = value;

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
    onValueChange({ pushdownEnabled, transformationPushdown: newTransformationPushdown });
  };

  const toggleEnabled = () => {
    onValueChange({ pushdownEnabled: !pushdownEnabled, transformationPushdown });
  };

  useEffect(() => {
    fetchPluginInfo(cloudArtifact || { ...ARTIFACT_DEFAULT, scope: 'USER' })
      .pipe(
        catchError((err) => {
          if (err?.statusCode !== 404 || cloudArtifact) {
            throw err;
          }
          return fetchPluginInfo({ ...ARTIFACT_DEFAULT, scope: 'SYSTEM' });
        })
      )
      .subscribe(
        (res) => {
          const artifact = res.artifact;
          fetchPluginWidget(
            artifact.name,
            artifact.version,
            artifact.scope,
            PLUGIN_NAME,
            PLUGIN_TYPE
          ).subscribe(
            (widget) => {
              onValueChange({
                pushdownEnabled,
                transformationPushdown: {
                  plugin: {
                    name: PLUGIN_NAME,
                    label: PLUGIN_LABEL,
                    type: PLUGIN_TYPE,
                    artifact,
                    properties: valueProperties,
                  },
                },
              });
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
  }, [cloudArtifact]);

  if (loading) {
    return <LoadingSVG />;
  }

  return (
    <div className={classes.container}>
      <div className={classes.inner}>
        <strong>
          Choose to push down compatible transformations to BigQuery. Currently Joiner, Group By,
          Window aggregations and Deduplicate aggregations are supported.
        </strong>
        <div className={classes.toggleRow}>
          <FormControlLabel
            control={
              <Checkbox checked={pushdownEnabled} onChange={toggleEnabled} color="primary" />
            }
            label="Enable Transformation Pushdown"
          />
        </div>
        <div className={pushdownEnabled ? classes.blockShown : classes.blockHidden}>
          <ConfigurationGroup
            widgetJson={pluginWidget}
            pluginProperties={pluginProperties}
            values={valueProperties}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}

PushdownConfig.propTypes = {
  value: PropTypes.object.isRequired,
  onValueChange: PropTypes.func.isRequired,
  cloudArtifact: PropTypes.object,
};
