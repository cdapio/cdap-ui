/*
 * Copyright © 2022 Cask Data, Inc.
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

import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import CustomTooltip from 'components/ConnectionList/Components/CustomTooltip';
import { WrangleIcon } from 'components/ConnectionList/icons';
import { createWorkspace } from 'components/Connections/Browser/GenericBrowser/apiHelpers';
import { ConnectionsContext } from 'components/Connections/ConnectionsContext';
import { IRecords } from 'components/GridTable/types';
import * as React from 'react';
import { createRef, Ref, useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router';
import { getCurrentNamespace } from 'services/NamespaceStore';
import useStyles from './styles';
import T from 'i18n-react';
import { ITableSampleCanSampleProps } from './types';

export default function TabLabelCanSample({
  label,
  entity,
  initialConnectionId,
  toggleLoader,
  setToaster,
}: ITableSampleCanSampleProps) {
  const classes = useStyles();

  const myLabelRef: Ref<HTMLSpanElement> = createRef();
  const [refValue, setRefValue] = useState(false);
  const [workspaceId, setWorkspaceId] = useState(null);
  const [currentConnection, setCurrentConnection] = useState(initialConnectionId);

  const { onWorkspaceCreate } = useContext(ConnectionsContext);

  useEffect(() => {
    setRefValue(myLabelRef?.current?.offsetWidth < myLabelRef?.current?.scrollWidth);
  }, []);

  const onExplore = (currentEntity) => {
    const { canBrowse, canSample } = currentEntity;
    if (!canBrowse && canSample) {
      onCreateWorkspace(currentEntity);
    } else {
      setToaster({
        open: true,
        message: `${T.translate('features.WranglerNewUI.Snackbar.labels.retrieveFailure')} ${
          entity?.name
        }`,
        isSuccess: false,
      });
    }
  };

  const onCreateWorkspace = async (currentEntity, parseConfig = {}) => {
    try {
      createWorkspaceInternal(currentEntity, parseConfig);
    } catch (e) {
      setToaster({
        open: true,
        message: `${T.translate('features.WranglerNewUI.Snackbar.labels.workspaceFailure')} ${
          entity?.name
        }`,
        isSuccess: false,
      });
    }
  };

  const createWorkspaceInternal = async (currentEntity, parseConfig = {}) => {
    toggleLoader(true);
    createWorkspace({
      entity: currentEntity,
      connection: currentConnection,
      properties: parseConfig,
    })
      .then((res) => {
        if (onWorkspaceCreate) {
          return onWorkspaceCreate(res);
        }
        if (res) {
          setToaster({
            open: true,
            message: `${T.translate('features.WranglerNewUI.Snackbar.labels.datasetSuccess')}`,
            isSuccess: true,
          });
          setTimeout(() => {
            setWorkspaceId(res);
          }, 2000);
          // TODO: this setTimeout needs to be removed after getting merged with Destination(test/unit-tests-for-m1) branch
          toggleLoader(false);
        }
      })
      .catch((err) => {
        toggleLoader(false);
        setToaster({
          open: true,
          message: `${T.translate('features.WranglerNewUI.Snackbar.labels.sampleFailure')}`,
          isSuccess: false,
        });
      });
  };

  return workspaceId ? (
    <Redirect to={`/ns/${getCurrentNamespace()}/wrangler-grid/${workspaceId}`} />
  ) : refValue ? (
    <CustomTooltip title={label} arrow data-testid="connections-tab-ref-label-simple">
      <Box className={classes.labelsContainerCanSample}>
        <Typography variant="body2" className={classes.labelStylesCanSample} ref={myLabelRef}>
          {label}
        </Typography>
        <button
          className="wranglingHover"
          onClick={() => onExplore(entity)}
          data-testid="connections-tab-ref-explore"
        >
          <WrangleIcon />
          <Typography variant="body2" className={classes.wrangleButton}>
            Wrangle
          </Typography>
        </button>
      </Box>
    </CustomTooltip>
  ) : (
    <Box className={classes.labelsContainerCanSample} data-testid="connections-tab-label-simple">
      <Typography variant="body2" className={classes.labelStylesCanSample} ref={myLabelRef}>
        {label}
      </Typography>
      <button
        className="wranglingHover"
        onClick={() => onExplore(entity)}
        data-testid="connections-tab-explore"
      >
        <WrangleIcon />
        <Typography variant="body2" className={classes.wrangleButton}>
          Wrangle
        </Typography>
      </button>
    </Box>
  );
}
