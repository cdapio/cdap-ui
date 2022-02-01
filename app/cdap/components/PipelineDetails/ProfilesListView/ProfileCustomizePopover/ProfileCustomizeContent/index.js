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

import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import LoadingSVG from 'components/shared/LoadingSVG';
import Accordion, {
  AccordionContent,
  AccordionTitle,
  AccordionPane,
} from 'components/shared/Accordion';
import { MyCloudApi } from 'api/cloud';
import { extractProfileName } from 'components/Cloud/Profiles/Store/ActionCreator';
import IconSVG from 'components/shared/IconSVG';
import cloneDeep from 'lodash/cloneDeep';
import classnames from 'classnames';
import ProfilePropertyRow from 'components/PipelineDetails/ProfilesListView/ProfileCustomizePopover/ProfilePropertyRow';
import { filterByCondition } from 'components/shared/ConfigurationGroup/utilities/DynamicPluginFilters';
import { objectQuery } from 'services/helpers';

require('./ProfileCustomizeContent.scss');

export default class ProfileCustomizeContent extends PureComponent {
  static propTypes = {
    editablePropertiesFromProfile: PropTypes.array,
    profileName: PropTypes.string,
    profileLabel: PropTypes.string,
    customizations: PropTypes.object,
    provisioner: PropTypes.object,
    onSave: PropTypes.func,
    disabled: PropTypes.bool,
    onClose: PropTypes.func,
  };
  static defaultProps = {
    customizations: {},
    disabled: false,
  };

  state = {
    loading: true,
    provisionerSpec: null,
    filteredConfigurationGroup: [],
  };

  customization = cloneDeep(this.props.customizations);
  latestValues = this.getDefaultValues();

  componentDidMount() {
    MyCloudApi.getProvisionerDetailSpec({
      provisioner: this.props.provisioner.name,
    }).subscribe(
      (provisionerSpec) => {
        this.setState({
          provisionerSpec,
          filteredConfigurationGroup: this.getFilteredConfigurationGroup(provisionerSpec),
          loading: false,
        });
      },
      (err) => {
        this.setState({
          loading: false,
        });
        console.log('Failed to fetch provisioner spec ', err);
      }
    );
  }

  componentWillUnmount() {
    this.customization = {};
    this.latestValues = {};
  }

  getDefaultValues() {
    const { editablePropertiesFromProfile } = this.props;
    const values = {};
    editablePropertiesFromProfile.forEach((property) => {
      if (property.name in this.props.customizations) {
        values[property.name] = this.props.customizations[property.name];
      } else {
        values[property.name] = property.value;
      }
    });
    return values;
  }

  getFilteredConfigurationGroup(provisionerSpec) {
    const configurationGroups = provisionerSpec['configuration-groups'];
    const filters = provisionerSpec.filters;
    if (filters) {
      return filterByCondition(
        configurationGroups,
        {
          'configuration-groups': configurationGroups,
          filters,
        },
        {},
        this.latestValues
      );
    } else {
      return configurationGroups;
    }
  }

  onPropertyUpdate = (propertyName, value) => {
    this.customization[propertyName] = value.toString();
    this.latestValues[propertyName] = value.toString();
    // Re-render only when the updated property is part of the filters.
    if (this.isFilteredProperty(propertyName)) {
      const filteredConfigurationGroup = this.getFilteredConfigurationGroup(
        this.state.provisionerSpec
      );
      this.setState({
        filteredConfigurationGroup,
      });
    }
  };

  isFilteredProperty(propertyName) {
    const { provisionerSpec } = this.state;
    return (provisionerSpec.filters || []).some(
      (filter) => objectQuery(filter, 'condition', 'property') === propertyName
    );
  }

  onSave = () => {
    if (this.props.onSave) {
      this.props.onSave(this.customization);
    }
  };

  onClose = () => {
    if (this.props.onClose) {
      this.props.onClose(false);
    }
  };

  render() {
    const { editablePropertiesFromProfile } = this.props;
    if (this.state.loading) {
      return (
        <div className="profile-customize-content">
          <LoadingSVG />
        </div>
      );
    }
    let groups = this.state.filteredConfigurationGroup;

    const propertiesFromProfileMap = {};
    this.props.provisioner.properties.forEach((property) => {
      propertiesFromProfileMap[property.name] = property;
    });

    let profileName = this.props.profileLabel || extractProfileName(this.props.profileName);

    return (
      <div className="profile-customize-content">
        <div>
          <div className="profile-customize-metadata">
            <div className="profile-customize-name">
              <strong title={profileName}>{profileName}</strong>
              {editablePropertiesFromProfile.length ? (
                <small>Customize the values for the runs started by this schedule</small>
              ) : null}
            </div>
            <IconSVG name="icon-close" onClick={this.onClose} />
          </div>
          <Accordion size="small" active="0">
            {groups.map((group, i) => {
              if (group.show === false) {
                return null;
              }
              const editableProperties = group.properties
                .filter((property) => {
                  const isEditable =
                    !propertiesFromProfileMap[property.name] ||
                    propertiesFromProfileMap[property.name].isEditable !== false;
                  return isEditable && property.show !== false;
                })
                .map((property) => {
                  if (property['widget-type'] === 'select') {
                    return {
                      ...property,
                      value: this.latestValues[property.name],
                      ['widget-attributes']: {
                        ...(property['widget-attributes'] || {}),
                        MenuProps: {
                          disablePortal: true,
                        },
                      },
                    };
                  }
                  return {
                    ...property,
                    value: this.latestValues[property.name],
                  };
                });
              return (
                <AccordionPane id={i} key={i}>
                  <AccordionTitle>
                    <strong>
                      {group.label} ({group.properties.length})
                    </strong>
                  </AccordionTitle>
                  <AccordionContent>
                    {editableProperties.map((property) => {
                      return (
                        <ProfilePropertyRow
                          key={property.name}
                          property={property}
                          value={property.value}
                          onChange={this.onPropertyUpdate.bind(this, property.name)}
                        />
                      );
                    })}
                    {!editableProperties.length ? (
                      <strong> Properties cannot be customized</strong>
                    ) : null}
                  </AccordionContent>
                </AccordionPane>
              );
            })}
          </Accordion>
        </div>
        {this.props.disabled ? null : (
          <div className="profile-customize-footer">
            {!editablePropertiesFromProfile.length ? (
              <small className="text-danger">
                Properties of this profile cannot be customized.
              </small>
            ) : null}
            <div
              className={classnames('btn btn-primary', {
                disabled: editablePropertiesFromProfile.length === 0,
              })}
              onClick={editablePropertiesFromProfile.length === 0 ? undefined : this.onSave}
            >
              Done
            </div>
          </div>
        )}
      </div>
    );
  }
}
