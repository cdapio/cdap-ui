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
import TabLabelItem from 'components/ConnectionList/Components/LabelItemCanSample';
import { WrangleIcon } from 'components/ConnectionList/IconStore/WrangleIcon';
import { createWorkspace } from 'components/Connections/Browser/GenericBrowser/apiHelpers';
import { ConnectionsContext } from 'components/Connections/ConnectionsContext';
import T from 'i18n-react';
import React, { createRef, Ref, useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router';
import { getCurrentNamespace } from 'services/NamespaceStore';
import styled from 'styled-components';

import { Dispatch, SetStateAction } from 'react';
import { IConnectionTabType } from 'components/ConnectionList/Components/ConnectionTabs/Components/RenderLabel';

export interface ITabLabelCanSampleItemProps {
  label: string;
  myLabelRef: Ref<HTMLSpanElement>;
  onExplore: (entity: IConnectionTabType) => void;
  entity: IConnectionTabType;
  buttonTestId: string;
  buttonElement: JSX.Element;
  dataTestID: number;
}

export interface ITabLabelCanSampleProps {
  label: string;
  entity: IConnectionTabType;
  initialConnectionId: string;
  toggleLoader: (value: boolean, isError?: boolean) => void;
  setIsErrorOnNoWorkSpace: Dispatch<SetStateAction<boolean>>;
  dataTestID: number;
}

const WrangleTypography = styled(Typography)`
  padding-left: 10px;
`;

export default function({
  label,
  entity,
  initialConnectionId,
  toggleLoader,
  setIsErrorOnNoWorkSpace,
  dataTestID,
}: ITabLabelCanSampleProps) {
  const myLabelRef: Ref<HTMLSpanElement> = createRef();
  const [refValue, setRefValue] = useState(false);
  const [workspaceId, setWorkspaceId] = useState<string>(null);
  const [currentConnection, setCurrentConnection] = useState(initialConnectionId);
  const { onWorkspaceCreate } = useContext(ConnectionsContext);
  const indexOfSelectedDataset: number = location.pathname.lastIndexOf('/');
  const requiredPath: string = location.pathname.slice(indexOfSelectedDataset + 1);

  useEffect(() => {
    setRefValue(myLabelRef?.current?.offsetWidth < myLabelRef?.current?.scrollWidth);
  }, []);

  const onExplore = (currentEntity: IConnectionTabType) => {
    const { canBrowse, canSample } = currentEntity;
    if (!canBrowse && canSample) {
      onCreateWorkspace(currentEntity);
    } else {
      setIsErrorOnNoWorkSpace(true);
    }
  };

  const onCreateWorkspace = (currentEntity: IConnectionTabType) => {
    try {
      createWorkspaceInternal(currentEntity);
    } catch (e) {
      setIsErrorOnNoWorkSpace(true);
    }
  };

  const createWorkspaceInternal = async (currentEntity: IConnectionTabType) => {
    toggleLoader(true);
    try {
      const response = await createWorkspace({
        entity: currentEntity,
        connection: currentConnection,
        properties: {},
      });
      if (onWorkspaceCreate) {
        return onWorkspaceCreate(response);
      }
      if (response) {
        setWorkspaceId(response);
        toggleLoader(false);
      }
    } catch (error) {
      toggleLoader(false);
      setIsErrorOnNoWorkSpace(true);
    }
  };

  return workspaceId ? (
    <Redirect
      to={{
        pathname: `/ns/${getCurrentNamespace()}/wrangler-grid/${workspaceId}`,
        state: {
          from: T.translate('features.WranglerNewUI.Breadcrumb.labels.connectionsList'),
          path: requiredPath,
        },
      }}
    />
  ) : (
    <CustomTooltip
      title={refValue ? label : ''}
      arrow
      data-testid="connections-tab-ref-label-simple"
    >
      <Box>
        <TabLabelItem
          dataTestID={dataTestID}
          label={label}
          myLabelRef={myLabelRef}
          onExplore={onExplore}
          entity={entity}
          buttonTestId="connections-tab-ref-explore"
          buttonElement={
            <Box className="wranglingHover">
              <WrangleIcon />
              <WrangleTypography
                color="primary"
                variant="body2"
                component="span"
                data-testid={`wrangle-text`}
              >
                {T.translate('features.WranglerNewUI.ConnectionsList.labels.loadToGrid')}
              </WrangleTypography>
            </Box>
          }
        />
      </Box>
    </CustomTooltip>
  );
}
