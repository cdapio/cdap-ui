/*
 * Copyright © 2018 Cask Data, Inc.
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'reactstrap';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { Link, Redirect } from 'react-router-dom';
import { MyCloudApi } from 'api/cloud';
import { objectQuery, preventPropagation, isNilOrEmpty } from 'services/helpers';
import LoadingSVGCentered from 'components/shared/LoadingSVGCentered';
import { connect, Provider } from 'react-redux';
import ProvisionerInfoStore from 'components/Cloud/Store';
import { fetchProvisionerSpec } from 'components/Cloud/Store/ActionCreator';
import { ADMIN_CONFIG_ACCORDIONS } from 'components/Administration/AdminConfigTabContent';
import { EntityTopPanel } from 'components/EntityTopPanel';
import {
  ConnectedProfileName,
  ConnectedProfileDescription,
  ConnectedProfileLabel,
} from 'components/Cloud/Profiles/CreateView/CreateProfileMetadata';
import {
  initializeProperties,
  updateProperty,
  resetCreateProfileStore,
} from 'components/Cloud/Profiles/CreateView/CreateProfileActionCreator';
import CreateProfileBtn from 'components/Cloud/Profiles/CreateView/CreateProfileBtn';
import CreateProfileStore from 'components/Cloud/Profiles/CreateView/CreateProfileStore';
import PropertyRow from 'components/Cloud/Profiles/CreateView/PropertyRow';
import { highlightNewProfile } from 'components/Cloud/Profiles/Store/ActionCreator';
import Helmet from 'react-helmet';
import T from 'i18n-react';
import { SCOPES, SYSTEM_NAMESPACE } from 'services/global-constants';
import { Theme } from 'services/ThemeHelper';
import If from 'components/shared/If';
import { filterByCondition } from 'components/shared/ConfigurationGroup/utilities/DynamicPluginFilters';
import Alert from 'components/shared/Alert';

const PREFIX = 'features.Cloud.Profiles.CreateView';

require('./CreateView.scss');

class ProfileCreateView extends Component {
  static propTypes = {
    match: PropTypes.object,
    provisionerJsonSpecMap: PropTypes.object,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    provisionerJsonSpecMap: {},
  };

  state = {
    redirectToNamespace: false,
    redirectToAdmin: false,
    creatingProfile: false,
    isSystem: objectQuery(this.props.match, 'params', 'namespace') === SYSTEM_NAMESPACE,
    selectedProvisioner: objectQuery(this.props.match, 'params', 'provisionerId'),
    filteredConfigurationGroup: [],
    showAlert: false,
    alertType: null,
    alertMessage: null,
  };

  componentWillReceiveProps(nextProps) {
    let { selectedProvisioner } = this.state;
    initializeProperties(nextProps.provisionerJsonSpecMap[selectedProvisioner]);
    this.setFilteredConfigurationGroup(nextProps);
  }

  componentDidMount() {
    let { selectedProvisioner } = this.state;
    fetchProvisionerSpec(selectedProvisioner);
  }

  componentWillUnmount() {
    resetCreateProfileStore();
  }

  getProvisionerLabel = () => {
    const { selectedProvisioner } = this.state;
    const label = objectQuery(this.props, 'provisionerJsonSpecMap', selectedProvisioner, 'label');
    const provisionerLabel = isNilOrEmpty(label) ? '' : `${label}`;
    return provisionerLabel;
  };

  createProfile = () => {
    this.setState({
      creatingProfile: true,
    });
    let { label, name, description, properties } = CreateProfileStore.getState();

    /**
     * TODO: https://issues.cask.co/browse/CDAP-15211
     * Today we special case it for projectid alone to minimize the impact of the change
     * Ideally we should have this information from backend (nullable fields) so that UI
     * can be proactive in not passing empty string for nullable fields while creating
     * a profile.
     */
    if (properties['projectId'] && properties['projectId'].value === '') {
      delete properties['projectId'];
    }
    // Add only fields that are shown to the users.
    const visibilityMap = {};
    for (const groupInfo of this.state.filteredConfigurationGroup) {
      for (const propertyInfo of groupInfo.properties) {
        visibilityMap[propertyInfo.name] = propertyInfo.show !== false;
      }
    }
    let jsonBody = {
      description,
      label,
      provisioner: {
        name: this.state.selectedProvisioner,
        properties: Object.entries(properties)
          .filter(([property]) => visibilityMap[property])
          .map(([property, propObj]) => {
            return {
              name: property,
              value: propObj.value,
              isEditable: propObj.isEditable,
            };
          }),
      },
    };
    let apiObservable$ = MyCloudApi.create;
    let apiQueryParams = {
      namespace: getCurrentNamespace(),
      profile: name,
    };
    if (this.state.isSystem) {
      apiObservable$ = MyCloudApi.createSystemProfile;
      delete apiQueryParams.namespace;
    }
    apiObservable$(apiQueryParams, jsonBody).subscribe(
      () => {
        if (this.state.isSystem) {
          this.setState({
            redirectToAdmin: true,
          });
        } else {
          this.setState({
            redirectToNamespace: true,
          });
        }

        let profilePrefix = this.state.isSystem ? SCOPES.SYSTEM : SCOPES.USER;
        name = `${profilePrefix}:${name}`;
        highlightNewProfile(name);
      },
      (err) => {
        this.setState({
          creatingProfile: false,
          error: err.response,
          showAlert: true,
          alertType: 'error',
          alertMessage: err.response,
        });
      }
    );
  };

  setFilteredConfigurationGroup(props) {
    const { selectedProvisioner } = this.state;
    const { values } = CreateProfileStore.getState();
    const configurationGroups = objectQuery(
      props,
      'provisionerJsonSpecMap',
      selectedProvisioner,
      'configuration-groups'
    );
    const filters = objectQuery(props, 'provisionerJsonSpecMap', selectedProvisioner, 'filters');
    if (!configurationGroups) {
      this.setState({
        filteredConfigurationGroup: [],
      });
    } else {
      let filteredConfigurationGroup = configurationGroups;
      if (filters && filters.length > 0) {
        filteredConfigurationGroup = filterByCondition(
          configurationGroups,
          {
            'configuration-groups': configurationGroups,
            filters,
          },
          {},
          values
        );
      }
      this.setState({
        filteredConfigurationGroup,
      });
    }
  }

  onUpdateProperty(property, value) {
    updateProperty(property, value);
    this.setFilteredConfigurationGroup(this.props);
  }

  renderProfileName = () => {
    return (
      <div className="property-row">
        <ConnectedProfileName />
      </div>
    );
  };

  renderProfileLabel = () => {
    return (
      <div className="property-row">
        <ConnectedProfileLabel />
      </div>
    );
  };

  renderDescription = () => {
    return (
      <div className="property-row">
        <ConnectedProfileDescription />
      </div>
    );
  };

  renderGroup = (group) => {
    if (group.show === false) {
      return null;
    }
    let { properties } = CreateProfileStore.getState();
    const extraConfig = {
      namespace: this.state.isSystem ? SYSTEM_NAMESPACE : getCurrentNamespace(),
    };

    return (
      <div className="group-container" key={group.label}>
        <strong className="group-title"> {group.label} </strong>
        <hr />
        <div className="group-description">{group.description}</div>
        <div className="fields-container">
          {group.properties.map((property) => {
            if (property.show === false) {
              return null;
            }
            return (
              <PropertyRow
                key={property.name}
                property={property}
                properties={properties}
                onChange={this.onUpdateProperty.bind(this, property.name)}
                extraConfig={extraConfig}
              />
            );
          })}
        </div>
      </div>
    );
  };

  renderGroups = () => {
    if (this.state.filteredConfigurationGroup.length === 0) {
      return null;
    }
    return this.state.filteredConfigurationGroup.map((group) => this.renderGroup(group));
  };

  resetAlert = () => {
    this.setState({
      showAlert: false,
      alertType: null,
      alertMessage: null,
    });
  };

  render() {
    if (this.state.redirectToNamespace) {
      return <Redirect to={`/ns/${getCurrentNamespace()}/details`} />;
    }
    if (this.state.redirectToAdmin) {
      return (
        <Redirect
          to={{
            pathname: '/administration/configuration',
            state: { accordionToExpand: ADMIN_CONFIG_ACCORDIONS.systemProfiles },
          }}
        />
      );
    }

    let linkObj = this.state.isSystem
      ? {
          pathname: '/administration/configuration',
          state: { accordionToExpand: ADMIN_CONFIG_ACCORDIONS.systemProfiles },
        }
      : () => history.back();

    return (
      <Provider store={CreateProfileStore}>
        <Alert
          showAlert={this.state.showAlert}
          type={this.state.alertType}
          message={this.state.alertMessage}
          onClose={this.resetAlert}
        />
        <div className="profile-create-view">
          <Helmet
            title={T.translate(`${PREFIX}.pageTitle`, {
              provisioner_name: this.getProvisionerLabel(),
              productName: Theme.productName,
            })}
          />
          <EntityTopPanel
            title={`Create a profile for ${this.getProvisionerLabel()}`}
            closeBtnAnchorLink={linkObj}
          />
          <div className="create-form-container">
            <fieldset disabled={this.state.creatingProfile}>
              <Form
                className="form-horizontal"
                onSubmit={(e) => {
                  preventPropagation(e);
                  return false;
                }}
              >
                <div className="group-container">
                  {this.renderProfileLabel()}
                  {this.renderProfileName()}
                  {this.renderDescription()}
                </div>
                {this.renderGroups()}
                {this.props.loading ? <LoadingSVGCentered /> : null}
              </Form>
            </fieldset>
          </div>
          <If condition={this.state.error}>
            <div className="error-section text-danger">{this.state.error}</div>
          </If>
          <div className="btns-section">
            <CreateProfileBtn
              className="btn-primary"
              onClick={this.createProfile}
              loading={this.state.creatingProfile}
            />
            {typeof linkObj === 'function' ? (
              <button className="btn btn-link" onClick={linkObj}>
                {T.translate('commons.close')}
              </button>
            ) : (
              <Link to={linkObj}>{T.translate('commons.close')}</Link>
            )}
          </div>
        </div>
      </Provider>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    provisionerJsonSpecMap: state.map,
  };
};
const ConnectedProfileCreateView = connect(mapStateToProps)(ProfileCreateView);

export default function ProfileCreateViewFn({ ...props }) {
  return (
    <Provider store={ProvisionerInfoStore}>
      <div>
        <ConnectedProfileCreateView {...props} />
      </div>
    </Provider>
  );
}
