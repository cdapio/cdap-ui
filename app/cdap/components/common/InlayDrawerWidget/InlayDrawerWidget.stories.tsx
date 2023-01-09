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

import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import InlayDrawerWidget from 'components/common/InlayDrawerWidget';
import { IActionsOptions } from 'components/common/InlayDrawerWidget/Menu';
import React, { useState } from 'react';

storiesOf('InlayDrawerWidget', module)
  .addDecorator(withKnobs)
  .add(
    'Default Inlay Drawer',
    withInfo({
      text: 'Default Drawer',
    })(() => {
      const [open, setOpen] = useState(true);

      const handleDrawerCloseIconClick = () => {
        setOpen(false);
      };

      const onSaveButtonClick = () => {
        // do nothing - TODO: event handler for save button click
      };
      const onApplyButtonClick = () => {
        // do nothing - TODO: event handler for apply button click
      };
      const onDownloadClick = () => {
        // do nothing - TODO: event handler for download button click
      };

      const actionsOptions: IActionsOptions[] = [
        {
          label: 'Save',
          value: 'save',
          clickHandler: onSaveButtonClick,
        },
        {
          label: 'Apply',
          value: 'apply',
          clickHandler: onApplyButtonClick,
        },
        {
          label: 'Download',
          value: 'download',
          clickHandler: onDownloadClick,
        },
      ];

      return (
        open && (
          <InlayDrawerWidget
            headingText={'Inlay Drawer'}
            onClose={handleDrawerCloseIconClick}
            showDivider={true}
            position={'left'}
            actionsOptions={actionsOptions}
          >
            <div>Child component is rendered here</div>
          </InlayDrawerWidget>
        )
      );
    })
  );
