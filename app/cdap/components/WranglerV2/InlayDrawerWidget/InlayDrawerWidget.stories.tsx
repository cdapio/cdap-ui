/*
 * Copyright © 2023 Cask Data, Inc.
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
import { action } from '@storybook/addon-actions';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import InlayDrawerWidget, { IMenuItem } from 'components/WranglerV2/InlayDrawerWidget';

export default {
  title: 'InlayDrawerWidget',
  component: InlayDrawerWidget,
} as ComponentMeta<typeof InlayDrawerWidget>;

const open = true;

const handleDrawerCloseIconClick = () => action('clicked')('Drawer Closed');
const onApplyButtonClick = () => action('clicked')('Apply Button Clicked');
const onDownloadButtonClick = () => action('clicked')('Download Button Clicked');
const onSaveButtonClick = () => action('clicked')('Save Button Clicked');

const actionsOptions: IMenuItem[] = [
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
    clickHandler: onDownloadButtonClick,
  },
];

const Template: ComponentStory<typeof InlayDrawerWidget> = (args) => {
  return <InlayDrawerWidget {...args} />;
};

export const DefaultInlayDrawerWidget = Template.bind({});

DefaultInlayDrawerWidget.args = {
  actionsOptions,
  headingText: 'Header Text',
  onClose: handleDrawerCloseIconClick,
  position: 'left',
  showDivider: true,
  disableActionsButton: true,
};
