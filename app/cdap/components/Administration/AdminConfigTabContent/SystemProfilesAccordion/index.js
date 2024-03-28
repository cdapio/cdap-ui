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
import { Link } from 'react-router-dom';
import ProfilesListView from 'components/Cloud/Profiles/ListView';
import classnames from 'classnames';
import IconSVG from 'components/shared/IconSVG';
import T from 'i18n-react';
import ProfilesStore from 'components/Cloud/Profiles/Store';
import { importProfile } from 'components/Cloud/Profiles/Store/ActionCreator';
import { connect, Provider } from 'react-redux';
import { Label, Input } from 'reactstrap';
import { getProfiles, resetProfiles } from 'components/Cloud/Profiles/Store/ActionCreator';
import { SYSTEM_NAMESPACE } from 'services/global-constants';
import { Theme } from 'services/ThemeHelper';
import { getDataTestid } from '../../../../testids/TestidsProvider';
import If from 'components/shared/If';
require('./SystemProfilesAccordion.scss');

const PREFIX = 'features.Administration.Accordions.SystemProfiles';
const TESTID_PREFIX = 'features.administration.configuration';

class SystemProfilesAccordion extends Component {
  static propTypes = {
    profilesCount: PropTypes.number,
    loading: PropTypes.bool,
    expanded: PropTypes.bool,
    onExpand: PropTypes.func,
  };

  componentDidMount() {
    getProfiles(SYSTEM_NAMESPACE);
  }

  componentWillUnmount() {
    resetProfiles();
  }

  renderLabel() {
    return (
      <div className="admin-config-container-toggle" onClick={this.props.onExpand}>
        <span className="admin-config-container-label">
          <IconSVG name={this.props.expanded ? 'icon-caret-down' : 'icon-caret-right'} />
          {this.props.loading ? (
            <h5>
              {T.translate(`${PREFIX}.label`)}
              <IconSVG name="icon-spinner" className="fa-spin" />
            </h5>
          ) : (
            <h5>{T.translate(`${PREFIX}.labelWithCount`, { count: this.props.profilesCount })}</h5>
          )}
        </span>
        <span className="admin-config-container-description">
          {T.translate(`${PREFIX}.description`)}
        </span>
      </div>
    );
  }

  renderContent() {
    if (!this.props.expanded) {
      return null;
    }

    return (
      <div className="admin-config-container-content system-profiles-container-content">
        <If condition={Theme.showCreateProfile !== false}>
          <div className="create-import-profile">
            <Link
              className="btn btn-secondary create-profile-button"
              to="/ns/system/profiles/create"
              data-testid={getDataTestid(`${TESTID_PREFIX}.create-profile-btn`)}
            >
              {T.translate(`${PREFIX}.create`)}
            </Link>
            <Label className="import-profile-label" for="import-profile">
              {T.translate(`${PREFIX}.import`)}
              <Input
                type="file"
                accept=".json"
                id="import-profile"
                onChange={importProfile.bind(this, SYSTEM_NAMESPACE)}
                onClick={(e) => (e.target.value = null)}
              />
            </Label>
          </div>
        </If>

        <ProfilesListView namespace={SYSTEM_NAMESPACE} />
      </div>
    );
  }

  render() {
    return (
      <div
        className={classnames('admin-config-container system-profiles-container', {
          expanded: this.props.expanded,
        })}
        data-testid={getDataTestid(`${TESTID_PREFIX}.system-profiles-accordion`)}
      >
        {this.renderLabel()}
        {this.renderContent()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    profilesCount: state.profiles.length,
    loading: state.loading,
  };
};

const ConnectedSystemProfilesAccordion = connect(mapStateToProps)(SystemProfilesAccordion);

export default function SystemProfilesAccordionFn(props) {
  return (
    <Provider store={ProfilesStore}>
      <ConnectedSystemProfilesAccordion {...props} />
    </Provider>
  );
}
