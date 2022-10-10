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

import React from 'react';
import PrimaryContainedButton from './PrimaryContainedButton';
import PrimaryTextButton from './PrimaryTextButton';
import PrimaryOutlinedButton from './PrimaryOutlinedButton';
import ButtonLoadingHoc from './ButtonLoadingHoc';

export default {
  title: 'MuiButtons',
  component: PrimaryContainedButton,
};

export const PrimaryContained = ({ label, onClick, ...args }) => (
  <PrimaryContainedButton onClick={onClick} {...args}>
    {label}
  </PrimaryContainedButton>
);
PrimaryContained.args = {
  disabled: false,
  label: 'Button text',
};

PrimaryContained.argTypes = {
  onClick: { action: 'click' },
};

export const PrimaryText = ({ label, onClick, ...args }) => (
  <PrimaryTextButton onClick={onClick} {...args}>
    {label}
  </PrimaryTextButton>
);
PrimaryText.args = {
  disabled: false,
  label: 'Button text',
};

PrimaryText.argTypes = {
  onClick: { action: 'click' },
};

export const PrimaryOutlined = ({ label, onClick, ...args }) => (
  <PrimaryOutlinedButton onClick={onClick} {...args}>
    {label}
  </PrimaryOutlinedButton>
);
PrimaryOutlined.args = {
  disabled: false,
  label: 'Button text',
};

PrimaryOutlined.argTypes = {
  onClick: { action: 'click' },
};

const PrimaryContainedLoadingButton = ButtonLoadingHoc(PrimaryContainedButton);

export const LoadingButton = ({ label, loading, disabled, onClick, ...args }) => (
  <PrimaryContainedLoadingButton onClick={onClick} loading={loading} disabled={disabled} {...args}>
    {label}
  </PrimaryContainedLoadingButton>
);
LoadingButton.args = {
  disabled: false,
  loading: true,
  label: 'Button text',
};

LoadingButton.argTypes = {
  onClick: { action: 'click' },
};
