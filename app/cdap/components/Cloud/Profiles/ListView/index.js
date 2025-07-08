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
import { getCurrentNamespace } from 'services/NamespaceStore';
import { Link } from 'react-router-dom';
import T from 'i18n-react';
import classnames from 'classnames';
import IconSVG from 'components/shared/IconSVG';
import LoadingSVG from 'components/shared/LoadingSVG';
import orderBy from 'lodash/orderBy';
import ViewAllLabel from 'components/shared/ViewAllLabel';
import ConfirmationModal from 'components/shared/ConfirmationModal';
import AutoScaleBadge from 'components/Cloud/Profiles/AutoScaleBadge';
import ProfilesStore, { PROFILE_STATUSES } from 'components/Cloud/Profiles/Store';
import { alpha } from '@material-ui/core';
import {
  getProfiles,
  deleteProfile,
  setError,
  getDefaultProfile,
  setDefaultProfile,
  extractProfileName,
  getProfileNameWithScope,
  getNodeHours,
} from 'components/Cloud/Profiles/Store/ActionCreator';
import { connect, Provider } from 'react-redux';
import Alert from 'components/shared/Alert';
import uuidV4 from 'uuid/v4';
import ActionsPopover from 'components/Cloud/Profiles/ActionsPopover';
import isEqual from 'lodash/isEqual';
import { getProvisionersMap } from 'components/Cloud/Profiles/Store/Provisioners';
import { CLOUD, SYSTEM_NAMESPACE } from 'services/global-constants';
import { preventPropagation } from 'services/helpers';
import findIndex from 'lodash/findIndex';
import { SCOPES } from 'services/global-constants';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@material-ui/core';
require('./ListView.scss');
import styled from 'styled-components';
import history from 'services/history';

const PREFIX = 'features.Cloud.Profiles';

const PROFILES_TABLE_HEADERS = [
  {
    label: T.translate(`${PREFIX}.ListView.default`),
  },
  {
    property: 'name',
    label: T.translate(`${PREFIX}.ListView.profileName`),
  },
  {
    property: (profile) => profile.provisioner.label,
    label: T.translate(`${PREFIX}.common.provisioner`),
  },
  {
    property: (profile) => profile.provisioner.totalProcessingCpusLabel,
    label: T.translate(`${PREFIX}.common.totalWorkerCores`),
  },
  {
    property: 'scope',
    label: T.translate('commons.scope'),
  },
  {
    property: 'last24HrRuns',
    label: T.translate(`${PREFIX}.common.last24HrRuns`),
  },
  {
    property: 'last24HrNodeHr',
    label: T.translate(`${PREFIX}.common.last24HrNodeHr`),
  },
  {
    property: 'totalNodeHr',
    label: T.translate(`${PREFIX}.common.totalNodeHr`),
  },
  {
    property: 'schedulesCount',
    label: T.translate(`${PREFIX}.ListView.schedules`),
  },
  {
    property: 'triggersCount',
    label: T.translate(`${PREFIX}.ListView.triggers`),
  },
  {
    property: 'status',
    label: 'Status',
  },
  {
    label: '',
  },
];

const SORT_METHODS = {
  asc: 'asc',
  desc: 'desc',
};

const NUM_PROFILES_TO_SHOW = 5;

const StyledTableContainer = styled(TableContainer).attrs(() => ({
  component: Paper,
  elevation: 10,
}))`
  margin-top: 1.3rem;
`;

const StyledTableCell = styled(TableCell)`
  font-size: 1rem;

  &.default-star {
    cursor: pointer;
  }

  &.default-star {
    .default-profile {
      color: var(--brand-primary-color);
    }

    .not-default-profile {
      display: none;
    }
  }

  &.enabled-label {
    color: ${(props) => {
      return props.theme.palette.green[100];
    }};
  }

  &.disabled-label {
    color: ${(props) => {
      return props.theme.palette.red[100];
    }};
  }
`;

