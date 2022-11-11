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
import IconSVG from 'components/shared/IconSVG';
import Button from 'components/shared/Buttons/PrimaryOutlinedButton';
import { withStyles } from '@material-ui/core/styles';
import { Popover } from '@material-ui/core/';
import styled from 'styled-components';
import { setSelectedProfile } from 'components/PipelineScheduler/Store/ActionCreator';
import { connect } from 'react-redux';
import StatusMapper from 'services/StatusMapper';
import ProfilesListView from 'components/PipelineDetails/ProfilesListView';
import { MyCloudApi } from 'api/cloud';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { getProvisionersMap } from 'components/Cloud/Profiles/Store/Provisioners';
import { preventPropagation } from 'services/helpers';
import { extractProfileName, isSystemProfile } from 'components/Cloud/Profiles/Store/ActionCreator';
import T from 'i18n-react';

export const PROFILES_DROPDOWN_DOM_CLASS = 'profiles-list-dropdown';
const PREFIX = 'features.PipelineScheduler';

const StyledPopover = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
    width: '600px',
    height: '300px',
    outline: 'none',
    '& .profiles-list-view-on-pipeline': {
      height: '100%',
      width: '100%',
      '& .grid-wrapper': {
        height: '100%',
        overflow: 'auto',
        '& .grid.grid-container': {
          maxHeight: '100%',
        },
      },
    },
  },
})(Popover);

const StyledButton = styled(Button)`
  border: 1px solid #d3d4d5;
  color: #555555;
  min-width: 150px;
  max-width: 250px;
  &:hover,
  &:focus,
  &:active {
    background: transparent;
    box-shadow: none;
  }
`;

const StyledSpan = styled.span`
  max-width: 90%;
  margin-right: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

class ProfilesForSchedule extends Component {
  static propTypes = {
    selectedProfile: PropTypes.string,
    scheduleStatus: PropTypes.string,
    profileCustomizations: PropTypes.object,
  };

  static defaultProps = {
    selectedProfile: null,
    profileCustomizations: {},
  };
  state = {
    scheduleDetails: null,
    provisionersMap: {},
    profileDetails: {},
    selectedProfile: this.props.selectedProfile,
    profileCustomizations: this.props.profileCustomizations,
    anchorEl: null,
  };

  componentDidMount() {
    this.setProvisionersMap();
    this.setProfileDetails();
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      {
        selectedProfile: nextProps.selectedProfile,
        profileCustomizations: nextProps.profileCustomizations,
      },
      () => {
        this.setProfileDetails();
      }
    );
  }

  toggleProfileDropdown = (e) => {
    this.setState({
      anchorEl: this.state.anchorEl ? null : e.currentTarget,
    });
    if (typeof e === 'object') {
      preventPropagation(e);
    }
  };

  setProfileDetails() {
    if (!this.state.selectedProfile) {
      return;
    }
    let profileName = extractProfileName(this.state.selectedProfile);
    let apiObservable$;
    if (isSystemProfile(this.state.selectedProfile)) {
      apiObservable$ = MyCloudApi.getSystemProfile({ profile: profileName });
    } else {
      apiObservable$ = MyCloudApi.get({ namespace: getCurrentNamespace(), profile: profileName });
    }
    apiObservable$.subscribe((profileDetails) => {
      this.setState({
        profileDetails,
      });
    });
  }

  setProvisionersMap() {
    getProvisionersMap().subscribe((state) => {
      this.setState({
        provisionersMap: state.nameToLabelMap,
      });
    });
  }

  setSelectedProfile = (selectedProfile, profileCustomizations = {}, e) => {
    setSelectedProfile(selectedProfile, profileCustomizations);
    this.toggleProfileDropdown(e);
  };

  renderProfilesTable = () => {
    if (!this.state.anchorEl) {
      return null;
    }
    let isScheduled = this.props.scheduleStatus === StatusMapper.statusMap['SCHEDULED'];
    let selectedProfile = {
      name: this.state.selectedProfile,
      profileCustomizations: this.state.profileCustomizations,
    };
    return (
      <ProfilesListView
        showProfilesCount={false}
        onProfileSelect={this.setSelectedProfile}
        disabled={isScheduled}
        selectedProfile={selectedProfile}
      />
    );
  };

  renderProfilesDropdown = () => {
    let isScheduled = this.props.scheduleStatus === StatusMapper.statusMap['SCHEDULED'];
    let provisionerLabel;
    if (this.state.selectedProfile) {
      let { profileDetails = {} } = this.state;
      let { provisioner = {} } = profileDetails;
      let { name: provisionerName } = provisioner;
      provisionerLabel = this.state.provisionersMap[provisionerName] || provisionerName;
    }

    const getDropdownToggleLabel = () => {
      if (!this.state.selectedProfile) {
        return <span>{T.translate(`${PREFIX}.selectAProfile`)}</span>;
      }

      let profileLabel =
        this.state.profileDetails.label || extractProfileName(this.state.selectedProfile);
      if (provisionerLabel) {
        profileLabel += ` (${provisionerLabel})`;
      }
      return (
        <span className="dropdown-toggle-label truncate" title={profileLabel}>
          {profileLabel}
        </span>
      );
    };

    return (
      <div>
        <StyledButton disabled={isScheduled} onClick={this.toggleProfileDropdown}>
          <StyledSpan>{getDropdownToggleLabel()}</StyledSpan>
          <IconSVG name="icon-caret-down" />
        </StyledButton>
        <StyledPopover
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
          onClose={this.toggleProfileDropdown}
        >
          {this.renderProfilesTable()}
        </StyledPopover>
      </div>
    );
  };

  render() {
    return (
      <div className="form-group row">
        <label className="col-3 control-label">{T.translate(`${PREFIX}.computeProfiles`)}</label>
        <div className="col-6 schedule-values-container">{this.renderProfilesDropdown()}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedProfile: state.profiles.selectedProfile,
    profileCustomizations: state.profiles.profileCustomizations,
    scheduleStatus: state.scheduleStatus,
  };
};

const ConnectedProfilesForSchedule = connect(mapStateToProps)(ProfilesForSchedule);

export default ConnectedProfilesForSchedule;
