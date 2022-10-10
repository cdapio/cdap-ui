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
import BrandImage from 'components/shared/AppHeader/BrandImage';
import MenuIcon from '@material-ui/icons/Menu';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import classnames from 'classnames';
import {
  withContext,
  INamespaceLinkContext,
} from 'components/shared/AppHeader/NamespaceLinkContext';
import ToolBarFeatureLink from 'components/shared/AppHeader/AppToolBar/ToolBarFeatureLink';
import HubButton from 'components/shared/AppHeader/HubButton';
import { Theme } from 'services/ThemeHelper';
import FeatureHeading from 'components/shared/AppHeader/AppToolBar/FeatureHeading';
import ProductEdition from 'components/shared/AppHeader/AppToolBar/ProductEdition';
import AppToolbarMenu from 'components/shared/AppHeader/AppToolBar/AppToolbarMenu';
import ee from 'event-emitter';
import globalEvents from 'services/global-events';

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

  public eventEmitter = ee(ee);

  public render() {
    const { onMenuIconClick, classes } = this.props;
    const { namespace } = this.props.context;
    return (
      <Toolbar className={classes.customToolbar} data-cy="navbar-toolbar">
        <IconButton
          onClick={onMenuIconClick}
          color="inherit"
          className={classnames(classes.iconButton, classes.iconButtonFocus)}
          edge="start"
          data-cy="navbar-hamburger-icon"
          data-testid="navbar-hamburger-icon"
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
            onClick={() => this.eventEmitter.emit(globalEvents.CLOSEMARKET)}
          />
          <ToolBarFeatureLink
            featureFlag={Theme.showReports}
            featureName={Theme.featureNames.reports}
            featureUrl={`/ns/${namespace}/reports`}
            onClick={() => this.eventEmitter.emit(globalEvents.CLOSEMARKET)}
          />
          <HubButton />
          <ToolBarFeatureLink
            featureFlag={true}
            featureName={Theme.featureNames.systemAdmin}
            featureUrl={`/administration`}
            // This is needed here when Authorization fails for all namespaces.
            // In this case navigating to Admin section doesn't have restriction (yet).
            onClick={() => {
              this.eventEmitter.emit(globalEvents.PAGE_LEVEL_ERROR, { reset: true });
              this.eventEmitter.emit(globalEvents.CLOSEMARKET);
            }}
          />
        </div>
        <AppToolbarMenu />
        <ProductEdition />
      </Toolbar>
    );
  }
}

export default withStyles(styles)(withContext(AppToolbar));
