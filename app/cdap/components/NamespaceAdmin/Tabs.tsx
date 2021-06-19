/*
 * Copyright © 2021 Cask Data, Inc.
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

import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { Route, Switch, NavLink } from 'react-router-dom';
import ComputeProfiles from 'components/NamespaceAdmin/ComputeProfiles';
import Preferences from 'components/NamespaceAdmin/Preferences';
import Drivers from 'components/NamespaceAdmin/Drivers';
import Connections from 'components/NamespaceAdmin/Connections';

const useStyle = makeStyles((theme) => {
  return {
    activeLink: {
      fontWeight: 'bold',
      textDecoration: 'underline',
    },
    linkContainer: {
      padding: '10px 25px',
      backgroundColor: theme.palette.grey[700],
    },
    separator: {
      marginLeft: '15px',
      marginRight: '15px',
      fontSize: '20px',
    },
    link: {
      color: theme.palette.grey[50],
      fontSize: '20px',
      '&:hover': {
        color: 'inherit',
      },
    },
    content: {
      marginTop: '15px',
    },
  };
});

const Tabs: React.FC = () => {
  const classes = useStyle();
  const namespace = getCurrentNamespace();

  const baseNSPath = `/ns/${namespace}/details`;
  const basepath = '/ns/:namespace/details';

  return (
    <div>
      <div className={classes.linkContainer}>
        <NavLink
          exact
          to={baseNSPath}
          className={classes.link}
          activeClassName={classes.activeLink}
        >
          Compute profiles
        </NavLink>
        <span className={classes.separator}>|</span>
        <NavLink
          exact
          to={`${baseNSPath}/preferences`}
          className={classes.link}
          activeClassName={classes.activeLink}
        >
          Preferences
        </NavLink>
        <span className={classes.separator}>|</span>
        <NavLink
          exact
          to={`${baseNSPath}/connections`}
          className={classes.link}
          activeClassName={classes.activeLink}
        >
          Connections
        </NavLink>
        <span className={classes.separator}>|</span>
        <NavLink
          exact
          to={`${baseNSPath}/drivers`}
          className={classes.link}
          activeClassName={classes.activeLink}
        >
          Drivers
        </NavLink>
      </div>
      <div className={classes.content}>
        <Switch>
          <Route exact path={basepath} component={ComputeProfiles} />
          <Route exact path={`${basepath}/preferences`} component={Preferences} />
          <Route exact path={`${basepath}/connections`} component={Connections} />
          <Route exact path={`${basepath}/drivers`} component={Drivers} />
        </Switch>
      </div>
    </div>
  );
};

export default Tabs;