const StyledTableRow = styled(TableRow)`
  &.highlighted {
    border: 2px solid
      ${(props) => {
        return props.theme.palette.green[200];
      }};
    background-color: ${(props) => {
      return alpha(props.theme.palette.green[200], 0.1);
    }};
  }

  & {
    cursor: pointer;
  }

  &.native-profile {
    cursor: not-allowed;
  }

  &:hover {
    .default-star {
      .not-default-profile {
        display: inline-block;
      }
    }
  }
`;

class ProfilesListView extends Component {
  state = {
    profiles: this.props.profiles,
    provisionersMap: {},
    viewAll: false,
    sortMethod: SORT_METHODS.asc,
    sortColumn: PROFILES_TABLE_HEADERS[1].property,
    profileToDelete: null,
    deleteErrMsg: '',
    extendedDeleteErrMsg: '',
  };

  static propTypes = {
    namespace: PropTypes.string.isRequired,
    profiles: PropTypes.array,
    defaultProfile: PropTypes.string,
    newProfile: PropTypes.string,
    error: PropTypes.any,
    loading: PropTypes.bool,
  };

  componentDidMount() {
    getProfiles(this.props.namespace);
    getDefaultProfile(this.props.namespace);
    this.getProvisioners();
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.profiles, this.props.profiles)) {
      let orderedProfiles = orderBy(
        nextProps.profiles,
        this.state.sortColumn,
        this.state.sortMethod
      );
      let viewAll = this.state.viewAll;

      if (
        this.props.newProfile &&
        orderedProfiles.length > NUM_PROFILES_TO_SHOW &&
        !this.state.viewAll
      ) {
        let newProfileName = extractProfileName(this.props.newProfile);
        let newProfileIndex = findIndex(orderedProfiles, { name: newProfileName });
        if (newProfileIndex >= NUM_PROFILES_TO_SHOW) {
          viewAll = true;
        }
      }
      this.setState({
        profiles: orderedProfiles,
        viewAll,
      });
    }
  }

  getProvisioners() {
    getProvisionersMap().subscribe((state) => {
      this.setState({
        provisionersMap: state.nameToLabelMap,
      });
    });
  }

  toggleViewAll = () => {
    this.setState({
      viewAll: !this.state.viewAll,
    });
  };

  handleProfilesSort = (field) => {
    let newSortColumn, newSortMethod;
    if (this.state.sortColumn === field) {
      newSortColumn = this.state.sortColumn;
      newSortMethod =
        this.state.sortMethod === SORT_METHODS.asc ? SORT_METHODS.desc : SORT_METHODS.asc;
    } else {
      newSortColumn = field;
      newSortMethod = SORT_METHODS.asc;
    }

    this.setState({
      sortColumn: newSortColumn,
      sortMethod: newSortMethod,
      profiles: orderBy(this.state.profiles, [newSortColumn], [newSortMethod]),
    });
  };

  deleteProfile = (profile) => {
    let namespace = profile.scope === SCOPES.SYSTEM ? SYSTEM_NAMESPACE : this.props.namespace;

    deleteProfile(namespace, profile.name, this.props.namespace).subscribe(
      () => {
        this.setState({
          profileToDelete: null,
          deleteErrMsg: '',
          extendedDeleteErrMsg: '',
        });
      },
      (err) => {
        this.setState({
          deleteErrMsg: T.translate(`${PREFIX}.common.deleteError`),
          extendedDeleteErrMsg: err,
        });
      }
    );
  };

  toggleDeleteConfirmationModal = (profileToDelete = null) => {
    this.setState({
      profileToDelete,
      deleteErrMsg: '',
      extendedDeleteErrMsg: '',
    });
  };

  renderProfilesTable() {
    if (!this.state.profiles.length) {
      return (
        <div className="text-center">
          {this.props.namespace === SYSTEM_NAMESPACE ? (
            <span>
              {T.translate(`${PREFIX}.ListView.noProfilesSystem`)}
              <Link to={'/ns/system/profiles/create'}>
                {T.translate(`${PREFIX}.ListView.createOne`)}
              </Link>
            </span>
          ) : (
            <span>
              {T.translate(`${PREFIX}.ListView.noProfiles`)}
              <Link to={`/ns/${getCurrentNamespace()}/profiles/create`}>
                {T.translate(`${PREFIX}.ListView.createOne`)}
              </Link>
            </span>
          )}
        </div>
      );
    }

    return (
      <StyledTableContainer>
        <Table>
          {this.renderProfilesTableHeader()}
          {this.renderProfilesTableBody()}
        </Table>
      </StyledTableContainer>
    );
  }

  renderSortIcon(field) {
    if (field !== this.state.sortColumn) {
      return null;
    }

    return this.state.sortMethod === SORT_METHODS.asc ? (
      <IconSVG name="icon-caret-down" />
    ) : (
      <IconSVG name="icon-caret-up" />
    );
  }

  renderProfilesTableHeader() {
    return (
      <TableHead>
        <StyledTableRow>
          {PROFILES_TABLE_HEADERS.map((header, i) => {
            if (header.property) {
              return (
                <StyledTableCell
                  key={i}
                  sortDirection={
                    this.state.sortColumn === header.property ? this.state.sortMethod : false
                  }
                >
                  <TableSortLabel
                    active={this.state.sortColumn === header.property}
                    direction={
                      this.state.sortColumn === header.property
                        ? this.state.sortMethod
                        : SORT_METHODS.asc
                    }
                    onClick={this.handleProfilesSort.bind(this, header.property)}
                  >
                    {header.label}
                  </TableSortLabel>
                </StyledTableCell>
              );
            }
            return <StyledTableCell key={i}>{header.label}</StyledTableCell>;
          })}
        </StyledTableRow>
      </TableHead>
    );
  }

  setProfileAsDefault = (profileName, e) => {
    if (profileName !== this.props.defaultProfile) {
      setDefaultProfile(this.props.namespace, profileName);
    }
    preventPropagation(e);
  };

  renderProfilerow = (profile) => {
    let namespace = profile.scope === SCOPES.SYSTEM ? SYSTEM_NAMESPACE : this.props.namespace;
    let provisionerName = profile.provisioner.name;
    profile.provisioner.label = this.state.provisionersMap[provisionerName] || provisionerName;
    let profileStatus = PROFILE_STATUSES[profile.status];
    const profileName = getProfileNameWithScope(profile.name, profile.scope);
    const isNativeProfile = profileName === CLOUD.DEFAULT_PROFILE_NAME;
    const profileIsDefault = profileName === this.props.defaultProfile;
    const actionsElem = () => {
      if (isNativeProfile) {
        return (
          <IconSVG
            name="icon-more"
            onClick={(e) => {
              preventPropagation(e);
              return false;
            }}
          />
        );
      }
      return <IconSVG name="icon-more" />;
    };
    return (
      <StyledTableRow
        className={
          ('highlighted',
          classnames({
            'native-profile': isNativeProfile,
            highlighted: profileName === this.props.newProfile,
          }))
        }
        onClick={
          !isNativeProfile
            ? () => history.push(`/ns/${namespace}/profiles/details/${profile.name}`)
            : undefined
        }
        hover
        key={uuidV4()}
      >
        <StyledTableCell
          className="default-star"
          onClick={this.setProfileAsDefault.bind(this, profileName)}
        >
          {profileIsDefault ? (
            <IconSVG name="icon-star" className="default-profile" />
          ) : (
            <IconSVG name="icon-star-o" className="not-default-profile" />
          )}
        </StyledTableCell>
        <StyledTableCell
          title={profile.label || profile.name}
          data-cy={`profile-list-${profile.name}`}
          data-testid={`profile-list-${profile.name}`}
        >
          {profile.label || profile.name}
        </StyledTableCell>
        <StyledTableCell>{profile.provisioner.label}</StyledTableCell>
        <StyledTableCell>
          {profile.provisioner.totalProcessingCpusLabel || '--'}
          <AutoScaleBadge properties={profile.provisioner.properties} />
        </StyledTableCell>
        <StyledTableCell>{profile.scope}</StyledTableCell>
        {/*
          We should set the defaults in the metrics call but since it is not certain that we get metrics
          for all the profiles all the time I have added the defaults here in the view
          Ideally we should set the defaults when we create the map of profiles.

          This is the minimal change for 5.0.

          Also, need to make these properties sortable, using SortableStickyGrid.
          JIRA: CDAP-13895
        */}
        <StyledTableCell>{profile.oneDayMetrics.runs || '--'}</StyledTableCell>
        <StyledTableCell>{getNodeHours(profile.oneDayMetrics.minutes || '--')}</StyledTableCell>
        <StyledTableCell>{getNodeHours(profile.overAllMetrics.minutes || '--')}</StyledTableCell>
        <StyledTableCell>{profile.schedulesCount}</StyledTableCell>
        <StyledTableCell>{profile.triggersCount}</StyledTableCell>
        <StyledTableCell className={`${profileStatus}-label`}>
          {T.translate(`${PREFIX}.common.${profileStatus}`)}
        </StyledTableCell>
        <StyledTableCell>
          <ActionsPopover
            target={actionsElem}
            namespace={this.props.namespace}
            profile={profile}
            disabled={isNativeProfile}
            onDeleteClick={this.toggleDeleteConfirmationModal.bind(this, profile)}
          />
        </StyledTableCell>
      </StyledTableRow>
    );
  };

  renderProfilesTableBody() {
    let profiles = [...this.state.profiles];

    if (!this.state.viewAll && profiles.length > NUM_PROFILES_TO_SHOW) {
      profiles = profiles.slice(0, NUM_PROFILES_TO_SHOW);
    }

    return <TableBody>{profiles.map(this.renderProfilerow)}</TableBody>;
  }

  renderDeleteConfirmationModal() {
    if (!this.state.profileToDelete) {
      return null;
    }

    const confirmationText = T.translate(`${PREFIX}.common.deleteConfirmation`, {
      profile: this.state.profileToDelete.name,
    });

    return (
      <ConfirmationModal
        headerTitle={T.translate(`${PREFIX}.common.deleteTitle`)}
        toggleModal={this.toggleDeleteConfirmationModal.bind(this, null)}
        confirmationText={confirmationText}
        confirmButtonText={T.translate('commons.delete')}
        confirmFn={this.deleteProfile.bind(this, this.state.profileToDelete)}
        cancelFn={this.toggleDeleteConfirmationModal.bind(this, null)}
        isOpen={this.state.profileToDelete !== null}
        errorMessage={this.state.deleteErrMsg}
        extendedMessage={this.state.extendedDeleteErrMsg}
      />
    );
  }

  renderError() {
    if (!this.props.error) {
      return null;
    }

    let error = this.props.error.response || this.props.error;

    return <Alert message={error} type="error" showAlert={true} onClose={setError} />;
  }

  render() {
    if (this.props.loading) {
      return (
        <div className="text-center">
          <LoadingSVG />
        </div>
      );
    }
    return (
      <div className="profiles-list-view">
        {this.renderProfilesTable()}
        <ViewAllLabel
          arrayToLimit={this.state.profiles}
          limit={NUM_PROFILES_TO_SHOW}
          viewAllState={this.state.viewAll}
          toggleViewAll={this.toggleViewAll}
        />
        {this.renderDeleteConfirmationModal()}
        {this.renderError()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    profiles: state.profiles,
    defaultProfile: state.defaultProfile,
    newProfile: state.newProfile,
    loading: state.loading,
    error: state.error,
  };
};

const ConnectedProfilesListView = connect(mapStateToProps)(ProfilesListView);

export default function ProfilesListViewFn(props) {
  return (
    <Provider store={ProfilesStore}>
      <ConnectedProfilesListView {...props} />
    </Provider>
  );
}
