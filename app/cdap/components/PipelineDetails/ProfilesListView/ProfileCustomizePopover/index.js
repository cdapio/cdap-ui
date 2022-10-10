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
import classnames from 'classnames';
import React, { PureComponent } from 'react';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Popover from '@material-ui/core/Popover';
import ProfileCustomizeContent from 'components/PipelineDetails/ProfilesListView/ProfileCustomizePopover/ProfileCustomizeContent';
import { getProfileNameWithScope } from 'components/Cloud/Profiles/Store/ActionCreator';
import { withStyles } from '@material-ui/core/styles';
require('./ProfileCustomizePopover.scss');

const CustomizedPopover = withStyles({
  paper: {
    padding: '20px 10px',
  },
})(Popover);

const styles = () => ({
  buttonLink: {
    '&:hover': {
      backgroundColor: 'inherit',
      color: '#007bff',
    },
    fontWeight: 400,
    '& span': {
      color: '#007bff',
    },
    '&.Mui-disabled': {
      color: 'inherit',
      '& span': {
        color: 'rgba(0, 0, 0, 0.26)',
      },
    },
    fontFamily: 'var(--font-family)',
    textTransform: 'none',
    fontSize: '13px',
    marginBottom: '2px',
    paddingLeft: 0,
  },
});

class ProfileCustomizePopover extends PureComponent {
  static propTypes = {
    profile: PropTypes.object,
    onProfileSelect: PropTypes.func,
    customizations: PropTypes.object,
    disabled: PropTypes.bool,
    classes: PropTypes.object,
  };

  static defaultProps = {
    customizations: {},
  };

  state = {
    showPopover: false,
  };

  onTogglePopover = (e) => {
    this.setState({
      showPopover: !this.state.showPopover,
      anchorEl: e.currentTarget,
    });
  };

  onProfileSelect = (profileName, customizations) => {
    if (this.props.onProfileSelect) {
      this.props.onProfileSelect(profileName, customizations);
    }
    this.onTogglePopover(false);
  };

  render() {
    const { name, provisioner, scope, label: profileLabel } = this.props.profile;
    const profileName = getProfileNameWithScope(name, scope);
    const editablePropertiesFromProfile = provisioner.properties.filter(
      (property) => property.isEditable !== false
    );

    return (
      <div id="profile-customize-popover" className="profile-customize-popover">
        <Button
          disableFocusRipple
          disableRipple
          disableElevation
          disableTouchRipple
          variant="text"
          disabled={editablePropertiesFromProfile.length === 0}
          component={Link}
          style={{
            textDecorationColor: '#007bff',
          }}
          onClick={this.onTogglePopover}
          className={classnames(this.props.classes.buttonLink)}
        >
          Customize
        </Button>
        <CustomizedPopover
          open={this.state.showPopover}
          anchorEl={this.state.anchorEl}
          onClose={this.onTogglePopover}
          style={{
            // Default modal zindex in theme is 1300. This is added as
            // inline style by material-ui. Hence the inline style to override it
            zIndex: 1400,
          }}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
        >
          <ProfileCustomizeContent
            profileName={profileName}
            profileLabel={profileLabel}
            customizations={this.props.customizations}
            provisioner={provisioner}
            editablePropertiesFromProfile={editablePropertiesFromProfile}
            onSave={this.onProfileSelect.bind(this, profileName)}
            disabled={this.props.disabled}
            onClose={this.onTogglePopover}
          />
        </CustomizedPopover>
      </div>
    );
  }
}

export default withStyles(styles)(ProfileCustomizePopover);
