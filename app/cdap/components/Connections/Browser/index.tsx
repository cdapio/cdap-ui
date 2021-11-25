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

import React, { useState, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import IconButton from '@material-ui/core/IconButton';
import { GenericBrowser } from 'components/Connections/Browser/GenericBrowser';
import If from 'components/shared/If';
import Heading, { HeadingTypes } from 'components/shared/Heading';
import { Route, Switch } from 'react-router-dom';
import Upload from 'components/Connections/Upload';
import Button from '@material-ui/core/Button';
import { ConnectionsContext } from 'components/Connections/ConnectionsContext';

const useStyle = makeStyles((theme) => {
  return {
    root: {
      padding: 0,
      display: 'grid',
      gridTemplateRows: '50px 1fr',
      gridTemplateColumns: '100%',
      height: '100%',
    },
    header: {
      padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
      backgroundColor: theme.palette.grey[600],
      display: 'flex',
      alignItems: 'center',
      gap: `${theme.spacing(1)}px`,
    },
    headerInner: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    heading: {
      fontWeight: 'bold',
      paddingLeft: `${theme.spacing(1)}px`,
    },
    browserContainer: {
      borderTop: '1px solid rgba(0, 0, 0, .125)',
      height: '100%',
      overflow: 'hidden',
      position: 'relative',
      display: 'grid',
      gridTemplateRows: 'auto 1fr',
    },
  };
});

interface IConnectionsBrowser {
  expanded: boolean;
  onCollapse: () => void;
  initialConnectionId: string;
}
export function ConnectionsBrowser({
  expanded,
  onCollapse,
  initialConnectionId,
}: IConnectionsBrowser) {
  const { onEntitySelect } = useContext(ConnectionsContext);
  const isSelectMode = typeof onEntitySelect === 'function';
  const [selectableParent, setSelectableParent] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);
  const classes = useStyle();

  function onEntityChange(entity = null) {
    setSelectableParent(entity);
  }

  return (
    <Paper className={classes.root}>
      <div className={classes.header}>
        <If condition={expanded}>
          <IconButton onClick={expanded ? onCollapse : undefined} size="small">
            <ArrowForwardIosIcon fontSize="inherit" />
          </IconButton>
        </If>
        <Switch>
          <Route path="/ns/:namespace/connection-upload">
            <Heading type={HeadingTypes.h5} label="Upload Data" className={classes.heading} />
          </Route>
          <Route>
            {!selectableParent && (
              <Heading type={HeadingTypes.h5} label="Select Data" className={classes.heading} />
            )}
            {isSelectMode && selectableParent && (
              <div className={classes.headerInner}>
                <Heading
                  type={HeadingTypes.h5}
                  label={`Contents of '${selectableParent.name}'`}
                  className={classes.heading}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setSelectedParent(selectableParent);
                  }}
                >
                  Select '{selectableParent.name}'
                </Button>
              </div>
            )}
          </Route>
        </Switch>
      </div>
      <Switch>
        <Route path="/ns/:namespace/connection-upload">
          <Upload />
        </Route>
        <Route>
          <div className={classes.browserContainer}>
            <GenericBrowser
              initialConnectionId={initialConnectionId}
              onEntityChange={onEntityChange}
              selectedParent={selectedParent}
            />
          </div>
        </Route>
      </Switch>
    </Paper>
  );
}
