/*
 * Copyright © 2016 Cask Data, Inc.
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

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import WizardModal from 'components/shared/WizardModal';
import Wizard from 'components/shared/Wizard';
import PluginArtifactUploadStore from 'services/WizardStores/PluginArtifactUpload/PluginArtifactUploadStore';
import PluginArtifactUploadActions from 'services/WizardStores/PluginArtifactUpload/PluginArtifactUploadActions';
import ArtifactUploadActionCreator from 'services/WizardStores/PluginArtifactUpload/ActionCreator';
import T from 'i18n-react';

require('./PluginArtifactUpload.scss');

/**
 * This is used in both uploading a plugin artifact as well as a wrangler directive.
 * This component renders the wizard and has the success info being given to it
 * by plugin and directive upload wizards.
 */
export default class PluginArtifactUploadWizard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showWizard: this.props.isOpen,
      successInfo: {},
    };
  }
  componentWillUnmount() {
    PluginArtifactUploadStore.dispatch({
      type: PluginArtifactUploadActions.onReset,
    });
  }
  onSubmit() {
    this.buildSuccessInfo();
    return ArtifactUploadActionCreator.uploadArtifact(
      this.props.includeParents
    ).mergeMap(() => {
      this.props.onSubmit();
      return ArtifactUploadActionCreator.uploadConfigurationJson();
    });
  }
  toggleWizard(returnResult) {
    if (this.state.showWizard) {
      this.props.onClose(returnResult);
    }
    this.setState({
      showWizard: !this.state.showWizard,
    });
  }
  buildSuccessInfo() {
    this.setState({
      successInfo: this.props.buildInfo(),
    });
  }
  render() {
    const input = this.props.input;
    const pkg = input.package || {};
    const headerLabel = input.headerLabel;

    const wizardModalTitle =
      (pkg.label ? pkg.label + ' | ' : '') +
      (headerLabel
        ? headerLabel
        : T.translate('features.Wizard.Informational.headerlabel'));
    return (
      <WizardModal
        title={wizardModalTitle}
        isOpen={this.state.showWizard}
        toggle={this.toggleWizard.bind(this, false)}
        className="artifact-upload-wizard"
      >
        <Wizard
          wizardConfig={this.props.wizardConfig}
          wizardType="ArtifactUpload"
          store={PluginArtifactUploadStore}
          onSubmit={this.onSubmit.bind(this)}
          successInfo={this.state.successInfo}
          onClose={this.toggleWizard.bind(this)}
        />
      </WizardModal>
    );
  }
}

PluginArtifactUploadWizard.defaultProps = {
  input: {
    action: {
      arguments: {},
    },
    package: {},
  },
  includeParents: true,
};
PluginArtifactUploadWizard.propTypes = {
  isOpen: PropTypes.bool,
  input: PropTypes.any,
  onClose: PropTypes.func,
  buildInfo: PropTypes.func,
  wizardConfig: PropTypes.object,
  onSubmit: PropTypes.func,
  includeParents: PropTypes.bool,
};
