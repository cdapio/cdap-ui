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

import React, { useState, useRef, MouseEvent } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import EditIcon from '@material-ui/icons/Edit';

import { ToolTipButtonContainer } from './sharedStyled';
import Typography from '@material-ui/core/Typography';

interface IChangeVersionMenuProps {
  changePluginVersion: (plugin) => void;
  plugin: any;
}
/**
 * How the angular version of this is super weird - it uses the same click function for all
 * kinds of things including delete, create, add to page etc. It also passes around contentData as
 * a plugin and things like that. I believe it also automatically sends a request to change
 * the default version when you change a version. It is very confusing and hard to use. Most of the
 * code is in leftpanel-ctrl and group-side-panel but there is also leftpanel-plugin-popover
 */
export default function ChangeVersionMenu({
  changePluginVersion,
  plugin,
}: IChangeVersionMenuProps) {
  const hasMultiplePluginVersions = plugin.allArtifacts?.length > 1;
  if (!hasMultiplePluginVersions) {
    return null;
  }

  const buttonLabel = `${plugin.name}-change-version-menu`;
  const elementRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = (e) => {
    e.stopPropagation();
    e.preventDefault();

    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChangeArtifact = (artifact) => {
    plugin.defaultArtifact = artifact;
    changePluginVersion(plugin);
    handleClose();
  };

  return (
    <>
      <Button aria-label={'change version'} component="span" onClick={handleOpen} ref={elementRef}>
        <ToolTipButtonContainer>
          <EditIcon /> Change Version
        </ToolTipButtonContainer>
      </Button>
      <Menu
        // this is really unfortunate but due to all the weirdness necessary
        style={{
          zIndex: 100000,
        }}
        id={buttonLabel}
        anchorEl={elementRef.current}
        open={isOpen}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': buttonLabel,
        }}
      >
        {plugin.allArtifacts.map((p) => {
          const artifact = p.artifact;
          return (
            <MenuItem onClick={() => handleChangeArtifact(artifact)}>
              <Typography noWrap>
                {artifact.version} {artifact.scope}
              </Typography>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
