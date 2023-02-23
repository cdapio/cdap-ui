/*
 * Copyright © 2017 Cask Data, Inc.
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
import LibraryUploadWizardConfig from 'services/WizardConfigs/LibraryUploadWizardConfig';
import ArtifactUploadStore from 'services/WizardStores/ArtifactUpload/ArtifactUploadStore';
import ArtifactUploadActions from 'services/WizardStores/ArtifactUpload/ArtifactUploadActions';
import ArtifactUploadActionCreator from 'services/WizardStores/ArtifactUpload/ActionCreator';
import NamespaceStore from 'services/NamespaceStore';
import T from 'i18n-react';
import ee from 'event-emitter';
import globalEvents from 'services/global-events';

import 'components/CaskWizards/ArtifactUpload/ArtifactUpload.scss';

export default class LibraryUploadWizard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showWizard: this.props.isOpen,
      successInfo: {},
    };
    this.eventEmitter = ee(ee);
  }
  componentDidMount() {
    ArtifactUploadStore.dispatch({
      type: ArtifactUploadActions.setType,
      payload: {
        type: 'sparkprogram',
      },
    });
  }
  componentWillUnmount() {
    ArtifactUploadStore.dispatch({
      type: ArtifactUploadActions.onReset,
    });
  }

  onSubmit() {
    if (!this.props.buildSuccessInfo) {
      this.buildSuccessInfo();
    }
    return ArtifactUploadActionCreator.uploadArtifact().mergeMap((res) => {
      this.eventEmitter.emit(globalEvents.ARTIFACTUPLOAD);
      return res; // needs to return something
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
    const state = ArtifactUploadStore.getState();
    const artifactName = state.configure.name;
    const namespace = NamespaceStore.getState().selectedNamespace;
    const message = T.translate('features.Wizard.LibraryUpload.success', {
      artifactName,
    });
    const subtitle = T.translate('features.Wizard.LibraryUpload.subtitle');
    const buttonLabel = T.translate(
      'features.Wizard.LibraryUpload.callToAction'
    );
    const linkLabel = T.translate('features.Wizard.GoToHomePage');
    this.setState({
      successInfo: {
        message,
        subtitle,
        buttonLabel,
        buttonUrl: window.getHydratorUrl({
          stateName: 'hydrator.create',
          stateParams: {
            namespace,
          },
        }),
        handleCallToActionClick: () => {
          /**
           * FIXME (CDAP-15396): Right now we don't know what context we are in (market vs plus button)
           * We should be able to pass on that context from the parent to be able to target specific
           * things in specific environments.
           * Right now this is here to close the modal when user clicks "Create pipeline" on plugin upload
           * while in pipeline studio.
           * */
          this.eventEmitter.emit(globalEvents.CLOSERESOURCECENTER);
        },
        linkLabel,
        linkUrl: `${window.getAbsUIUrl({
          namespaceId: namespace,
        })}/control`,
      },
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
        : T.translate('features.Wizard.LibraryUpload.headerlabel'));
    return (
      <WizardModal
        title={wizardModalTitle}
        isOpen={this.state.showWizard}
        toggle={this.toggleWizard.bind(this, false)}
        className="artifact-upload-wizard"
      >
        <Wizard
          wizardConfig={LibraryUploadWizardConfig}
          wizardType="LibraryUpload"
          store={ArtifactUploadStore}
          onSubmit={this.onSubmit.bind(this)}
          successInfo={this.state.successInfo}
          onClose={this.toggleWizard.bind(this)}
        />
      </WizardModal>
    );
  }
}

LibraryUploadWizard.defaultProps = {
  input: {
    action: {
      arguments: {},
    },
    package: {},
  },
};

LibraryUploadWizard.propTypes = {
  isOpen: PropTypes.bool,
  input: PropTypes.any,
  onClose: PropTypes.func,
  buildSuccessInfo: PropTypes.func,
};
