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

import React, { ChangeEvent, useEffect, useState } from 'react';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Select from '@material-ui/core/Select';
import SidePanel from 'components/hydrator/components/SidePanel/SidePanel';
import MenuItem from '@material-ui/core/MenuItem';
import { IconButton } from '@material-ui/core';

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
}

export const LeftPanel = ({
  onArtifactChange,
  selectedArtifact,
  artifacts,
  itemGenericName,
  groups,
  groupGenericName,
  onPanelItemClick,
  pluginsMap,
}: ILeftPanelProps) => {
  // angular has this saved in local storage - is this necessary?
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <>
      <div className="left-top-section">
        <Select
          value={selectedArtifact}
          className="form-control"
          onChange={(event) => onArtifactChange(event.target.value)}
          MenuProps={{
            getContentAnchorEl: null,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
          }}
        >
          {artifacts.map((artifact) => {
            return (
              <MenuItem value={artifact.label} key={artifact.label}>
                {artifact.label}
              </MenuItem>
            );
          })}
        </Select>
      </div>
      {pluginsMap && pluginsMap.length && (
        <SidePanel
          itemGenericName={itemGenericName}
          groups={groups}
          groupGenericName={groupGenericName}
          onPanelItemClick={onPanelItemClick}
        />
      )}
      <div className="btn-left-panel-toggle btn-sm pull-right">
        <IconButton onClick={() => setIsExpanded(!isExpanded)} color="primary" component="span">
          {isExpanded ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </div>
    </>
  );
};
