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

import React, { useEffect, useState } from 'react';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Select from '@material-ui/core/Select';
import SidePanel from 'components/hydrator/components/SidePanel/SidePanel';
import MenuItem from '@material-ui/core/MenuItem';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
import AvailablePluginsStore from 'services/AvailablePluginsStore';
import { useOnUnmount } from 'services/react/customHooks/useOnUnmount';

interface ILeftPanelProps {
  onArtifactChange: (value: any) => void;
  pluginsMap: any[];
  selectedArtifact: any;
  artifacts: any[];
  itemGenericName: string;
  groups: any[];
  groupGenericName: string;
  onPanelItemClick: (event: any, plugin: any) => void;
  toggleSideBar: () => void;
  isSideBarExpanded: boolean;
  isEdit: boolean;
  createPluginTemplate: (node: any, mode: 'edit' | 'create') => void;
}

const StyledSelect = styled(Select)`
  overflow: hidden;
`;

export const LeftPanel = ({
  onArtifactChange,
  selectedArtifact,
  artifacts,
  itemGenericName,
  groups,
  groupGenericName,
  onPanelItemClick,
  isEdit,
  createPluginTemplate,
}: ILeftPanelProps) => {
  // angular has this saved in local storage - is this necessary?
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [availablePlugins, setAvailablePlugins] = useState(AvailablePluginsStore.getState());
  let unsub;
  useEffect(() => {
    unsub = AvailablePluginsStore.subscribe(() => {
      const avp = AvailablePluginsStore.getState();
      if (avp.plugins) {
        setAvailablePlugins(avp);
      }
    });
  }, []);

  useOnUnmount(() => {
    unsub();
  });

  return (
    <div className={`left-panel-wrapper ${isExpanded ? 'expanded' : ''}`}>
      <div className="left-panel">
        <div className="left-top-section">
          <StyledSelect
            value={selectedArtifact.label}
            className="form-control"
            onChange={(event: any) => onArtifactChange(event.currentTarget.dataset.name)}
            MenuProps={{
              getContentAnchorEl: null,
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
            }}
            disabled={isEdit}
          >
            {artifacts.map((artifact) => {
              return (
                <MenuItem value={artifact.label} key={artifact.label} data-name={artifact.name}>
                  {artifact.label}
                </MenuItem>
              );
            })}
          </StyledSelect>
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            color="primary"
            component="button"
            className="btn-sm pull-right"
          >
            {isExpanded ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>
        <div className="my-side-panel">
          <SidePanel
            availablePlugins={availablePlugins}
            itemGenericName={itemGenericName}
            groups={groups}
            groupGenericName={groupGenericName}
            onPanelItemClick={(event, plugin) => onPanelItemClick(event, plugin)}
            createPluginTemplate={createPluginTemplate}
          />
        </div>
      </div>
    </div>
  );
};
