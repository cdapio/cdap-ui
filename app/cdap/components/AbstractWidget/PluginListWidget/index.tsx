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

import { MyPipelineApi } from 'api/pipeline';
import { IWidgetProps } from 'components/AbstractWidget';
import CustomSelect from 'components/AbstractWidget/FormInputs/Select';
import T from 'i18n-react';
import * as React from 'react';
import { GLOBALS, SCOPES } from 'services/global-constants';
import { objectQuery } from 'services/helpers';
import { getCurrentNamespace } from 'services/NamespaceStore';
import VersionStore from 'services/VersionStore';
import uniqBy from 'lodash/uniqBy';
import LoadingSVG from 'components/shared/LoadingSVG';
import ee from 'event-emitter';
import GLOBAL_EVENTS from 'services/global-events';

const PREFIX = 'features.AbstractWidget.PluginListWidget';

interface IPluginListWidgetProps {
  'plugin-type': string;
  placeholder?: string;
}

type IPluginListProps = IWidgetProps<IPluginListWidgetProps>;

interface IPlugin {
  name: string;
  type: string;
  description: string;
  className: string;
  artifact: {
    name: string;
    version: string;
    scope: string;
  };
}

interface IOption {
  value: string;
  label: string | React.ReactNode;
  disabled?: boolean;
}

const LOADING_OPTION = {
  value: '',
  label: <LoadingSVG />,
  disabled: true,
};

const PluginListWidget: React.FC<IPluginListProps> = ({
  value,
  onChange,
  widgetProps,
  disabled,
  dataCy,
}) => {
  const [options, setOptions] = React.useState<IOption[]>([LOADING_OPTION]);
  const eventEmitter = ee(ee);
  const placeholder = objectQuery(widgetProps, 'placeholder') || 'Select one';

  function setEmptyOptions(extension) {
    const emptyOptions = [
      {
        value: '',
        label: T.translate(`${PREFIX}.emptyLabel`, {
          pluginType: extension,
        }).toString(),
        disabled: true,
      },
    ];
    setOptions(emptyOptions);
  }

  function fetchExtensions() {
    const extension = objectQuery(widgetProps, 'plugin-type') || 'jdbc';
    const params = {
      namespace: getCurrentNamespace(),
      parentArtifact: GLOBALS.etlDataPipeline,
      version: VersionStore.getState().version,
      extension,
      scope: SCOPES.SYSTEM,
    };

    MyPipelineApi.getExtensions(params).subscribe(
      (res: IPlugin[]) => {
        if (res.length === 0) {
          setEmptyOptions(extension);
          return;
        }

        const displayOptions = res.map((plugin) => {
          return {
            value: plugin.name,
            label: plugin.name,
          };
        });
        const uniqueOptions = uniqBy(displayOptions, 'value');

        setOptions(uniqueOptions);
      },
      () => {
        setEmptyOptions(extension);
      }
    );
  }

  React.useEffect(() => {
    fetchExtensions();

    eventEmitter.on(GLOBAL_EVENTS.ARTIFACTUPLOAD, fetchExtensions);

    return () => {
      eventEmitter.off(GLOBAL_EVENTS.ARTIFACTUPLOAD, fetchExtensions);
    };
  }, []);

  return (
    <CustomSelect
      value={value}
      onChange={onChange}
      widgetProps={{
        options,
      }}
      disabled={disabled}
      placeholder={placeholder}
      dataCy={dataCy}
    />
  );
};

export default PluginListWidget;

(PluginListWidget as any).getWidgetAttributes = () => {
  return {
    'plugin-type': { type: 'string', required: true },
  };
};
