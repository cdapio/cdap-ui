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

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import Button from '@material-ui/core/Button';
import ErrorBanner from 'components/shared/ErrorBanner';
import { IWidgetProps } from 'components/AbstractWidget';
import React from 'react';
import ThemeWrapper from 'components/ThemeWrapper';
import ee from 'event-emitter';
import { objectQuery } from 'services/helpers';
import Connections from 'components/Connections';
import { IConnectionMode } from 'components/Connections/ConnectionsContext';
import PipelineModal from 'components/PipelineModal';
import { extractConnectionName } from 'components/AbstractWidget/ConnectionsWidget';

const styles = (theme) => {
  return {
    modalBody: {
      padding: 0,
      height: 'calc(100% - 50px)',
      maxHeight: '100% !important', // overwrite reactstrap specificity
    },
  };
};
interface IPluginConnectionState {
  showBrowserModal: boolean;
  error: string | null;
  loading: boolean;
  connectionName?: string;
}

interface IConnectionBrowserWidgetProps {
  connectionType: string;
  label: string;
  connectionProperty?: string;
}

interface IPluginConnectionBrowserProps
  extends IWidgetProps<IConnectionBrowserWidgetProps>,
    WithStyles<typeof styles> {}

class PluginConnectionBrowser extends React.PureComponent<
  IPluginConnectionBrowserProps,
  IPluginConnectionState
> {
  public state = {
    showBrowserModal: false,
    error: null,
    loading: false,
    connectionName: null,
  };

  public eventEmitter = ee(ee);

  private toggleConnectionBrowser = () => {
    const connectionProperty = this.props?.widgetProps?.connectionProperty || 'connection';
    const connection = objectQuery(this.props, 'extraConfig', 'properties', connectionProperty);
    const connectionName = extractConnectionName(connection);
    const useConnection =
      objectQuery(this.props, 'extraConfig', 'properties', 'useConnection') !== 'false';

    this.setState({
      showBrowserModal: !this.state.showBrowserModal,
      connectionName: useConnection ? connectionName : null,
    });
  };

  private resetError = () => {
    this.setState({ error: null });
  };

  private handleEntitySelect = ({ properties, schema }) => {
    const schemaStr = JSON.stringify(schema);
    this.props.updateAllProperties(
      {
        ...properties,
        schema: schemaStr,
      },
      { updateFilteredConfigurationGroups: true }
    );
    if (schema) {
      this.eventEmitter.emit('schema.import', schema);
    }
    this.setState({
      showBrowserModal: false,
      connectionName: null,
    });
  };

  public render() {
    const { widgetProps, classes } = this.props;
    const { label = 'Browse' } = widgetProps;
    return (
      <>
        <Button variant="contained" color="primary" onClick={this.toggleConnectionBrowser}>
          {label}
        </Button>

        <PipelineModal
          isOpen={this.state.showBrowserModal}
          toggle={this.toggleConnectionBrowser}
          header={label}
          loading={this.state.loading}
          modalBodyClassName={classes.modalBody}
        >
          <Connections
            hideSidePanel={!!this.state.connectionName}
            hideAddConnection={true}
            allowDefaultConnection={false}
            mode={IConnectionMode.ROUTED_WORKSPACE}
            connectionId={this.state.connectionName}
            connectorType={this.props.widgetProps.connectionType}
            onEntitySelect={this.handleEntitySelect}
            showParsingConfig={false}
          />
        </PipelineModal>

        <ErrorBanner canEditPageWhileOpen error={this.state.error} onClose={this.resetError} />
      </>
    );
  }
}
const StyledPluginConnectionBrowser = withStyles(styles)(PluginConnectionBrowser);
function PluginConnectionBrowserWrapper(props) {
  return (
    <ThemeWrapper>
      <StyledPluginConnectionBrowser {...props} />
    </ThemeWrapper>
  );
}

(PluginConnectionBrowserWrapper as any).getWidgetAttributes = () => {
  return {
    connectionType: { type: 'string', required: true },
    label: { type: 'string', required: true },
  };
};

export default PluginConnectionBrowserWrapper;
