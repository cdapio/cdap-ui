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

import grey from '@material-ui/core/colors/grey';
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';
import SaveAltOutlinedIcon from '@material-ui/icons/SaveAltOutlined';
import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import InlayDrawerWidget from 'components/common/InlayDrawerWidget';
import React from 'react';
import styled from 'styled-components';

storiesOf('InlayDrawerWidget', module)
  .addDecorator(withKnobs)
  .add(
    'Default Inlay Drawer',
    withInfo({
      text: 'Default Drawer',
    })(() => {
      const DownloadIconStyle = styled(SaveAltOutlinedIcon)`
        width: 20px;
        height: 20px;
      `;

      const KebabMenuIconStyle = styled(MoreVertOutlinedIcon)`
        width: 20px;
        height: 20px;
        font-size: 26px;
        color: ${grey[600]};
      `;

      const handleDownloadIconClick = () => alert('download icon clicked');
      const handleKebabMenuIconClick = () => alert('kebab menu icon clicked');
      const handleDrawerCloseIconClick = () => alert('drawer close icon clicked');

      const templateActions = [
        {
          name: 'download-icon',
          getIconComponent: () => DownloadIconStyle,
          iconClickHandler: handleDownloadIconClick,
        },
        {
          name: 'kebab-menu-icon',
          getIconComponent: () => KebabMenuIconStyle,
          iconClickHandler: handleKebabMenuIconClick,
        },
      ];

      return (
        <InlayDrawerWidget
          headingText={'Inlay Drawer'}
          onClose={handleDrawerCloseIconClick}
          showDivider={true}
          templateActions={templateActions}
          position={'left'}
        >
          <div>Child component is rendered here</div>
        </InlayDrawerWidget>
      );
    })
  );
