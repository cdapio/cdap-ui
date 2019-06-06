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
import * as React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import BrandImage from 'components/AppHeader/BrandImage';
import MenuItem from '@material-ui/core/MenuItem';
import IconSVG from 'components/IconSVG';
import MenuIcon from '@material-ui/icons/Menu';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import classnames from 'classnames';
import { withContext, INamespaceLinkContext } from 'components/AppHeader/NamespaceLinkContext';
import ToolBarFeatureLink from 'components/AppHeader/AppToolBar/ToolBarFeatureLink';
import HubButton from 'components/AppHeader/HubButton';
import { Theme } from 'services/ThemeHelper';
import VersionStore from 'services/VersionStore';
import T from 'i18n-react';
import If from 'components/If';
import AboutPageModal from 'components/AppHeader/AboutPageModal';
import FeatureHeading from 'components/AppHeader/AppToolBar/FeatureHeading';
import ProductEdition from 'components/AppHeader/AppToolBar/ProductEdition';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';

const styles = (theme) => {
  return {
    grow: theme.grow,
    iconButton: {
      marginLeft: '-20px',
      padding: '10px',
      fontSize: '1.8rem',
    },
    iconButtonFocus: theme.iconButtonFocus,
    customToolbar: {
      height: '48px',
      minHeight: '48px',
    },
    buttonLink: theme.buttonLink,
    cogWheelFontSize: {
      // This is because the icon is not the same size as it should be.
      // So beside a normal text this looks small. Hence the bump in font size
      fontSize: '1.3rem',
    },
    anchorMenuItem: {
      '&:focus': {
        outline: 'none',
      },
      textDecoration: 'none !important',
      color: 'inherit',
    },
  };
};

interface IAppToolbarProps extends WithStyles<typeof styles> {
  onMenuIconClick: () => void;
  context: INamespaceLinkContext;
}

interface IAppToolbarState {
  anchorEl: EventTarget | null;
  aboutPageOpen: boolean;
}

class AppToolbar extends React.PureComponent<IAppToolbarProps, IAppToolbarState> {
  public state = {
    anchorEl: null,
    aboutPageOpen: false,
  };

  public toggleSettings = (event: React.MouseEvent<HTMLElement>) => {
    if (this.state.anchorEl) {
      this.setState({
        anchorEl: null,
      });
    } else {
      this.setState({
        anchorEl: event.currentTarget,
      });
    }
  };

  public closeSettings = (e) => {
    if (this.state.anchorEl && this.state.anchorEl.contains(e.target)) {
      return;
    }
    this.setState({
      anchorEl: null,
    });
  };

  private toggleAboutPage = () => {
    this.setState({
      aboutPageOpen: !this.state.aboutPageOpen,
      anchorEl: null,
    });
  };
  private getDocsUrl = () => {
    if (Theme.productDocumentationLink === null) {
      const cdapVersion = VersionStore.getState().version;
      return `http://docs.cdap.io/cdap/${cdapVersion}/en/index.html`;
    }

    return Theme.productDocumentationLink;
  };

  public render() {
    const { onMenuIconClick, classes } = this.props;
    const { anchorEl } = this.state;
    const { namespace } = this.props.context;
    const cdapVersion = VersionStore.getState().version;
    return (
      <Toolbar className={classes.customToolbar} data-cy="navbar-toolbar">
        <IconButton
          onClick={onMenuIconClick}
          color="inherit"
          className={classnames(classes.iconButton, classes.iconButtonFocus)}
          edge="start"
          data-cy="navbar-hamburger-icon"
        >
          <MenuIcon fontSize="inherit" />
        </IconButton>
        <div className={classes.grow}>
          <BrandImage />
          <FeatureHeading />
        </div>
        <div>
          <ToolBarFeatureLink
            featureFlag={Theme.showDashboard}
            featureName={Theme.featureNames.dashboard}
            featureUrl={`/ns/${namespace}/operations`}
          />
          <ToolBarFeatureLink
            featureFlag={Theme.showReports}
            featureName={Theme.featureNames.reports}
            featureUrl={`/ns/${namespace}/reports`}
          />
          <HubButton />
          <ToolBarFeatureLink
            featureFlag={true}
            featureName={Theme.featureNames.systemAdmin}
            featureUrl={`/administration`}
          />
        </div>
        <div onClick={this.toggleSettings}>
          <IconButton className={classnames(classes.buttonLink, classes.iconButtonFocus)}>
            <IconSVG name="icon-cogs" className={classes.cogWheelFontSize} />
          </IconButton>
        </div>
        <ProductEdition />
        <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.closeSettings}>
                  <div>
                    <a
                      className={classes.anchorMenuItem}
                      href={this.getDocsUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MenuItem onClick={this.closeSettings}>
                        {T.translate('features.Navbar.ProductDropdown.documentationLabel')}
                      </MenuItem>
                    </a>
                    <If condition={Theme.showAboutProductModal === true}>
                      <MenuItem onClick={this.toggleAboutPage}>
                        <a>
                          {T.translate('features.Navbar.ProductDropdown.aboutLabel', {
                            productName: Theme.productName,
                          })}
                        </a>
                      </MenuItem>
                    </If>
                  </div>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        <If condition={Theme.showAboutProductModal === true}>
          <AboutPageModal
            cdapVersion={cdapVersion}
            isOpen={this.state.aboutPageOpen}
            toggle={this.toggleAboutPage}
          />
        </If>
      </Toolbar>
    );
  }
}

export default withStyles(styles)(withContext(AppToolbar));
